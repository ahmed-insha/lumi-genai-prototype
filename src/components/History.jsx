import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Bot, User, Trash2 } from 'lucide-react';

export const History = () => {
  const { chatHistory, clearHistory } = useContext(AppContext);

  return (
    <div className="flex-1 glass-card p-6 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-2xl font-extrabold text-gray-800">Chat History</h2>
        {chatHistory.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 text-sm text-red-500 font-bold hover:text-red-700 px-4 py-2 rounded-2xl bg-[#FCE4EC]/50 border border-white hover:bg-[#FCE4EC] transition-colors shadow-sm"
          >
            <Trash2 size={16} />
            Clear
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 font-medium">
            <p>No history yet. Start chatting!</p>
          </div>
        ) : (
          chatHistory.map((msg, index) => (
            <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-5 rounded-3xl ${
                msg.role === 'user' 
                  ? 'bg-[#E3F2FD] border border-blue-100 text-blue-900 rounded-br-none shadow-sm ml-auto' 
                  : 'bg-white/90 border border-white text-gray-800 rounded-bl-none shadow-sm'
              }`}>
                <div className="flex items-center gap-2 mb-2 opacity-80 text-xs font-bold text-gray-500">
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
                {msg.parsedData ? (
                  <div className="text-sm font-semibold text-pink-600">Generated JSON Card for: {msg.parsedData.vibe_title || msg.parsedData.location}</div>
                ) : (
                  <p className="whitespace-pre-wrap text-[15px]">{msg.content}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
