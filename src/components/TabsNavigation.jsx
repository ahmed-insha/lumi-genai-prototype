import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { MessageSquare, LayoutDashboard, History } from 'lucide-react';

export const TabsNavigation = () => {
  const { activeTab, setActiveTab } = useContext(AppContext);
  const tabs = [
    { id: 'Action', icon: MessageSquare },
    { id: 'Dashboard', icon: LayoutDashboard },
    { id: 'History', icon: History }
  ];

  return (
    <div className="flex gap-4 mb-6 shrink-0">
      {tabs.map((tab) => {
        const Icon = tab.icon;
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
            <Icon size={18} />
            {tab.id}
          </button>
        );
      })}
    </div>
  );
};
