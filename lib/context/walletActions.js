import * as nearAPI from "near-api-js";
import * as bip39 from "bip39";
import * as SecureStore from "expo-secure-store";
import nacl from "tweetnacl";
export const createNewAccount = async (accountId, network, wallet, setAccountId, setNetwork, setMnemonic, setBalance) => {
    try {
        if (!wallet)
            throw new Error("Wallet not initialized");
        const { keyStores } = nearAPI;
        const keyStore = new keyStores.InMemoryKeyStore();
        const newMnemonic = bip39.generateMnemonic();
        const seed = await bip39.mnemonicToSeed(newMnemonic); // Add this line
        const keyPairInstance = generateKeyPair(seed); // Updated
        await keyStore.setKey(network, accountId, keyPairInstance);
        const near = wallet._near;
        const account = await near.account(accountId);
        await account.state();
        setAccountId(accountId);
        setNetwork(network);
        setMnemonic(newMnemonic);
        await SecureStore.setItemAsync("preferredNetwork", network);
        await refreshBalance(wallet, accountId, setBalance);
    }
    catch (error) {
        throw new Error(`Failed to create account ${accountId} on ${network}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
export const importWallet = async (accountId, mnemonic, network, wallet, setAccountId, setNetwork, setMnemonic, setBalance) => {
    try {
        if (!wallet)
            throw new Error("Wallet not initialized");
        if (!bip39.validateMnemonic(mnemonic))
            throw new Error("Invalid mnemonic phrase");
        const { keyStores } = nearAPI;
        const keyStore = new keyStores.InMemoryKeyStore();
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const keyPairInstance = generateKeyPair(seed); // Updated
        await keyStore.setKey(network, accountId, keyPairInstance);
        const near = wallet._near;
        const account = await near.account(accountId);
        await account.state();
        setAccountId(accountId);
        setNetwork(network);
        setMnemonic(mnemonic);
        await SecureStore.setItemAsync("preferredNetwork", network);
        await refreshBalance(wallet, accountId, setBalance);
    }
    catch (error) {
        throw new Error(`Failed to import account ${accountId} on ${network}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
export const signTransaction = async (tx, wallet, accountId, setBalance) => {
    try {
        if (!wallet || !accountId)
            throw new Error("Wallet not initialized");
        const near = wallet._near;
        const account = await near.account(accountId);
        const actions = tx.actions.map((action) => {
            switch (action.type) {
                case "Transfer":
                    return nearAPI.transactions.transfer(parseNearAmount(action.params.amount));
                default:
                    throw new Error(`Unsupported action type: ${action.type}`);
            }
        });
        await account.signAndSendTransaction({
            receiverId: tx.receiverId,
            actions,
        });
        await refreshBalance(wallet, accountId, setBalance);
    }
    catch (error) {
        if (error instanceof Error &&
            error.message.includes("InsufficientBalance")) {
            throw new Error(`Not enough NEAR in ${accountId}.`);
        }
        throw new Error(`Failed to sign transaction: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
export const refreshBalance = async (wallet, accountId, setBalance) => {
    try {
        if (!wallet || !accountId)
            return;
        const near = wallet._near;
        const account = await near.account(accountId);
        const state = await account.state();
        setBalance(nearAPI.utils.format.formatNearAmount(state.amount));
    }
    catch (error) {
        throw new Error(`Failed to refresh balance for ${accountId}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
const generateKeyPair = (seed) => {
    return nearAPI.KeyPair.fromString(Buffer.from(nacl.sign.keyPair.fromSeed(seed.slice(0, 32)).secretKey).toString("hex"));
};
const parseNearAmount = (amount) => {
    if (amount === null) {
        throw new Error("Amount cannot be null");
    }
    return nearAPI.utils.format.parseNearAmount(amount);
};
