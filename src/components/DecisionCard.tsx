import React from 'react';
import {
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  MapPin,
  Clock,
  Maximize2,
  Zap,
} from 'lucide-react';
import { DebrisDetection } from '../types';

interface DecisionCardProps {
  detection: DebrisDetection;
  onReviewDetection: () => void;
  onOpenWhyDecision: () => void;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({
  detection,
  onReviewDetection,
  onOpenWhyDecision,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm mb-6 hover:shadow-md transition-shadow select-none">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#18B77A] animate-pulse" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0878D1]">
            RECOMMENDED ACTION
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-500 font-medium">Updated moments ago</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-[#E35D5D]/10 text-[#E35D5D] border border-[#E35D5D]/20 text-[11px] font-bold">
            High Priority
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 items-center">
        {/* Left 8 Cols: Main Decision Details & 4 Compact Blocks */}
        <div className="lg:col-span-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#0878D1]/10 text-[#0878D1] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#071A33] tracking-tight">
                {detection.name}
              </h2>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#0878D1]" />
                <span>{detection.locationName}</span>
                <span className="text-slate-300">•</span>
                <span>Lat 9.93°N, Lng 75.80°E</span>
              </div>
            </div>
          </div>

          {/* 4 Compact Information Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
            {/* Block 1: Detection */}
            <div className="p-3 rounded-xl bg-[#F5F9FC] border border-slate-200/80">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                DETECTION CONFIDENCE
              </div>
              <div className="text-sm font-extrabold text-[#071A33]">
                {detection.confidence}%
              </div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                Satellite verified
              </div>
            </div>

            {/* Block 2: Detected Area */}
            <div className="p-3 rounded-xl bg-[#F5F9FC] border border-slate-200/80">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                <Maximize2 className="w-2.5 h-2.5 text-[#24C6C5]" />
                DETECTED AREA
              </div>
              <div className="text-sm font-extrabold text-[#071A33]">
                {detection.visibleExtentKm2} km²
              </div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                Observed slick
              </div>
            </div>

            {/* Block 3: Drift Window */}
            <div className="p-3 rounded-xl bg-[#F5F9FC] border border-slate-200/80">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-[#168BE8]" />
                DRIFT WINDOW
              </div>
              <div className="text-sm font-extrabold text-[#071A33]">
                {detection.driftWindowHours}
              </div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                Northeast direction
              </div>
            </div>

            {/* Block 4: Priority */}
            <div className="p-3 rounded-xl bg-[#EAF8FA] border border-[#24C6C5]/30">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#0878D1] mb-1 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-[#0878D1]" />
                PRIORITY
              </div>
              <div className="text-sm font-extrabold text-[#071A33]">
                {detection.priority}
              </div>
              <div className="text-[10px] text-[#0878D1] font-medium mt-0.5">
                Check recommended
              </div>
            </div>
          </div>

          {/* Buttons & Rationale Link */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              onClick={onReviewDetection}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#18B77A] hover:bg-[#15A06B] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#18B77A]/25 transition-all cursor-pointer"
            >
              <span>Review Detection</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenWhyDecision}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0878D1] hover:text-[#065A9E] underline underline-offset-4 cursor-pointer transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Why this decision? (View Rationale)</span>
            </button>
          </div>
        </div>

        {/* Right 4 Cols: Detection Confidence Box */}
        <div className="lg:col-span-4 bg-[#F5F9FC] rounded-xl border border-slate-200/80 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              DETECTION CONFIDENCE
            </span>
            <span className="px-2 py-0.5 rounded bg-[#18B77A]/15 text-[#18B77A] text-[10px] font-extrabold">
              High
            </span>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-black text-[#071A33]">{detection.confidence}%</span>
            <span className="text-xs text-slate-500 font-semibold">Match Score</span>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-4">
            <div
              className="bg-gradient-to-r from-[#0878D1] to-[#18B77A] h-full rounded-full transition-all duration-1000"
              style={{ width: `${detection.confidence}%` }}
            />
          </div>

          <div className="space-y-2 text-[11px] pt-2 border-t border-slate-200/60 text-slate-600">
            <div className="flex justify-between">
              <span>Satellite Match:</span>
              <span className="font-bold text-slate-800">High Signature</span>
            </div>
            <div className="flex justify-between">
              <span>Ocean Current Vector:</span>
              <span className="font-bold text-slate-800">0.32 s⁻¹ Convergence</span>
            </div>
            <div className="flex justify-between">
              <span>Forecast Range:</span>
              <span className="font-bold text-[#18B77A]">±1.2 km</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
