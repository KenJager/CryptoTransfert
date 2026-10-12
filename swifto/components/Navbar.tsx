"use client"

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/utils/cn";
import Image from "next/image";

interface NavBarItemProps {
  title: string;
  classprops?: string;
}

const NavBarItem = ({ title, classprops }: NavBarItemProps) => (
  <li className={cn("mx-4 cursor-pointer", classprops)}>{title}</li>
);

const navItems = ["Market", "Exchange", "Tutorials", "Wallets"] as const;

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <Image src="/logo.png" alt="logo" className="cursor-pointer"  width={20} height={20} />
      </div>

      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {navItems.map((item) => (
          <NavBarItem key={item} title={item} />
        ))}
        <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]">
          Login
        </li>
      </ul>

      <div className="flex relative">
        <button
          type="button"
          aria-label={toggleMenu ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setToggleMenu((v) => !v)}
          className="text-white md:hidden cursor-pointer"
        >
          {toggleMenu ? <X size={28} /> : <Menu size={28} />}
        </button>

        {toggleMenu && (
          <ul
            className="z-10 fixed top-0 right-0 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
          >
            <li className="text-xl w-full my-2">
              <button
                type="button"
                aria-label="Fermer le menu"
                onClick={() => setToggleMenu(false)}
              >
                <X size={24} />
              </button>
            </li>
            {navItems.map((item) => (
              <NavBarItem key={item} title={item} classprops="my-2 text-lg" />
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;