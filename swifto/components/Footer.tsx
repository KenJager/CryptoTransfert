"use client"

import Image from "next/image";

const footerLinks = ["Market", "Exchange", "Tutorials", "Wallets"] as const;

const Footer = () => (
  <div className="w-full flex md:justify-center justify-between items-center px-15 py-4 flex-col gradient-bg-footer">
    <div className="w-full flex sm:flex-row flex-col justify-center items-center my-4">
      <div className="flex flex-[0.5] justify-center items-center">
        <Image src="/logo.png" alt="logo" width={100} height={100} />
      </div>
    </div>

    <div className="flex justify-center items-center flex-col mt-5">
      <p className="text-white text-sm text-center font-medium mt-2">
        nzokosalih@gmail.com
      </p>
    </div>

    <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5" />

    <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
      <p className="text-white text-left text-xs">@KenJagers</p>
      <p className="text-white text-right text-xs">All rights reserved</p>
    </div>
  </div>
);

export default Footer;