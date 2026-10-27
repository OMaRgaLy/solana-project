// Two networks, chosen at run time:
//   mainnet  real money. Starts here as soon as the contract is deployed (NEXT_PUBLIC_PROGRAM_ID_MAINNET is set).
//   devnet   the "Demo mode" button: test SOL, demo wallets, the bot's /demo.
// Until the mainnet contract exists the site starts in demo (devnet), so nobody lands in a broken state.
export type NetName = "mainnet" | "devnet";

export type NetConfig = {
  name: NetName;
  cluster: "mainnet-beta" | "devnet";
  label: string;
  rpc: string;
  programId: string;
  explorerQuery: string;
  /** CAIP-2 chain id for Solana Actions (first 32 chars of the genesis hash). */
  chainId: string;
  isDemo: boolean;
  /** True when a program id is configured for this network. */
  configured: boolean;
  /** Wallet that receives the 1% service fee ("" = not applicable). */
  treasury: string;
};

export const UNSET_PROGRAM = "11111111111111111111111111111111";

/** The platform wallet for the service fee on mainnet (a public address). Override with NEXT_PUBLIC_TREASURY. */
export const DEFAULT_TREASURY = "FtRMty97BNBxvEMWAw2Xv9AaNCrD83CyKiNdcyhVKQpG";

const devnet: NetConfig = {
  name: "devnet",
  cluster: "devnet",
  label: "Solana Devnet",
  rpc: process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com",
  programId: process.env.NEXT_PUBLIC_PROGRAM_ID || UNSET_PROGRAM,
  explorerQuery: "?cluster=devnet",
  chainId: "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
  isDemo: true,
  configured: Boolean(process.env.NEXT_PUBLIC_PROGRAM_ID),
  treasury: "",
};

const mainnet: NetConfig = {
  name: "mainnet",
  cluster: "mainnet-beta",
  label: "Solana Mainnet",
  rpc: process.env.NEXT_PUBLIC_RPC_URL_MAINNET || "https://api.mainnet-beta.solana.com",
  programId: process.env.NEXT_PUBLIC_PROGRAM_ID_MAINNET || UNSET_PROGRAM,
  explorerQuery: "",
  chainId: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
  isDemo: false,
  configured: Boolean(process.env.NEXT_PUBLIC_PROGRAM_ID_MAINNET),
  treasury: process.env.NEXT_PUBLIC_TREASURY || DEFAULT_TREASURY,
};

export const NETS: Record<NetName, NetConfig> = { mainnet, devnet };

export const MAINNET_READY = mainnet.configured;
export const DEFAULT_NET: NetName = MAINNET_READY ? "mainnet" : "devnet";

/** Networks the app can read, the default one first. */
export const configuredNets = (): NetConfig[] =>
  [NETS[DEFAULT_NET], ...Object.values(NETS).filter((n) => n.name !== DEFAULT_NET)].filter((n) => n.configured);

// Backwards-compatible names for the default network (scripts, tests, server defaults).
export const CLUSTER = NETS[DEFAULT_NET].cluster;
export const IS_MAINNET = DEFAULT_NET === "mainnet";
export const DEFAULT_RPC = NETS[DEFAULT_NET].rpc;
export const NETWORK_LABEL = NETS[DEFAULT_NET].label;
export const EXPLORER_QUERY = NETS[DEFAULT_NET].explorerQuery;
export const CHAIN_ID = NETS[DEFAULT_NET].chainId;
