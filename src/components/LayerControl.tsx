import React, { useState, useRef, useEffect } from 'react';
import { Layers, ChevronDown, Eye, Wind, Flame, Navigation, ShieldCheck, GripVertical, Sparkles } from 'lucide-react';

export interface ActiveLayers {
  aiDetection: boolean;
  predictedDrift: boolean;
  accumulationHotspots: boolean;
  oceanCurrents: boolean;
  wind: boolean;
  verificationPoints: boolean;
}

interface LayerControlProps {
  layers: ActiveLayers;
  onToggleLayer: (key: keyof ActiveLayers) => void;
  positionCorner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const LayerControl: React.FC<LayerControlProps> = ({
  layers,
  onToggleLayer,
  positionCorner = 'top-left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [autoPosition, setAutoPosition] = useState(true);
  const [corner, setCorner] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>(positionCorner);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const layerItems: { key: keyof ActiveLayers; label: string; color: string; icon: any }[] = [
    { key: 'aiDetection', label: 'Debris Detection', color: '#EF4444', icon: Eye },
    { key: 'predictedDrift', label: 'Predicted Drift', color: '#00E5FF', icon: Wind },
    { key: 'accumulationHotspots', label: 'Accumulation Hotspots', color: '#F97316', icon: Flame },
    { key: 'oceanCurrents', label: 'Ocean Currents', color: '#24C6C5', icon: Navigation },
    { key: 'wind', label: 'Wind Vector', color: '#A855F7', icon: Wind },
    { key: 'verificationPoints', label: 'Verification Points', color: '#10B981', icon: ShieldCheck },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeCount = Object.values(layers).filter(Boolean).length;

  const handleCornerCycle = () => {
    setAutoPosition(false);
    const corners: ('top-left' | 'top-right' | 'bottom-left' | 'bottom-right')[] = [
      'top-left',
      'top-right',
      'bottom-right',
      'bottom-left',
    ];
    const currentIndex = corners.indexOf(corner);
    const nextCorner = corners[(currentIndex + 1) % corners.length];
    setCorner(nextCorner);
  };

  return (
    <div ref={containerRef} className="relative z-[500] select-none">
      {/* Compact Collapsible Trigger Button with Drag Handle */}
      <div className="flex items-center gap-1 bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md border border-slate-700/80 rounded-xl p-1 shadow-xl text-white">
        {/* Drag / Cycle Corner Handle */}
        <button
          onClick={handleCornerCycle}
          title="Click to cycle corner position or toggle manual drag"
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>

        {/* Main Layers Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2 px-2.5 py-1 text-xs font-extrabold cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>LAYERS {activeCount}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Expanded Floating Checklist Dropdown */}
      {isOpen && (
        <div className="absolute top-11 left-0 w-60 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/90 p-3 shadow-2xl space-y-2 animate-fade-in text-white">
          <div className="flex items-center justify-between px-1 pb-1 border-b border-slate-800 text-[10px] font-black uppercase text-slate-400 tracking-wider">
            <span>MAP LAYERS ({activeCount}/6)</span>

            {/* Auto Position Toggle */}
            <button
              onClick={() => setAutoPosition((prev) => !prev)}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold transition-colors cursor-pointer ${
                autoPosition ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40' : 'text-slate-500 bg-slate-800'
              }`}
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>Auto Pos</span>
            </button>
          </div>

          <div className="space-y-1">
            {layerItems.map((item) => {
              const isChecked = layers[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => onToggleLayer(item.key)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    isChecked ? 'bg-slate-800/90 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: isChecked ? item.color : '#64748B' }}
                    />
                    <span className="text-[11px] font-bold">{item.label}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                    className="w-3.5 h-3.5 rounded text-[#00E5FF] accent-[#00E5FF] focus:ring-0 cursor-pointer pointer-events-none"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
