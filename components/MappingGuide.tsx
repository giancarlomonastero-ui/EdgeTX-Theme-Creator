
import React, { useState } from 'react';
import { ThemeVariable } from '../types';

interface MappingGuideProps {
  onHighlight: (variable: ThemeVariable) => void;
  activeScreen: string;
}

const MappingGuide: React.FC<MappingGuideProps> = ({ onHighlight, activeScreen }) => {
  const [tab, setTab] = useState<'colors' | 'blueprint'>('colors');

  if (activeScreen !== 'screenshot1') return null;

  const mappingSchema = [
    {
      area: "Top Bar (Header)",
      elements: [
        { label: "Bar Background", var: "secondary1", desc: "The main top rectangle." },
        { label: "Logo Accent", var: "focus", desc: "The arrow/accent behind 'EDGETX'." },
        { label: "Logo Text", var: "primary2", desc: "The color of the 'EDGE' and 'TX' text." },
        { label: "Signal Indicators", var: "warning", desc: "Signal bars at top right." }
      ]
    },
    {
      area: "Sticks & Sliders",
      elements: [
        { label: "Rail", var: "secondary1", desc: "The slots where handles slide." },
        { label: "Handles", var: "focus", desc: "The stick control squares." },
        { label: "Gradients/Scale", var: "primary1", desc: "The side and center millimeter tick marks." }
      ]
    },
    {
      area: "Widget > Outputs",
      elements: [
        { label: "Table Borders", var: "primary1", desc: "Outer frames and divider lines." },
        { label: "Label Text", var: "primary1", desc: "Channel names (CH1, CH2, etc)." },
        { label: "Numeric Values", var: "secondary1", desc: "The percentages on the right." },
        { label: "Progress Bars", var: "secondary1", desc: "The fill color of the output bars." }
      ]
    },
    {
      area: "Model Area",
      elements: [
        { label: "Model Label", var: "secondary1", desc: "The text label above the image." },
        { label: "Global Background", var: "secondary3", desc: "The background color of the whole page." }
      ]
    }
  ];

  const blueprintSchema = [
    {
      name: "renderTopBar()",
      pos: "Top (15% height)",
      logic: "Flexbox (justify-between)",
      elements: "Logo, Timer, Battery, RSSI (Warning)"
    },
    {
      name: "VerticalSlot",
      pos: "Absolute (Left-2 / Right-13)",
      logic: "H-70% / Flex-row",
      props: "railPos, scalePos, isLeft"
    },
    {
      name: "HorizontalSlot",
      pos: "Bottom (px-24 / pb-10)",
      logic: "Flex-col / W-47%",
      props: "railPos, scalePos"
    },
    {
      name: "Main Content Grid (The Table)",
      pos: "Center (px-16 / -mt-8)",
      logic: "Grid-cols-[45%_55%]",
      desc: "The main grid defining the two-column screen structure."
    },
    {
      name: "Model Area Container",
      pos: "Right Column (55%)",
      logic: "Flex-col / Items-center",
      elements: "modelLabel, droneImage (PNG, max 280x250px)",
      desc: "Block containing the model image and customizable text label."
    }
  ];

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-right-4 flex flex-col h-full">
      <div className="flex border-b border-slate-800">
        <button 
          onClick={() => setTab('colors')}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${tab === 'colors' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Color Map
        </button>
        <button 
          onClick={() => setTab('blueprint')}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${tab === 'blueprint' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Technical Blueprint
        </button>
      </div>

      <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
        {tab === 'colors' ? (
          <div className="space-y-6">
            <h2 className="text-sm font-bold flex items-center gap-2 text-white">
              <span className="w-1.5 h-4 bg-green-500 rounded-full"></span>
              Variable Mapping
            </h2>
            {mappingSchema.map((section, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
                  <span className="h-[1px] flex-grow bg-blue-500/20"></span>
                  {section.area}
                </h3>
                <div className="grid grid-cols-1 gap-1">
                  {section.elements.map((el, elIdx) => (
                    <button
                      key={elIdx}
                      onClick={() => onHighlight(el.var as ThemeVariable)}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors group text-left"
                    >
                      <div className="mt-1 w-3 h-3 rounded-sm border border-white/20 group-hover:scale-125 transition-transform" style={{ backgroundColor: `var(--${el.var})` }} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">{el.label}</span>
                          <span className="text-[9px] font-mono bg-slate-950 px-1.5 py-0.5 rounded text-slate-500 group-hover:text-blue-400">{el.var.toUpperCase()}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{el.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-sm font-bold flex items-center gap-2 text-white">
              <span className="w-1.5 h-4 bg-purple-500 rounded-full"></span>
              renderScreenshot1() Structure
            </h2>
            <div className="space-y-4">
              {blueprintSchema.map((item, idx) => (
                <div key={idx} className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 hover:border-purple-500/30 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-mono font-bold text-purple-400">{item.name}</span>
                    <span className="text-[9px] font-black bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">{item.pos}</span>
                  </div>
                  <div className="text-[10px] text-slate-300 space-y-1">
                    <p><span className="text-slate-500 font-bold uppercase text-[8px] tracking-tighter mr-1">Logic:</span> {item.logic}</p>
                    {item.props && <p><span className="text-slate-500 font-bold uppercase text-[8px] tracking-tighter mr-1">Props:</span> <code className="bg-black/40 px-1 rounded text-purple-300">{item.props}</code></p>}
                    {item.elements && <p><span className="text-slate-500 font-bold uppercase text-[8px] tracking-tighter mr-1">Contains:</span> {item.elements}</p>}
                    {item.desc && <p className="text-slate-500 italic mt-1">{item.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-blue-900/10 p-4 rounded-lg border border-blue-900/30 mt-4">
              <p className="text-[10px] text-blue-300 leading-relaxed font-medium">
                <span className="block font-black mb-1 text-blue-400 uppercase tracking-tighter">Quick Guide</span>
                To move the model image, look for the <b>Model Area Container</b> block in <i>Preview.tsx</i>. To change column widths, modify the <b>Main Content Grid</b>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MappingGuide;
