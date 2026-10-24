export interface SavedCollaborator {
  id: string;
  name: string;
  wallet: string;
  defaultPct: number;
  note?: string;
  createdAt: number;
}

const STORAGE_PREFIX = "steppe_collabs_";

export function getCollaboratorStorageKey(walletAddress: string): string {
  return `${STORAGE_PREFIX}${walletAddress}`;
}

export function getSavedCollaborators(walletAddress: string): SavedCollaborator[] {
  if (typeof window === "undefined" || !walletAddress) return [];
  try {
    const raw = localStorage.getItem(getCollaboratorStorageKey(walletAddress));
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to load collaborators", e);
  }
  return [];
}

export function saveCollaborator(
  walletAddress: string,
  collab: Omit<SavedCollaborator, "id" | "createdAt">
): SavedCollaborator[] {
  if (typeof window === "undefined" || !walletAddress) return [];
  const existing = getSavedCollaborators(walletAddress);
  const newCollab: SavedCollaborator = {
    ...collab,
    id: `collab_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    createdAt: Date.now(),
  };
  const updated = [newCollab, ...existing];
  try {
    localStorage.setItem(getCollaboratorStorageKey(walletAddress), JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save collaborator", e);
  }
  return updated;
}

export function deleteCollaborator(walletAddress: string, id: string): SavedCollaborator[] {
  if (typeof window === "undefined" || !walletAddress) return [];
  const existing = getSavedCollaborators(walletAddress);
  const updated = existing.filter((c) => c.id !== id);
  try {
    localStorage.setItem(getCollaboratorStorageKey(walletAddress), JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to delete collaborator", e);
  }
  return updated;
}

export function updateCollaborator(
  walletAddress: string,
  updatedCollab: SavedCollaborator
): SavedCollaborator[] {
  if (typeof window === "undefined" || !walletAddress) return [];
  const existing = getSavedCollaborators(walletAddress);
  const updated = existing.map((c) => (c.id === updatedCollab.id ? updatedCollab : c));
  try {
    localStorage.setItem(getCollaboratorStorageKey(walletAddress), JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to update collaborator", e);
  }
  return updated;
}
