import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Emojis = {
  Action: "https://microsoft.github.io/fluentui-emoji/assets/Speech%20balloon/3D/speech_balloon_3d.png",
  Dashboard: "https://microsoft.github.io/fluentui-emoji/assets/Chart%20increasing/3D/chart_increasing_3d.png",
  History: "https://microsoft.github.io/fluentui-emoji/assets/Hourglass%20done/3D/hourglass_done_3d.png"
};

export const TabsNavigation = () => {
  const { activeTab, setActiveTab } = useContext(AppContext);
  const tabs = [
    { id: 'Action', icon: Emojis.Action },
    { id: 'Dashboard', icon: Emojis.Dashboard },
    { id: 'History', icon: Emojis.History }
  ];

  return (
    <div className="flex gap-4 mb-6 shrink-0">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-3xl font-bold transition-all shadow-sm ${
              isActive 
                ? 'bg-white text-gray-800 border border-white/60'
                : 'bg-white/40 text-gray-500 hover:bg-white/70 border border-transparent hover:text-gray-700'
            }`}
          >
            <img src={tab.icon} alt={tab.id} className="w-5 h-5 object-contain" />
            {tab.id}
          </button>
        );
      })}
    </div>
  );
};
