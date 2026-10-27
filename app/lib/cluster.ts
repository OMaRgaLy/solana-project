// One switch for the network: NEXT_PUBLIC_CLUSTER=mainnet-beta moves the whole app to Solana mainnet.
// Default is devnet, so nothing changes until the variable is set. On mainnet the demo wallets can never be
// used (their keys are public): demo mode, the demo wallet adapters and the bot's /demo are all switched off.
export type ClusterName = "devnet" | "mainnet-beta";

export const CLUSTER: ClusterName = process.env.NEXT_PUBLIC_CLUSTER === "mainnet-beta" ? "mainnet-beta" : "devnet";
export const IS_MAINNET = CLUSTER === "mainnet-beta";

export const DEFAULT_RPC = IS_MAINNET ? "https://api.mainnet-beta.solana.com" : "https://api.devnet.solana.com";

/** CAIP-2 chain id used by Solana Actions (first 32 chars of the cluster's genesis hash). */
export const CHAIN_ID = IS_MAINNET ? "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp" : "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1";

/** Solscan needs ?cluster= for every network except mainnet. */
export const EXPLORER_QUERY = IS_MAINNET ? "" : `?cluster=${CLUSTER}`;

export const NETWORK_LABEL = IS_MAINNET ? "Solana Mainnet" : "Solana Devnet";

/**
 * The platform wallet that receives the 1% service fee. Without it the fee would fall back to the invoice
 * creator's own wallet, i.e. the platform would earn nothing, so mainnet refuses to create invoices.
 */
export const TREASURY = process.env.NEXT_PUBLIC_TREASURY || "";
