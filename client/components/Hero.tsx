"use client";

import Link from "next/link";
import React from "react";
import { JSX } from "react";

export default function Hero(): JSX.Element {
  return (
    <section
      className="relative flex h-screen w-full flex-col items-center justify-center bg-cover bg-center px-4 py-10 text-center md:px-6"
      style={{
        fontFamily: '"Press Start 2P", system-ui, sans-serif',
        backgroundImage: "url('/herobackground.jpg')",
      }}
    >
      {/* Hero content */}
      <div className="relative z-10">
        {/* Heading box */}
        <div
          className="mb-10 inline-flex max-w-[950px] items-center justify-center rounded-4xl border border-black bg-yellow-300 px-2 py-2 shadow-[0_6px_0_#000] md:px-4 md:py-6"
          style={{ fontFamily: '"Press Start 2P", system-ui, sans-serif' }}
        >
          <h1 className="text-base leading-snug text-black md:text-xl lg:text-3xl">
            Learn. Play. Save the Planet.
          </h1>
        </div>

        {/* Subheading */}
        <p className="mx-auto mb-10 max-w-2xl text-xs leading-relaxed text-white/95 md:text-sm lg:mb-20">
          An AI-powered gamified platform that turns environmental education
          into fun challenges
        </p>

        {/* Dashboard button */}
        <Link
          href="/student-dashboard"
          className="inline-flex items-center gap-4 rounded-full border-4 border-black bg-yellow-300 px-8 py-4 text-black shadow-[0_6px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-y-0"
          style={{ fontFamily: '"Press Start 2P", system-ui, sans-serif' }}
        >
          <span className="text-sm md:text-base">Go to Dashboard</span>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 text-yellow-300"
            >
              <path d="M4 12a1 1 0 001 1h10.586l-3.293 3.293a1 1 0 101.414 1.414l5.003-5.003a1 1 0 000-1.414l-5.003-5.003a1 1 0 10-1.414 1.414L15.586 11H5a1 1 0 00-1 1z" />
            </svg>
          </span>
        </Link>
      </div>

      {/* Floating chat button */}
      <button
        aria-label="Chat"
        className="fixed bottom-6 right-6 z-20 inline-flex h-14 w-14 items-center justify-center rounded-full border-4 border-black bg-yellow-300 shadow-[0_6px_0_#000]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 text-black"
        >
          <path d="M2 5a3 3 0 013-3h14a3 3 0 013 3v9a3 3 0 01-3 3H9.828L5 21.828V17H5a3 3 0 01-3-3V5z" />
        </svg>
      </button>
    </section>
  );
}
