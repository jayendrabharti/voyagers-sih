"use client";

import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";

type NavItem = { href: string; label: string; isActive?: boolean };

const navItems: NavItem[] = [
  { href: "/home", label: "Home", isActive: true },
  { href: "#missions", label: "Missions" },
  { href: "#modules", label: "Modules" },
  { href: "#trending", label: "Trending" },
];

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.isLoggedIn) {
        setUser(parsed);
      }
    }
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
  };

  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[90%] z-50">
      <div className="backdrop-blur-md bg-black/70 rounded-3xl shadow-lg supports-[backdrop-filter]:backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          {/* Left: Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-green-300/60">
              <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                <circle cx="32" cy="32" r="30" fill="#14532d" />
                <path
                  d="M18 36c10-2 18-10 24-20 2 10-2 22-8 28-6 6-14 8-24 6 4-6 4-10 8-14z"
                  fill="#22c55e"
                />
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

          {/* Right: Nav + Auth/Profile */}
          <div className="flex items-center gap-2 md:gap-4 relative" ref={dropdownRef}>
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

            {!user ? (
              <Link
                href="/auth-model"
                className="ml-1 rounded-full border-2 border-black bg-yellow-400 px-4 py-2 text-sm font-semibold text-black shadow-[0_3px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-y-0"
                style={{ fontFamily: '"Press Start 2P", system-ui, sans-serif' }}
              >
                SIGN UP
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="h-10 w-10 overflow-hidden rounded-full border-2 border-yellow-400"
                >
                  <img
                    src="https://via.placeholder.com/150"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border p-3 z-50">
                    <p className="text-sm font-semibold text-gray-800">
                      {user.fullName || "User"}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">{user.email}</p>
                    <button
                      onClick={handleLogout}
                      className="w-full rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
