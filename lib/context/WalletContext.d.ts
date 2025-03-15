import React from "react";
import * as nearAPI from "near-api-js";
export type WalletAction = {
    type: "Transfer";
    params: {
        amount: string;
    };
} | {
    type: "OtherAction";
    params: Record<string, any>;
};
export interface Transaction {
    receiverId: string;
    actions: WalletAction[];
}
export interface WalletContextType {
    wallet: nearAPI.WalletConnection | null;
    balance: string;
    mnemonic: string | null;
    accountId: string;
    network: "mainnet" | "testnet";
    createNewAccount: (accountId: string, network: "mainnet" | "testnet") => Promise<void>;
    importWallet: (accountId: string, mnemonic: string, network: "mainnet" | "testnet") => Promise<void>;
    signTransaction: (tx: Transaction) => Promise<void>;
    refreshBalance: () => Promise<void>;
}
export declare const WalletContext: React.Context<WalletContextType | undefined>;
export declare const WalletProvider: React.FC<{
    children: React.ReactNode;
}>;
export { useWallet } from "./useWallet";
