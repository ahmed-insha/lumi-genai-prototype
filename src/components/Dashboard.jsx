import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const Dashboard = () => {
  const { chatHistory } = useContext(AppContext);

  return (
    <div className="flex-1 glass-card p-6 overflow-hidden flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Metrics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-white/50 border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-orange-500 mb-2">{chatHistory.length}</span>
          <span className="text-sm font-medium text-gray-500">Total Interactions</span>
        </div>
        <div className="p-6 rounded-2xl bg-white/50 border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-green-500 mb-2">0</span>
          <span className="text-sm font-medium text-gray-500">Tokens Saved (Est)</span>
        </div>
      </div>
    </div>
  );
};
