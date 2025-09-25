"use client";

import Link from "next/link";
import React from "react";
import { JSX } from "react";

type NavItem = {
  href: string;
  label: string;
  isActive?: boolean;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home", isActive: true },
  { href: "/missions", label: "Missions" },
  { href: "/modules", label: "Modules" },
  { href: "/pricing", label: "Pricing" },
];

export default function Navbar(): JSX.Element {
  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[90%] z-50">
      <div className="backdrop-blur-md bg-black/70 rounded-3xl shadow-lg supports-[backdrop-filter]:backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          {/* Left: Logo + subtitle */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-green-300/60">
              <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                <circle cx="32" cy="32" r="30" fill="#14532d" />
                <path d="M18 36c10-2 18-10 24-20 2 10-2 22-8 28-6 6-14 8-24 6 4-6 4-10 8-14z" fill="#22c55e" />
              </svg>
            </div>
            <div className="leading-tight">
              <div
                className="text-xl font-extrabold tracking-wide text-white md:text-2xl"
                style={{ fontFamily: '"Press Start 2P", system-ui, sans-serif' }}
              >
                ECO Play
              </div>
              <div className="text-xs text-green-100/90">Gamified environmental education</div>
            </div>
          </Link>

          {/* Right: Nav links + search + signup */}
          <div className="flex items-center gap-2 md:gap-4">
            <ul className="hidden items-center gap-4 md:flex">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={
                      "text-sm font-medium transition-colors hover:text-yellow-300 " +
                      (item.isActive ? "text-yellow-400" : "text-green-100")
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Search icon */}
            <button
              aria-label="Search"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-green-100 hover:bg-white/10 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3a7.5 7.5 0 105.036 13.207l3.628 3.629a.75.75 0 101.06-1.06l-3.629-3.628A7.5 7.5 0 0010.5 3zm0 1.5a6 6 0 100 12 6 6 0 000-12z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Sign Up button */}
            <Link
              href="/signup"
              className="ml-1 rounded-full border-2 border-black bg-yellow-400 px-4 py-2 text-sm font-semibold text-black shadow-[0_3px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-y-0"
              style={{ fontFamily: '"Press Start 2P", system-ui, sans-serif' }}
            >
              SIGN UP
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
