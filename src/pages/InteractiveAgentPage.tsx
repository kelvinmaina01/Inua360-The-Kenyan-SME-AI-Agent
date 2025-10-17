import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InteractiveAgent from "@/components/InteractiveAgent";

const InteractiveAgentPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-16 pt-8">
        <div className="max-w-7xl mx-auto">
          <InteractiveAgent />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InteractiveAgentPage;
