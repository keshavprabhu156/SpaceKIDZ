import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollFX from "@/components/fx/ScrollFX";
import Hero from "@/components/sections/Hero";
import LearningShowcase from "@/components/sections/LearningShowcase";
import GradeJourney from "@/components/sections/GradeJourney";
import AudienceSection from "@/components/sections/AudienceSection";
import ContactSection from "@/components/sections/ContactSection";
import {
  TrustBar,
  WhySection,
  GamesSection,
  AchievementsSection,
  NetworkSection,
  FAQSection,
  FinalCTA,
} from "@/components/sections/LandingSections";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-space-black">
      <ScrollFX />
      <Navbar />

      <Hero />
      <TrustBar />
      <WhySection />
      <LearningShowcase />
      <GradeJourney />
      <AudienceSection />
      <GamesSection />
      <AchievementsSection />
      <NetworkSection />
      <FAQSection />
      <ContactSection />
      <FinalCTA />

      <Footer />
    </main>
  );
}
