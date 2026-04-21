import React, { createContext, useState, useEffect } from 'react';
import { domainConfig } from '../domainConfig';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const initializeSidebarContext = () => {
    const saved = localStorage.getItem('lumi_sidebarContext');
    if (saved) return JSON.parse(saved);
    
    const defaultContext = {};
    domainConfig.SIDEBAR_FIELDS.forEach(field => {
      defaultContext[field.id] = '';
    });
    return defaultContext;
  };

  const [sidebarContext, setSidebarContext] = useState(initializeSidebarContext);
  
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem('lumi_chatHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('Action');
  
  // Vibe Voyager Mode: 'HOME_SANCTUARY' or 'GLOBAL_ESCAPE'
  const [vibeMode, setVibeMode] = useState(() => {
    const savedMode = localStorage.getItem('lumi_vibeMode');
    return savedMode || 'HOME_SANCTUARY';
  });

  useEffect(() => {
    localStorage.setItem('lumi_sidebarContext', JSON.stringify(sidebarContext));
  }, [sidebarContext]);

  useEffect(() => {
    localStorage.setItem('lumi_chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('lumi_vibeMode', vibeMode);
  }, [vibeMode]);

  const updateSidebarField = (id, value) => {
    setSidebarContext(prev => ({ ...prev, [id]: value }));
  };

  const addChatMessage = (role, content, parsedData = null) => {
    setChatHistory(prev => [...prev, { role, content, parsedData, timestamp: Date.now() }]);
  };

  const clearHistory = () => {
    setChatHistory([]);
  };

  return (
    <AppContext.Provider
      value={{
        sidebarContext,
        updateSidebarField,
        chatHistory,
        addChatMessage,
        clearHistory,
        activeTab,
        setActiveTab,
        vibeMode,
        setVibeMode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
