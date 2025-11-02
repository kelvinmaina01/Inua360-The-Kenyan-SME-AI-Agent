import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import ProfileBuilder from "./pages/ProfileBuilder";
import ComplianceAgent from "./pages/ComplianceAgent";
import FinancialAgent from "./pages/FinancialAgent";
import InteractiveAgentPage from "./pages/InteractiveAgentPage";
import NotFound from "./pages/NotFound";
import { useState } from 'react';
import { ChatbotContainer } from "@/components/chatbot/ChatbotContainer";
import { TbMessageChatbotFilled } from "react-icons/tb";

const queryClient = new QueryClient();

const App = () => {

  const [chatbotOpen, setChatbotOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen relative">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/profile-builder" element={<ProfileBuilder />} />
              <Route path="/compliance-agent" element={<ComplianceAgent />} />
              <Route path="/financial-agent" element={<FinancialAgent />} />
              <Route path="/interactive-agent" element={<InteractiveAgentPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            {!chatbotOpen && (
              <button onClick={() => setChatbotOpen(true)} className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-50 opacity-80 hover:opacity-100" aria-label="Open AI assistant">
                <TbMessageChatbotFilled size={48} className="text-blue-600 hover:scale-110 transition-transform" />
              </button>
            )}
            <ChatbotContainer isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
