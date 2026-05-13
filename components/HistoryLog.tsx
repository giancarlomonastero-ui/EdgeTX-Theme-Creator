
import React from 'react';
// Fixed: Added .ts extension to the import for consistency across the codebase
import { HistoryEntry } from '../types.ts';

interface HistoryLogProps {
  history: HistoryEntry[];
  currentIndex: number;
  onJump: (index: number) => void;
}

const HistoryLog: React.FC<HistoryLogProps> = ({ history, currentIndex, onJump }) => {
  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="bg-slate-900 rounded-xl p-6 shadow-2xl border border-slate-800 flex flex-col h-[300px]">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white shrink-0">
        <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
        Change History
      </h2>
      
      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-2">
        {history.slice().reverse().map((entry, revIndex) => {
          const actualIndex = history.length - 1 - revIndex;
          const isActive = actualIndex === currentIndex;
          const isFuture = actualIndex > currentIndex;

          return (
            <button
              key={`${entry.timestamp}-${actualIndex}`}
              onClick={() => onJump(actualIndex)}
              className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 group ${
                isActive 
                  ? 'bg-purple-600/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                  : isFuture 
                    ? 'bg-slate-900/30 border-slate-800/50 opacity-40 grayscale'
                    : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${
                isActive ? 'bg-purple-400 animate-pulse' : 'bg-slate-600'
              }`} />
              
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-baseline gap-2">
                  <span className={`text-[11px] font-bold uppercase tracking-wider truncate ${
                    isActive ? 'text-purple-300' : 'text-slate-300'
                  }`}>
                    {entry.label}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 shrink-0">
                    {formatTime(entry.timestamp)}
                  </span>
                </div>
                <div className="flex gap-1 mt-1 overflow-hidden h-1.5 rounded-full bg-black/20">
                    {Object.values(entry.theme).slice(0, 6).map((color, i) => (
                        <div key={i} className="flex-grow" style={{ backgroundColor: color }} />
                    ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryLog;
