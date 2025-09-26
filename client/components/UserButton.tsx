import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";

export default function UserButton({ className = "" }: { className?: string }) {
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
    <>
      {!user ? (
        <Link
          href="/auth-model"
          className={`ml-1 rounded-full border-2 border-black bg-yellow-400 px-4 py-2 text-sm font-semibold text-black shadow-[0_3px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-y-0 ${className}`}
          style={{
            fontFamily: '"Press Start 2P", system-ui, sans-serif',
          }}
        >
          SIGN UP
        </Link>
      ) : (
        <div className={`relative ${className}`}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="h-10 w-10 overflow-hidden rounded-full border-2 border-yellow-400"
          >
            <img
              src="/avatar.png"
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
    </>
  );
}
