import { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SMEProfileBuilder from "@/components/SMEProfileBuilder";
import ComplianceChecker from "@/components/ComplianceChecker";
import FinanceCompanion from "@/components/FinanceCompanion";
import InteractiveAgent from "@/components/InteractiveAgent";

const Index = () => {
  const [activeAgent, setActiveAgent] = useState("profile");

  const renderAgent = () => {
    switch (activeAgent) {
      case "profile":
        return <SMEProfileBuilder />;
      case "compliance":
        return <ComplianceChecker />;
      case "finance":
        return <FinanceCompanion />;
      case "agent":
        return <InteractiveAgent />;
      default:
        return <SMEProfileBuilder />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navigation activeAgent={activeAgent} onAgentChange={setActiveAgent} />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {renderAgent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
