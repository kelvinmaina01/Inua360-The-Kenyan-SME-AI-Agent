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
import { FloatingChatBubble } from "@/components/chatbot/FloatingChatBubble"; // <-- NEW
import { useState } from 'react';

const queryClient = new QueryClient();

const App = () => {
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
              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Floating AI Chat Bubble */}
            <FloatingChatBubble />

          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
