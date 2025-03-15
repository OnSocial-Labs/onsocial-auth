import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Modal, Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { sharedStyles } from "./styles";
export const AuthSetup = ({ visible, accountId, onComplete, }) => {
    const [useBiometrics, setUseBiometrics] = useState(false);
    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [hasBiometrics, setHasBiometrics] = useState(false);
    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            setHasBiometrics(compatible && enrolled);
        })();
    }, []);
    const handleSave = async () => {
        if (!useBiometrics) {
            if (pin !== confirmPin || pin.length < 4) {
                Alert.alert("Error", pin !== confirmPin
                    ? "PINs do not match"
                    : "PIN must be at least 4 digits");
                return;
            }
        }
        await SecureStore.setItemAsync(`auth_${accountId}`, useBiometrics ? "biometrics" : pin);
        onComplete(accountId);
    };
    if (!visible)
        return null;
    return (<Modal visible={visible} transparent>
      <View style={sharedStyles.modalOverlay}>
        <View style={sharedStyles.modalContent}>
          <Text style={sharedStyles.modalTitle}>Secure Your Wallet</Text>
          {hasBiometrics ? (<View style={sharedStyles.buttonRow}>
              <Button title="Use Biometrics" onPress={() => setUseBiometrics(true)}/>
              <Button title="Use PIN" onPress={() => setUseBiometrics(false)}/>
            </View>) : (<Text>Biometrics not available. Set a PIN.</Text>)}
          {!useBiometrics && (<>
              <TextInput style={sharedStyles.input} placeholder="Enter PIN (min 4 digits)" value={pin} onChangeText={setPin} keyboardType="numeric" secureTextEntry/>
              <TextInput style={sharedStyles.input} placeholder="Confirm PIN" value={confirmPin} onChangeText={setConfirmPin} keyboardType="numeric" secureTextEntry/>
            </>)}
          <Button title="Save" onPress={handleSave}/>
        </View>
      </View>
    </Modal>);
};
