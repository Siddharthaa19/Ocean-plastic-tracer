import React from 'react';
import { Layers, Eye, Wind, Flame, Navigation, ShieldCheck } from 'lucide-react';

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
}

export const LayerControl: React.FC<LayerControlProps> = ({ layers, onToggleLayer }) => {
  const layerItems: { key: keyof ActiveLayers; label: string; color: string; icon: any }[] = [
    { key: 'aiDetection', label: 'Debris Detection', color: '#0878D1', icon: Eye },
    { key: 'predictedDrift', label: 'Predicted Drift', color: '#168BE8', icon: Wind },
    { key: 'accumulationHotspots', label: 'Accumulation Hotspots', color: '#E35D5D', icon: Flame },
    { key: 'oceanCurrents', label: 'Ocean Currents', color: '#24C6C5', icon: Navigation },
    { key: 'wind', label: 'Wind Vector', color: '#7666D9', icon: Wind },
    { key: 'verificationPoints', label: 'Verification Points', color: '#18B77A', icon: ShieldCheck },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-3.5 shadow-lg w-56 select-none">
      <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-100 text-xs font-extrabold text-[#071A33] uppercase tracking-wider">
        <Layers className="w-3.5 h-3.5 text-[#0878D1]" />
        LAYERS
      </div>

      <div className="space-y-1.5">
        {layerItems.map((item) => {
          const Icon = item.icon;
          const isChecked = layers[item.key];
          return (
            <label
              key={item.key}
              onClick={() => onToggleLayer(item.key)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                isChecked ? 'bg-[#F5F9FC] text-[#071A33]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: isChecked ? item.color : '#CBD5E1' }}
                />
                <span className="text-[11px] font-bold">{item.label}</span>
              </div>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {}}
                className="w-3.5 h-3.5 rounded text-[#0878D1] focus:ring-0 cursor-pointer"
              />
            </label>
          );
        })}
      </div>
    </div>
  );
};
