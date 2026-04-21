import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Send, Mic, Image as ImageIcon } from 'lucide-react';
import { domainConfig } from '../domainConfig';
import { logger } from '../utils/logger';

export const ChatInterface = () => {
  const { chatHistory, addChatMessage, sidebarContext } = useContext(AppContext);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    addChatMessage('user', userMessage);
    setInput('');
    setIsLoading(true);
    const startTime = performance.now();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...chatHistory, { role: 'user', content: userMessage }],
          context: sidebarContext,
          domainConfig: domainConfig
        })
      });

      if (!response.ok) {
        throw new Error('API Error');
      }

      const data = await response.json();
      addChatMessage('assistant', data.reply);
      logger.logApiCall(startTime, data.tokenEstimate || 0);
      
      // Multimodal: Pollinations AI Image logic could be appended here if required.
    } catch (error) {
      console.error(error);
      addChatMessage('assistant', 'Bestie, I ran into an error connecting to my brain. Try again?');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListen = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Web Speech API is not supported in this browser.");
      return;
    }
    
    // Placeholder Logic for voice
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    recognition.start();
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + " " + transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    }
  };

  return (
    <div className="flex-1 glass-card flex flex-col overflow-hidden relative">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white/40">
        <h2 className="font-semibold text-gray-800">Chat with {domainConfig.APP_NAME}</h2>
        <button className="text-xs text-gray-500 flex items-center gap-1 hover:text-orange-500 transition-colors">
          <ImageIcon size={14} /> Generate Visual
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {chatHistory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
            <div className="text-4xl text-orange-200">✨</div>
            <p>Hey there! I'm Lumi. How can I help you with {domainConfig.PRIMARY_TOPIC}?</p>
          </div>
        )}
        
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-orange-500 text-white rounded-br-none shadow-md shadow-orange-500/20' 
                : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 text-gray-500 rounded-2xl rounded-bl-none p-4 shadow-sm flex gap-1 items-center">
              <span className="w-2 h-2 bg-orange-300 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-orange-300 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-orange-300 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white/60 backdrop-blur border-t border-white flex gap-2 items-center">
        <button 
          onClick={toggleListen}
          className={`p-3 rounded-xl transition-colors ${
            isListening ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
          title="Voice input"
        >
          <Mic size={20} />
        </button>
        <form onSubmit={handleSend} className="flex-1 flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all bg-white"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-orange-500 transition-colors shadow-md shadow-orange-500/20 flex items-center justify-center"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
