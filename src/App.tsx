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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/profile-builder" element={<ProfileBuilder />} />
          <Route path="/compliance-agent" element={<ComplianceAgent />} />
          <Route path="/financial-agent" element={<FinancialAgent />} />
          <Route path="/interactive-agent" element={<InteractiveAgentPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
