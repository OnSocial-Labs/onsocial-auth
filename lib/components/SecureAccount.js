import React from "react";
import { View, Text, Button, Alert } from "react-native";
import { useWallet } from "../context/useWallet";
import { sharedStyles } from "./styles";
import Clipboard from "@react-native-clipboard/clipboard";
export const SecureAccount = ({ onComplete }) => {
    const { accountId, mnemonic } = useWallet();
    const copyMnemonic = () => {
        if (mnemonic) {
            Clipboard.setString(mnemonic);
            Alert.alert("Copied", "Mnemonic copied to clipboard");
        }
    };
    return (<View style={sharedStyles.container}>
      <Text style={sharedStyles.title}>Account Created!</Text>
      <Text style={sharedStyles.subtitle}>Account ID: {accountId}</Text>
      {mnemonic && (<>
          <Text style={sharedStyles.subtitle}>Save your mnemonic:</Text>
          <Text style={sharedStyles.input}>{mnemonic}</Text>
          <Button title="Copy Mnemonic" onPress={copyMnemonic}/>
        </>)}
      <Button title="Continue" onPress={onComplete}/>
    </View>);
};
