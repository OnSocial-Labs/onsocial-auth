import * as nearAPI from "near-api-js";
import * as bip39 from "bip39";
import { KeyPair, utils } from "near-api-js";
import * as SecureStore from "expo-secure-store";
import { Transaction, WalletAction } from "./WalletContext";

export const createNewAccount = async (
  accountId: string,
  network: "mainnet" | "testnet",
  wallet: nearAPI.WalletConnection | null,
  setAccountId: (id: string) => void,
  setNetwork: (network: "mainnet" | "testnet") => void,
  setMnemonic: (mnemonic: string) => void,
  setBalance: (balance: string) => void
) => {
  try {
    if (!wallet) throw new Error("Wallet not initialized");
    const { keyStores } = nearAPI;
    const keyStore = new keyStores.InMemoryKeyStore();
    const newMnemonic = bip39.generateMnemonic();
    const seed = await bip39.mnemonicToSeed(newMnemonic); // Add this line
    const keyPairInstance = KeyPair.fromString(
      utils.serialize.base_encode(seed.slice(0, 32))
    ); // Updated
    await keyStore.setKey(network, accountId, keyPairInstance);

    const near = wallet._near;
    const account = await near.account(accountId);
    await account.state();

    setAccountId(accountId);
    setNetwork(network);
    setMnemonic(newMnemonic);
    await SecureStore.setItemAsync("preferredNetwork", network);
    await refreshBalance(wallet, accountId, setBalance);
  } catch (error: unknown) {
    throw new Error(
      `Failed to create account ${accountId} on ${network}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const importWallet = async (
  accountId: string,
  mnemonic: string,
  network: "mainnet" | "testnet",
  wallet: nearAPI.WalletConnection | null,
  setAccountId: (id: string) => void,
  setNetwork: (network: "mainnet" | "testnet") => void,
  setMnemonic: (mnemonic: string) => void,
  setBalance: (balance: string) => void
) => {
  try {
    if (!wallet) throw new Error("Wallet not initialized");
    if (!bip39.validateMnemonic(mnemonic))
      throw new Error("Invalid mnemonic phrase");
    const { keyStores } = nearAPI;
    const keyStore = new keyStores.InMemoryKeyStore();
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const keyPairInstance = KeyPair.fromString(
      utils.serialize.base_encode(seed.slice(0, 32))
    ); // Updated
    await keyStore.setKey(network, accountId, keyPairInstance);

    const near = wallet._near;
    const account = await near.account(accountId);
    await account.state();

    setAccountId(accountId);
    setNetwork(network);
    setMnemonic(mnemonic);
    await SecureStore.setItemAsync("preferredNetwork", network);
    await refreshBalance(wallet, accountId, setBalance);
  } catch (error: unknown) {
    throw new Error(
      `Failed to import account ${accountId} on ${network}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const signTransaction = async (
  tx: Transaction,
  wallet: nearAPI.WalletConnection | null,
  accountId: string,
  setBalance: (balance: string) => void
) => {
  try {
    if (!wallet || !accountId) throw new Error("Wallet not initialized");
    const near = wallet._near;
    const account = await near.account(accountId);
    const actions = tx.actions.map((action: WalletAction) => {
      switch (action.type) {
        case "Transfer":
          return nearAPI.transactions.transfer(
            nearAPI.utils.format.parseNearAmount(action.params.amount)
          );
        default:
          throw new Error(`Unsupported action type: ${action.type}`);
      }
    });

    await account.signAndSendTransaction({
      receiverId: tx.receiverId,
      actions,
    });
    await refreshBalance(wallet, accountId, setBalance);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes("InsufficientBalance")
    ) {
      throw new Error(`Not enough NEAR in ${accountId}.`);
    }
    throw new Error(
      `Failed to sign transaction: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const refreshBalance = async (
  wallet: nearAPI.WalletConnection | null,
  accountId: string,
  setBalance: (balance: string) => void
) => {
  try {
    if (!wallet || !accountId) return;
    const near = wallet._near;
    const account = await near.account(accountId);
    const state = await account.state();
    setBalance(nearAPI.utils.format.formatNearAmount(state.amount));
  } catch (error: unknown) {
    throw new Error(
      `Failed to refresh balance for ${accountId}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
