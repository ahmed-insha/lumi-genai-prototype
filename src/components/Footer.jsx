import React, { useState, useEffect } from 'react';

export const Footer = () => {
  const [metrics, setMetrics] = useState({ latency: 0, status: 'Standing By', tokens: 0 });

  useEffect(() => {
    const handleLog = (e) => {
      if (e.detail) {
        setMetrics({
          latency: e.detail.latency || 0,
          status: e.detail.status || 'Verified',
          tokens: e.detail.tokens || 0
        });
      }
    };
    window.addEventListener('vibe_latency', handleLog);
    return () => window.removeEventListener('vibe_latency', handleLog);
  }, []);

  return (
    <footer className="w-full mt-4 flex justify-between items-center text-xs text-gray-500 bg-white/60 px-6 py-4 rounded-3xl border border-white/60 shadow-sm backdrop-blur-md shrink-0">
      <div className="flex items-center gap-3">
        <span className={`flex h-2 w-2 rounded-full ${metrics.status.includes('Refused') ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
        <span className="font-bold text-gray-700 tracking-wide">{metrics.status}</span>
      </div>
      <div className="flex gap-6 font-mono text-[11px] bg-white/50 px-4 py-2 rounded-2xl border border-white">
        <span>⏱️ Latency: <span className="text-pink-600 font-bold">{metrics.latency > 0 ? `${Math.round(metrics.latency)}ms` : '--'}</span></span>
        {metrics.tokens > 0 && <span>Tokens: <span className="text-blue-600 font-bold">{metrics.tokens}</span></span>}
      </div>
      <div>
        <span className="font-bold text-[#FCE4EC] bg-pink-500/90 px-3 py-1.5 rounded-full tracking-wider uppercase text-[10px]">Engine: Groq-JSON + Lyria</span>
      </div>
    </footer>
  );
};
