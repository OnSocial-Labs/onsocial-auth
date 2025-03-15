import * as nearAPI from "near-api-js";

export const initWallet = async (network: "mainnet" | "testnet") => {
  const config: nearAPI.ConnectConfig = {
    networkId: network,
    keyStore: new nearAPI.keyStores.InMemoryKeyStore(),
    nodeUrl:
      network === "mainnet"
        ? "https://rpc.mainnet.near.org"
        : "https://rpc.testnet.near.org",
    walletUrl:
      network === "mainnet"
        ? "https://wallet.near.org"
        : "https://wallet.testnet.near.org",
    helperUrl:
      network === "mainnet"
        ? "https://helper.mainnet.near.org"
        : "https://helper.testnet.near.org",
  };
  const near = await nearAPI.connect(config);
  return new nearAPI.WalletConnection(near, "onsocial-auth");
};
