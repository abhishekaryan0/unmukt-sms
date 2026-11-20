"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ConnectedChannels } from "@/components/landing/ConnectedChannels";
import { CoreFeatures } from "@/components/landing/CoreFeatures";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ProductPreview } from "@/components/landing/ProductPreview";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { SolutionsSection } from "@/components/landing/SolutionsSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white flex flex-col">
      {/* 1. Sticky Navigation Bar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 2. Hero Section with High-Fidelity Unified Inbox Preview */}
        <HeroSection />

        {/* 3. Connected Channels (WhatsApp, Instagram, Messenger, Telegram) */}
        <ConnectedChannels />

        {/* 4. Core Features with Subtle Visual Demonstrations */}
        <CoreFeatures />

        {/* 5. How It Works (Simple 3-Step Process) */}
        <HowItWorks />

        {/* 6. Product Preview Section (Interactive Tabs: Inbox & Details, Campaigns, Analytics) */}
        <ProductPreview />

        {/* 7. Business Benefits Section */}
        <BenefitsSection />

        {/* Solutions Section (Nav anchor #solutions) */}
        <SolutionsSection />

        {/* About Section (Nav anchor #about) */}
        <AboutSection />

        {/* 8. Final Conversion CTA ("Bring Every Conversation Together.") */}
        <FinalCta />
      </main>

      {/* 9. Professional Footer */}
      <Footer />
    </div>
  );
}
