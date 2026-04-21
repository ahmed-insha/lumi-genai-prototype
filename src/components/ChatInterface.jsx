import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { domainConfig } from '../domainConfig';
import { logger } from '../utils/logger';
import { Send, Music, Calendar, Zap, Home, Plane } from 'lucide-react';

const VibePlayer = ({ musicVibe }) => {
  const [isPlaying, setIsPlaying] = useState(!!musicVibe);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (musicVibe && !isPlaying && progress === 0) {
       setIsPlaying(true);
       logger.logApiCall(performance.now(), 0, "Lyria 3 (Simulated)", "Music Verified & Auto-Started");
    }
  }, [musicVibe]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) return 0;
          return p + 1;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div className="bg-[#E3F2FD] p-5 rounded-3xl flex flex-col gap-3 mt-4 border border-white/40 shadow-sm relative overflow-hidden">
      {/* Mini Visualizer */}
      <div className="absolute top-0 right-0 left-0 h-1 flex items-end justify-around px-2 opacity-30">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="bg-blue-500 w-1 rounded-full transition-all duration-300" 
            style={{ height: isPlaying ? `${Math.random() * 100}%` : '20%' }}
          ></div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => {
            if (!isPlaying) logger.logApiCall(performance.now(), 0, "Lyria 3 (Simulated)", "Music Verified");
            setIsPlaying(!isPlaying);
          }}
          className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all ring-4 ring-blue-50 group"
        >
          {isPlaying ? (
            <div className="flex gap-1">
              <div className="w-1.5 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-4 bg-blue-500 rounded-full animate-pulse delay-75"></div>
            </div>
          ) : (
            <Music size={24} className="text-blue-500" />
          )}
        </button>
        <div className="flex-1">
          <div className="text-sm font-bold text-blue-900">{musicVibe || "Soulful Ambient Vibe"}</div>
          <div className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-0.5">Lyria 3 Engine • 24-bit Audio</div>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="w-full bg-blue-200/50 h-3 rounded-full overflow-hidden border border-white/20 shadow-inner">
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-full transition-all duration-300 ease-linear" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex justify-between text-[10px] text-blue-400 font-bold px-1 uppercase">
          <span>0:{(Math.floor(progress * 0.3)).toString().padStart(2, '0')}</span>
          <span>0:30</span>
        </div>
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
      // We no longer block parsing if a refusal_message is present, since we return full objects now.
      addChatMessage('assistant', "", parsed);
      
    } catch (error) {
      console.error(error);
      addChatMessage('assistant', 'Bestie, I ran into an error connecting to my brain. Try again?');
    } finally {
      setIsLoading(false);
    }
  };

  const renderJsonCard = (parsed) => {
    if (parsed.error) return <div className="text-red-500 font-mono text-xs bg-red-50 p-4 rounded-2xl">{parsed.raw}</div>;

    const imageUrl = parsed.image_prompt ? `https://image.pollinations.ai/prompt/${encodeURIComponent(parsed.image_prompt)}?width=1000&height=600&nologo=true&seed=${Math.floor(Math.random()*1000)}` : null;

    const RefusalWarning = parsed.sassy_note && (
      <div className="bg-orange-50/90 text-orange-800 p-4 rounded-2xl border border-orange-200 font-medium text-[15px] shadow-sm mb-4">
        👵 {parsed.sassy_note}
      </div>
    );

    if (vibeMode === 'HOME_SANCTUARY') {
      return (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {RefusalWarning}
          
          {parsed.vibe_title && <h3 className="text-2xl font-black text-gray-800 tracking-tight leading-none">{parsed.vibe_title}</h3>}
          
          {imageUrl && (
            <div className="relative group">
              <img src={imageUrl} alt="Generated Vibe" className="w-full h-64 object-cover rounded-[2rem] shadow-xl border-4 border-white transition-transform group-hover:scale-[1.01] duration-500" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-gray-800 uppercase tracking-widest">Home Sanctuary</div>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-4">
            {parsed.recipe && (
              <div className="bg-[#E8F5E9]/60 p-6 rounded-[2rem] border border-white shadow-sm">
                <h4 className="font-black text-[#2e7d32] uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#2e7d32] rounded-full"></span> Detailed Recipe
                </h4>
                <p className="text-[15px] text-gray-800 leading-relaxed whitespace-pre-wrap">{parsed.recipe}</p>
              </div>
            )}
            
            {parsed.hobby && (
              <div className="bg-[#FCE4EC]/60 p-6 rounded-[2rem] border border-white shadow-sm">
                <h4 className="font-black text-[#c2185b] uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#c2185b] rounded-full"></span> Specific Hobby
                </h4>
                <p className="text-[15px] text-gray-800 leading-relaxed">{parsed.hobby}</p>
              </div>
            )}
          </div>

          {parsed.music_vibe && <VibePlayer musicVibe={parsed.music_vibe} />}
        </div>
      );
    }

    if (vibeMode === 'GLOBAL_ESCAPE') {
      const gcalUrl = parsed.calendar_link ? 
        `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(parsed.calendar_link.title)}&location=${encodeURIComponent(parsed.calendar_link.location)}&details=${encodeURIComponent(parsed.calendar_link.details)}` 
        : '#';

      return (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {RefusalWarning}
          
          <div className="flex justify-between items-start">
            {parsed.location && <h3 className="text-2xl font-black text-gray-800 tracking-tight leading-none">Vibe Check: {parsed.location}</h3>}
            {parsed.calendar_link && (
              <a href={gcalUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full text-xs font-black shadow-lg hover:bg-blue-700 transition-all hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-widest shrink-0">
                <Calendar size={14} className="text-white" /> 
                Block Calendar
              </a>
            )}
          </div>

          {imageUrl && (
            <div className="relative group">
              <img src={imageUrl} alt="Destination" className="w-full h-64 object-cover rounded-[2rem] shadow-xl border-4 border-white transition-transform group-hover:scale-[1.01] duration-500" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-gray-800 uppercase tracking-widest">Global Escape</div>
            </div>
          )}

          {parsed.itinerary && parsed.itinerary.length > 0 && (
            <div className="bg-white/70 p-6 rounded-[2.5rem] border border-white shadow-sm space-y-6">
              <h4 className="font-black text-gray-800 uppercase tracking-widest text-xs flex items-center gap-2">
                 <Plane size={16} /> Curated Itinerary
              </h4>
              <div className="grid gap-6">
                {parsed.itinerary.map((day, idx) => (
                  <div key={idx} className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-blue-100 before:rounded-full">
                    <span className="block font-black text-blue-800 text-xs uppercase tracking-widest mb-2">{day.day}</span>
                    <div className="grid gap-2">
                      <div className="text-sm text-gray-700"><span className="font-black text-[10px] uppercase text-gray-400 mr-2">Morning</span> {day.morning}</div>
                      <div className="text-sm text-gray-700"><span className="font-black text-[10px] uppercase text-gray-400 mr-2">Afternoon</span> {day.afternoon}</div>
                      <div className="text-sm text-gray-700"><span className="font-black text-[10px] uppercase text-gray-400 mr-2">Evening</span> {day.evening}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parsed.packing_list && Object.keys(parsed.packing_list).length > 0 && (
              <div className="bg-[#FCE4EC]/60 p-6 rounded-[2rem] border border-white shadow-sm">
                <h4 className="font-black text-[#c2185b] uppercase tracking-widest text-[10px] mb-4">Master Packing List</h4>
                <div className="space-y-4">
                  {Object.entries(parsed.packing_list).map(([cat, items]) => (
                    <div key={cat}>
                      <div className="text-[10px] font-black text-[#c2185b]/60 uppercase mb-1">{cat}</div>
                      <ul className="text-sm text-gray-800 space-y-1">
                        {Array.isArray(items) && items.map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-[#c2185b] rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {parsed.ootd && parsed.ootd.length > 0 && (
              <div className="bg-[#E8F5E9]/60 p-6 rounded-[2rem] border border-white shadow-sm">
                <h4 className="font-black text-[#2e7d32] uppercase tracking-widest text-[10px] mb-4">Outfit of the Day (OOTD)</h4>
                <ul className="text-sm text-gray-800 space-y-3">
                  {parsed.ootd.map((item, i) => (
                    <li key={i} className="flex gap-3 leading-tight">
                      <div className="text-[10px] font-black text-[#2e7d32]/50 mt-1">{i+1}</div>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="flex-1 glass-card flex flex-col overflow-hidden relative shadow-2xl border-white/50 min-h-[700px]">
      <div className="p-6 border-b border-white/40 flex justify-between items-center bg-white/40 backdrop-blur-xl">
        <h2 className="font-black text-gray-800 flex items-center gap-3 text-xl tracking-tighter uppercase">
          <Zap className="text-pink-400" size={24} /> Voyager Console
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Guardrails Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8 min-h-0 bg-white/20">
        {chatHistory.length === 0 && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700">
            <div className="bg-white/90 p-8 rounded-[3rem] border-4 border-white shadow-2xl text-gray-800 max-w-lg">
              <div className="text-5xl mb-6">🛳️</div>
              <p className="text-2xl font-black mb-6 tracking-tight leading-tight">Heyy, I'm Lumi, your new Grandma's Travel Bestie! ✨</p>
              <p className="text-[15px] text-gray-600 leading-relaxed font-medium">I'm here to help you live your absolute best life now that the kids are gone. Check your sidebar to pick Home Sanctuary or Global Escape. Tell me a vibe—like <span className="font-bold text-pink-500">'Harry Potter Library'</span> or <span className="font-bold text-blue-500">'Midnight in Tokyo'</span>—and let's go!</p>
            </div>
          </div>
        )}
        
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`w-full ${msg.parsedData ? 'max-w-[95%]' : 'max-w-[80%]'} p-6 rounded-[2.5rem] ${
              msg.role === 'user' 
                ? 'bg-blue-600 border-4 border-blue-400/30 text-white rounded-br-none shadow-2xl ml-auto font-bold text-lg' 
                : 'bg-white/95 border-b-8 border-gray-100 text-gray-800 rounded-tl-none shadow-xl'
            }`}>
              {msg.parsedData ? renderJsonCard(msg.parsedData) : <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/95 border border-white text-gray-500 rounded-[2.5rem] rounded-tl-none p-6 shadow-xl flex gap-1.5 items-center">
              <span className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"></span>
              <span className="w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-150"></span>
              <span className="w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-white/60 backdrop-blur-2xl border-t border-white/80">
        <form onSubmit={handleSend} className="flex gap-4">
          <div className="flex-1 relative group">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={vibeMode === 'HOME_SANCTUARY' ? "Describe your home vibe (e.g., 'Cozy Studio Ghibli')..." : "Trip Details (Days, Vibe, Destination, Budget)..."}
              className="w-full px-8 py-5 rounded-[2rem] border-4 border-white focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all bg-white shadow-2xl text-[16px] font-bold text-gray-800 placeholder:text-gray-300"
              disabled={isLoading}
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
               {vibeMode === 'HOME_SANCTUARY' ? <Home size={24} /> : <Plane size={24} />}
            </div>
          </div>
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white w-20 h-20 rounded-[2rem] hover:bg-blue-700 disabled:opacity-30 disabled:hover:bg-blue-600 transition-all shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95"
          >
            <Send size={32} />
          </button>
        </form>
      </div>
    </div>
  );
};
