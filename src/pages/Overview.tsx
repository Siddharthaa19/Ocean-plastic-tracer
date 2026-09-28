import React, { useState, useRef } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { MapView } from '../components/MapView';
import { LayerControl, ActiveLayers } from '../components/LayerControl';
import { NavigationId, TimelineStep } from '../types';
import {
  MapPin,
  Compass,
  ArrowRight,
  ShieldCheck,
  Navigation,
  Clock,
  AlertTriangle,
  Layers,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface OverviewProps {
  onNavigate: (id: NavigationId) => void;
}

export const OverviewPage: React.FC<OverviewProps> = ({ onNavigate }) => {
  const [timelineStep, setTimelineStep] = useState<TimelineStep>('NOW');
  const [layers, setLayers] = useState<ActiveLayers>({
    aiDetection: true,
    predictedDrift: true,
    accumulationHotspots: true,
    oceanCurrents: false,
    wind: false,
    verificationPoints: true, // Show 📍 BEST PLACE TO CHECK green pin on Overview
  });

  const mapSectionRef = useRef<HTMLDivElement>(null);

  const handleToggleLayer = (key: keyof ActiveLayers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleScrollToMap = () => {
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const timelineSteps: { id: TimelineStep; label: string }[] = [
    { id: 'NOW', label: 'NOW' },
    { id: '24H', label: '24H' },
    { id: '48H', label: '48H' },
    { id: '72H', label: '72H' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto select-none space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#071A33] tracking-tight uppercase">
          Marine Debris Situation Overview
        </h1>
        <p className="text-sm text-slate-500 font-normal mt-1">
          Current marine debris situation, movement forecast, and recommended field action.
        </p>
      </div>

      {/* SECTION 1 — HERO */}
      <HeroBanner onNavigate={onNavigate} onExploreMap={handleScrollToMap} />

      {/* SECTION 2 — CURRENT SITUATION */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EAF8FA] text-[#0878D1] flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#071A33]">Current Situation</h2>
              <p className="text-xs text-slate-500">Summary of detected floating marine debris</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF9800]/10 border border-[#FF9800]/30 text-[#D97706] text-xs font-extrabold">
            <span className="w-2 h-2 rounded-full bg-[#FF9800] animate-pulse" />
            Needs Field Check
          </span>
        </div>

        {/* 4 Core Data Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#F5F9FC] border border-slate-200/70">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-extrabold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5 text-[#0878D1]" />
              Detected Area
            </div>
            <div className="text-2xl font-black text-[#071A33]">4.8 km²</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Floating debris patch</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F9FC] border border-slate-200/70">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-extrabold uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5 text-[#24C6C5]" />
              Location
            </div>
            <div className="text-base font-extrabold text-[#071A33] leading-snug">Arabian Sea</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Kerala Coast</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F9FC] border border-slate-200/70">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-extrabold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#18B77A]" />
              Detection Confidence
            </div>
            <div className="text-2xl font-black text-[#18B77A]">86%</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">High detection match</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F9FC] border border-slate-200/70">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-extrabold uppercase tracking-wider mb-2">
              <Navigation className="w-3.5 h-3.5 text-[#168BE8]" />
              Movement
            </div>
            <div className="text-base font-extrabold text-[#071A33] leading-snug">Northeast</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">24–48 hrs trajectory</div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — MAIN MARINE DEBRIS MAP (SITUATION SUMMARY MAP) */}
      <section ref={mapSectionRef} className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#0878D1]" />
              <h2 className="text-lg font-extrabold text-[#071A33] tracking-tight">
                Executive Situation Map
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Clear 5-second overview: Detection point 🔴 → Drift trajectory 🔵 → Coastal Hotspots 🟠 → Best Place to Check 🟢
            </p>
          </div>
        </div>

        {/* Large Visually Dominant Map Canvas with Executive Legend Overlay */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner">
          <MapView layers={layers} currentStep={timelineStep} onNavigate={onNavigate} className="h-[520px] sm:h-[580px]" />

          {/* Compact Collapsible Layers Control */}
          <div className="absolute top-3 left-3 z-[400]">
            <LayerControl layers={layers} onToggleLayer={handleToggleLayer} />
          </div>

          {/* Executive Situation Map 4-Key Legend Overlay (Bottom Bar) */}
          <div className="absolute bottom-4 left-4 right-4 z-[400] hidden sm:flex items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-xl text-white text-xs shadow-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-extrabold">1. DETECTED:</span>
              <span className="text-slate-300">Debris Patch (4.8 km²)</span>
            </div>

            <div className="w-px h-4 bg-slate-700" />

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]" />
              <span className="font-extrabold">2. TRAJECTORY:</span>
              <span className="text-slate-300">31 km Northeast</span>
            </div>

            <div className="w-px h-4 bg-slate-700" />

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="font-extrabold">3. ACCUMULATION:</span>
              <span className="text-slate-300">Kerala Shelf (Zone A)</span>
            </div>

            <div className="w-px h-4 bg-slate-700" />

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-extrabold">4. ACTION:</span>
              <span className="text-emerald-400 font-black">Check 14 km Offshore</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — WHAT HAPPENS NEXT & SECTION 5 — RECOMMENDED ACTION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* SECTION 4 — WHAT HAPPENS NEXT (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#168BE8]" />
                <h3 className="text-base font-extrabold text-[#071A33]">
                  Where could it move next?
                </h3>
              </div>
              <button
                onClick={() => onNavigate('drift')}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#0878D1] hover:text-[#0766B3] transition-colors cursor-pointer"
              >
                <span>View Full Forecast</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Movement Parameters */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="p-3 rounded-xl bg-[#F5F9FC] border border-slate-200/70 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  EXPECTED MOVEMENT
                </div>
                <div className="text-xl font-black text-[#0878D1]">31 km</div>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F9FC] border border-slate-200/70 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  DIRECTION
                </div>
                <div className="text-base font-extrabold text-[#071A33]">Northeast</div>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F9FC] border border-slate-200/70 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  TIME WINDOW
                </div>
                <div className="text-base font-extrabold text-[#071A33]">Next 48 hours</div>
              </div>
            </div>

            {/* Simple Visual Timeline */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-xs font-extrabold text-slate-600 mb-3 uppercase tracking-wider flex items-center justify-between">
                <span>Movement Horizon Scrubber</span>
                <span className="text-[#0878D1] lowercase font-normal text-[11px]">click to view map step</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {timelineSteps.map((step) => {
                  const isActive = timelineStep === step.id;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setTimelineStep(step.id)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-[#0878D1] text-white border-[#0878D1] shadow-md shadow-[#0878D1]/30'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {step.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5 — RECOMMENDED ACTION (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#062B5C] to-[#041F44] text-white rounded-2xl p-6 shadow-lg flex flex-col justify-between border border-[#0A3D7F]/60">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#24C6C5]" />
                <h3 className="text-base font-extrabold text-white">Recommended Action</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E35D5D]/20 border border-[#E35D5D]/40 text-[#FF8A8A] text-[10px] font-black uppercase">
                HIGH PRIORITY
              </span>
            </div>

            <h4 className="text-lg font-black text-white leading-snug mb-2">
              Check 14 km offshore from the Kerala coast.
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed font-normal mb-5">
              Checking this area can help confirm the detected debris before it reaches the coast.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">
                  BEST ASSET
                </span>
                <span className="font-extrabold text-white">Boat / Drone</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">
                  PRIORITY
                </span>
                <span className="font-extrabold text-[#24C6C5]">High</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('verification')}
            className="w-full py-3 px-4 rounded-xl bg-[#0878D1] hover:bg-[#168BE8] text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-[#0878D1]/40 transition-all cursor-pointer transform active:scale-95"
          >
            <span>Start Verification</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SECTION 8 — THREE SMALL SUMMARY CARDS */}
      <section className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
                DETECTED AREA
              </div>
              <div className="text-2xl font-black text-[#071A33] mb-1">4.8 km²</div>
            </div>
            <div className="text-xs text-slate-500 font-medium">Floating debris detected</div>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
                EXPECTED MOVEMENT
              </div>
              <div className="text-2xl font-black text-[#0878D1] mb-1">31 km</div>
            </div>
            <div className="text-xs text-slate-500 font-medium">Next 48 hours</div>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
                HOTSPOT RISK
              </div>
              <div className="text-2xl font-black text-[#E35D5D] mb-1">3 zones</div>
            </div>
            <div className="text-xs text-slate-500 font-medium">Areas to watch</div>
          </div>
        </div>

        {/* Subtle demonstration label */}
        <div className="text-center text-[11px] text-slate-400 font-medium pt-2">
          Illustrative demonstration
        </div>
      </section>
    </div>
  );
};
