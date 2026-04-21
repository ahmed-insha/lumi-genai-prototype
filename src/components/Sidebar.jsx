import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { domainConfig } from '../domainConfig';

export const Sidebar = () => {
  const { sidebarContext, updateSidebarField } = useContext(AppContext);

  return (
    <aside className="w-64 h-full p-6 flex flex-col gap-6 glass-card mr-4">
      <div className="flex items-center gap-3 mb-4">
        {/* Fluent Emoji Placeholder using image. Setting default width */}
        <img src="https://microsoft.github.io/fluentui-emoji/assets/Sun%20with%20face/3D/sun_with_face_3d.png" 
             alt="Lumi Icon" className="w-10 h-10 object-contain drop-shadow-md" 
             onError={(e) => { e.target.style.display = 'none' }} />
        <h1 className="text-2xl font-bold text-orange-600">{domainConfig.APP_NAME}</h1>
      </div>
      
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">System Context</h2>
        <p className="text-xs text-gray-400 mb-2">Topic: {domainConfig.PRIMARY_TOPIC}</p>
      </div>

      <div className="flex flex-col gap-4 flex-grow">
        {domainConfig.SIDEBAR_FIELDS.map(field => (
          <div key={field.id} className="flex flex-col gap-1">
            <label htmlFor={field.id} className="text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <input
              id={field.id}
              type="text"
              placeholder={field.placeholder}
              value={sidebarContext[field.id] || ''}
              onChange={(e) => updateSidebarField(field.id, e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all text-sm bg-white/50"
            />
          </div>
        ))}
      </div>
    </aside>
  );
};
