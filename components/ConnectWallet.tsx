"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";

export function ConnectWallet() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <p className="text-sm text-muted-foreground">
          Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
        <Button variant="outline" size="sm" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => connect({ connector: connectors[0] })}
      className="bg-purple-600 hover:bg-purple-700 text-white"
    >
      Connect Wallet
    </Button>
  );
}
