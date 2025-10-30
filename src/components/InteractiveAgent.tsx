// src/components/InteractiveAgent.tsx
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  BrainCircuit,
  Home,
  Mic,
  MicOff,
  Volume2,
  User,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * InteractiveAgent
 *
 * - Uses custom markdown renderers so we don't require tailwind typography plugin.
 * - Expects a backend endpoint POST ${API_BASE}/api/agent/chat/ returning:
 *   { text: string, audio?: string (base64 mp3), meta?: { confidence?: number } }
 *
 * - Theme color used: #FB630B
 */

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
  meta?: Record<string, any>;
}

const API_BASE = (import.meta.env.VITE_API_BASE as string) || "http://localhost:8080/compliance-agent";
const BRAND = "#FB630B";

const nowIso = () => new Date().toISOString();

const InteractiveAgent: React.FC = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const speechRecRef = useRef<any>(null);

  const quickPrompts = [
    "How do I register my business?",
    "What licenses do I need?",
    "Show compliance steps",
    "Generate a growth report",
  ];

  // Load profile and initial welcome message
  useEffect(() => {
    const stored = localStorage.getItem("sme_profile_data");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setProfileData(data);
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content: `Hello ${data.business_name ?? "there"}! 👋 I'm Inua360 — your AI Business Advisor. I can help with funding, compliance, and growth tailored to your ${data.sector ?? "business"}. What would you like to explore?`,
            timestamp: nowIso(),
            meta: {},
          },
        ]);
        return;
      } catch {
        // fallthrough
      }
    }
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! 👋 I'm Inua360 — your AI Business Advisor. Ask me anything about funding, compliance, or growth.",
        timestamp: nowIso(),
        meta: {},
      },
    ]);
  }, []);

  // Auto-scroll behavior
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // scroll a bit after DOM updates (give time for render)
    setTimeout(() => {
      el.scrollTop = el.scrollHeight + 200;
    }, 80);
  }, [messages]);

  // Cleanup audio and speech on unmount
  useEffect(() => {
    return () => {
      try {
        speechRecRef.current?.stop?.();
      } catch {}
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // Post chat to backend
  const postChat = async (message: string) => {
    const payload = { message, profile: profileData ?? undefined };
    const res = await fetch(`${API_BASE}/api/agent/chat/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || "AI request failed");
    }
    return (await res.json()) as { text: string; audio?: string; meta?: any };
  };

  // Send handler (text or quick prompt)
  const handleSend = async (fromQuickPrompt?: string) => {
    const messageText = (fromQuickPrompt ?? input).trim();
    if (!messageText) return;

    const user: Message = { id: String(Date.now()), role: "user", content: messageText, timestamp: nowIso() };
    setMessages((prev) => [...prev, user]);
    setInput("");
    setIsLoading(true);

    // Add a placeholder assistant message (shows typing)
    const placeholderId = `tmp-${Date.now()}`;
    setMessages((prev) => [...prev, { id: placeholderId, role: "assistant", content: "…", timestamp: nowIso() }]);

    try {
      const reply = await postChat(messageText);

      // replace placeholder with real reply
      setMessages((prev) =>
        prev.map((m) => (m.id === placeholderId ? { ...m, content: reply.text, timestamp: nowIso(), meta: reply.meta } : m))
      );

      // If audio base64 provided, play it
      if (reply.audio) {
        if (!audioRef.current) audioRef.current = new Audio();
        audioRef.current.src = `data:audio/mpeg;base64,${reply.audio}`;
        audioRef.current.onplay = () => setIsSpeaking(true);
        audioRef.current.onended = () => setIsSpeaking(false);
        audioRef.current.onerror = () => setIsSpeaking(false);
        // play (await to catch play errors)
        await audioRef.current.play().catch((err) => {
          console.warn("Audio play error", err);
        });
      }
    } catch (err: any) {
      console.error("Chat error", err);
      // show friendly error message inside chat
      setMessages((prev) =>
        prev.map((m) =>
          m.id === placeholderId
            ? { ...m, content: "⚠️ Sorry — I couldn't get a response right now. Please try again.", timestamp: nowIso() }
            : m
        )
      );
      toast.error("AI agent error");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle speech recognition (client-side)
  const toggleListening = () => {
    if (isListening) {
      try {
        speechRecRef.current?.stop?.();
      } catch {}
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      // auto send the transcript
      handleSend(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = (err: any) => {
      console.error("Speech rec error", err);
      toast.error("Speech recognition error");
      setIsListening(false);
    };

    recognition.start();
    speechRecRef.current = recognition;
    setIsListening(true);
  };

  const formatTime = (iso?: string) => {
    if (!iso) return "";
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Custom markdown components for consistent styling (no `prose`)
  const markdownComponents = {
    strong: ({ children }: any) => <span className="font-semibold text-[${BRAND}] text-[#FB630B]">{children}</span>,
    em: ({ children }: any) => <em className="italic text-slate-800">{children}</em>,
    a: ({ href, children }: any) => (
      <a className="text-[#FB630B] underline" href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    ),
    ul: ({ children }: any) => <ul className="list-disc ml-5 space-y-1 text-sm">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal ml-5 space-y-1 text-sm">{children}</ol>,
    li: ({ children }: any) => <li className="text-sm">{children}</li>,
    code: ({ children }: any) => <code className="bg-slate-100 px-1 py-[2px] rounded text-xs text-[#FB630B]">{children}</code>,
    pre: ({ children }: any) => <pre className="bg-slate-100 p-3 rounded overflow-auto text-xs">{children}</pre>,
    p: ({ children }: any) => <p className="text-sm leading-relaxed text-slate-900">{children}</p>,
    h1: ({ children }: any) => <h1 className="text-2xl font-semibold">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-xl font-semibold">{children}</h2>,
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto w-full px-4 py-6 flex-1 flex flex-col">
        {/* Header */}
        <Card className="bg-gradient-to-r from-[#FB630B] to-[#fc9355] text-white rounded-2xl shadow-md overflow-hidden mb-4">
          <CardHeader className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <BrainCircuit className="h-8 w-8 text-white" />
              <div>
                <CardTitle className="text-xl font-semibold text-white">Inua360 AI Business Advisor</CardTitle>
                <CardDescription className="text-white/90">Intelligent assistance for funding, compliance, and growth.</CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {profileData && <Badge className="bg-white/20 text-white">{profileData.business_name}</Badge>}
              <Button
                variant="outline"
                className="gap-2 text-[#FB630B] border-white bg-white hover:bg-[#fff4ef]"
                onClick={() => navigate("/")}
              >
                <Home className="h-4 w-4" /> Home
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Chat + messages */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full" ref={(el: any) => (scrollRef.current = el?.contentEl || el)}>
              <div className="p-6">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className={`mb-4 flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar className={msg.role === "user" ? "bg-[#FB630B]" : "bg-slate-200"}>
                        <AvatarFallback>{msg.role === "user" ? "U" : <Bot className="h-4 w-4" />}</AvatarFallback>
                      </Avatar>

                      <div className={`max-w-[80%] ${msg.role === "user" ? "text-right" : "text-left"}`}>
                        <div className={`inline-block rounded-2xl p-4 shadow-sm ${msg.role === "user" ? "bg-[#FB630B] text-white" : "bg-slate-50 text-slate-900"}`}>
                          {msg.role === "assistant" ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                              {msg.content}
                            </ReactMarkdown>
                          ) : (
                            <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                          )}
                        </div>

                        <div className="text-xs opacity-60 mt-1">
                          <span>{formatTime(msg.timestamp)}</span>
                          {msg.role === "assistant" && msg.meta?.confidence !== undefined && (
                            <span className="ml-3">• confidence: {(msg.meta.confidence * 100).toFixed(0)}%</span>
                          )}
                          {msg.role === "assistant" && isSpeaking && (
                            <span className="ml-3">• Speaking <Volume2 className="inline-block ml-1 h-3 w-3" /></span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="bg-slate-200">
                      <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                    <div className="bg-slate-50 p-3 rounded-2xl">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 bg-[#FB630B] rounded-full animate-bounce" />
                        <span className="h-2 w-2 bg-[#FB630B] rounded-full animate-bounce delay-150" />
                        <span className="h-2 w-2 bg-[#FB630B] rounded-full animate-bounce delay-300" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Input area */}
          <div className="border-t p-4 bg-white/70 backdrop-blur-sm">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((q, i) => (
                  <Button key={i} variant="ghost" size="sm" className="text-[#FB630B] hover:bg-[#fff3ec]" onClick={() => handleSend(q)}>
                    {q}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Inua360 about your business..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="flex-1"
                />

                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={toggleListening}
                    className={`p-3 rounded-full shadow-md transition-colors ${isListening ? "bg-red-500 text-white" : "bg-[#FB630B] text-white hover:bg-[#fc9355]"}`}
                    whileTap={{ scale: 0.95 }}
                    title={isListening ? "Stop listening" : "Speak"}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </motion.button>

                  <Button onClick={() => handleSend()} className="bg-[#FB630B] hover:bg-[#fc9355] text-white">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-slate-500">✨ Inua360 – empowering SMEs with AI insights.</div>
      </div>
    </div>
  );
};

export default InteractiveAgent;
