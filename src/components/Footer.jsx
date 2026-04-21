import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full mt-4 flex items-center justify-between text-xs text-gray-500 bg-white/50 px-6 py-3 rounded-full border border-gray-100 shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
        <span>API Online</span>
      </div>
      <div>
        <span>Branch: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">main</span></span>
      </div>
      <div>
        <span className="font-medium text-orange-400">Engine: Groq-Llama-3</span>
      </div>
    </footer>
  );
};
