"use client";

import { useContext } from "react";
import Image from "next/image";
import { TransactionContext } from "@/context/TransactionContext";
import useFetch from "@/hooks/useFetch";
import dummyData from "@/utils/dummyData";
import { shortenAddress } from "@/utils/shortenAddress";
import type { Transaction } from "@/types";

interface TransactionsCardProps extends Transaction {
  url?: string;
}

const TransactionsCard = ({
  addressTo,
  addressFrom,
  timestamp,
  message,
  keyword,
  amount,
  url,
}: TransactionsCardProps) => {
  const gifUrl = useFetch({ keyword });
  const src = (gifUrl || url)?.trim();

  return (
    <div className="bg-[#181918] m-4 flex flex-1 2xl:min-w-[450px] 2xl:max-w-[500px] sm:min-w-[270px] sm:max-w-[300px] min-w-full flex-col p-3 rounded-md hover:shadow-2xl">
      <div className="flex flex-col items-center w-full p-2">
        <div className="display-flex justify-start w-full mb-6 p-2">
          <a
            href={`https://sepolia.etherscan.io/address/${addressFrom}`}
            target="_blank"
            rel="noreferrer"
          >
            <p className="text-white text-base">
              From: {shortenAddress(addressFrom)}
            </p>
          </a>
          <a
            href={`https://sepolia.etherscan.io/address/${addressTo}`}
            target="_blank"
            rel="noreferrer"
          >
            <p className="text-white text-base">
              To: {shortenAddress(addressTo)}
            </p>
          </a>
          <p className="text-white text-base">Amount: {amount} ETH</p>
          {message && (
            <>
              <br />
              <p className="text-white text-base">Message: {message}</p>
            </>
          )}
        </div>

        {/* Wrapper obligatoire pour `fill` */}
        <div className="relative w-full h-25 rounded-md overflow-hidden shadow-lg">
          {src ? (
            <Image
              src={src}
              alt="gif"
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <p className="text-gray-400 text-sm">No GIF available</p>
            </div>
          )}
        </div>

        <div className="bg-black p-3 px-5 w-max rounded-3xl mt-5 shadow-2xl">
          <p className="text-[#37c7da] font-bold">{timestamp}</p>
        </div>
      </div>
    </div>
  );
};

const Transactions = () => {
  const { transactions, currentAccount } = useContext(TransactionContext)!;

  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        <h3 className="text-white text-3xl text-center my-2">
          {currentAccount
            ? "Latest Transactions"
            : "Connect your account to see the latest transactions"}
        </h3>

        <div className="flex flex-wrap justify-center items-center mt-10">
          {[...dummyData, ...transactions]
            .reverse()
            .map((transaction, i) => (
              <TransactionsCard key={i} {...transaction} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Transactions;