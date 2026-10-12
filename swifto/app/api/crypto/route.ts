import { NextResponse } from "next/server";

export async function GET() {
  try {
    // ✅ Fetch direct vers /tickers qui contient les prix
    const res = await fetch(
      "https://api.coinpaprika.com/v1/tickers?quotes=USD",
    );

    if (!res.ok) throw new Error(`CoinPaprika error: ${res.status}`);

    const tickers = await res.json();

    // On garde les 100 premières et on extrait les champs utiles
    const assets = tickers.slice(0, 100).map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      rank: coin.rank,
      price: coin.quotes.USD.price,           // ✅ Prix
      marketValue: coin.quotes.USD.market_cap / 1e9, // en milliards
      change24h: coin.quotes.USD.percent_change_24h,
      volume24h: coin.quotes.USD.volume_24h,
    }));

    return NextResponse.json({ data: assets });
  } catch (error) {
    console.error("CoinPaprika error:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les données" },
      { status: 502 }
    );
  }
}