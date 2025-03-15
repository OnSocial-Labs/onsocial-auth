import * as nearAPI from "near-api-js";
export declare const initWallet: (network: "mainnet" | "testnet") => Promise<nearAPI.WalletConnection>;
