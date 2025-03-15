import * as nearAPI from "../../node_modules/near-api-js";
export declare const generateKeyPairFromMnemonic: (mnemonic: string, network: "mainnet" | "testnet", accountId: string) => Promise<nearAPI.utils.key_pair.KeyPair>;
