import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { domainConfig } from '../domainConfig';
import { logger } from '../utils/logger';
import { 
  Send, 
  Music, 
  Calendar, 
  Zap, 
  Map as MapIcon, 
  Home as HomeIcon, 
  Plane,
  Sparkles,
  Info
} from 'lucide-react';

const VibePlayer = ({ musicMood }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 1));
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div className="bg-[#E3F2FD]/50 p-6 rounded-3xl flex flex-col gap-4 mt-4 border border-blue-100 shadow-sm relative group overflow-hidden">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => {
            if (!isPlaying) logger.logApiCall(performance.now(), 0, "Lyria 3 (Simulated Low-Latency)", "Music Verified");
            setIsPlaying(!isPlaying);
          }}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all text-blue-600 ring-2 ring-blue-50"
        >
          {isPlaying ? <div className="flex gap-1"><div className="w-1 h-3 bg-blue-600 rounded-full animate-pulse"></div><div className="w-1 h-3 bg-blue-600 rounded-full animate-pulse delay-75"></div></div> : <Music size={20} />}
        </button>
        <div className="flex-1">
          <div className="text-sm font-bold text-blue-900">{musicMood || "Ambient Vibe"}</div>
          <div className="text-[10px] text-blue-500 font-bold uppercase tracking-widest opacity-70">Lyria 3 Engine Active</div>
        </div>
      </div>
      <div className="w-full bg-blue-100/50 h-2 rounded-full overflow-hidden">
        <div className="bg-blue-500 h-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export const ChatInterface = () => {
  const { chatHistory, addChatMessage, sidebarContext, vibeMode } = useContext(AppContext);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
          messages: [...chatHistory.map(m => ({ role: m.role, content: m.content }))].filter(m => !m.parsedData).slice(-4),
          context: sidebarContext,
          domainConfig: domainConfig,
          mode: vibeMode
        })
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      logger.logApiCall(startTime, data.tokenEstimate || 0, '/api/chat', data.groundingStatus || "Verified");
      
      const parsed = data.reply;
      
      if (parsed.refusal) {
        addChatMessage('assistant', parsed.refusal);
      } else {
        addChatMessage('assistant', "", parsed);
      }
    } catch (error) {
      console.error(error);
      addChatMessage('assistant', "Bestie, I'm having a small glitch in my systems. Can you try that again?");
    } finally {
      setIsLoading(false);
    }
  };

  const renderJsonCard = (parsed) => {
    if (parsed.error) return <div className="text-red-500 text-xs font-mono">{parsed.raw}</div>;

    const imageUrl = parsed.image_prompt ? `https://image.pollinations.ai/prompt/${encodeURIComponent(parsed.image_prompt)}?width=1000&height=500&nologo=true&seed=${Math.floor(Math.random()*1000)}` : null;

    if (vibeMode === 'HOME_SANCTUARY') {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-xl text-pink-600"><HomeIcon size={24} /></div>
            <h3 className="text-2xl font-bold text-gray-800 tracking-tight">{parsed.vibe_title}</h3>
          </div>
          
          {imageUrl && (
            <div className="relative rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
              <img src={imageUrl} alt="Home Vibe" className="w-full h-72 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-[#E8F5E9]/60 p-6 rounded-3xl border border-white shadow-sm">
              <h4 className="font-bold text-[#2e7d32] text-sm uppercase tracking-wider mb-2">Recipe Ritual</h4>
              <p className="text-[15px] text-gray-800 leading-relaxed whitespace-pre-wrap">{parsed.recipe}</p>
            </div>
            
            <div className="bg-[#FCE4EC]/60 p-6 rounded-3xl border border-white shadow-sm">
              <h4 className="font-bold text-[#c2185b] text-sm uppercase tracking-wider mb-2">Recommended Hobby</h4>
              <p className="text-[15px] text-gray-800 leading-relaxed">{parsed.hobby_recs}</p>
            </div>
          </div>

          <VibePlayer musicMood={parsed.music_mood} />
        </div>
      );
    }

    if (vibeMode === 'GLOBAL_ESCAPE') {
      const gcalUrl = parsed.calendar_link ? 
        `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(parsed.calendar_link.title)}&location=${encodeURIComponent(parsed.calendar_link.location)}&details=${encodeURIComponent(parsed.calendar_link.details)}` 
        : '#';

      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center bg-white/50 p-4 rounded-3xl border border-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><Plane size={24} /></div>
              <h3 className="text-xl font-bold text-gray-800">{parsed.location}</h3>
            </div>
            {parsed.calendar_link && (
              <a href={gcalUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95">
                <Calendar size={14} /> 
                Block My Calendar
              </a>
            )}
          </div>

          {imageUrl && (
            <div className="rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
              <img src={imageUrl} alt="Global Escape" className="w-full h-80 object-cover" />
            </div>
          )}

          <div className="bg-white/80 p-8 rounded-[2.5rem] border border-white shadow-sm space-y-6">
            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-widest">Master Itinerary</h4>
            <div className="space-y-8">
              {parsed.itinerary?.map((day, idx) => (
                <div key={idx} className="relative pl-8 border-l-2 border-blue-100">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-400 rounded-full border-2 border-white"></div>
                  <span className="block font-bold text-blue-600 text-xs uppercase mb-3">{day.day}</span>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-sm"><span className="block font-bold text-[10px] text-gray-400 uppercase mb-1">Morning</span> {day.morning}</div>
                    <div className="text-sm"><span className="block font-bold text-[10px] text-gray-400 uppercase mb-1">Afternoon</span> {day.afternoon}</div>
                    <div className="text-sm"><span className="block font-bold text-[10px] text-gray-400 uppercase mb-1">Evening</span> {day.evening}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#FCE4EC]/50 p-6 rounded-3xl border border-white shadow-sm">
              <h4 className="font-bold text-[#c2185b] text-xs uppercase tracking-widest mb-4">Packing List</h4>
              <ul className="text-sm text-gray-800 space-y-2">
                {Array.isArray(parsed.packing_list) && parsed.packing_list.map((item, i) => (
                  <li key={i} className="flex gap-2"><span className="text-pink-300">•</span> {item}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-[#E8F5E9]/50 p-6 rounded-3xl border border-white shadow-sm">
              <h4 className="font-bold text-[#2e7d32] text-xs uppercase tracking-widest mb-4">OOTD Strategy</h4>
              <ul className="text-sm text-gray-800 space-y-3">
                {parsed.ootd?.map((item, i) => (
                  <li key={i} className="flex gap-3 leading-tight font-medium">
                    <span className="text-[#2e7d32]/50 font-bold shrink-0">{i+1}.</span> 
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="flex-1 flex flex-col min-h-[700px] bg-white/30 backdrop-blur-xl rounded-[3rem] border border-white shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-white/50 flex justify-between items-center bg-white/20">
        <h2 className="font-black text-gray-800 flex items-center gap-3 text-xl tracking-tight">
          <Zap className="w-8 h-8 text-blue-500 fill-blue-500" /> Voyager Console
        </h2>
        <div className="flex items-center gap-3 bg-white/50 px-4 py-2 rounded-2xl border border-white/50 shadow-sm">
          <div className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-mono">Status: Ready</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 h-full overflow-y-auto custom-scrollbar p-8 space-y-8 min-h-0">
        {chatHistory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700 text-center">
            <div className="bg-white/90 p-10 rounded-[3rem] border border-white shadow-2xl max-w-lg">
              <div className="flex justify-center mb-6">
                <div className="p-5 bg-blue-50 rounded-3xl text-blue-500"><Sparkles size={48} /></div>
              </div>
              <p className="text-2xl font-black mb-6 tracking-tight leading-tight">Heyy, I'm Lumi! ✨ Ready to teleport?</p>
              <p className="text-[15px] text-gray-600 mb-8 leading-relaxed font-medium">
                Check your sidebar to pick <span className="font-bold text-pink-500">Home Sanctuary</span> (cook & chill) or <span className="font-bold text-blue-500">Global Escape</span> (plan & pack). 
              </p>
              <p className="text-sm font-bold text-gray-400 italic">Tell me a vibe—like 'Harry Potter Library' or 'Midnight in Tokyo'—and let's go!</p>
            </div>
          </div>
        )}
        
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`w-full ${msg.parsedData ? 'max-w-[95%]' : 'max-w-[80%]'} p-6 rounded-[2.5rem] shadow-xl ${
              msg.role === 'user' 
                ? 'bg-blue-600 border-2 border-blue-400 text-white rounded-br-none ml-auto font-bold text-lg' 
                : 'bg-white border-b-4 border-gray-100 text-gray-800 rounded-tl-none'
            }`}>
              {msg.parsedData ? renderJsonCard(msg.parsedData) : <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/90 border border-white text-gray-500 rounded-[2rem] p-6 shadow-xl flex gap-1.5 items-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-8 bg-white/40 backdrop-blur-3xl border-t border-white/50">
        <form onSubmit={handleSend} className="flex gap-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={vibeMode === 'HOME_SANCTUARY' ? "Teleport your home... (e.g. 'Cozy Ghibli')" : "Plan your escape... (e.g. 'Paris, 3 days')"}
            className="flex-1 px-8 py-6 rounded-3xl border-2 border-white focus:outline-none focus:ring-8 focus:ring-blue-100/50 transition-all bg-white shadow-2xl text-lg font-bold text-gray-800 placeholder:text-gray-300"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white w-20 h-20 rounded-3xl hover:bg-blue-700 disabled:opacity-30 transition-all shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95"
          >
            <Send size={28} />
          </button>
        </form>
      </div>
    </div>
  );
};
