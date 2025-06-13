"use client";

import { useState } from "react";
import {
  createPublicClient,
  http,
  createWalletClient,
  custom,
} from "viem";
import { somniaTestnet } from "viem/chains";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  const [address, setAddress] = useState<string>("");
  const [connected, setConnected] = useState(false);
  const [client, setClient] = useState<any>(null);

  const connectToMetaMask = async () => {
    if (typeof window !== "undefined" && window.ethereum !== undefined) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const walletClient = createWalletClient({
          chain: somniaTestnet,
          transport: custom(window.ethereum),
        });
        const [userAddress] = await walletClient.getAddresses();
        setClient(walletClient);
        setAddress(userAddress);
        setConnected(true);
        console.log("Connected account:", userAddress);
      } catch (error) {
        console.error("User denied account access:", error);
      }
    } else {
      console.log(
          "MetaMask is not installed or not running in a browser environment!"
      );
    }
  };

  return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        {!connected ? (
            <button
                onClick={connectToMetaMask}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Connect Wallet
            </button>
        ) : (
            <div className="text-center">
              <p>Connected as: {address}</p>
              <p>Network: Somnia Testnet</p>
            </div>
        )}
      </main>
  );
}