import * as nearAPI from "../../node_modules/near-api-js";
export declare const initWallet: (network: "mainnet" | "testnet") => Promise<nearAPI.WalletConnection>;
