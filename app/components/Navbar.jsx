"use client";
import React, { useState } from "react";
import Link from "next/link";
import { SignInButton,UserButton } from "@clerk/nextjs";
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
        <Link href="/interview" className="hover:bg-[#0362C7] p-2 rounded">
          Interview
        </Link>
        <Link href="/about" className="hover:bg-[#0362C7] p-2 rounded">
          About
        </Link>
        <Link href="/contact" className="hover:bg-[#0362C7] p-2 rounded">
          Contact
        </Link>
        <SignInButton mode='modal'/>
        <UserButton/>
      </div>
    </>
  );
};

export default Navbar;
