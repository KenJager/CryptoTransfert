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