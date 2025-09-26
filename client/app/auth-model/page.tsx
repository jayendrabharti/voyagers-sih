"use client";

import { useState } from "react";
import Link from "next/link";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signup");

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url('/signimage.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      {/* Overlay for dim effect */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Form Box */}
      <div className="relative w-full max-w-md h-100 p-6 rounded-xl shadow-lg bg-white/30 backdrop-blur-md">
        {/* Optional Back Link */}
        <Link
          href="/"
          className="absolute -top-4 -left-2 p-5 text-green-500 font-bold hover:underline"
        >
          ← Back
        </Link>

        {/* Tabs */}
        <div className="flex justify-around mb-6 mt-5">
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold ${
              activeTab === "signin"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("signin")}
          >
            Sign In
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold ${
              activeTab === "signup"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        {activeTab === "signin" ? (
          <form className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              className="bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-500 transition"
            >
              Sign In
            </button>
          </form>
        ) : (
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              className="bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-500 transition"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
