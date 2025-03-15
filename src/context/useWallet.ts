import { useContext } from "react";
import { WalletContext, WalletContextType } from "@context/WalletContext";

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context)
    throw new Error("useWallet must be used within a WalletProvider");
  return context;
};
