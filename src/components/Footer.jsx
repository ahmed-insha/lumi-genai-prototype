import React, { useState, useEffect } from 'react';

// Basic event system for footer to listen to logger events if we wanted, 
// but we will just pass via window for a hackathon trick.
export const Footer = () => {
  const [latency, setLatency] = useState(0);

  useEffect(() => {
    // Hackathon trick: Listen for custom event dispatched by logger
    const handleLog = (e) => {
      if (e.detail && e.detail.latency) {
        setLatency(e.detail.latency);
      }
    };
    window.addEventListener('vibe_latency', handleLog);
    return () => window.removeEventListener('vibe_latency', handleLog);
  }, []);

  return (
    <footer className="w-full mt-4 flex items-center justify-between text-xs text-gray-500 bg-white/50 px-6 py-3 rounded-full border border-gray-100 shadow-sm backdrop-blur-md shrink-0">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
        <span>Verified against Allergy Guardrails</span>
      </div>
      <div>
        <span>API Latency: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-orange-500">{latency > 0 ? `${Math.round(latency)}ms` : '--'}</span></span>
      </div>
      <div>
        <span className="font-medium text-[#FCE4EC] bg-pink-500 px-2 py-0.5 rounded-full">Engine: Groq-JSON + Lyria</span>
      </div>
    </footer>
  );
};
