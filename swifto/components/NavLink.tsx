"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
}

export const NavLink = ({
  href,
  children,
  className,
  onNavigate,
}: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "mx-2 px-3 py-2 rounded-md transition-colors duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2952e3]",
        isActive
          ? "text-white bg-white/10"
          : "text-white/70 hover:text-white hover:bg-white/5",
        className
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
};