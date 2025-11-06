import React from 'react';
import { Mic, MicOff, Send } from 'lucide-react';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isListening: boolean;
  onToggleVoice: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  setInputValue,
  handleSendMessage,
  handleKeyPress,
  isListening,
  onToggleVoice,
}) => {
  return (
    <div className="border-t p-4 bg-white/70 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {/* Input */}
        <input
          type="text"
          placeholder="Ask your AI assistant..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB630B]"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        {/* Mic button */}
        {/* <button
          type="button"
          onClick={onToggleVoice}
          className={`p-3 rounded-full shadow-md transition-colors ${
            isListening
              ? 'bg-red-500 text-white'
              : 'bg-[#FB630B] text-white hover:bg-[#fc9355]'
          }`}
          title={isListening ? 'Stop listening' : 'Speak'}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button> */}

        {/* Send button */}
        <button
          onClick={handleSendMessage}
          className="p-3 rounded-lg bg-[#FB630B] hover:bg-[#fc9355] text-white flex items-center justify-center"
          title="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
