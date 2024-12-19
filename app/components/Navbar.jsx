"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import clsx from "clsx";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <div className="flex justify-between items-center p-4 md:hidden">
        <div className="text-2xl font-bold">AIPAS</div>
        <button
          onClick={toggleMenu}
          className="text-white text-3xl focus:outline-none"
        >
          {menuOpen ? "X" : "☰"}
        </button>
      </div>
      <div
        className={clsx(
          menuOpen ? "flex" : "hidden",
          "flex-col gap-2 p-4 md:flex md:flex-row md:justify-center md:gap-6 md:p-2"
        )}
      >
        <SignedIn>
          <Link
            href="/interview"
            className={clsx(
              "hover:bg-[#0362C7] p-2 rounded",
              pathname === "/interview" && "bg-[#0362C7] text-white"
            )}
          >
            Interview
          </Link>
        </SignedIn>
        <Link
          href="/about"
          className={clsx(
            "hover:bg-[#0362C7] p-2 rounded",
            pathname === "/about" && "bg-[#0362C7] text-white"
          )}
        >
          About
        </Link>
        <Link
          href="/contact"
          className={clsx(
            "hover:bg-[#0362C7] p-2 rounded",
            pathname === "/contact" && "bg-[#0362C7] text-white"
          )}
        >
          Contact
        </Link>
        <SignedOut>
          <SignInButton
            mode="modal"
            className={clsx(
              "hover:bg-[#0362C7] p-2 rounded",
              pathname === "/signin" && "bg-[#0362C7] text-white"
            )}
          />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </>
  );
};

export default Navbar;
