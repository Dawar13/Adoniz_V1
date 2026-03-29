import { Navbar } from "@/components/navbar/Navbar";
import { HeroSection } from "@/components/hero/HeroSection";
import { DeviceShowcase } from "@/components/device-showcase/DeviceShowcase";
import { FeaturesSection } from "@/components/features/FeaturesSection";
import { ConnectionsSection } from "@/components/connections/ConnectionsSection";
import { FiltersSection } from "@/components/filters/FiltersSection";
import { CTASection } from "@/components/cta/CTASection";
import { Footer } from "@/components/footer/Footer";

/* ─── Transition helpers ──────────────────────────────────────────────────── */

/** White (#FFF) → Device green (#013540) — 12-stop dissolve */
function TransitionWhiteToGreen() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: "600px",
        background:
          "linear-gradient(to bottom, #FFFFFF 0%, #FAFCFB 8%, #F0F7F4 16%, #E0EDE8 24%, #C8DDD4 32%, #A0C8BA 42%, #6DAA96 52%, #3D8A76 62%, #1A6B5A 72%, #065448 82%, #024540 90%, #013540 100%)",
        marginTop: "-1px",
        marginBottom: "-1px",
      }}
    />
  );
}

/** Device green (#013540) → Snow (#F2F7F7) — compact 200px fade */
function TransitionGreenToWhite() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: "200px",
        background:
          "linear-gradient(to bottom, #013540 0%, #2a6b5e 30%, #6baa97 60%, #c5dfd8 80%, #F2F7F7 100%)",
        marginTop: "-1px",
        marginBottom: "-1px",
      }}
    />
  );
}

/** Snow (#F2F7F7) → Pine (#003D31) — 5-stop smooth fade */
function TransitionWhiteToDark() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: "300px",
        background:
          "linear-gradient(to bottom, #F2F7F7 0%, #d0e9e2 22%, #7ab8a8 48%, #2d6b58 72%, #003D31 100%)",
        marginTop: "-1px",
        marginBottom: "-1px",
      }}
    />
  );
}

/** Pine → Teal spill → black — short footer transition */
function TransitionDarkToFooter() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: "100px",
        background: "linear-gradient(to bottom, #003D31 0%, #032425 100%)",
        marginTop: "-1px",
        marginBottom: "-1px",
      }}
    />
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* 1. Hero — bg gradient fades to #013540 at its own bottom edge */}
        <HeroSection />

        {/* Device showcase starts at #013540, zero gap — seamless continuation */}
        <DeviceShowcase />

        {/* Transition: device green → snow */}
        <TransitionGreenToWhite />

        {/* 3. Features — snow bg */}
        <FeaturesSection />

        {/* 4. Connections — white bg */}
        <ConnectionsSection />

        {/* 5. Filters — snow bg */}
        <FiltersSection />

        {/* Transition: snow → pine (CTA dark) */}
        <TransitionWhiteToDark />

        {/* 6. CTA — pine/teal-spill bg */}
        <CTASection />

        {/* Transition: CTA → footer */}
        <TransitionDarkToFooter />
      </main>
      <Footer />
    </>
  );
}
