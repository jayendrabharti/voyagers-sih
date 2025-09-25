import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Explore from "@/components/explore";
import HowItWork from "@/components/HowItWork";
import SchoolAndFamily from "@/components/SchoolFamily";
import Join from "@/components/Join";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Platform from "@/components/Platform";


export default function Home() {
  return (
    <main>
      
      <div className="fixed top-0 left-0 w-full backdrop-blur-md bg-white/30 rounded-b-2xl z-50">
        <Navbar />
      </div>

      
      <div>
        <Hero />
      </div>
      <Platform />
      <Explore />
      <HowItWork />
      <SchoolAndFamily />
      <Join />
      <FAQ />
      <Footer />

      

    </main>
  );
}
