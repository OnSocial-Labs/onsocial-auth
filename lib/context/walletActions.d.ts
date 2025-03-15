import * as nearAPI from "near-api-js";
import { Transaction } from "./WalletContext";
export declare const createNewAccount: (accountId: string, network: "mainnet" | "testnet", wallet: nearAPI.WalletConnection | null, setAccountId: (id: string) => void, setNetwork: (network: "mainnet" | "testnet") => void, setMnemonic: (mnemonic: string) => void, setBalance: (balance: string) => void) => Promise<void>;
export declare const importWallet: (accountId: string, mnemonic: string, network: "mainnet" | "testnet", wallet: nearAPI.WalletConnection | null, setAccountId: (id: string) => void, setNetwork: (network: "mainnet" | "testnet") => void, setMnemonic: (mnemonic: string) => void, setBalance: (balance: string) => void) => Promise<void>;
export declare const signTransaction: (tx: Transaction, wallet: nearAPI.WalletConnection | null, accountId: string, setBalance: (balance: string) => void) => Promise<void>;
export declare const refreshBalance: (wallet: nearAPI.WalletConnection | null, accountId: string, setBalance: (balance: string) => void) => Promise<void>;
