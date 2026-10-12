"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import useCryptoData, { type CryptoAsset } from "@/hooks/useCryptoData";
import CryptoTableRow from "./Common/TableRow";
import { cn } from "@/utils/cn";

type SortKey = "price" | "change24h" | "marketValue" | "rank";
type SortOrder = "asc" | "desc";

const CryptoTable = () => {
  // ✅ Récupère les données du hook
  const { assets, isLoading, error, updatedAt, dataUpdatedAt } = useCryptoData();

  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // ✅ Filtre et trie les assets localement
  const filteredAndSortedData = useMemo(() => {
    if (!assets) return [];
    
    const filtered = assets.filter(
      (a) =>
        a.name.toLowerCase().includes(filter.toLowerCase()) ||
        a.symbol.toLowerCase().includes(filter.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      const cmp = typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv));
      return sortOrder === "asc" ? cmp : -cmp;
    });
  }, [assets, filter, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // ✅ Affiche le loader seulement si isLoading est vrai
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

  return (
    <div>
      {/* Barre de recherche + info fraîcheur */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <p className="text-white/50 text-xs">
          Dernière mise à jour :{" "}
          {new Date(dataUpdatedAt).toLocaleTimeString()}
          {updatedAt && ` (${new Date(updatedAt).toLocaleTimeString()})`}
        </p>

        <div className="relative w-full md:w-1/4">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            placeholder="Search..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={cn(
              "w-full pl-10 pr-4 py-2 rounded-lg",
              "bg-white/5 border border-white/10 text-white",
              "placeholder:text-white/40",
              "focus:outline-none focus:border-white/30 focus:bg-white/10",
              "transition-colors"
            )}
          />
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full" aria-label="crypto table">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left text-white font-semibold">
                Crypto
              </th>
              <SortableHeader
                label="Prix (USD)"
                active={sortKey === "price"}
                order={sortOrder}
                onClick={() => handleSort("price")}
              />
              <SortableHeader
                label="Market Cap (B USD)"
                active={sortKey === "marketValue"}
                order={sortOrder}
                onClick={() => handleSort("marketValue")}
              />
              <SortableHeader
                label="24h Change"
                active={sortKey === "change24h"}
                order={sortOrder}
                onClick={() => handleSort("change24h")}
              />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredAndSortedData.map((row:any) => (
              <CryptoTableRow key={row.id} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface SortableHeaderProps {
  label: string;
  active: boolean;
  order: SortOrder;
  onClick: () => void;
}

const SortableHeader = ({
  label,
  active,
  order,
  onClick,
}: SortableHeaderProps) => (
  <th
    className="px-4 py-3 text-left text-white font-semibold cursor-pointer select-none hover:bg-white/5"
    onClick={onClick}
  >
    <span className="inline-flex items-center gap-1">
      {label}
      {active && <span className="text-xs">{order === "asc" ? "▲" : "▼"}</span>}
    </span>
  </th>
);

export default CryptoTable;