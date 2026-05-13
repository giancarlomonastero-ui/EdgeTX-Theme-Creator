
import React, { useState } from 'react';
import { EdgeTXTheme, ThemeVariable, VariableMeta } from '../types';

interface ControlsProps {
  theme: EdgeTXTheme;
  updateColor: (variable: ThemeVariable, color: string) => void;
  variables: VariableMeta[];
  highlightedVar: ThemeVariable | null;
  setHoveredVar: (variable: ThemeVariable | null) => void;
  yamlCode: string;
}

const Controls: React.FC<ControlsProps> = ({ 
  theme, 
  updateColor, 
  variables, 
  highlightedVar, 
  setHoveredVar,
  yamlCode 
}) => {
  const [view, setView] = useState<'colors' | 'code'>('colors');

  return (
    <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden h-full">
      {/* Tabs Header */}
      <div className="flex border-b border-slate-800 shrink-0">
        <button 
          onClick={() => setView('colors')}
          className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
            view === 'colors' 
              ? 'bg-blue-600 text-white shadow-inner' 
              : 'text-slate-500 hover:text-slate-300 bg-slate-900/50'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${view === 'colors' ? 'bg-white' : 'bg-slate-700'}`}></div>
          Color Variables
        </button>
        <button 
          onClick={() => setView('code')}
          className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
            view === 'code' 
              ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500' 
              : 'text-slate-500 hover:text-slate-300 bg-slate-900/50'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${view === 'code' ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
          YML Output
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 p-6 pb-0">
        {view === 'colors' ? (
          <div className="grid grid-cols-1 gap-4 mb-6">
            {variables.map((v) => (
              <div 
                key={v.key} 
                id={`control-${v.key}`}
                onMouseEnter={() => setHoveredVar(v.key)}
                onMouseLeave={() => setHoveredVar(null)}
                className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 cursor-default relative overflow-hidden ${
                  highlightedVar === v.key 
                    ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_40px_rgba(37,99,235,0.15)] z-10 scale-[1.02]' 
                    : 'bg-slate-800/30 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                {/* Active indicator bar */}
                {highlightedVar === v.key && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-l-xl animate-pulse" />
                )}

                <div className="relative flex-shrink-0">
                  <input
                    type="color"
                    value={theme[v.key]}
                    onChange={(e) => updateColor(v.key, e.target.value)}
                    className={`w-12 h-12 rounded-lg cursor-pointer bg-transparent border-2 transition-all duration-300 ${
                      highlightedVar === v.key ? 'border-white scale-105 shadow-xl' : 'border-slate-700 group-hover:border-slate-500'
                    }`}
                  />
                  {highlightedVar === v.key && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-blue-600"></div>
                  )}
                </div>
                
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-mono font-bold text-[11px] tracking-widest transition-colors truncate pr-2 ${highlightedVar === v.key ? 'text-blue-300' : 'text-slate-300'}`}>
                      {v.label}
                    </span>
                    <span className={`text-[9px] font-mono uppercase font-black transition-colors ${highlightedVar === v.key ? 'text-white' : 'text-slate-600'}`}>
                      {theme[v.key]}
                    </span>
                  </div>
                  <p className={`text-[10px] leading-tight line-clamp-2 transition-colors ${highlightedVar === v.key ? 'text-blue-50/80 font-medium' : 'text-slate-500'}`}>
                    {v.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col h-full pb-6">
            <div className="flex items-center justify-between mb-4 px-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Live Theme Source</span>
              </div>
              <button 
                onClick={() => { navigator.clipboard.writeText(yamlCode); alert("YAML code copied!"); }} 
                className="text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-1.5 rounded-lg text-white font-black transition-all active:scale-95"
              >
                COPY CODE
              </button>
            </div>
            <pre className="p-6 text-[13px] font-mono text-blue-200 overflow-x-auto bg-black/40 rounded-xl flex-grow border border-slate-800 shadow-inner custom-scrollbar"><code>{yamlCode}</code></pre>
            <div className="mt-4 p-4 bg-blue-900/10 border border-blue-900/30 rounded-xl shrink-0">
               <p className="text-[11px] text-blue-300 flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Copy this code and paste it into a new <b>.yml</b> file in the <b>/THEMES</b> folder of your EdgeTX SD card to apply the theme to your radio.</span>
               </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Controls;
