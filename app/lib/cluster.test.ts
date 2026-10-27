import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const DEVNET_PROGRAM = "7ze4Utjmn73v42terYZMTFVGCt2ygVu9u85US89uNGJm";
// Any valid, different base58 address stands in for a future mainnet deployment.
const MAINNET_PROGRAM = "FtRMty97BNBxvEMWAw2Xv9AaNCrD83CyKiNdcyhVKQpG";

async function load(env: Record<string, string | undefined>) {
  vi.resetModules();
  for (const k of ["NEXT_PUBLIC_PROGRAM_ID", "NEXT_PUBLIC_PROGRAM_ID_MAINNET", "NEXT_PUBLIC_TREASURY"]) delete process.env[k];
  for (const [k, v] of Object.entries(env)) if (v !== undefined) process.env[k] = v;
  const cluster = await import("./cluster");
  const program = await import("./program");
  return { cluster, program };
}

describe("network selection", () => {
  const saved = { ...process.env };
  beforeEach(() => vi.resetModules());
  afterEach(() => {
    process.env = { ...saved };
  });

  it("starts in demo (devnet) until a mainnet program is configured", async () => {
    const { cluster } = await load({ NEXT_PUBLIC_PROGRAM_ID: DEVNET_PROGRAM });
    expect(cluster.MAINNET_READY).toBe(false);
    expect(cluster.DEFAULT_NET).toBe("devnet");
    expect(cluster.configuredNets().map((n) => n.name)).toEqual(["devnet"]);
  });

  it("starts on mainnet as soon as its program id is set, keeping devnet for the demo button", async () => {
    const { cluster } = await load({ NEXT_PUBLIC_PROGRAM_ID: DEVNET_PROGRAM, NEXT_PUBLIC_PROGRAM_ID_MAINNET: MAINNET_PROGRAM });
    expect(cluster.DEFAULT_NET).toBe("mainnet");
    expect(cluster.configuredNets().map((n) => n.name)).toEqual(["mainnet", "devnet"]);
  });

  it("sends the 1% fee to the platform wallet on mainnet and nowhere on devnet", async () => {
    const { cluster } = await load({ NEXT_PUBLIC_PROGRAM_ID_MAINNET: MAINNET_PROGRAM });
    expect(cluster.NETS.mainnet.treasury).toBe("FtRMty97BNBxvEMWAw2Xv9AaNCrD83CyKiNdcyhVKQpG");
    expect(cluster.NETS.devnet.treasury).toBe("");
  });

  it("lets NEXT_PUBLIC_TREASURY override the default platform wallet", async () => {
    const { cluster } = await load({ NEXT_PUBLIC_PROGRAM_ID_MAINNET: MAINNET_PROGRAM, NEXT_PUBLIC_TREASURY: DEVNET_PROGRAM });
    expect(cluster.NETS.mainnet.treasury).toBe(DEVNET_PROGRAM);
  });

  it("uses a different invoice address on each network, so an invoice exists on exactly one", async () => {
    const { program } = await load({ NEXT_PUBLIC_PROGRAM_ID: DEVNET_PROGRAM, NEXT_PUBLIC_PROGRAM_ID_MAINNET: MAINNET_PROGRAM });
    const creator = program.programIdOf("devnet"); // any valid public key works as a creator here
    expect(program.invoicePda(creator, 1n, "devnet").toBase58()).not.toBe(program.invoicePda(creator, 1n, "mainnet").toBase58());
  });

  it("targets the program of the network the invoice was read from", async () => {
    const { program } = await load({ NEXT_PUBLIC_PROGRAM_ID: DEVNET_PROGRAM, NEXT_PUBLIC_PROGRAM_ID_MAINNET: MAINNET_PROGRAM });
    const owner = program.programIdOf("devnet");
    const base = {
      address: owner, creator: owner, invoiceId: 1n, amount: 1n, assetType: 0, vaultRecipient: owner, vaultBps: 100,
      collaborator: null, collaboratorBps: 0, payer: null, isPaid: false, createdAt: 0, paidAt: null, title: "t", bump: 255,
    };
    expect(program.payInvoiceIx({ ...base, net: "mainnet" }, owner).programId.toBase58()).toBe(MAINNET_PROGRAM);
    expect(program.payInvoiceIx({ ...base, net: "devnet" }, owner).programId.toBase58()).toBe(DEVNET_PROGRAM);
  });
});
