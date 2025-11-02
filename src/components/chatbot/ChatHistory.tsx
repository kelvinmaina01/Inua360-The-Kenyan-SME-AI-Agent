import React from 'react';
import { QuickSuggestions } from './QuickSuggestions';

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
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  messages,
  showSuggestions,
  randomQuestions,
  chatbotOpenFullScreen,
  setInputValue,
  setShowSuggestions,
  handleSendMessage,
}) => {
  return (
    <>
      {showSuggestions &&
        messages.length === 1 &&
        messages[0].sender === 'bot' &&
        messages[0].text === 'This is Cultura AI chatbot! How can I help you today?' && (
        <QuickSuggestions
          randomQuestions={randomQuestions}
          setInputValue={setInputValue}
          setShowSuggestions={setShowSuggestions}
          handleSendMessage={handleSendMessage}
          chatbotOpenFullScreen={chatbotOpenFullScreen}
        />
      )}
      {messages.map((msg, index) => (
        <div key={index} className={`flex mb-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`p-3 rounded-lg max-w-[80%] shadow-sm ${
              msg.sender === 'user'
                ? 'bg-blue-100 text-blue-800'
                : msg.text === 'Thinking...'
                ? 'bg-gray-100 text-blue-700 italic animate-pulse'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {msg.text}
          </div>
        </div>
      ))}
    </>
  );
};