import React from 'react';
import {
  Compass,
  Flame,
  Target,
  ArrowRight,
  Radio,
} from 'lucide-react';
import { NavigationId } from '../types';
import { HOTSPOT_ZONES } from '../data/mockData';

interface RightIntelligenceCardsProps {
  onNavigate: (id: NavigationId) => void;
}

export const RightIntelligenceCards: React.FC<RightIntelligenceCardsProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-4 select-none">
      {/* CARD 1: DETECTION CONFIDENCE */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            <Radio className="w-3.5 h-3.5 text-[#0878D1]" />
            DETECTION CONFIDENCE
          </div>
          <span className="px-2 py-0.5 rounded bg-[#18B77A]/15 text-[#18B77A] text-[10px] font-extrabold">
            High
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-black text-[#071A33]">86%</span>
          <span className="text-xs text-slate-500 font-semibold">Satellite Match Score</span>
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-600">
            <span className="text-slate-400">Satellite Source:</span>
            <span className="font-bold text-slate-800">Sentinel-2 (10m)</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span className="text-slate-400">Observation:</span>
            <span className="font-semibold text-slate-700">27 Sep 2026 · 09:20 UTC</span>
          </div>
        </div>
      </div>

      {/* CARD 2: DRIFT FORECAST */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            <Compass className="w-3.5 h-3.5 text-[#168BE8]" />
            DRIFT FORECAST
          </div>
          <span className="px-2 py-0.5 rounded bg-[#EAF8FA] text-[#0878D1] text-[10px] font-bold">
            NEXT 48 HOURS
          </span>
        </div>

        <div className="flex items-center justify-between my-2">
          <div>
            <div className="text-2xl font-black text-[#071A33] flex items-center gap-1">
              <span>↗</span> 31 km
            </div>
            <div className="text-[11px] font-semibold text-slate-500">
              Expected Direction: Northeast
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Forecast Confidence</div>
            <div className="text-sm font-extrabold text-[#0878D1]">82%</div>
          </div>
        </div>

        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
          <div className="bg-[#168BE8] h-full w-[82%] rounded-full" />
        </div>
      </div>

      {/* CARD 3: HOTSPOT RISK */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            <Flame className="w-3.5 h-3.5 text-[#E35D5D]" />
            HOTSPOT RISK
          </div>
          <span className="text-xs font-bold text-slate-600">3 zones identified</span>
        </div>

        <div className="space-y-2 my-3">
          {HOTSPOT_ZONES.map((spot) => (
            <div
              key={spot.id}
              onClick={() => onNavigate('hotspots')}
              className="flex items-center justify-between p-2 rounded-xl bg-[#F5F9FC] border border-slate-200/70 hover:border-[#0878D1]/40 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#062B5C] text-white flex items-center justify-center text-[10px] font-bold">
                  0{spot.rank}
                </span>
                <span className="text-xs font-bold text-[#071A33]">{spot.name}</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                  spot.priority === 'High'
                    ? 'bg-[#E35D5D]/15 text-[#E35D5D]'
                    : 'bg-[#E9A72F]/15 text-[#E9A72F]'
                }`}
              >
                {spot.priority}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => onNavigate('hotspots')}
          className="w-full text-center text-xs font-bold text-[#0878D1] hover:underline pt-1 block cursor-pointer"
        >
          View All Hotspots →
        </button>
      </div>

      {/* CARD 4: BEST PLACE TO CHECK (DIFFERENTIATOR) */}
      <div className="bg-gradient-to-br from-[#062B5C] to-[#0A3D7F] rounded-2xl p-4 text-white shadow-lg relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#24C6C5]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#24C6C5]">
            <Target className="w-4 h-4 text-[#24C6C5] animate-pulse" />
            BEST PLACE TO CHECK
          </div>
          <span className="px-2 py-0.5 rounded bg-[#18B77A] text-white text-[10px] font-black">
            HIGH VALUE
          </span>
        </div>

        <div className="text-lg font-bold text-white mb-1">14 km Offshore (Kerala)</div>
        <div className="text-xs text-slate-300 leading-relaxed mb-4">
          Checking this spot minimizes drift uncertainty before debris arrives at the coast.
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4 bg-white/10 p-2.5 rounded-xl border border-white/10 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Information Value:</span>
            <span className="font-extrabold text-[#24C6C5]">High</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Recommended Asset:</span>
            <span className="font-bold text-white">Boat / Drone</span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('verification')}
          className="w-full py-2.5 rounded-xl bg-[#0878D1] hover:bg-[#168BE8] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#0878D1]/40 transition-all cursor-pointer transform active:scale-95"
        >
          <span>Start Verification</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
