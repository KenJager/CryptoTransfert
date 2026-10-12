"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, RefreshCw, Wallet } from "lucide-react";
import { cn } from "@/utils/cn";
import useWalletInfo from "@/hooks/useWalletInfo";

interface AccountCardProps {
  address: string;
}

const getExplorerUrl = (chainId: number | null, address: string) => {
  switch (chainId) {
    case 1:
      return `https://etherscan.io/address/${address}`;
    case 11155111:
      return `https://sepolia.etherscan.io/address/${address}`;
    case 137:
      return `https://polygonscan.com/address/${address}`;
    case 42161:
      return `https://arbiscan.io/address/${address}`;
    case 10:
      return `https://optimistic.etherscan.io/address/${address}`;
    case 8453:
      return `https://basescan.org/address/${address}`;
    default:
      return null;
  }
};

const AccountCard = ({ address }: AccountCardProps) => {
  const { balance, chainId, networkName, isLoading, refresh } =
    useWalletInfo(address);
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const explorerUrl = getExplorerUrl(chainId, address);
  const balanceNum = Number(balance);
  const formatted = balanceNum < 0.001
    ? balanceNum.toExponential(2)
    : balanceNum.toFixed(4);

  return (
    <div className="blue-glassmorphism p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#2952e3] flex items-center justify-center">
          <Wallet size={18} className="text-white" />
        </div>
        <div>
          <p className="text-white/60 text-xs">Compte connecté</p>
          <p className="text-white font-semibold text-sm">{networkName}</p>
        </div>
      </div>

      {/* Adresse */}
      <div>
        <p className="text-white/60 text-xs mb-1">Adresse</p>
        <div className="flex items-center gap-2 bg-black/30 rounded-lg px-3 py-2">
          <code className="text-white text-xs font-mono truncate flex-1">
            {address}
          </code>
          <button
            type="button"
            onClick={copyAddress}
            aria-label="Copier l'adresse"
            className="text-white/60 hover:text-white transition-colors shrink-0"
          >
            {copied ? (
              <Check size={14} className="text-green-400" />
            ) : (
              <Copy size={14} />
            )}
          </button>
        </div>
      </div>

      {/* Solde */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-white/60 text-xs">Solde</p>
          <button
            type="button"
            onClick={refresh}
            aria-label="Rafraîchir le solde"
            className={cn(
              "text-white/60 hover:text-white transition-colors",
              isLoading && "animate-spin"
            )}
          >
            <RefreshCw size={12} />
          </button>
        </div>
        <p className="text-white text-2xl font-bold">
          {formatted} <span className="text-white/60 text-base">ETH</span>
        </p>
      </div>

      {/* Lien explorer */}
      {explorerUrl && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "flex items-center justify-center gap-2 text-white/70 hover:text-white",
            "text-xs py-2 border border-white/10 rounded-lg transition-colors"
          )}
        >
          Voir sur l'explorateur
          <ExternalLink size={12} />
        </a>
      )}
    </div>
  );
};

export default AccountCard;