import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, Home } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const InteractiveAgent = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load profile data from localStorage
    const stored = localStorage.getItem('sme_profile_data');
    if (stored) {
      const data = JSON.parse(stored);
      setProfileData(data);
      
      // Create personalized welcome message
      const welcomeMessage: Message = {
        id: "welcome",
        role: "assistant",
        content: `Hello ${data.business_name ? data.business_name + ' team' : 'there'}! 👋 

I'm your Inua360 AI assistant, and I'm excited to help you grow your business! 🚀

I've reviewed your profile - a ${data.sector} business in ${data.country} with ${data.employees} employees. That's impressive!

I'm here to support you with:
• 💡 Business growth strategies
• 📋 Registration and compliance guidance  
• 💰 Funding and financing options
• 📊 Market insights and best practices
• 🎯 Personalized recommendations

What would you like to explore today? Ask me anything!`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    } else {
      // Default welcome message if no profile data
      const welcomeMessage: Message = {
        id: "welcome",
        role: "assistant",
        content: "Hello! 👋 I'm your Inua360 AI assistant. I'm here to help you grow your business with personalized guidance. What would you like to know?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // TODO: Replace with actual API call to Django backend + AI/ML models
  const getAIResponse = async (userMessage: string): Promise<string> => {
    // Simulated AI response - replace with actual backend integration
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("register") || lowerMessage.includes("registration")) {
      return "To register your business in Kenya, you'll need to:\n\n1. Reserve your business name through the BRS portal\n2. Apply for a KRA PIN\n3. Register with the Business Registration Service (BRS)\n4. Obtain a county business permit\n5. Register with NSSF and NHIF for employees\n\nWould you like more details on any of these steps?";
    }
    
    if (lowerMessage.includes("funding") || lowerMessage.includes("loan") || lowerMessage.includes("finance")) {
      return "Kenya offers several funding options for SMEs:\n\n• Youth Enterprise Development Fund (for entrepreneurs 18-35)\n• Women Enterprise Fund\n• Uwezo Fund\n• Bank loans (KCB, Equity, Co-op)\n• M-PESA business loans\n• Angel investors and VCs\n\nWhat's your business size and sector? I can give you more specific recommendations.";
    }
    
    if (lowerMessage.includes("compliance") || lowerMessage.includes("permit") || lowerMessage.includes("license")) {
      return "Compliance requirements vary by sector and location, but common ones include:\n\n• Business registration certificate\n• KRA PIN certificate\n• County single business permit\n• NEMA environmental compliance (if applicable)\n• Sector-specific licenses\n\nUse our Compliance Checker tool to get a personalized checklist for your business!";
    }
    
    if (lowerMessage.includes("growth") || lowerMessage.includes("scale") || lowerMessage.includes("expand")) {
      return "Here are proven strategies to grow your SME:\n\n1. Digitalize your operations (online payments, inventory systems)\n2. Build an online presence (website, social media)\n3. Network with other businesses\n4. Invest in employee training\n5. Explore new markets or product lines\n6. Access business development services\n\nWhat specific growth challenge are you facing?";
    }

    return "That's a great question! While I'm still learning, I can help you with:\n\n• Business registration processes\n• Funding and financing options\n• Compliance and licensing requirements\n• Growth and scaling strategies\n\nCould you rephrase your question or pick one of these topics?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // TODO: Call actual Django backend + AI/ML model
    const aiResponse = await getAIResponse(input);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    "How do I register my business?",
    "What funding options are available?",
    "Tell me about compliance requirements",
    "How can I grow my business?"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
        <Home className="h-4 w-4" />
        Back to Home
      </Button>

      <Card className="shadow-card">
        <CardHeader className="gradient-hero text-primary-foreground rounded-t-xl">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 animate-pulse" />
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Bot className="h-6 w-6" />
                Your AI Business Advisor
              </CardTitle>
              <CardDescription className="text-primary-foreground/90 mt-2">
                Congratulations on completing your business profile! 🎉 Now, let's chat about your growth journey. 
                Ask me anything about expanding your business, funding opportunities, or strategic advice!
              </CardDescription>
            </div>
          </div>
          {profileData && (
            <Badge variant="secondary" className="bg-white/20 text-white w-fit mt-2">
              {profileData.business_name} • {profileData.sector} in {profileData.country}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px] p-6" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className={message.role === "user" ? "bg-primary" : "bg-secondary"}>
                    <AvatarFallback className="text-primary-foreground">
                      {message.role === "user" ? "U" : <Bot className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex-1 p-4 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground ml-12"
                        : "bg-muted text-foreground mr-12"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <span className="text-xs opacity-70 mt-2 block">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <Avatar className="bg-secondary">
                    <AvatarFallback className="text-primary-foreground">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 p-4 rounded-lg bg-muted text-foreground mr-12">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 animate-pulse text-primary" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(action)}
                  className="text-xs"
                >
                  {action}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your business..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              💡 This agent uses AI to provide guidance. For official information, consult with BRF or legal advisors.
              {/* TODO: Connect to Django backend + Jupyter ML models for intelligent responses */}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>✨ Keep exploring! Your journey to business growth has just begun.</p>
        <p className="mt-2">💡 This agent uses AI to provide guidance. For official information, consult with BRS or legal advisors.</p>
      </div>
    </div>
  );
};

export default InteractiveAgent;
