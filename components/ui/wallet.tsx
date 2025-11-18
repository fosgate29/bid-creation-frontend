import React from "react";
import type { WalletCardProps } from "@/app/types";
import { Button } from "./button";
import { Wallet } from "lucide-react";

export const WalletCard: React.FC<WalletCardProps> = ({
  isConnected,
  walletAddress,
  onConnect,
  onDisconnect,
}) => {
  return (
    <div>
      <div>
        {isConnected && walletAddress ? (
          <Button variant="default" className="gap-2" onClick={onConnect}>
            <Wallet className="size-4" />
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </Button>
        ) : (
          <Button variant="outline" className="gap-2" onClick={onConnect}>
            <Wallet className="size-4" />
              Connect Wallet
          </Button>
        )}
      </div>
    </div>
  );
};
