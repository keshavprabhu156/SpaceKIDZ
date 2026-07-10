import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollFX from "@/components/fx/ScrollFX";
import StarBackground from "@/components/fx/StarBackground";
import Hero from "@/components/sections/Hero";
import ContactSection from "@/components/sections/ContactSection";
import {
  AboutSection,
  MissionSection,
  CurriculumSection,
  DemoSection,
  GamesSection,
  AchievementsSection,
  CountriesSection,
  FinalCTA,
} from "@/components/sections/LandingSections";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-space-black">
      <ScrollFX />
      <Navbar />
      <Hero />
      <div className="relative">
        <StarBackground />
        <div className="relative">
          <AboutSection />
          <MissionSection />
          <CurriculumSection />
          <DemoSection />
          <GamesSection />
          <AchievementsSection />
          <CountriesSection />
          <ContactSection />
          <FinalCTA />
        </div>
      </div>
      <Footer />
    </main>
  );
}
