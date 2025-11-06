import React from 'react';

interface QuickSuggestionsProps {
  randomQuestions: { question: string }[];
  setInputValue: (q: string) => void;
  setShowSuggestions: (show: boolean) => void;
  handleSendMessage: () => void;
  chatbotOpenFullScreen: boolean;
}

export const QuickSuggestions: React.FC<QuickSuggestionsProps> = ({
  randomQuestions,
  setInputValue,
  setShowSuggestions,
  handleSendMessage,
  chatbotOpenFullScreen,
}) => {
  return (
    <div className="space-y-3">
      {/* <p className="text-gray-700 font-semibold">Here are some suggestions you can ask me:</p>
      <div className={`flex text-xs p-1 gap-2 ${chatbotOpenFullScreen ? 'flex' : 'flex-col'} space-y-2 md:space-y-0 md:space-x-2`}>
        {randomQuestions.map((q, index) => (
          <button
            key={index}
            className="text-left bg-gray-100 hover:bg-blue-100 text-gray-800 px-4 py-2 rounded-lg shadow-sm transition duration-200"
            onClick={() => {
              setInputValue(q.question);
              setShowSuggestions(false);
              handleSendMessage();
            }}
          >
            {q.question}
          </button>
        ))}
      </div> */}
    </div>
  );
};