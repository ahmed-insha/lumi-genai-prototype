import React, { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TabsNavigation } from './components/TabsNavigation';
import { ChatInterface } from './components/ChatInterface';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';
import { Footer } from './components/Footer';

function MainApp() {
  const { activeTab } = useContext(AppContext);

  return (
    <div className="h-screen overflow-hidden p-6 flex flex-col box-border bg-buttermilk">
      <div className="flex-1 flex overflow-hidden min-h-0">
        <Sidebar />
        <main className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar max-w-5xl mx-auto w-full relative px-2">
          <TabsNavigation />
          
          <div className="flex-1 min-h-0 flex flex-col">
            {activeTab === 'Action' && <ChatInterface />}
            {activeTab === 'Dashboard' && <Dashboard />}
            {activeTab === 'History' && <History />}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
