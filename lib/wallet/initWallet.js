import * as nearAPI from "../../node_modules/near-api-js";
export const initWallet = async (network) => {
    const config = {
        networkId: network,
        keyStore: new nearAPI.keyStores.InMemoryKeyStore(),
        nodeUrl: network === "mainnet"
            ? "https://rpc.mainnet.near.org"
            : "https://rpc.testnet.near.org",
        walletUrl: network === "mainnet"
            ? "https://wallet.near.org"
            : "https://wallet.testnet.near.org",
        helperUrl: network === "mainnet"
            ? "https://helper.mainnet.near.org"
            : "https://helper.testnet.near.org",
    };
    const near = await nearAPI.connect(config);
    return new nearAPI.WalletConnection(near, "onsocial-auth");
};
