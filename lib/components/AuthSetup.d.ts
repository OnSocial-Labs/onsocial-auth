import React from "react";
interface AuthSetupProps {
    visible: boolean;
    accountId: string;
    onComplete: (accountId: string) => void;
}
export declare const AuthSetup: React.FC<AuthSetupProps>;
export {};
