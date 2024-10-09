"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { ThemeToggleMode } from "./theme/ThemeToggleMode";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav className="shadow-md px-2 dark:shadow-slate-800">
      <div className="container md:mx-auto flex justify-between items-center">
        <Link
          className="text-2xl  font-bold flex items-center"
          href="/dashboard"
        >
          <Image
            src="/logo/namelessDark.png"
            alt="Nameless Feedback"
            width={70}
            height={70}
            className="w-[70px] h-[70px] dark:invert"
          />
          <span>Nameless</span>
        </Link>

        <ul className="hidden space-x-4 md:flex">
          <li
            className={`${
              pathname === "/"
                ? " bg-slate-100 dark:bg-slate-800 text-gray-500"
                : ""
            } rounded-md py-1 px-2`}
          >
            <Link className="flex items-center" href="/">
              Home
            </Link>
          </li>
          <li
            className={`${
              pathname === "/dashboard"
                ? " bg-slate-100 dark:bg-slate-800 text-gray-500"
                : ""
            } rounded-md py-1 px-2`}
          >
            <Link className="flex items-center" href="/dashboard">
              Dashboard
            </Link>
          </li>
        </ul>
        {session ? (
          <>
            {/* <span className='mr-4'>Welcome, {user?.username || user?.email}</span> */}
            <div className="flex space-x-4">
              <ThemeToggleMode />
              <Button
                className="inline-flex h-10 animate-shimmer items-center justify-center rounded-md border px-6 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
              border-slate-800 bg-[linear-gradient(110deg,#f9fafb,45%,#e5e7eb,55%,#f9fafb)] bg-[length:200%_100%] text-slate-900 focus:ring-slate-400 focus:ring-offset-slate-50
              dark:border-slate-700 dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] dark:text-slate-400 dark:focus:ring-slate-500 dark:focus:ring-offset-slate-900"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </div>
          </>
        ) : (
          <div className="flex space-x-4">
            <ThemeToggleMode />

            <Link href="/sign-in">
              <Button
                className="inline-flex h-10 animate-shimmer items-center justify-center rounded-md border px-6 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
              border-slate-800 bg-[linear-gradient(110deg,#f9fafb,45%,#e5e7eb,55%,#f9fafb)] bg-[length:200%_100%] text-slate-900 focus:ring-slate-400 focus:ring-offset-slate-50
              dark:border-slate-700 dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] dark:text-slate-400 dark:focus:ring-slate-500 dark:focus:ring-offset-slate-900"
              >
                SignIn
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
