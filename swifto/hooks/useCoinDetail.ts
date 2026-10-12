"use client";

import { useQuery } from "@tanstack/react-query";
import type { CryptoAsset } from "./useCryptoData";

const fetchCoin = async (id: string): Promise<CryptoAsset> => {
  const res = await fetch(`/api/crypto/${id}`);
  if (!res.ok) throw new Error("Failed to fetch coin");
  const json = await res.json();
  return json.data;
};

export default function useCoinDetail(id: string) {
  return useQuery({
    queryKey: ["coin", id],
    queryFn: () => fetchCoin(id),
    staleTime: 5 * 60_000,
    enabled: !!id,
  });
}