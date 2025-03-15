import * as nearAPI from "near-api-js";
import * as bip39 from "bip39";
import nacl from "tweetnacl";
export const generateKeyPairFromMnemonic = async (mnemonic, network, accountId) => {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const keyPair = nearAPI.KeyPair.fromString(Buffer.from(nacl.sign.keyPair.fromSeed(seed.slice(0, 32)).secretKey).toString("hex"));
    const keyStore = new nearAPI.keyStores.InMemoryKeyStore();
    await keyStore.setKey(network, accountId, keyPair);
    return keyPair;
};
