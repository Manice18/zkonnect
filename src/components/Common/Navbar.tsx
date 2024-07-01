"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "@/components/Common/Logo";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import WalletConnectButton from "@/components/Wallet/wallet-connect-button";
import Link from "next/link";

const Navbar = ({
  requireLogin = true,
  requireLogo,
}: {
  requireLogin?: boolean;
  requireLogo?: boolean;
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  const scrolled = useScrollTop();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 z-[99999] flex w-full items-center px-6 py-3",
        scrolled && "border-b bg-zkonnect-white-origin shadow-sm",
      )}
      ref={menuRef}
    >
      <div className="mx-auto flex w-full max-w-[1600px]">
        <Link href="/" className={`${requireLogo ? "block" : "hidden"}`}>
          <Logo />
        </Link>
        <div className="flex w-full items-center justify-end gap-x-2 md:ml-auto">
          {requireLogin && <WalletConnectButton />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
