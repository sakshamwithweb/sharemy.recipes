import Demo from "@/components/Demo";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Demo />
      <HowItWorks />
      <Footer />
    </div>
  );
}
