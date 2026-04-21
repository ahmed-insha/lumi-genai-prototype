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
    <div className="min-h-screen p-6 max-h-screen flex flex-col box-border">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col h-full max-w-5xl mx-auto w-full relative">
          <TabsNavigation />
          
          {activeTab === 'Action' && <ChatInterface />}
          {activeTab === 'Dashboard' && <Dashboard />}
          {activeTab === 'History' && <History />}
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
