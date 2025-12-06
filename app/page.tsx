import Header from "./components/Header";
import Hero from "./components/Hero";
import TradingPlans from "./components/TradingPlans";
import AboutSection from "./components/AboutSection";
import WhatWeOffer from "./components/WhatWeOffer";
import ComponentsOfSuccess from "./components/ComponentsOfSuccess";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import AffiliateSection from "./components/AffiliateSection";
import Partners from "./components/Partners";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <AboutSection />
      <TradingPlans />
      <WhatWeOffer />
      <ComponentsOfSuccess />
      <Services />
      <Testimonials />
      <AffiliateSection />
      <Partners />
      <Footer />
    </>
  );
}
