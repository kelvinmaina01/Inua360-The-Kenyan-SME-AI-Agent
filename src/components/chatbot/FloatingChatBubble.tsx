import React, { useState, useEffect } from 'react';
import { FaCommentDots } from 'react-icons/fa6';
import { ChatbotContainer } from './ChatbotContainer';
import { useChatbotLogic } from './useChatbotLogic';

export const FloatingChatBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isListening, isSpeaking } = useChatbotLogic();

  // State to trigger pulse/glow
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    setIsActive(isListening || isSpeaking);
  }, [isListening, isSpeaking]);

  return (
    <>
      {/* Minimized bubble with name and call-to-action */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-3 bg-[#FB630B] text-white px-6 py-3 rounded-full shadow-2xl hover:bg-[#fc9355] transition transform hover:scale-105"
            title="Open chat"
          >
            {/* Glowing ring when active */}
            {isActive && (
              <span className="absolute -inset-2 rounded-full border-2 border-[#FB630B] opacity-50 animate-ping"></span>
            )}

            {/* Large chat icon */}
            <FaCommentDots size={32} className="relative z-10" />

            {/* Call-to-action text */}
            <span className="relative z-10 font-bold text-lg">
              Chat with me now!
            </span>
          </button>
        </div>
      )}

      {/* Chat container */}
      <ChatbotContainer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
