import React, { createContext, useState, useEffect } from 'react';
import { domainConfig } from '../domainConfig';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Initialize context data from localStorage or defaults
  const initializeSidebarContext = () => {
    const saved = localStorage.getItem('lumi_sidebarContext');
    if (saved) return JSON.parse(saved);
    
    // Default context based on domainConfig
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

  // Persist to localStorage whenever dependencies change
  useEffect(() => {
    localStorage.setItem('lumi_sidebarContext', JSON.stringify(sidebarContext));
  }, [sidebarContext]);

  useEffect(() => {
    localStorage.setItem('lumi_chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const updateSidebarField = (id, value) => {
    setSidebarContext(prev => ({ ...prev, [id]: value }));
  };

  const addChatMessage = (role, content) => {
    setChatHistory(prev => [...prev, { role, content, timestamp: Date.now() }]);
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
        setActiveTab
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
