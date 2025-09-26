"use client";

import Hero from "@/components/Hero";
import Explore from "@/components/explore";
import HowItWork from "@/components/HowItWork";
import SchoolAndFamily from "@/components/SchoolFamily";
import Join from "@/components/Join";
import FAQ from "@/components/FAQ";
import Platform from "@/components/Platform";
import Navbar from "@/components/Navbar";
import Trending from "@/components/trending";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Platform />
      <Explore />
      <HowItWork />
      <SchoolAndFamily />
      <Join />
      <FAQ />
      <Footer />
    </>
  );
}
