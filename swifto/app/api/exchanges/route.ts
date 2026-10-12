import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.coinpaprika.com/v1/exchanges",
      { next: { revalidate: 3600 } } // Cache 1h
    );

    if (!res.ok) throw new Error(`CoinPaprika error: ${res.status}`);

    const exchanges = await res.json();

    // On garde les 50 premières pour ne pas surcharger
    const data = exchanges.slice(0, 50).map((ex: any) => ({
      id: ex.id,
      name: ex.name,
      type: ex.type, // "exchange" ou "dex"
      active: ex.active,
      adjusted_rank: ex.adjusted_rank,
      reported_rank: ex.reported_rank,
      currencies: ex.currencies,
      markets: ex.markets,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Exchanges fetch error:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les exchanges" },
      { status: 502 }
    );
  }
}