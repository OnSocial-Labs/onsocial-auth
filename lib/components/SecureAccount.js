import React from "react";
import { View, Text, Button, Alert } from "react-native";
import { useWallet } from "../context/useWallet";
import { sharedStyles } from "./styles";
import Clipboard from "@react-native-community/clipboard";
export const SecureAccount = ({ onComplete }) => {
    const { accountId, mnemonic } = useWallet();
    const copyMnemonic = () => {
        if (mnemonic) {
            if (Clipboard && Clipboard.setString) {
                Clipboard.setString(mnemonic);
                Alert.alert("Copied", "Mnemonic copied to clipboard");
            }
            else {
                Alert.alert("Clipboard not available");
            }
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
