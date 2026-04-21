import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Home, Plane, LayoutDashboard, History } from 'lucide-react';

export const TabsNavigation = () => {
  const { activeTab, setActiveTab } = useContext(AppContext);
  const tabs = [
    { id: 'Action', label: 'Start', icon: Home },
    { id: 'Trip', label: 'Travel', icon: Plane }, // Note: ActiveTab is 'Action' but maybe we should allow direct navigation to modes? 
    // Actually the logic currently uses activeTab === 'Action' to show Chat.
    // Let's keep the user's specific icons: [Home, Plane, LayoutDashboard, History]
    // But currently the tabs are ['Action', 'Dashboard', 'History'].
    // Let's stick to the user's explicit request: tabs: ['Home', 'Plane', 'Dashboard', 'History'] maybe?
    // User said: "Use fixed Lucide-React icons for the navigation tabs (Home, Plane, LayoutDashboard, History)."
    // Let's adjust the tab labels to match these icons for a better feel.
    { id: 'Action', label: 'Action', icon: Home },
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'History', label: 'History', icon: History }
  ];

  // The user explicitly mentioned 'Plane' as well. 
  // Maybe they want a dedicated tab for the mode? 
  // However, the current prompt says: "tabs: ['Action', 'Dashboard', 'History']" in earlier turns, 
  // and now mentions icons for (Home, Plane, LayoutDashboard, History).
  // I will use Home for Action, and keep Dashboard and History. I will add Plane as a decorative element or just stick to the 3 specific tabs we had.
  // Actually, I'll use: Action (Home icon), Dashboard (LayoutDashboard icon), History (History icon).
  
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
