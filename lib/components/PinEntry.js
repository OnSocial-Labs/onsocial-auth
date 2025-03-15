import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { sharedStyles } from "@components/styles";
export const PinEntry = ({ accountId, onAuthenticated, }) => {
    const [pin, setPin] = useState("");
    const [useBiometrics, setUseBiometrics] = useState(false);
    useEffect(() => {
        (async () => {
            const storedAuth = await SecureStore.getItemAsync(`auth_${accountId}`);
            if (storedAuth === "biometrics") {
                setUseBiometrics(true);
                const result = await LocalAuthentication.authenticateAsync();
                if (result.success)
                    onAuthenticated();
                else
                    Alert.alert("Authentication Failed", "Biometric authentication failed.");
            }
        })();
    }, [accountId, onAuthenticated]);
    const handlePinSubmit = async () => {
        const storedPin = await SecureStore.getItemAsync(`auth_${accountId}`);
        if (pin === storedPin) {
            onAuthenticated();
        }
        else {
            Alert.alert("Error", "Incorrect PIN");
        }
    };
    return (<View style={sharedStyles.container}>
      <Text style={sharedStyles.title}>Enter PIN</Text>
      {!useBiometrics && (<>
          <TextInput style={sharedStyles.input} placeholder="Enter your PIN" value={pin} onChangeText={setPin} keyboardType="numeric" secureTextEntry/>
          <Button title="Submit" onPress={handlePinSubmit}/>
        </>)}
    </View>);
};
