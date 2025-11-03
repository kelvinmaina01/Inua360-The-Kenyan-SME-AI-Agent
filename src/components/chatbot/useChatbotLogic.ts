import { useState, useEffect, useRef } from 'react';

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const quickQstns = [
    { question: 'How do I register my business in Kenya?' },
    { question: 'What tax compliance do I need as an SME?' },
    { question: 'How can I improve my cash flow?' },
    { question: 'What documents do I need for a business permit?' },
    { question: 'Explain PAYE vs VAT for small businesses.' },
    { question: 'How do I apply for a HELB waiver?' },
    { question: 'What are common financial mistakes by startups?' },
  ];

  // Speech recognition setup
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
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }

    return () => recognitionRef.current?.stop();
  }, []);

  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Voice input not supported.');
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // Load chat history
  useEffect(() => {
    const savedMessages = sessionStorage.getItem(CHATBOT_HISTORY_KEY);
    const savedState = sessionStorage.getItem(CHATBOT_STATE_KEY);
    if (savedMessages) setMessages(JSON.parse(savedMessages));
    if (savedState === 'true') setChatbotOpen(true);
  }, []);

  useEffect(() => {
    sessionStorage.setItem(CHATBOT_HISTORY_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    sessionStorage.setItem(CHATBOT_STATE_KEY, chatbotOpen.toString());
  }, [chatbotOpen]);

  // Random suggestions
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
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setShowSuggestions(false);
    setLoadingMessage(true);

    const placeholderId = `tmp-${Date.now()}`;
    setMessages(prev => [...prev, { sender: 'bot', text: 'Thinking...' }]);
    scrollToBottom();

    try {
      // Call your backend for AI response (replace with your actual API)
      const response = await fetch('YOUR_BACKEND_AI_ENDPOINT', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text }),
      });
      const data = await response.json();
      const botText = data.text ?? 'Sorry, I could not generate a response.';

      // Update message
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: 'bot', text: botText };
        return updated;
      });

      // 11Labs TTS playback
      if (data.audio) {
        if (!audioRef.current) audioRef.current = new Audio();
        audioRef.current.src = `data:audio/mpeg;base64,${data.audio}`;
        audioRef.current.onplay = () => setIsSpeaking(true);
        audioRef.current.onended = () => setIsSpeaking(false);
        audioRef.current.onerror = () => setIsSpeaking(false);
        await audioRef.current.play().catch(err => console.warn(err));
      }

    } catch (err) {
      console.error(err);
      setMessages(prev => [
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
    isSpeaking,
  };
};
