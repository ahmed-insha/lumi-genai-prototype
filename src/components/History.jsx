import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Bot, User, Trash2 } from 'lucide-react';

export const History = () => {
  const { chatHistory, clearHistory } = useContext(AppContext);

  return (
    <div className="flex-1 glass-card p-6 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Chat History</h2>
        {chatHistory.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 px-3 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} />
            Clear
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <p>No history yet. Start chatting!</p>
          </div>
        ) : (
          chatHistory.map((msg, index) => (
            <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-orange-100 text-orange-900 rounded-br-none' 
                  : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm'
              }`}>
                <div className="flex items-center gap-2 mb-1 opacity-60 text-xs">
                  {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                  <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
