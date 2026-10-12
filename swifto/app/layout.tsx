import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { TransactionsProvider } from "@/context/TransactionContext";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Krypto — Send Crypto Across the World",
  description:
    "Explore the crypto world. Buy and sell cryptocurrencies easily on Krypto.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${openSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-dark-bg text-white">
        <TransactionsProvider>{children}</TransactionsProvider>
      </body>
    </html>
  );
}