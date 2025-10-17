import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Shield, Wallet, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Welcome = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Building2,
      title: "Business Profile Collector",
      description: "Build your business profile with AI-powered insights",
    },
    {
      icon: Shield,
      title: "Compliance Data Uploader",
      description: "Submit and verify your legal documents for readiness",
    },
    {
      icon: Wallet,
      title: "Financial Records Collector",
      description: "Upload receipts and invoices to analyze your financial health",
    },
    {
      icon: MessageSquare,
      title: "AI Growth Agent",
      description: "24/7 AI agent for business growth, strategy, and support",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 space-y-6 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Welcome to Inua360
            </h1>
            <p className="text-2xl sm:text-3xl font-semibold text-muted-foreground max-w-2xl mx-auto">
              Your AI Companion for SME Growth
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Let's help you build your business profile and access smart growth tools.
              We'll guide you step-by-step through building your profile, checking compliance,
              analyzing your finances, and connecting you with an AI agent—all in one place.
            </p>

            <Button
              size="lg"
              onClick={() => navigate("/profile-builder")}
              className="mt-8 text-lg px-10 py-4 h-auto rounded-xl bg-primary text-white font-medium shadow-md hover:shadow-lg hover:bg-primary/90 transition-all"
            >
              Start Your Journey
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6 mt-12">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 rounded-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Welcome;