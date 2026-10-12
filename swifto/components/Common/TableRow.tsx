"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/utils/cn";
import type { CoinData } from "@/index";

interface CryptoTableRowProps {
  row: CoinData;
}

const formatMarketValue = (value: number): string => {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  return value.toFixed(2);
};

const CryptoTableRow = ({ row }: CryptoTableRowProps) => {
  const currentPrice = Number(row.price);
  const previousPrice = Number(row.previousPrice ?? row.price);

  const [priceHistory, setPriceHistory] = useState<number[]>(
    row.priceHistory ?? []
  );
  const [isFlashing, setIsFlashing] = useState(false);
  const previousPriceRef = useRef<number>(previousPrice);

  useEffect(() => {
    if (currentPrice === previousPriceRef.current) return;

    setIsFlashing(true);
    setPriceHistory((prev) => {
      const next = [...prev, currentPrice];
      return next.length > 20 ? next.slice(1) : next;
    });
    previousPriceRef.current = currentPrice;

    const timeout = setTimeout(() => setIsFlashing(false), 2000);
    return () => clearTimeout(timeout);
  }, [currentPrice]);

  const change = Number(row.change24h);
  const isPositive = change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <tr
      className={cn(
        "transition-colors duration-500 hover:bg-white/5",
        isFlashing && (isPositive ? "bg-green-500/15" : "bg-red-500/15")
      )}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Image
            src={`https://cdn.bilira.co/symbol/svg/${row.symbol.toLowerCase()}.svg`}
            alt={`${row.symbol} icon`}
            width={36}
            height={36}
            loading="lazy"
            className="rounded-full"
            unoptimized
          />
          <div className="flex flex-col text-sm">
            <span className="text-white font-semibold">
              {row.symbol.toUpperCase()}
              <span className="text-white/50 font-normal"> / USDT</span>
            </span>
            <span className="text-white/50 text-xs">{row.name}</span>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <span className="text-white font-bold text-lg">
          {currentPrice.toFixed(2)}
        </span>
        <span className="text-white/50 text-xs ml-1">USDT</span>
      </td>

      <td className="px-4 py-3">
        <span className="text-white font-bold text-lg">
          {formatMarketValue(Number(row.marketValue))}
        </span>
        <span className="text-white/50 text-xs ml-1">USDT</span>
      </td>

      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center gap-1 font-medium",
            isPositive ? "text-green-500" : "text-red-500"
          )}
        >
          <TrendIcon size={16} />
          {change.toFixed(2)}%
        </span>
      </td>
    </tr>
  );
};

export default CryptoTableRow;