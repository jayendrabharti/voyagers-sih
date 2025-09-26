"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "./home/page"; // import the home page sections

export default function Home() {
  return (
    <>
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full backdrop-blur-md bg-white/30 rounded-b-2xl z-50">
        <Navbar />
      </div>

      {/* Main Home Content */}
      <HomePage />

      {/* Footer */}
      <Footer />
    </>
  );
}
