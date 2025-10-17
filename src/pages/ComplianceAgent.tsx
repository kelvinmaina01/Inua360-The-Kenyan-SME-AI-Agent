import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComplianceChecker from "@/components/ComplianceChecker";

const ComplianceAgent = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-16 pt-8">
        <div className="max-w-7xl mx-auto">
          <ComplianceChecker onComplete={() => navigate('/financial-agent')} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ComplianceAgent;
