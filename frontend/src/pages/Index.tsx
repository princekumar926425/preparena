import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SubjectCards from "@/components/SubjectCards";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <SubjectCards />
      </main>
    </div>
  );
};

export default Index;