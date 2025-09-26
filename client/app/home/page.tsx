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

export default function HomePage() {
  return (
    <main className="pt-0"> {/* pt-24 to offset fixed navbar if needed */}
      <Hero />
      <Platform />
       <section id="modules" className="min-h-screen">
      <Explore />
      </section>

      <section id="missions" className="min-h-screen">
      <HowItWork />
      </section>


      <SchoolAndFamily />
      <section id="trending" className="min-h-screen">
      <Trending />
    
      </section>
      <Join />
      <FAQ />
    </main>
  );
}
