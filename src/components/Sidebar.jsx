import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { domainConfig } from '../domainConfig';
import { Sparkles, Home, Plane } from 'lucide-react';

export const Sidebar = () => {
  const { sidebarContext, updateSidebarField, vibeMode, setVibeMode } = useContext(AppContext);

  return (
    <aside className="w-72 h-full overflow-y-auto custom-scrollbar p-6 flex flex-col gap-6 bg-[#E8F5E9]/90 backdrop-blur-md rounded-3xl shadow-sm border border-white/60 mr-4 shrink-0">
      <div className="flex items-center gap-3 mb-2">
        <Sparkles className="text-pink-500 w-8 h-8" />
        <h1 className="text-2xl font-bold text-gray-800">{domainConfig.APP_NAME}</h1>
      </div>
      
      {/* Mode Toggle */}
      <div className="bg-white/50 p-2 rounded-2xl flex gap-1">
        <button 
          onClick={() => setVibeMode('HOME_SANCTUARY')}
          className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            vibeMode === 'HOME_SANCTUARY' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700 hover:bg-white/30'
          }`}
        >
           <Home className="w-4 h-4" />
           Home
        </button>
        <button 
          onClick={() => setVibeMode('GLOBAL_ESCAPE')}
          className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            vibeMode === 'GLOBAL_ESCAPE' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700 hover:bg-white/30'
          }`}
        >
          <Plane className="w-4 h-4" />
          Trip
        </button>
      </div>

      <div className="flex flex-col gap-2 border-t border-white/40 pt-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">System Context</h2>
      </div>

      <div className="flex flex-col gap-5 flex-grow">
        {domainConfig.SIDEBAR_FIELDS.map(field => (
          <div key={field.id} className="flex flex-col gap-1.5">
            <label htmlFor={field.id} className="text-sm font-semibold text-gray-700">
              {field.label}
            </label>
            <input
              id={field.id}
              type="text"
              placeholder={field.placeholder}
              value={sidebarContext[field.id] || ''}
              onChange={(e) => updateSidebarField(field.id, e.target.value)}
              className="px-4 py-3 rounded-2xl border border-white focus:outline-none focus:ring-2 focus:ring-[#E3F2FD] transition-all text-sm bg-white/70 shadow-inner"
            />
          </div>
        ))}
      </div>
    </aside>
  );
};
