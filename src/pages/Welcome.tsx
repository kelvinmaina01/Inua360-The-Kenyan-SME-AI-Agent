import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Rocket, Building2, Shield, Wallet, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const Welcome = () => {
  const navigate = useNavigate();
  const features = [{
    icon: Building2,
    title: "Profile Builder",
    description: "Build your comprehensive business profile with AI insights"
  }, {
    icon: Shield,
    title: "Compliance Check",
    description: "Ensure your business meets all legal requirements"
  }, {
    icon: Wallet,
    title: "Financial Assistant",
    description: "Get personalized financial health analysis and funding options"
  }, {
    icon: MessageSquare,
    title: "AI Chat Assistant",
    description: "24/7 AI advisor for your business growth questions"
  }];
  return <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 text-primary mb-4">
              <Rocket className="w-12 h-12 animate-pulse" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Welcome to Inua360
            </h1>
            <p className="text-2xl sm:text-3xl font-semibold text-foreground max-w-2xl mx-auto">
              Your AI Companion for SME Growth 🚀
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Let's help you build your business profile and access smart growth tools. 
              We'll guide you step-by-step through building your profile, checking compliance, 
              analyzing your finances, and connecting you with an AI advisor—all in one place!
            </p>
            
            <Button size="lg" onClick={() => navigate('/profile-builder')} className="mt-8 text-lg px-10 py-7 h-auto shadow-lg hover:shadow-xl transition-all">
              🚀 Start Your Journey Now
            </Button>
            
            
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6 mt-12">
            {features.map((feature, index) => <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>)}
          </div>
        </div>
      </main>

      <Footer />
    </div>;
};
export default Welcome;