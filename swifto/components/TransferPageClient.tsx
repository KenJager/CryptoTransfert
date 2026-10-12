// app/transfer/TransferPageClient.tsx
"use client";

import { useContext } from "react";
import { TransactionContext } from "@/context/TransactionContext";
import AccountCard from "@/components/AccountCard";
import TransferForm from "@/components/TransferForm";

export function TransferPageClient() {
  const { currentAccount } = useContext(TransactionContext)!;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
      {/* Colonne gauche : infos compte */}
      <aside className="lg:sticky lg:top-24 self-start">
        {currentAccount ? (
          <AccountCard address={currentAccount} />
        ) : (
          <div className="blue-glassmorphism p-5 text-center">
            <p className="text-white/70 text-sm">
              Connectez votre wallet pour voir les informations du compte.
            </p>
          </div>
        )}
      </aside>

      {/* Colonne droite : formulaire */}
      <div className="w-full md:w-[70%]">
        <TransferForm />
      </div>
    </div>
  );
}