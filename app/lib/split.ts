// Mirrors the on-chain math in programs/steppe_invoice. Creator receives the remainder,
// so the three shares always sum to `amount`.
export type Split = { vault: bigint; collaborator: bigint; creator: bigint };

export function computeSplit(amount: bigint, vaultBps: number, collabBps: number): Split {
  const vault = (amount * BigInt(vaultBps)) / 10_000n;
  const collaborator = (amount * BigInt(collabBps)) / 10_000n;
  return { vault, collaborator, creator: amount - vault - collaborator };
}

export function validateSplit(vaultBps: number, collabBps: number, hasCollaborator: boolean): string | null {
  if (vaultBps + collabBps > 10_000) return "Vault + collaborator share cannot exceed 100%";
  if (collabBps > 0 && !hasCollaborator) return "Collaborator share requires a collaborator wallet";
  return null;
}
