import type { Metadata } from "next";
import "./globals.css";
import { Footer, Navbar } from "@/components";
import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "Swifto — Send Crypto Across the World",
  description:
    "Explore the crypto world. Buy and sell cryptocurrencies easily on Krypto.",
  icons: {
    icon: "/logo-img.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col bg-dark-bg text-white">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}