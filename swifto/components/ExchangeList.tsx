// app/exchange/ExchangeList.tsx
"use client";

import useExchanges from "@/hooks/useExchanges";
import { cn } from "@/utils/cn";

export default function ExchangeList() {
  const { data: exchanges, isLoading, error } = useExchanges();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-12 w-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
        Erreur : {(error as Error).message}
      </div>
    );
  }

  if (!exchanges || exchanges.length === 0) {
    return (
      <div className="p-6 text-white/60 text-center">
        Aucun exchange disponible.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full" aria-label="exchanges table">
        <thead className="bg-white/5">
          <tr>
            <th className="px-4 py-3 text-left text-white font-semibold">Nom</th>
            <th className="px-4 py-3 text-left text-white font-semibold">Type</th>
            <th className="px-4 py-3 text-left text-white font-semibold">Rang</th>
            <th className="px-4 py-3 text-left text-white font-semibold">Devises</th>
            <th className="px-4 py-3 text-left text-white font-semibold">Marchés</th>
            <th className="px-4 py-3 text-left text-white font-semibold">Statut</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {exchanges.map((ex) => (
            <tr key={ex.id} className="hover:bg-white/5 transition-colors">
              <td className="px-4 py-3 text-white font-medium">{ex.name}</td>
              <td className="px-4 py-3 text-white/70 text-sm">{ex.type}</td>
              <td className="px-4 py-3 text-white/70 text-sm">{ex.adjusted_rank ?? "—"}</td>
              <td className="px-4 py-3 text-white/70 text-sm">{ex.currencies ?? "—"}</td>
              <td className="px-4 py-3 text-white/70 text-sm">{ex.markets ?? "—"}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    ex.active
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  )}
                >
                  {ex.active ? "Actif" : "Inactif"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}