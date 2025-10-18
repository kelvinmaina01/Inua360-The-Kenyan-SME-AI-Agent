import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/10 to-muted/30">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="grid md:grid-cols-2 gap-10 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 text-center md:text-left"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                Empowering SMEs with <span className="text-primary">AI-driven Growth</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto md:mx-0">
                Welcome to <strong>Inua360</strong> — your all-in-one platform for business
                growth. Build your profile, verify compliance, manage finances, and get
                round-the-clock support from your personal AI Growth Agent.
              </p>

              <Button
                size="lg"
                onClick={() => navigate("/profile-builder")}
                className="text-lg px-10 py-4 h-auto rounded-xl bg-primary text-white font-medium shadow-md hover:shadow-lg hover:bg-primary/90 transition-all"
              >
                Start Your Journey
              </Button>
            </motion.div>

            {/* Hero Illustration Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="hidden md:block text-center"
            >
              <img
                src="/images/ai-growth-illustration.svg"
                alt="AI business growth"
                className="w-full max-w-md mx-auto"
              />
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Card className="p-6 border-2 hover:border-primary/50 rounded-2xl hover:shadow-xl transition-all duration-300 bg-background/80 backdrop-blur-sm">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 rounded-xl bg-primary/10">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mt-24 text-center bg-primary/5 py-12 rounded-2xl shadow-inner"
          >
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              Ready to Transform Your Business?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of SMEs already growing with Inua360.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/profile-builder")}
              className="text-lg px-10 py-4 h-auto rounded-xl bg-primary text-white font-medium shadow-md hover:shadow-lg hover:bg-primary/90 transition-all"
            >
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Welcome;
