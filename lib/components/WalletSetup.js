import React, { useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, Alert, } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Clipboard from "@react-native-clipboard/clipboard"; // Updated Clipboard import
import { useWallet } from "../context/useWallet";
import { AuthSetup } from "./AuthSetup";
import { sharedStyles } from "./styles";
export const WalletSetup = ({ onSetupComplete, }) => {
    const [username, setUsername] = useState("");
    const [importKey, setImportKey] = useState("");
    const [network, setNetwork] = useState("testnet");
    const [loading, setLoading] = useState(false);
    const [showImport, setShowImport] = useState(false);
    const [showAuthSetup, setShowAuthSetup] = useState(false);
    const { createNewAccount, importWallet } = useWallet();
    const handleCreate = async () => {
        setLoading(true);
        try {
            const accountId = `${username.toLowerCase()}.${network === "mainnet" ? "near" : "testnet"}`;
            await createNewAccount(accountId, network);
            setShowAuthSetup(true);
        }
        catch (error) {
            Alert.alert("Error", error instanceof Error ? error.message : "An unknown error occurred", [
                network === "testnet"
                    ? {
                        text: "Copy Faucet Link",
                        onPress: () => {
                            Clipboard.setString("https://near-faucet.io/testnet"); // Using the new Clipboard API
                        },
                    }
                    : { text: "OK" },
            ]);
        }
        finally {
            setLoading(false);
        }
    };
    const handleImport = async () => {
        setLoading(true);
        try {
            const accountId = `${username.toLowerCase()}.${network === "mainnet" ? "near" : "testnet"}`;
            await importWallet(accountId, importKey, network);
            setShowAuthSetup(true);
        }
        catch (error) {
            Alert.alert("Error", error instanceof Error ? error.message : "An unknown error occurred");
        }
        finally {
            setLoading(false);
        }
    };
    const onAuthSetupComplete = (accountId) => {
        setShowAuthSetup(false);
        onSetupComplete(accountId);
    };
    return (<View style={sharedStyles.container}>
      <Text style={sharedStyles.title}>Welcome to OnSocial!</Text>
      <Text style={sharedStyles.subtitle}>
        Create or sign in to your wallet
      </Text>
      <Picker selectedValue={network} style={sharedStyles.picker} onValueChange={(value) => setNetwork(value)}>
        <Picker.Item label="Testnet" value="testnet"/>
        <Picker.Item label="Mainnet" value="mainnet"/>
      </Picker>
      <TextInput style={sharedStyles.input} placeholder={`Enter username (e.g., alice.${network})`} value={username} onChangeText={setUsername}/>
      {loading ? (<ActivityIndicator />) : (<>
          <Button title="Create Wallet" onPress={handleCreate}/>
          <Button title="Sign In with Mnemonic" onPress={() => setShowImport(true)}/>
        </>)}
      {showImport && (<View style={sharedStyles.modalOverlay}>
          <View style={sharedStyles.modalContent}>
            <TextInput style={sharedStyles.input} placeholder="Paste your 12-word mnemonic" value={importKey} onChangeText={setImportKey}/>
            <Button title="Import" onPress={handleImport}/>
            <Button title="Cancel" onPress={() => setShowImport(false)}/>
          </View>
        </View>)}
      <AuthSetup visible={showAuthSetup} accountId={`${username.toLowerCase()}.${network}`} onComplete={onAuthSetupComplete}/>
    </View>);
};
