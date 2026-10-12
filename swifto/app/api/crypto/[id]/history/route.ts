import { NextResponse } from "next/server";
import { coinpaprika } from "@/lib/coinpaprika";

export const revalidate = 86400; // Cache 24h

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // ✅ getCoinsOHLCVHistorical récupère l'historique OHLCV
    // Note: le free tier ne donne que le dernier jour complet en OHLCV.
    // Pour des données quotidiennes sur 1 an, il faut utiliser l'endpoint REST /tickers/{id}/historical
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const history = await coinpaprika.getCoinsOHLCVHistorical({
      coinId: id,
      start: yesterday.toISOString().split("T")[0],
      end: today.toISOString().split("T")[0],
    });

    return NextResponse.json({ data: history });
  } catch (error) {
    console.error("History error:", error);
    return NextResponse.json(
      { error: "History unavailable" },
      { status: 502 }
    );
  }
}