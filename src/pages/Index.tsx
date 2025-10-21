import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import WhyFinora from "@/components/WhyFinora";
import HowItWorks from "@/components/HowItWorks";
import LeadMagnet from "@/components/LeadMagnet";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Disclaimer from "@/components/Disclaimer";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <SocialProof />
      <WhyFinora />
      <HowItWorks />
      <LeadMagnet />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Disclaimer />
      <Footer />
    </div>
  );
};

export default Index;
