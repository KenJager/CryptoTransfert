import type { Metadata } from "next";
import CryptoTable from "@/components/CryptoTable";

export const metadata: Metadata = {
  title: "Swifto — Market",
  description: "Explorez les marchés crypto en temps réel.",
};

export default function MarketPage() {
  return (
    <main className="min-h-screen pt-24 px-6 md:px-14">
      <h1 className="text-white text-4xl font-bold mb-6">Market</h1>
      <p className="text-white/70">
        Suivez les prix, les volumes et les tendances des cryptomonnaies.
      </p>
      <CryptoTable />
    </main>
  );
}
