import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FinanceCompanion from "@/components/FinanceCompanion";

const FinancialAgent = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-16 pt-8">
        <div className="max-w-7xl mx-auto">
          <FinanceCompanion onComplete={() => navigate('/interactive-agent')} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FinancialAgent;
