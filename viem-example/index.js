import { createPublicClient, createWalletClient, http } from "viem";
import { somniaTestnet } from "viem/chains"
import { ABI } from "./abi.js";
import { privateKeyToAccount } from "viem/accounts";
import dotenv from 'dotenv';

dotenv.config();

const CONTRACT_ADDRESS = "0x55E49CdDA09C2F13793EC8f90A3812432722d02D";

const publicClient = createPublicClient({
    chain: somniaTestnet,
    transport: http(),
});

const walletClient = createWalletClient({
    account: privateKeyToAccount(process.env.PRIVATE_KEY),
    chain: somniaTestnet,
    transport: http(),
});

const interactWithContract = async () => {
    try {
        console.log("Reading message from the contract...");


        // Read the "greet" function
        const greeting = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: "greet",
        });
        console.log("Current greeting:", greeting);

        const txHash = await walletClient.writeContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: "changeName",
            args: ["Emmanuel2!"],
        });
        console.log("Transaction sent. Hash:", txHash);
        console.log("Waiting for transaction confirmation...");

        // Wait for the transaction to be confirmed
        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        console.log("Transaction confirmed. Receipt:", receipt);

        // Read the updated "greet" function
        const updatedGreeting = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: "greet",
        });
        console.log("Updated greeting:", updatedGreeting);
    } catch (error) {
        console.error("Error interacting with the contract:", error);
    }
};


interactWithContract();