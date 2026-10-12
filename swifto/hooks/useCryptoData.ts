"use client";

import { useQuery } from "@tanstack/react-query";

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  rank: number;
  price: number;
  volume24h: number;
  marketValue: number;
  change24h: number;
  change7d: number;
}

interface CryptoResponse {
  data: CryptoAsset[];
  updatedAt: string;
}

const fetchCrypto = async (): Promise<CryptoResponse> => {
  const res = await fetch("/api/crypto");
  if (!res.ok) throw new Error("Failed to fetch crypto data");
  return res.json();
};

export default function useCryptoData() {
  const { data, isLoading, error, dataUpdatedAt } = useQuery({
    queryKey: ["crypto"],
    queryFn: fetchCrypto,
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: false,
  });

  return {
    assets: data?.data ?? [],
    updatedAt: data?.updatedAt,
    isLoading,
    error,
    dataUpdatedAt,
  };
}