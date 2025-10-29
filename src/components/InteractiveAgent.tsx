import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  BrainCircuit,
  Home,
  Mic,
  MicOff,
} from "lucide-react"; // ✅ Replaced Sparkles with BrainCircuit (modern AI icon)
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
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
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ✅ Load profile and show welcome message
  useEffect(() => {
    const stored = localStorage.getItem("sme_profile_data");
    if (stored) {
      const data = JSON.parse(stored);
      setProfileData(data);
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hello ${data.business_name ? data.business_name + " team" : "there"}! 👋 
I'm your Inua360 AI Business Advisor — ready to help your ${data.sector} business in ${data.country} grow and thrive 🚀.
What would you like to explore today?`,
          timestamp: new Date(),
        },
      ]);
    } else {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content:
            "Hello! 👋 I'm your Inua360 AI Business Advisor. Ask me anything about growing your business — from funding to compliance to expansion!",
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Auto-scroll to newest message
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // ✅ Real AI backend call
  const getAIResponse = async (
    msg: string
  ): Promise<{ text: string; audio?: string }> => {
    try {
      const res = await fetch("http://localhost:8000/api/agent/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, profile: profileData }),
      });

      if (!res.ok) throw new Error("AI response failed");
      return await res.json();
    } catch (err) {
      console.error("AI Error:", err);
      return {
        text: "⚠️ Sorry, something went wrong while getting advice from Inua360.",
      };
    }
  };

  // ✅ Send message and show AI reply
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsLoading(true);

    const reply = await getAIResponse(input);

    setMessages((m) => [
      ...m,
      {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply.text,
        timestamp: new Date(),
      },
    ]);

    if (reply.audio) {
      const audio = new Audio(`data:audio/mpeg;base64,${reply.audio}`);
      audio.play();
    }

    setIsLoading(false);
  };

  // ✅ Voice input toggle
  const handleVoiceToggle = () => setIsListening((prev) => !prev);

  // ✅ Speech recognition
  useEffect(() => {
    if (!isListening) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      handleSend();
    };

    recognition.onerror = (err: any) => {
      console.error("Speech recognition error:", err);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();

    return () => recognition.stop();
  }, [isListening]);

  const quickActions = [
    "How do I register my business?",
    "What funding options exist?",
    "Tell me about compliance",
    "How can I scale my SME?",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      <Button onClick={() => navigate("/")} variant="outline" className="gap-2">
        <Home className="h-4 w-4" /> Back to Home
      </Button>

      <Card className="shadow-card overflow-hidden backdrop-blur-sm border border-border/50 bg-background/80">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/90 to-primary/70 text-primary-foreground p-6"
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              {/* ✅ Updated icon for a professional AI look */}
              <BrainCircuit className="h-8 w-8 text-white drop-shadow-md" />
              <div>
                {/* ✅ Updated title & subtitle */}
                <CardTitle className="text-2xl flex items-center gap-2 font-semibold">
                  Inua360 AI Business Advisor
                </CardTitle>
                <CardDescription className="text-primary-foreground/90 mt-1">
                  Your intelligent partner for funding, compliance, and business growth.
                </CardDescription>
              </div>
            </div>
            {profileData && (
              <Badge variant="secondary" className="bg-white/20 text-white mt-3">
                {profileData.business_name} • {profileData.sector}
              </Badge>
            )}
          </CardHeader>
        </motion.div>

        {/* Chat area */}
        <CardContent className="p-0 relative">
          <ScrollArea className="h-[500px] p-6" ref={scrollRef}>
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 mb-4 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar
                    className={
                      msg.role === "user" ? "bg-primary" : "bg-secondary"
                    }
                  >
                    <AvatarFallback>
                      {msg.role === "user" ? "U" : <Bot className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[75%] p-4 rounded-2xl shadow-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground ml-2"
                        : "bg-muted/60 text-foreground mr-2"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <span className="text-xs opacity-70 block mt-1">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="bg-secondary">
                  <AvatarFallback>
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted/60 p-4 rounded-2xl mr-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Input area */}
          <div className="border-t p-4 space-y-3 bg-background/70 backdrop-blur-md">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(q)}
                >
                  {q}
                </Button>
              ))}
            </div>

            <div className="flex gap-2 items-center">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your business..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* ✅ Floating Voice Icon */}
          <motion.button
            onClick={handleVoiceToggle}
            className={`absolute bottom-24 right-6 p-4 rounded-full shadow-lg ${
              isListening ? "bg-red-500" : "bg-primary"
            } text-white hover:scale-105 transition-transform`}
            whileTap={{ scale: 0.9 }}
          >
            {isListening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </motion.button>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        ✨ Keep exploring — your business journey starts here.
      </div>
    </div>
  );
};

export default InteractiveAgent;
 <button>
  back to home 
 </button>