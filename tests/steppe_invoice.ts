import * as anchor from "@anchor-lang/core";
import { BN, Program } from "@anchor-lang/core";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import { expect } from "chai";
import { SteppeInvoice } from "../target/types/steppe_invoice";

describe("steppe_invoice", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.steppeInvoice as Program<SteppeInvoice>;
  const creator = provider.wallet.publicKey;

  let nextId = Date.now();
  const newId = () => new BN(nextId++);
  const pda = (c: PublicKey, id: BN) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("invoice"), c.toBuffer(), id.toArrayLike(Buffer, "le", 8)],
      program.programId,
    )[0];

  const fund = async (kp: Keypair, sol = 5) => {
    const sig = await provider.connection.requestAirdrop(kp.publicKey, sol * LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(sig, "confirmed");
  };
  const bal = (k: PublicKey) => provider.connection.getBalance(k, "processed");

  async function create(opts: {
    id?: BN; amount?: BN; title?: string; vault: PublicKey; vaultBps?: number;
    collab?: PublicKey | null; collabBps?: number;
  }) {
    const id = opts.id ?? newId();
    await program.methods
      .initializeInvoice(
        id, opts.amount ?? new BN(LAMPORTS_PER_SOL), opts.title ?? "Landing page",
        opts.vault, opts.vaultBps ?? 1000, opts.collab ?? null, opts.collabBps ?? 0,
      )
      .accountsPartial({ invoice: pda(creator, id), creator, systemProgram: SystemProgram.programId })
      .rpc();
    return { id, invoice: pda(creator, id) };
  }

  // The payer is also the fee payer, so the creator's balance only moves by the split itself.
  async function pay(id: BN, payer: Keypair, vault: PublicKey, collab: PublicKey | null, creatorKey = creator) {
    const tx = await program.methods
      .payInvoice()
      .accountsPartial({
        invoice: pda(creatorKey, id), payer: payer.publicKey, creator: creatorKey,
        vault, collaborator: collab, systemProgram: SystemProgram.programId,
      })
      .transaction();
    tx.feePayer = payer.publicKey;
    tx.recentBlockhash = (await provider.connection.getLatestBlockhash()).blockhash;
    tx.sign(payer);
    const sig = await provider.connection.sendRawTransaction(tx.serialize());
    const res = await provider.connection.confirmTransaction(sig, "processed");
    if (res.value.err) throw new Error("tx failed: " + JSON.stringify(res.value.err));
    return sig;
  }

  async function expectFail(p: Promise<unknown>, re: RegExp) {
    try {
      await p;
    } catch (e) {
      expect(String(e) + JSON.stringify((e as { logs?: string[] }).logs ?? [])).to.match(re);
      return;
    }
    expect.fail("expected transaction to fail");
  }

  const payer = Keypair.generate();
  const vault = Keypair.generate();
  const collab = Keypair.generate();

  before(async () => { await fund(payer, 10); });

  it("full lifecycle: create -> 85/10/5 split -> balances -> double pay blocked -> cannot cancel paid", async () => {
    const { id, invoice } = await create({
      vault: vault.publicKey, vaultBps: 1000, collab: collab.publicKey, collabBps: 500, title: "Landing page",
    });
    const stored = await program.account.invoice.fetch(invoice);
    expect(stored.isPaid).to.eq(false);
    expect(stored.amount.toNumber()).to.eq(LAMPORTS_PER_SOL);
    expect(stored.title).to.eq("Landing page");
    expect(stored.creator.toBase58()).to.eq(creator.toBase58());

    const [c0, v0, k0] = [await bal(creator), await bal(vault.publicKey), await bal(collab.publicKey)];
    const sig = await pay(id, payer, vault.publicKey, collab.publicKey);
    const [c1, v1, k1] = [await bal(creator), await bal(vault.publicKey), await bal(collab.publicKey)];

    expect(v1 - v0).to.eq(0.1 * LAMPORTS_PER_SOL);
    expect(k1 - k0).to.eq(0.05 * LAMPORTS_PER_SOL);
    expect(c1 - c0).to.eq(0.85 * LAMPORTS_PER_SOL);

    const after = await program.account.invoice.fetch(invoice);
    expect(after.isPaid).to.eq(true);
    expect(after.payer!.toBase58()).to.eq(payer.publicKey.toBase58());
    expect(after.paidAt!.toNumber()).to.be.greaterThan(0);

    // event emitted with the right payload
    let tx = null;
    for (let i = 0; i < 40 && !tx; i++) {
      tx = await provider.connection.getTransaction(sig, { commitment: "confirmed", maxSupportedTransactionVersion: 0 });
      if (!tx) await new Promise((r) => setTimeout(r, 250));
    }
    const events = [...new anchor.EventParser(program.programId, program.coder).parseLogs(tx!.meta!.logMessages!)];
    expect(events).to.have.length(1);
    expect(events[0].name.toLowerCase()).to.eq("invoicepaidevent");
    expect((events[0].data.amount as BN).toNumber()).to.eq(LAMPORTS_PER_SOL);
    expect((events[0].data.payer as PublicKey).toBase58()).to.eq(payer.publicKey.toBase58());

    await expectFail(pay(id, payer, vault.publicKey, collab.publicKey), /already paid|AlreadyPaid/i);
    await expectFail(
      program.methods.cancelInvoice().accountsPartial({ invoice, creator }).rpc(),
      /already paid|AlreadyPaid/i,
    );
  });

  it("cancels an unpaid invoice and refunds rent to the creator", async () => {
    const { id, invoice } = await create({ vault: vault.publicKey });
    const rentHeld = await bal(invoice);
    expect(rentHeld).to.be.greaterThan(0);
    const before = await bal(creator);
    await program.methods.cancelInvoice().accountsPartial({ invoice, creator }).rpc();
    expect(await provider.connection.getAccountInfo(invoice)).to.eq(null);
    // net gain = rent returned minus the transaction fee
    expect((await bal(creator)) - before).to.be.within(rentHeld - 20_000, rentHeld);
    // paying a cancelled invoice fails cleanly
    await expectFail(pay(id, payer, vault.publicKey, null), /AccountNotInitialized|not initialized|3012/i);
  });

  it("only the creator can cancel", async () => {
    const { invoice } = await create({ vault: vault.publicKey });
    const attacker = Keypair.generate();
    await fund(attacker, 1);
    await expectFail(
      program.methods.cancelInvoice().accountsPartial({ invoice, creator: attacker.publicKey }).signers([attacker]).rpc(),
      /ConstraintSeeds|ConstraintHasOne|seeds constraint|2006|2001/i,
    );
    expect(await program.account.invoice.fetchNullable(invoice)).to.not.eq(null);
  });

  it("rejects split over 100%", async () => {
    await expectFail(create({ vault: vault.publicKey, vaultBps: 6000, collab: collab.publicKey, collabBps: 5000 }), /exceeds 100|SplitExceeds100/i);
  });

  it("rejects collaborator share without a collaborator wallet", async () => {
    await expectFail(create({ vault: vault.publicKey, vaultBps: 1000, collabBps: 500 }), /Collaborator share requires|CollaboratorRequired/i);
  });

  it("rejects zero amount and over-long title", async () => {
    await expectFail(create({ vault: vault.publicKey, amount: new BN(0) }), /greater than zero|InvalidAmount/i);
    await expectFail(create({ vault: vault.publicKey, title: "x".repeat(65) }), /longer than 64|TitleTooLong/i);
  });

  it("rejects payment to a wrong vault address", async () => {
    const { id } = await create({ vault: vault.publicKey });
    await expectFail(pay(id, payer, Keypair.generate().publicKey, null), /WrongRecipient|does not match|ConstraintAddress|2012/i);
  });

  it("conserves lamports when shares round down (dust goes to the creator)", async () => {
    // Fresh creator with a small balance: the local test wallet holds >2^53 lamports, which Number cannot represent exactly.
    const small = Keypair.generate();
    await fund(small, 1);
    const dust = Keypair.generate();
    const id = newId();
    await program.methods
      .initializeInvoice(id, new BN(3), "Dust", dust.publicKey, 3333, null, 0)
      .accountsPartial({ invoice: pda(small.publicKey, id), creator: small.publicKey })
      .signers([small])
      .rpc();
    const c0 = await bal(small.publicKey);
    await pay(id, payer, dust.publicKey, null, small.publicKey);
    expect((await bal(small.publicKey)) - c0).to.eq(3); // vault share rounds to 0 lamports; nothing created or lost
    expect(await bal(dust.publicKey)).to.eq(0);
  });

  it("works when the creator pays their own invoice and vault == creator", async () => {
    const self = Keypair.generate();
    await fund(self, 2);
    const id = newId();
    await program.methods
      .initializeInvoice(id, new BN(LAMPORTS_PER_SOL / 2), "Self", creator, 1000, null, 0)
      .accountsPartial({ invoice: pda(creator, id), creator })
      .rpc();
    const before = await bal(creator);
    await pay(id, self, creator, null);
    expect((await bal(creator)) - before).to.eq(LAMPORTS_PER_SOL / 2);
  });
});
