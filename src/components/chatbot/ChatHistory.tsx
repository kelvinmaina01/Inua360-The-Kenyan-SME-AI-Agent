import React from 'react';
import { QuickSuggestions } from './QuickSuggestions';
import { Volume2 } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface ChatHistoryProps {
  messages: Message[];
  showSuggestions: boolean;
  randomQuestions: { question: string }[];
  chatbotOpenFullScreen: boolean;
  setInputValue: (q: string) => void;
  setShowSuggestions: (show: boolean) => void;
  handleSendMessage: () => void;
  isSpeaking: boolean;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  messages,
  showSuggestions,
  randomQuestions,
  chatbotOpenFullScreen,
  setInputValue,
  setShowSuggestions,
  handleSendMessage,
  isSpeaking,
}) => {
  return (
    <>
      {showSuggestions &&
        messages.length === 1 &&
        messages[0].sender === 'bot' &&
        messages[0].text === 'Hello! I’m your AI assistant. How can I help you today?' && (
          <QuickSuggestions
            randomQuestions={randomQuestions}
            setInputValue={setInputValue}
            setShowSuggestions={setShowSuggestions}
            handleSendMessage={handleSendMessage}
            chatbotOpenFullScreen={chatbotOpenFullScreen}
          />
        )}

      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`p-4 rounded-2xl max-w-[80%] shadow-md break-words ${
              msg.sender === 'user'
                ? 'bg-[#FB630B] text-white'
                : msg.text === 'Thinking...'
                ? 'bg-slate-50 text-[#FB630B] italic animate-pulse'
                : 'bg-slate-50 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="whitespace-pre-wrap">{msg.text}</span>
              {msg.sender === 'bot' && isSpeaking && msg.text !== 'Thinking...' && (
                <span title="Speaking">
                  <Volume2 className="h-4 w-4 text-[#FB630B] animate-pulse" />
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
