import React from 'react';
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa6";

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
    <div className="p-4 border-t border-gray-200 flex items-center gap-2">
        <button
            type="button"
            onClick={onToggleVoice}
            className={`p-2 rounded-full ${
            isListening
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } transition-colors`}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
            title={isListening ? "Stop listening" : "Speak to send message"}
        >
            {isListening ? (
            <FaMicrophoneSlash size={20} />
            ) : (
            <FaMicrophone size={20} />
            )}
        </button>
      <input
        type="text"
        id="chatInput"
        placeholder="Type your message..."
        className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mr-3"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        onKeyPress={handleKeyPress}
      />
      <button
        id="sendMessage"
        className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
        onClick={handleSendMessage}
      >
        Send
      </button>
    </div>
  );
};