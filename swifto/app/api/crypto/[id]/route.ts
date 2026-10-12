import { NextResponse } from "next/server";
import { coinpaprika } from "@/lib/coinpaprika";

export const revalidate = 600; // Cache 10min

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // ✅ getCoin(id) récupère les détails d'une crypto
    const coin = await coinpaprika.getCoin(id);

    return NextResponse.json(
      { data: coin, updatedAt: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": "public, s-maxage=600",
        },
      }
    );
  } catch (error) {
    console.error(`CoinPaprika error for ${id}:`, error);
    return NextResponse.json(
      { error: "Coin not found" },
      { status: 404 }
    );
  }
}