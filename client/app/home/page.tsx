"use client";

import Hero from "@/components/Hero";
import Explore from "@/components/explore";
import HowItWork from "@/components/HowItWork";
import SchoolAndFamily from "@/components/SchoolFamily";
import Join from "@/components/Join";
import FAQ from "@/components/FAQ";
import Platform from "@/components/Platform";

export default function HomePage() {
  return (
    <main className="pt-0"> {/* pt-24 to offset fixed navbar if needed */}
      <Hero />
      <Platform />
      <Explore />
      <HowItWork />
      <SchoolAndFamily />
      <Join />
      <FAQ />
    </main>
  );
}
