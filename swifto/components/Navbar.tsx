"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { NavLink } from "./NavLink";

const navItems = [
  { label: "Market", href: "/market" },
  { label: "Transfer", href: "/transfer" },
  { label: "Exchange", href: "/exchange" },
] as const;

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Détecte le scroll pour adapter le background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloque le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = toggleMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [toggleMenu]);

  // Ferme le menu avec Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setToggleMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Ferme le menu si on passe en desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setToggleMenu(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full",
          "px-4 sm:px-10 lg:px-20 py-3 sm:py-4",
          "transition-all duration-300",
          scrolled
            ? "bg-[#0f0e13]/80 backdrop-blur-md shadow-lg border-b border-white/5"
            : "bg-transparent"
        )}
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Swifto logo"
              width={100}
              height={100}
              // Logo plus petit sur mobile
              className="cursor-pointer w-16 sm:w-20 lg:w-24 h-auto"
            />
          </Link>

          {/* Desktop */}
          <ul className="hidden md:flex list-none flex-row items-center gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
            <li>
              <button
                type="button"
                className={cn(
                  "ml-4 bg-[#2952e3] py-2 px-5 lg:px-7 rounded-full text-white",
                  "cursor-pointer hover:bg-[#2546bd] transition-colors",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                )}
              >
                Login
              </button>
            </li>
          </ul>

          {/* Bouton mobile */}
          <button
            type="button"
            aria-label={toggleMenu ? "Close menu" : "Open menu"}
            aria-expanded={toggleMenu}
            aria-controls="mobile-menu"
            onClick={() => setToggleMenu((v) => !v)}
            className={cn(
              "md:hidden text-white p-2 rounded-md",
              "hover:bg-white/10 transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            )}
          >
            {toggleMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Overlay sombre */}
      <div
        onClick={() => setToggleMenu(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 md:hidden",
          "transition-opacity duration-300",
          toggleMenu
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
      />

      {/* Menu mobile — slide down + scrollable */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed top-0 left-0 right-0 z-50 md:hidden",
          "bg-black rounded-b-2xl",
          "transform transition-transform duration-300 ease-out",
          // ✅ Limite la hauteur à 90vh et permet le scroll
          "max-h-[90vh] overflow-y-auto",
          toggleMenu ? "translate-y-0" : "-translate-y-full"
        )}
        // ✅ Safe area pour les iPhone avec encoche
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="flex justify-between items-center px-4 sm:px-6 py-4">
          <Image
            src="/logo.png"
            alt="Krypto logo"
            width={100}
            height={100}
            priority
            className="w-16 sm:w-20 h-auto"
          />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setToggleMenu(false)}
            className="text-white p-2 rounded-md hover:bg-white/10"
          >
            <X size={24} />
          </button>
        </div>

        <ul className="flex flex-col px-4 sm:px-6 pb-6 gap-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                href={item.href}
                onNavigate={() => setToggleMenu(false)}
                // ✅ Texte adaptatif
                className="block w-full py-3 px-4 text-base sm:text-lg"
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          <li className="mt-2">
            <button
              type="button"
              onClick={() => setToggleMenu(false)}
              className={cn(
                "w-full bg-[#2952e3] py-3 px-7 rounded-full text-white font-semibold",
                "hover:bg-[#2546bd] transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              )}
            >
              Login
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;