"use client";

import { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PlayCircle,
  Send,
  ShieldCheck,
  Coins,
  Globe,
  Zap,
  Lock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { TransactionContext } from "@/context/TransactionContext";
import { cn } from "@/utils/cn";

interface Feature {
  label: string;
  icon: LucideIcon;
}

const features: Feature[] = [
  { label: "Reliability", icon: ShieldCheck },
  { label: "Security", icon: Lock },
  { label: "Ethereum", icon: Coins },
  { label: "Web 3.0", icon: Globe },
  { label: "Low Fees", icon: Zap },
  { label: "Blockchain", icon: Coins },
];

const Welcome = () => {
  const { currentAccount, connectWallet } = useContext(TransactionContext)!;

  return (
    <section className="relative w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-32 pb-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Colonne gauche : texte + CTA + features */}
          <div className="flex-1 flex flex-col justify-start items-start">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white text-gradient leading-tight">
              Envoyez de la crypto
              <br />
              partout dans le monde
            </h1>

            <p className="text-left mt-5 text-white/70 font-light max-w-xl text-base sm:text-lg">
              Explorez l'univers crypto. Achetez, vendez et transférez vos
              actifs en quelques secondes, en toute sécurité.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 mt-8">
              {!currentAccount && (
                <button
                  type="button"
                  onClick={connectWallet}
                  className={cn(
                    "flex items-center justify-center gap-2",
                    "bg-[#2952e3] hover:bg-[#2546bd]",
                    "py-3 px-6 rounded-full text-white font-semibold",
                    "transition-colors cursor-pointer",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  )}
                >
                  <PlayCircle size={20} />
                  Connect Wallet
                </button>
              )}

              <Link
                href="/transfer"
                className={cn(
                  "flex items-center justify-center gap-2",
                  "border border-[#3d4f7c] hover:bg-[#3d4f7c]",
                  "py-3 px-6 rounded-full text-white font-semibold",
                  "transition-colors",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                )}
              >
                <Send size={18} />
                Envoyer des cryptos
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full mt-12 max-w-lg">
              {features.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className={cn(
                    "flex items-center gap-2 px-3 py-3",
                    "border border-white/10 rounded-xl",
                    "text-white/80 text-sm font-light",
                    "hover:border-white/20 hover:bg-white/5 transition-colors"
                  )}
                >
                  <Icon size={16} className="text-[#2952e3] shrink-0" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Colonne droite : image */}
          <div className="flex-1 w-full max-w-md lg:max-w-lg">
            <div className="relative w-full aspect-square">
              <Image
                src="/crypto-send.png"
                alt="Illustration d'envoi de cryptomonnaies"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="object-contain drop-shadow-2xl -rotate-30"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;