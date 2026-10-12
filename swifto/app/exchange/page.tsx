// app/exchange/page.tsx
import type { Metadata } from "next";
import ExchangeList from "@/components/ExchangeList";

export const metadata: Metadata = {
  title: "Exchange — Krypto",
  description: "Découvrez les exchanges supportés par Krypto.",
};

export default function ExchangePage() {
  return (
    <main className="min-h-screen pt-24 px-6 md:px-14">
      <h1 className="text-white text-4xl font-bold mb-6">Exchanges</h1>
      <p className="text-white/70 mb-8">
        Découvrez les {">"}350 exchanges référencés par CoinPaprika.
      </p>
      <ExchangeList />
    </main>
  );
}