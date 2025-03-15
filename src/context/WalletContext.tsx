import React, { createContext, useState, useEffect } from "react";
import * as nearAPI from "near-api-js";
import * as SecureStore from "expo-secure-store";
import { initWallet } from "../wallet/initWallet";
import {
  createNewAccount,
  importWallet,
  signTransaction,
  refreshBalance,
} from "./walletActions";

export type WalletAction =
  | { type: "Transfer"; params: { amount: string } }
  | { type: "OtherAction"; params: Record<string, any> };

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
  createNewAccount: (
    accountId: string,
    network: "mainnet" | "testnet"
  ) => Promise<void>;
  importWallet: (
    accountId: string,
    mnemonic: string,
    network: "mainnet" | "testnet"
  ) => Promise<void>;
  signTransaction: (tx: Transaction) => Promise<void>;
  refreshBalance: () => Promise<void>;
}

export const WalletContext = createContext<WalletContextType | undefined>(
  undefined
);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wallet, setWallet] = useState<nearAPI.WalletConnection | null>(null);
  const [balance, setBalance] = useState("0");
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string>("");
  const [network, setNetwork] = useState<"mainnet" | "testnet">("testnet");

  useEffect(() => {
    (async () => {
      const storedNetwork = await SecureStore.getItemAsync("preferredNetwork");
      const initialNetwork = storedNetwork
        ? (storedNetwork as "mainnet" | "testnet")
        : "testnet";
      setNetwork(initialNetwork);
      const walletInstance = await initWallet(initialNetwork);
      setWallet(walletInstance);
    })();
  }, []);

  const value = {
    wallet,
    balance,
    mnemonic,
    accountId,
    network,
    createNewAccount: (accountId: string, network: "mainnet" | "testnet") =>
      createNewAccount(
        accountId,
        network,
        wallet,
        setAccountId,
        setNetwork,
        setMnemonic,
        setBalance
      ),
    importWallet: (
      accountId: string,
      mnemonic: string,
      network: "mainnet" | "testnet"
    ) =>
      importWallet(
        accountId,
        mnemonic,
        network,
        wallet,
        setAccountId,
        setNetwork,
        setMnemonic,
        setBalance
      ),
    signTransaction: (tx: Transaction) =>
      signTransaction(tx, wallet, accountId, setBalance),
    refreshBalance: () => refreshBalance(wallet, accountId, setBalance),
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

// Optional: Re-export useWallet here if you want it accessible from this file
export { useWallet } from "./useWallet";
