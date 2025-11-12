import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyFinora from "@/components/WhyFinora";
import HowItWorks from "@/components/HowItWorks";
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
      <WhyFinora />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Disclaimer />
      <Footer />
    </div>
  );
};

export default Index;
