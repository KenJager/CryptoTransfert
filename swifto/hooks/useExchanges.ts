"use client";

import { useQuery } from "@tanstack/react-query";

export interface Exchange {
  id: string;
  name: string;
  type: string;
  active: boolean;
  adjusted_rank: number;
  reported_rank: number;
  currencies: number;
  markets: number;
}

const fetchExchanges = async (): Promise<Exchange[]> => {
  const res = await fetch("/api/exchanges");
  if (!res.ok) throw new Error("Failed to fetch exchanges");
  const json = await res.json();
  return json.data;
};

export default function useExchanges() {
  return useQuery({
    queryKey: ["exchanges"],
    queryFn: fetchExchanges,
    staleTime: 60 * 60_000, // 1h
  });
}