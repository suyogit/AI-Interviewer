"use client";
import React, { useState } from "react";
import Link from "next/link";
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
        className={`${
          menuOpen ? "flex" : "hidden"
        } flex-col gap-2 p-4 md:flex md:flex-row md:justify-center md:gap-6 md:p-2`}
      >
        <SignedIn>
          <Link href="/interview" className="hover:bg-[#0362C7] p-2 rounded">
            Interview
          </Link>
        </SignedIn>

        <Link href="/about" className="hover:bg-[#0362C7] p-2 rounded">
          About
        </Link>
        <Link href="/contact" className="hover:bg-[#0362C7] p-2 rounded">
          Contact
        </Link>
        <SignedOut>
          <SignInButton mode="modal" className="hover:bg-[#0362C7] p-2 rounded"/>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </>
  );
};

export default Navbar;
