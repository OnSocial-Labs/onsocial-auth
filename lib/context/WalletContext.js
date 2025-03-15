import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { initWallet } from "@wallet/initWallet";
import { createNewAccount, importWallet, signTransaction, refreshBalance, } from "@context/walletActions";
export const WalletContext = createContext(undefined);
export const WalletProvider = ({ children, }) => {
    const [wallet, setWallet] = useState(null);
    const [balance, setBalance] = useState("0");
    const [mnemonic, setMnemonic] = useState(null);
    const [accountId, setAccountId] = useState("");
    const [network, setNetwork] = useState("testnet");
    useEffect(() => {
        (async () => {
            const storedNetwork = await SecureStore.getItemAsync("preferredNetwork");
            const initialNetwork = storedNetwork
                ? storedNetwork
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
        createNewAccount: (accountId, network) => createNewAccount(accountId, network, wallet, setAccountId, setNetwork, setMnemonic, setBalance),
        importWallet: (accountId, mnemonic, network) => importWallet(accountId, mnemonic, network, wallet, setAccountId, setNetwork, setMnemonic, setBalance),
        signTransaction: (tx) => signTransaction(tx, wallet, accountId, setBalance),
        refreshBalance: () => refreshBalance(wallet, accountId, setBalance),
    };
    return (<WalletContext.Provider value={value}>{children}</WalletContext.Provider>);
};
// Optional: Re-export useWallet here if you want it accessible from this file
export { useWallet } from "@context/useWallet";
