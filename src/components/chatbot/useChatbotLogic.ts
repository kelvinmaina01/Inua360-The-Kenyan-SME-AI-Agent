import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}


interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const CHATBOT_HISTORY_KEY = 'cultura_chatbot_history';
const CHATBOT_STATE_KEY = 'cultura_chatbot_state';

export const useChatbotLogic = () => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_GENAI_API_KEY });

  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hello! I’m your AI assistant. How can I help you today?' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [randomQuestions, setRandomQuestions] = useState<{ question: string }[]>([]);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const quickQstns = [
    { question: 'How do I register my business in Kenya?' },
    { question: 'What tax compliance do I need as an SME?' },
    { question: 'How can I improve my cash flow?' },
    { question: 'What documents do I need for a business permit?' },
    { question: 'Explain PAYE vs VAT for small businesses.' },
    { question: 'How do I apply for a HELB waiver?' },
    { question: 'What are common financial mistakes by startups?' },
  ];

   // Initialize speech recognition once
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
        // Optionally auto-send after a short delay
        // setTimeout(() => handleSendMessage(), 300);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // Load from sessionStorage on mount
  useEffect(() => {
    const savedMessages = sessionStorage.getItem(CHATBOT_HISTORY_KEY);
    const savedChatbotOpen = sessionStorage.getItem(CHATBOT_STATE_KEY);
    if (savedMessages) setMessages(JSON.parse(savedMessages));
    if (savedChatbotOpen === 'true') setChatbotOpen(true);
  }, []);

  // Save messages & state
  useEffect(() => {
    sessionStorage.setItem(CHATBOT_HISTORY_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    sessionStorage.setItem(CHATBOT_STATE_KEY, chatbotOpen.toString());
  }, [chatbotOpen]);

  // Generate random suggestions
  useEffect(() => {
    if (chatbotOpen && randomQuestions.length === 0) {
      const shuffled = [...quickQstns].sort(() => 0.5 - Math.random());
      setRandomQuestions(shuffled.slice(0, 3));
    }
  }, [chatbotOpen]);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatHistoryRef.current?.scrollTo({
        top: chatHistoryRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = { sender: 'user', text: inputValue.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setShowSuggestions(false);
    setLoadingMessage(true);

    setMessages((prev) => [...prev, { sender: 'bot', text: 'Thinking...' }]);
    scrollToBottom();

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          "You are an AI assistant for small and medium enterprises (SMEs). Provide helpful, concise, professional advice on compliance, finance, or business operations. Answer in 1–2 sentences. Avoid markdown.",
          userMsg.text,
        ],
      });

      const botText = response.text ?? 'Sorry, I couldn’t generate a response.';
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: 'bot', text: botText };
        return updated;
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Oops, failed to reach the server.' },
      ]);
    } finally {
      setLoadingMessage(false);
      scrollToBottom();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return {
    messages,
    inputValue,
    setInputValue,
    loadingMessage,
    chatbotOpen,
    setChatbotOpen,
    showSuggestions,
    setShowSuggestions,
    randomQuestions,
    chatHistoryRef,
    handleSendMessage,
    handleKeyPress,
    isListening,
    onToggleVoice: toggleVoiceInput,
  };
};