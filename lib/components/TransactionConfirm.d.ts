import React from "react";
import { Transaction } from "../context/WalletContext";
interface TransactionConfirmProps {
    transaction: Transaction;
    onComplete: () => void;
}
export declare const TransactionConfirm: React.FC<TransactionConfirmProps>;
export {};
