"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getServerSession } from "@/authActions";
import { handleSignIn, handleSignOut } from "@/authActions";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function fetchSession() {
      const sessionData = await getServerSession();
      setSession(sessionData);
    }
    fetchSession();
  }, []);

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
        {session?.user ? (
          <>
            <Link href="/interview" className="hover:bg-[#0362C7] p-2 rounded">
              Interview
            </Link>

            <Link
              href={`/user/${session.user.id}`}
              className="hover:bg-[#0362C7] p-2 rounded"
            >
              {session.user.name.split(" ")[0]}
            </Link>
            <form action={handleSignOut}>
              <button type="submit" className="hover:bg-[#0362C7] p-2 rounded">
                Logout
              </button>
            </form>
          </>
        ) : (
          <form action={handleSignIn}>
            <button type="submit" className="hover:bg-[#0362C7] p-2 rounded">
              Login
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default Navbar;
