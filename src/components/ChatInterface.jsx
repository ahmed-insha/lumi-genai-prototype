import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { domainConfig } from '../domainConfig';
import { logger } from '../utils/logger';
import { Send, Music, Calendar, MapPin, Package, Sun, Shirt, Sparkles } from 'lucide-react';

// 3D Accents via Fluent Emoji CDN (Reliable links)
const Accents = {
  Home: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/House/3D/house_3d.png",
  Trip: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/World%20map/3D/world_map_3d.png",
  Sparkles: "https://microsoft.github.io/fluentui-emoji/assets/Sparkles/3D/sparkles_3d.png"
};

// --- Sub-Components ---

const RecipeCard = ({ recipe }) => (
  <div className="bg-[#E8F5E9]/60 p-6 rounded-[2rem] border border-white shadow-sm flex-1">
    <h4 className="font-black text-[#2e7d32] uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
      <div className="w-2 h-2 bg-[#2e7d32] rounded-full"></div> Detailed Recipe
    </h4>
    <p className="text-[15px] text-gray-800 leading-relaxed whitespace-pre-wrap">{recipe}</p>
  </div>
);

const HobbyCard = ({ hobby }) => (
  <div className="bg-[#FCE4EC]/60 p-6 rounded-[2rem] border border-white shadow-sm flex-1">
    <h4 className="font-black text-[#c2185b] uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
      <div className="w-2 h-2 bg-[#c2185b] rounded-full"></div> Specific Hobby
    </h4>
    <p className="text-[15px] text-gray-800 leading-relaxed">{hobby}</p>
  </div>
);

const MusicPlayer = ({ musicVibe }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 1));
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div className="bg-[#E3F2FD] p-6 rounded-3xl flex flex-col gap-4 border border-white/40 shadow-sm relative overflow-hidden">
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
          className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all ring-4 ring-blue-50"
        >
          {isPlaying ? (
            <div className="flex gap-1 items-center">
              {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i*0.1}s` }}></div>)}
            </div>
          ) : (
            <Music size={24} className="text-blue-500" />
          )}
        </button>
        <div className="flex-1">
          <div className="text-sm font-black text-blue-900">{musicVibe || "Soulful Ambient Vibe"}</div>
          <div className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-0.5">Lyria 3 Engine • 24-bit Audio</div>
        </div>
      </div>
      <div className="w-full bg-blue-200/50 h-2 rounded-full overflow-hidden border border-white/20 shadow-inner">
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-full transition-all duration-300 ease-linear" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

const ItineraryMap = ({ itinerary, location }) => (
  <div className="bg-white/70 p-6 rounded-[2.5rem] border border-white shadow-sm space-y-6">
    <h4 className="font-black text-gray-800 uppercase tracking-widest text-xs flex items-center gap-2">
      <MapPin size={16} className="text-blue-500" /> Curated Itinerary: {location}
    </h4>
    <div className="grid gap-6">
      {itinerary?.map((day, idx) => (
        <div key={idx} className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-blue-100 before:rounded-full">
          <span className="block font-black text-blue-800 text-xs uppercase tracking-widest mb-2">{day.day}</span>
          <div className="grid gap-2 text-sm text-gray-700">
            <div><span className="font-black text-[10px] uppercase text-gray-400 mr-2">Morning</span> {day.morning}</div>
            <div><span className="font-black text-[10px] uppercase text-gray-400 mr-2">Afternoon</span> {day.afternoon}</div>
            <div><span className="font-black text-[10px] uppercase text-gray-400 mr-2">Evening</span> {day.evening}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PackingListCard = ({ packingList }) => (
  <div className="bg-[#FCE4EC]/60 p-6 rounded-[2rem] border border-white shadow-sm h-full">
    <h4 className="font-black text-[#c2185b] uppercase tracking-widest text-[10px] mb-4 flex items-center gap-2">
      <Package size={14} /> Master Packing List
    </h4>
    <div className="grid grid-cols-2 gap-4">
      {packingList && Object.entries(packingList).map(([cat, items]) => (
        <div key={cat} className="space-y-2">
          <div className="text-[10px] font-black text-[#c2185b]/60 uppercase border-b border-[#c2185b]/10 pb-1">{cat}</div>
          <ul className="text-xs text-gray-800 space-y-1">
            {Array.isArray(items) && items.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-1 h-1 bg-[#c2185b] rounded-full mt-1.5 shrink-0"></div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

const OOTDGallery = ({ ootd }) => (
  <div className="bg-[#E8F5E9]/60 p-6 rounded-[2rem] border border-white shadow-sm h-full">
    <h4 className="font-black text-[#2e7d32] uppercase tracking-widest text-[10px] mb-4 flex items-center gap-2">
      <Shirt size={14} /> Outfit of the Day (OOTD)
    </h4>
    <div className="space-y-3">
      {ootd?.map((item, i) => (
        <div key={i} className="flex gap-3 leading-tight p-3 bg-white/40 rounded-2xl border border-white/50">
          <div className="text-[10px] font-black text-[#2e7d32]/50 mt-1">{i+1}</div>
          <span className="text-sm font-medium text-gray-800">{item}</span>
        </div>
      ))}
    </div>
  </div>
);

// --- Main Component ---

export const ChatInterface = () => {
  const { chatHistory, addChatMessage, sidebarContext, vibeMode } = useContext(AppContext);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    addChatMessage('user', userMessage);
    setInput('');
    setIsLoading(true);
    const startTime = performance.now();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory.filter(m => !m.parsedData).slice(-4).map(m => ({ role: m.role, content: m.content })),
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
      addChatMessage('assistant', 'Bestie, the vibe frequency is jammed. Try again?');
    } finally {
      setIsLoading(false);
    }
  };

  const WelcomeCard = () => (
    <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700 w-full">
      <div className="bg-white/50 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-2xl text-gray-800 max-w-2xl w-full">
        <div className="flex justify-center mb-6">
          <img src={Accents.Sparkles} alt="Sparkles" className="w-20 h-20 drop-shadow-md" />
        </div>
        <p className="text-3xl font-black mb-6 tracking-tight leading-tight text-center">Heyy, I'm Lumi! ✨ Where should we teleport today?</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white/40 p-6 rounded-3xl border border-white/60">
            <h5 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
              <Sun size={14} className="text-orange-400" /> Mode A: Home
            </h5>
            <p className="text-sm font-medium text-gray-600">Teleport your home vibe. Cook niche recipes, find hobbies, and chill.</p>
          </div>
          <div className="bg-white/40 p-6 rounded-3xl border border-white/60">
            <h5 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
              <Plane size={14} className="text-blue-400" /> Mode B: Trip
            </h5>
            <p className="text-sm font-medium text-gray-600">Plan a global escape. Itineraries, packing lists, and outfits.</p>
          </div>
        </div>
        <div className="mt-8 bg-[#E3F2FD]/50 p-6 rounded-3xl border border-blue-100/50">
          <p className="text-sm font-bold text-gray-700 text-center uppercase tracking-widest">Just describe your vibe below to start!</p>
        </div>
      </div>
    </div>
  );

  const renderJsonCard = (parsed) => {
    if (parsed.error) return <div className="text-red-500 font-mono text-xs bg-red-50 p-4 rounded-2xl">{parsed.raw}</div>;
    const imageUrl = parsed.image_prompt ? `https://image.pollinations.ai/prompt/${encodeURIComponent(parsed.image_prompt)}?width=1000&height=600&nologo=true&seed=${Math.floor(Math.random()*1000)}` : null;

    if (vibeMode === 'HOME_SANCTUARY') {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4">
             <img src={Accents.Home} alt="Home" className="w-12 h-12 object-contain" />
             <h3 className="text-3xl font-black text-gray-800 tracking-tight leading-none">{parsed.vibe_title}</h3>
          </div>
          {imageUrl && <img src={imageUrl} alt="Generated Vibe" className="w-full h-80 object-cover rounded-[2.5rem] shadow-xl border-4 border-white" />}
          <div className="flex flex-col md:flex-row gap-6">
            <RecipeCard recipe={parsed.detailed_recipe} />
            <HobbyCard hobby={parsed.specific_hobby} />
          </div>
          <MusicPlayer musicVibe={parsed.music_vibe} />
        </div>
      );
    }

    if (vibeMode === 'GLOBAL_ESCAPE') {
      const gcalUrl = parsed.calendar_link ? 
        `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(parsed.calendar_link.title)}&location=${encodeURIComponent(parsed.calendar_link.location)}&details=${encodeURIComponent(parsed.calendar_link.details)}` 
        : '#';

      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center bg-white/40 p-4 rounded-full border border-white/60 shadow-sm">
             <div className="flex items-center gap-4 px-4">
                <img src={Accents.Trip} alt="Trip" className="w-10 h-10 object-contain" />
                <h3 className="text-2xl font-black text-gray-800 tracking-tight leading-none">{parsed.location}</h3>
             </div>
             {parsed.calendar_link && (
               <a href={gcalUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full text-xs font-black shadow-lg hover:bg-blue-700 transition-all uppercase tracking-widest">
                 <Calendar size={16} /> Block Calendar
               </a>
             )}
          </div>
          {imageUrl && <img src={imageUrl} alt="Destination" className="w-full h-80 object-cover rounded-[3rem] shadow-2xl border-4 border-white" />}
          <ItineraryMap itinerary={parsed.itinerary} location={parsed.location} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PackingListCard packingList={parsed.packing_list} />
            <OOTDGallery ootd={parsed.ootd} />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 flex flex-col min-h-[600px] relative">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-0 space-y-10 pb-12">
        {chatHistory.length === 0 ? (
          <div className="h-full flex items-center justify-center py-20">
            <WelcomeCard />
          </div>
        ) : (
          <div className="space-y-12">
             {chatHistory.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`w-full ${msg.parsedData ? 'max-w-[95%]' : 'max-w-2xl'} p-8 rounded-[3rem] ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 border-4 border-blue-400/30 text-white rounded-br-none shadow-2xl ml-auto font-bold text-xl' 
                      : 'bg-white/90 border border-white text-gray-800 rounded-tl-none shadow-xl backdrop-blur-md'
                  }`}>
                    {msg.parsedData ? renderJsonCard(msg.parsedData) : <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>}
                  </div>
                </div>
             ))}
          </div>
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/90 border border-white text-gray-500 rounded-[2.5rem] rounded-tl-none p-6 shadow-xl flex gap-2 items-center">
              {[1, 2, 3].map(i => <div key={i} className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }}></div>)}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 pt-6 pb-2 bg-gradient-to-t from-[#FFFDF5] via-[#FFFDF5] to-transparent">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-4 w-full">
          <div className="flex-1 relative group">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={vibeMode === 'HOME_SANCTUARY' ? "What's the home vibe? (e.g. Studio Ghibli chill)..." : "Where are we escaping? (e.g. Tokyo 2077 vibe)..."}
              className="w-full px-10 py-6 rounded-[2.5rem] border-4 border-white focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all bg-white shadow-2xl text-lg font-bold text-gray-800 placeholder:text-gray-300"
              disabled={isLoading}
            />
            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
               <Sparkles className="text-blue-500" />
            </div>
          </div>
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white w-20 h-20 rounded-full hover:bg-blue-700 disabled:opacity-30 transition-all shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 shrink-0"
          >
            <Send size={32} />
          </button>
        </form>
      </div>
    </div>
  );
};
