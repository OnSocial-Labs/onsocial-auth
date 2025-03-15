import * as nearAPI from "near-api-js";
import * as bip39 from "bip39";

export const generateKeyPairFromMnemonic = async (
  mnemonic: string,
  network: "mainnet" | "testnet",
  accountId: string
) => {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const keyPair = nearAPI.KeyPair.fromString(seed.slice(0, 32).toString("hex")); // Updated
  const keyStore = new nearAPI.keyStores.InMemoryKeyStore();
  await keyStore.setKey(network, accountId, keyPair);
  return keyPair;
};
