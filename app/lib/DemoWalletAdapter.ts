import {
  BaseSignerWalletAdapter,
  WalletNotConnectedError,
  WalletReadyState,
  type WalletName,
} from "@solana/wallet-adapter-base";
import { Keypair, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import type { DemoWallet } from "./demoWallets";

const ICON =
  "data:image/svg+xml;base64," +
  (typeof btoa === "function"
    ? btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#14c8a4"/><text x="16" y="22" font-size="18" text-anchor="middle" fill="#04221c" font-family="sans-serif" font-weight="700">D</text></svg>')
    : "");

/** A wallet that signs locally with a published Devnet test keypair. No browser extension needed. */
export class DemoWalletAdapter extends BaseSignerWalletAdapter {
  name: WalletName;
  url = "https://github.com/OMaRgaLy/solana-project";
  icon = ICON;
  supportedTransactionVersions = null;
  private _publicKey: PublicKey | null = null;
  private _keypair: Keypair;

  constructor(wallet: DemoWallet) {
    super();
    this.name = wallet.label as WalletName;
    this._keypair = Keypair.fromSecretKey(Uint8Array.from(wallet.secretKey));
  }

  get publicKey() { return this._publicKey; }
  get connecting() { return false; }
  get readyState() { return WalletReadyState.Installed; }

  async connect() {
    this._publicKey = this._keypair.publicKey;
    this.emit("connect", this._publicKey);
  }

  async disconnect() {
    this._publicKey = null;
    this.emit("disconnect");
  }

  async signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T> {
    if (!this._publicKey) throw new WalletNotConnectedError();
    if ("version" in tx) (tx as VersionedTransaction).sign([this._keypair]);
    else (tx as Transaction).partialSign(this._keypair);
    return tx;
  }

  async signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> {
    return Promise.all(txs.map((t) => this.signTransaction(t)));
  }
}
