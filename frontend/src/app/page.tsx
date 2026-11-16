import { Navbar } from "@/components/marketing/Navbar";
import { HeroSection } from "@/components/marketing/HeroSection";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { WhatItDoesSection } from "@/components/marketing/WhatItDoesSection";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { CapabilitiesSection } from "@/components/marketing/CapabilitiesSection";
import { WhyStarkSection } from "@/components/marketing/WhyStarkSection";
import { ClosingSection } from "@/components/marketing/ClosingSection";
import { Footer } from "@/components/marketing/Footer";

export default function MarketingHomePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-950 font-serif selection:bg-zinc-950 selection:text-white">
      {/* Sticky Intelligently Transitioning Navigation */}
      <Navbar />

      <main>
        {/* SECTION 01 — HERO */}
        <HeroSection />

        {/* SECTION 02 — THE PROBLEM */}
        <ProblemSection />

        {/* SECTION 03 — WHAT STARK DOES */}
        <WhatItDoesSection />

        {/* SECTION 04 — HOW STARK WORKS */}
        <HowItWorksSection />

        {/* SECTION 05 — PLATFORM CAPABILITIES */}
        <CapabilitiesSection />

        {/* SECTION 06 — WHY STARK */}
        <WhyStarkSection />

        {/* SECTION 07 — THE CLOSING STATEMENT */}
        <ClosingSection />
      </main>

      {/* SECTION 08 — FOOTER */}
      <Footer />
    </div>
  );
}
