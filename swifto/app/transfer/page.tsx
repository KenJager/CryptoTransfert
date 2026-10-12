import type { Metadata } from "next";
import TransferForm from "@/components/TransferForm";
import AccountCard from "@/components/AccountCard";
import { TransferPageClient } from "@/components/TransferPageClient";

export const metadata: Metadata = {
  title: "Swifto — Transfer",
  description:
    "Envoyez des cryptomonnaies partout dans le monde en quelques secondes.",
};

export default function TransferPage() {
  return (
    <main className="min-h-screen pt-24 px-4 sm:px-6 md:px-14">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-white text-3xl sm:text-5xl text-gradient py-1 mb-4">
          Transfer Crypto
        </h1>
        <p className="text-white/70 mb-10 max-w-2xl">
          Envoyez des ETH à n'importe quelle adresse, avec un message et un GIF
          associé. La transaction est enregistrée sur la blockchain.
        </p>

        <TransferPageClient />
      </div>
    </main>
  );
}