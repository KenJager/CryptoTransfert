import { CoinData } from "@/index";

/**
 * List of coin IDs used for the initial REST snapshot.
 * These IDs match the CoinCap assets endpoint.
 */
const COIN_LIST = [
  "ethereum",
  "usdt",
  "avalanche",
  "bitcoin",
  "tron",
  "chainlink",
  "shib",
  "solana",
  "decentraland",
  "sand",
  "bnb",
];

/**
 * List of coin slugs used by the CoinCap WebSocket & history endpoint.
 * Order matters: index-aligned with COIN_LIST.
 */
const COIN_LIST_HISTORY = [
  "ethereum",
  "usdc",
  "avalanche",
  "bitcoin",
  "tron",
  "chainlink",
  "shiba-inu",
  "solana",
  "decentraland",
  "the-sandbox",
  "bnb",
];

/**
 * Map linking a COIN_LIST id to its COIN_LIST_HISTORY counterpart.
 * @type {Record<string, string>}
 */
const coinMapping: Record<string, string> = {};
COIN_LIST.forEach((coin, index) => {
  coinMapping[coin] = COIN_LIST_HISTORY[index];
});

/**
 * Reverse map from history slug to the primary coin id.
 * Used to translate WebSocket payload keys back to internal ids.
 * @type {Record<string, string>}
 */
const reverseCoinMapping: Record<string, string> = {};
COIN_LIST.forEach((coin) => {
  reverseCoinMapping[coinMapping[coin]] = coin;
});

/**
 * Fetches the initial cryptocurrency data (price, market cap, 24h change,
 * and 30-day daily price history) for the coins defined in COIN_LIST.
 *
 * @returns {Promise<Record<string, CoinData>>} A promise resolving to a map
 * of coin id -> CoinData. Returns an empty object on failure.
 */
export async function fetchInitialData(): Promise<Record<string, CoinData>> {
  const initialData: Record<string, CoinData> = {};

  try {
    const response = await fetch("https://api.coincap.io/v2/assets");

    if (!response.ok) {
      throw new Error("Failed to fetch assets data");
    }

    const data = await response.json();

    for (const coin of COIN_LIST) {
      const coinData = data.data.find(
        (item: any) => item.id === coin || item.symbol.toLowerCase() === coin
      );

      if (!coinData) continue;

      try {
        const historyResponse = await fetch(
          `https://api.coincap.io/v2/assets/${coinMapping[coin]}/history?interval=d1`
        );

        if (!historyResponse.ok) {
          throw new Error(`Failed to fetch history data for ${coin}`);
        }

        const historyData = await historyResponse.json();
        let priceHistory: number[] = [];

        if (historyData.data && Array.isArray(historyData.data)) {
          priceHistory = historyData.data.map((entry: any) =>
            parseFloat(entry.priceUsd)
          );
        } else {
          console.error(
            `No history data found for ${coinMapping[coin]}.`
          );
        }

        initialData[coin.toLowerCase()] = {
          id: coin.toLowerCase(),
          price: Number(coinData.priceUsd).toFixed(9),
          name: coinData.name,
          symbol: coinData.symbol,
          marketValue: Number(coinData.marketCapUsd),
          change24h: Number(coinData.changePercent24Hr).toFixed(2),
          priceHistory,
        };
      } catch (error) {
        console.error(`Error fetching history data for ${coin}:`, error);
      }
    }
  } catch (error) {
    console.error("Error fetching initial data:", error);
  }

  return initialData;
}

/**
 * Opens a WebSocket connection to CoinCap to receive real-time price updates.
 *
 * @param {(data: Record<string, number>) => void} onMessage - Callback invoked
 * on each tick with a map of coin slug -> latest price (as number).
 * @param {(connected: boolean) => void} [onStatusChange] - Optional callback
 * fired when the connection opens or closes.
 * @returns {() => void} A cleanup function that closes the socket.
 */
export const connectToWebSocket = (
  onMessage: (data: Record<string, number>) => void,
  onStatusChange?: (connected: boolean) => void
): (() => void) => {
  const pricesWs = new WebSocket(
    `wss://ws.coincap.io/prices?assets=${COIN_LIST_HISTORY.join(",")}`
  );

  pricesWs.onopen = () => onStatusChange?.(true);
  pricesWs.onclose = () => {
    console.log("WebSocket connection closed");
    onStatusChange?.(false);
  };
  pricesWs.onerror = () => onStatusChange?.(false);

  pricesWs.onmessage = (msg) => {
    const raw = JSON.parse(msg.data) as Record<string, string>;
    const normalized: Record<string, number> = {};

    for (const [slug, price] of Object.entries(raw)) {
      const internalId = reverseCoinMapping[slug] ?? slug;
      normalized[internalId] = Number(price);
    }

    onMessage(normalized);
  };

  return () => pricesWs.close();
};