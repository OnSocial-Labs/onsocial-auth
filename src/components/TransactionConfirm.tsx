import React, { useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import { useWallet } from "../context/useWallet";
import { Transaction, WalletAction } from "../context/WalletContext";
import { sharedStyles } from "./styles";

interface TransactionConfirmProps {
  transaction: Transaction;
  onComplete: () => void;
}

export const TransactionConfirm: React.FC<TransactionConfirmProps> = ({
  transaction,
  onComplete,
}) => {
  const { signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await signTransaction(transaction);
      Alert.alert("Success", "Transaction signed and sent!");
      onComplete();
    } catch (error: unknown) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={sharedStyles.container}>
      <Text style={sharedStyles.title}>Confirm Transaction</Text>
      <Text>Receiver: {transaction.receiverId}</Text>
      {transaction.actions.map((action: WalletAction, index: number) => (
        <Text key={index}>
          {action.type}: {action.params.amount || "N/A"}
        </Text>
      ))}
      {loading ? (
        <Text>Processing...</Text>
      ) : (
        <Button title="Confirm" onPress={handleConfirm} />
      )}
    </View>
  );
};
