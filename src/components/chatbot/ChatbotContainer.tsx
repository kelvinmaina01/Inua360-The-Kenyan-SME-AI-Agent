import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { MdFullscreen, MdOutlineFullscreenExit } from 'react-icons/md';
import { ChatHistory } from './ChatHistory';
import { ChatInput } from './ChatInput';
import { useChatbotLogic } from './useChatbotLogic';

interface ChatbotContainerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatbotContainer: React.FC<ChatbotContainerProps> = ({ isOpen, onClose }) => {
  const [fullScreen, setFullScreen] = useState(false);
  const {
    messages,
    inputValue,
    setInputValue,
    loadingMessage,
    showSuggestions,
    randomQuestions,
    chatHistoryRef,
    handleSendMessage,
    handleKeyPress,
    setShowSuggestions,
    isListening,
    onToggleVoice,
    isSpeaking,
  } = useChatbotLogic();

  if (!isOpen) return null;

  return (
    <div
      className={`chatbot-container fixed rounded-lg shadow-2xl z-50 flex flex-col ${
        fullScreen
          ? 'h-[90%] w-full bottom-0 right-0'
          : 'bottom-5 right-5 md:w-1/3 md:h-1/2 w-[90%] h-2/3'
      } bg-white`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FB630B] to-[#fc9355] text-white p-4 rounded-tl-xl flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setFullScreen(!fullScreen)}
            aria-label={fullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {fullScreen ? <MdOutlineFullscreenExit size={28} /> : <MdFullscreen size={28} />}
          </button>
          <h3 className="text-lg font-semibold">Inua360 AI Chatbot</h3>
        </div>
        <button onClick={onClose} aria-label="Close chatbot">
          <RxCross2 size={28} />
        </button>
      </div>

      {/* Chat history */}
      <div
        ref={chatHistoryRef}
        className="chat-history flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50"
      >
        <ChatHistory
          messages={messages}
          showSuggestions={showSuggestions}
          randomQuestions={randomQuestions}
          chatbotOpenFullScreen={fullScreen}
          setInputValue={setInputValue}
          setShowSuggestions={setShowSuggestions}
          handleSendMessage={handleSendMessage}
          isSpeaking={isSpeaking}
        />
      </div>

      {/* Input */}
      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={handleSendMessage}
        handleKeyPress={handleKeyPress}
        isListening={isListening}
        onToggleVoice={onToggleVoice}
      />
    </div>
  );
};
