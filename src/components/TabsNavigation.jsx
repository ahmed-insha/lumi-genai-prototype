import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { LayoutDashboard, MessageSquare, History } from 'lucide-react';

export const TabsNavigation = () => {
  const { activeTab, setActiveTab } = useContext(AppContext);
  const tabs = [
    { id: 'Action', icon: MessageSquare },
    { id: 'Dashboard', icon: LayoutDashboard },
    { id: 'History', icon: History }
  ];

  return (
    <div className="flex gap-4 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all ${
              isActive 
                ? 'bg-orange-100 text-orange-800 shadow-sm border border-orange-200'
                : 'bg-white/60 text-gray-600 hover:bg-white border border-transparent'
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
