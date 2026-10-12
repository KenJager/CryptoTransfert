export interface Transaction {
  addressTo: string;
  addressFrom: string;
  timestamp: string;
  message: string;
  keyword?: string;
  amount: string;
  url?: string;
}

export interface FormData {
  addressTo: string;
  amount: string;
  keyword: string;
  message: string;
}

export interface TransactionContextType {
  transactionCount: string | null;
  connectWallet: () => Promise<void>;
  transactions: Transaction[];
  currentAccount: string;
  isLoading: boolean;
  sendTransaction: () => Promise<void>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    name: keyof FormData
  ) => void;
  formData: FormData;
}

declare global {
  interface Window {
    ethereum?: import("ethers").Eip1193Provider & {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

/**
 * Represents cryptocurrency data used across the application.
 *
 * @property {string} id - Unique identifier of the coin (e.g. "bitcoin").
 * @property {string} name - Full name of the coin (e.g. "Bitcoin").
 * @property {string} symbol - Ticker symbol (e.g. "BTC").
 * @property {string} price - Current price in USDT as a string.
 * @property {string} change24h - 24h percentage change as a string.
 * @property {number} marketValue - Market capitalization in USD.
 * @property {number} [priceChange] - Last tick price difference (for flashing).
 * @property {number} [previousPrice] - Previous price before last tick.
 * @property {number[]} [priceHistory] - Last N prices for the sparkline.
 */
export interface CoinData {
  id?: string;
  name: string;
  symbol: string;
  price: string;
  change24h: string;
  marketValue: number;
  priceChange?: number;
  previousPrice?: number;
  priceHistory?: number[];
}