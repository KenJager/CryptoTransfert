"use client";

import { useEffect, useState } from "react";
import { BrowserProvider, formatEther } from "ethers";

interface WalletInfo {
  address: string;
  balance: string;
  chainId: number | null;
  networkName: string;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const NETWORKS: Record<number, string> = {
  1: "Ethereum Mainnet",
  11155111: "Sepolia",
  137: "Polygon",
  42161: "Arbitrum",
  10: "Optimism",
  8453: "Base",
};

export default function useWalletInfo(address: string): WalletInfo {
  const [balance, setBalance] = useState("0");
  const [chainId, setChainId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = async () => {
    if (!address || typeof window === "undefined" || !window.ethereum) return;
    setIsLoading(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      setChainId(Number(network.chainId));
      const raw = await provider.getBalance(address);
      setBalance(formatEther(raw));
    } catch (err) {
      console.error("useWalletInfo:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refresh();

    const ethereum = window.ethereum;
    if (!ethereum?.on) return;

    const onChainChanged = () => void refresh();
    ethereum.on("chainChanged", onChainChanged);
    return () => {
      ethereum.removeListener?.("chainChanged", onChainChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return {
    address,
    balance,
    chainId,
    networkName: chainId ? NETWORKS[chainId] ?? `Chain ${chainId}` : "—",
    isLoading,
    refresh,
  };
}