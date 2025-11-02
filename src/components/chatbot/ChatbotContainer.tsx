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
  } = useChatbotLogic();

  if (!isOpen) return null;

  return (
    <div
      id="chatbotContainer"
      className={`chatbot-container max-sm:p-0 max-sm:border max-sm:border-blue-600 fixed rounded-lg ${
        fullScreen
          ? 'h-[90%] bottom-0 right-0 w-full mx-auto'
          : 'bottom-5 right-5 md:w-1/3 md:h-1/2 w-[90%]'
      } h-2/3 bg-white rounded-tl-xl shadow-2xl flex flex-col z-40`}
    >
      <div className="bg-blue-600 text-white p-4 rounded-tl-xl flex justify-between items-center">
        <div className="flex gap-2">
          <button
            className="text-white hover:text-gray-200 focus:outline-none"
            onClick={() => setFullScreen(!fullScreen)}
            aria-label={fullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {fullScreen ? (
              <MdOutlineFullscreenExit title='Exit Fullscreen' className='my-auto hover:scale-105 cursor-pointer' size={30} />
            ) : (
              <MdFullscreen title='Fullscreen' className='my-auto hover:scale-105 cursor-pointer' size={30} />
            )}
          </button>
          <h3 className="text-lg font-semibold">Inua360 Chatbot</h3>
        </div>
        <button
          className="text-white hover:text-gray-200 focus:outline-none"
          onClick={onClose}
          aria-label="Close chatbot"
        >
          <RxCross2 title='Close Chatbot' className='my-auto hover:scale-105 cursor-pointer' size={30} />
        </button>
      </div>

      <div ref={chatHistoryRef} id="chatHistory" className="chat-history flex-grow p-4 overflow-y-auto space-y-4">
        <ChatHistory
          messages={messages}
          showSuggestions={showSuggestions}
          randomQuestions={randomQuestions}
          chatbotOpenFullScreen={fullScreen}
          setInputValue={setInputValue}
          setShowSuggestions={setShowSuggestions}
          handleSendMessage={handleSendMessage}
        />
      </div>

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