"use client"

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";

import { contractABI, contractAddress } from "@/utils/constants";
import type {
  FormData,
  Transaction,
  TransactionContextType,
} from "@/types";

export const TransactionContext = createContext<TransactionContextType | null>(
  null
);

const getEthereum = () =>
  typeof window !== "undefined" ? window.ethereum : undefined;

const createEthereumContract = async () => {
  const ethereum = getEthereum();
  if (!ethereum) throw new Error("MetaMask non détecté");

  const provider = new BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  return new Contract(contractAddress, contractABI, signer);
};

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormData>({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState<string | null>(
    typeof window !== "undefined"
      ? window.localStorage.getItem("transactionCount")
      : null
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, name: keyof FormData) => {
      setFormData((prev) => ({ ...prev, [name]: e.target.value }));
    },
    []
  );

  const getAllTransactions = useCallback(async () => {
    try {
      const contract = await createEthereumContract();
      const available = await contract.getAllTransactions();

      const structured: Transaction[] = available.map((tx: any) => ({
        addressTo: tx.receiver,
        addressFrom: tx.sender,
        timestamp: new Date(
          Number(tx.timestamp) * 1000
        ).toLocaleString(),
        message: tx.message,
        keyword: tx.keyword,
        amount: formatEther(tx.amount),
      }));

      setTransactions(structured);
    } catch (error) {
      console.error("getAllTransactions:", error);
    }
  }, []);

  const checkIfWalletIsConnected = useCallback(async () => {
    const ethereum = getEthereum();
    if (!ethereum) return;

    try {
      const accounts = (await ethereum.request({
        method: "eth_accounts",
      })) as string[];

      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        await getAllTransactions();
      }
    } catch (error) {
      console.error(error);
    }
  }, [getAllTransactions]);

  const connectWallet = useCallback(async () => {
    const ethereum = getEthereum();
    if (!ethereum) {
      alert("Please install MetaMask.");
      return;
    }

    try {
      const accounts = (await ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      setCurrentAccount(accounts[0]);
      await getAllTransactions();
    } catch (error) {
      console.error(error);
    }
  }, [getAllTransactions]);

  const sendTransaction = useCallback(async () => {
    const ethereum = getEthereum();
    if (!ethereum) return;

    try {
      const { addressTo, amount, keyword, message } = formData;
      setIsLoading(true);

      const contract = await createEthereumContract();
      const parsedAmount = parseEther(amount);

      // Appel direct via le contrat (plus besoin de eth_sendTransaction)
      const tx = await contract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );

      await tx.wait();

      const count = await contract.getTransactionCount();
      setTransactionCount(count.toString());
      window.localStorage.setItem("transactionCount", count.toString());

      await getAllTransactions();
    } catch (error) {
      console.error("sendTransaction:", error);
    } finally {
      setIsLoading(false);
    }
  }, [formData, getAllTransactions]);

  useEffect(() => {
    void checkIfWalletIsConnected();
  }, [checkIfWalletIsConnected]);

  const value = useMemo<TransactionContextType>(
    () => ({
      transactionCount,
      connectWallet,
      transactions,
      currentAccount,
      isLoading,
      sendTransaction,
      handleChange,
      formData,
    }),
    [
      transactionCount,
      connectWallet,
      transactions,
      currentAccount,
      isLoading,
      sendTransaction,
      handleChange,
      formData,
    ]
  );

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};