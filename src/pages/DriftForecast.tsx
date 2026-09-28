import React, { useState, useEffect } from 'react';
import { MapView } from '../components/MapView';
import { LayerControl, ActiveLayers } from '../components/LayerControl';
import { DriftTimeline } from '../components/DriftTimeline';
import { TimelineStep } from '../types';
import { DRIFT_TRAJECTORY_DATA } from '../data/mockData';
import {
  Wind,
  Navigation,
  Waves,
  Play,
  Pause,
  ArrowRight,
  Compass,
  Zap,
  Activity,
  MapPin,
  TrendingUp,
} from 'lucide-react';

export const DriftForecastPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<TimelineStep>('48H');
  const [isPlaying, setIsPlaying] = useState(false);
  const [layers, setLayers] = useState<ActiveLayers>({
    aiDetection: true,
    predictedDrift: true,
    accumulationHotspots: false, // Focused ONLY on drift trajectory & physics
    oceanCurrents: true,
    wind: true,
    verificationPoints: false,
  });

  const activeData = DRIFT_TRAJECTORY_DATA[currentStep];

  // Auto-play time simulation cycle
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      const steps: TimelineStep[] = ['NOW', '24H', '48H', '72H'];
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          const currentIndex = steps.indexOf(prev);
          const nextIndex = (currentIndex + 1) % steps.length;
          return steps[nextIndex];
        });
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const stepsList: TimelineStep[] = ['NOW', '24H', '48H', '72H'];

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto select-none space-y-6">
      {/* Page Title & One-line Subtitle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 border border-cyan-500/30 text-[11px] font-black uppercase tracking-wider">
              Ocean Debris Movement
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#071A33] tracking-tight uppercase mt-1">
            Debris Drift Forecast
          </h1>
          <p className="text-sm text-slate-500 font-normal mt-0.5">
            Track expected ocean plastic movement powered by surface currents and wind.
          </p>
        </div>

        {/* Play / Pause Simulation Control */}
        <button
          onClick={() => setIsPlaying((prev) => !prev)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer transform active:scale-95 border ${
            isPlaying
              ? 'bg-[#E35D5D] hover:bg-[#D32F2F] text-white border-[#E35D5D]'
              : 'bg-[#0878D1] hover:bg-[#0766B3] text-white border-[#0878D1]'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isPlaying ? 'PAUSE FORECAST' : 'PLAY FORECAST'}</span>
        </button>
      </div>

      {/* Hydrodynamic Physics Status Header */}
      <div className="bg-gradient-to-r from-[#062B5C] via-[#041F44] to-[#0878D1] text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-[#0A3D7F]/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00E5FF] to-[#0878D1] text-white flex items-center justify-center font-black text-xs shadow-md">
            {currentStep}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                PLANNED MOVEMENT
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-300 font-medium">Bearing: 55° NE</span>
            </div>
            <h2 className="text-lg font-black text-white">{activeData.displacementKm} km Estimated Distance</h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15">
            <span className="text-slate-400 block text-[9px] uppercase font-bold">OCEAN CURRENT</span>
            <span className="font-extrabold text-cyan-300">{activeData.currentSpeedKnots} kn → SE</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15">
            <span className="text-slate-400 block text-[9px] uppercase font-bold">WIND DRIFT</span>
            <span className="font-extrabold text-white">{activeData.windSpeedKmh} km/h → NE</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15">
            <span className="text-slate-400 block text-[9px] uppercase font-bold">MARGIN OF ERROR</span>
            <span className="font-extrabold text-slate-200">±{activeData.uncertaintyRadiusKm} km</span>
          </div>

          <span className="px-3 py-1.5 rounded-xl bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 text-xs font-black uppercase">
            82% Forecast Accuracy
          </span>
        </div>
      </div>

      {/* Main Grid: Map & Scrubber on Left, Physics Gauges & Step Selector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Map View & Scrubber */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm relative">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#0878D1]" />
                <span className="font-black text-[#071A33] uppercase">
                  DEBRIS MOVEMENT MAP
                </span>
              </div>
              <span className="text-[#0878D1] font-bold">Forecast Horizon: {currentStep}</span>
            </div>

            <MapView layers={layers} currentStep={currentStep} className="h-[480px]" />
            <div className="absolute top-14 left-7 z-[400] hidden sm:block">
              <LayerControl
                layers={layers}
                onToggleLayer={(k) => setLayers((p) => ({ ...p, [k]: !p[k] }))}
              />
            </div>
          </div>

          {/* Interactive Timeline Scrubber */}
          <DriftTimeline currentStep={currentStep} onSelectStep={setCurrentStep} />
        </div>

        {/* Right 5 Cols: Hydrodynamic Physics & Horizon Selector */}
        <div className="lg:col-span-5 space-y-4">
          {/* Hydrodynamic Physics Gauges Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-black text-[#071A33] uppercase flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#0878D1]" />
                OCEAN & WIND CONDITIONS ({currentStep})
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                Live Model
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Current Speed */}
              <div className="p-3 rounded-xl bg-[#F5F9FC] border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 font-extrabold uppercase text-[10px]">
                  <Navigation className="w-3.5 h-3.5 text-[#0878D1]" />
                  <span>Ocean Current Speed</span>
                </div>
                <div className="text-lg font-black text-[#071A33]">
                  {activeData.currentSpeedKnots} knots
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">Direction: {activeData.currentDirDeg}° SE</div>
              </div>

              {/* Wind Speed */}
              <div className="p-3 rounded-xl bg-[#F5F9FC] border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 font-extrabold uppercase text-[10px]">
                  <Wind className="w-3.5 h-3.5 text-[#168BE8]" />
                  <span>Surface Wind Speed</span>
                </div>
                <div className="text-lg font-black text-[#071A33]">
                  {activeData.windSpeedKmh} km/h
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">Bearing: {activeData.windDirDeg}° NE</div>
              </div>

              {/* Stokes Drift */}
              <div className="p-3 rounded-xl bg-[#F5F9FC] border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 font-extrabold uppercase text-[10px]">
                  <Waves className="w-3.5 h-3.5 text-[#24C6C5]" />
                  <span>Wave Drift Effect</span>
                </div>
                <div className="text-lg font-black text-[#071A33]">0.4 knots</div>
                <div className="text-[10px] text-slate-500 font-semibold">Wave Height: 1.2 m</div>
              </div>

              {/* Displacement */}
              <div className="p-3 rounded-xl bg-[#F5F9FC] border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 font-extrabold uppercase text-[10px]">
                  <TrendingUp className="w-3.5 h-3.5 text-[#18B77A]" />
                  <span>Displacement</span>
                </div>
                <div className="text-lg font-black text-[#18B77A]">
                  {activeData.displacementKm} km
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">Radius: ±{activeData.uncertaintyRadiusKm} km</div>
              </div>
            </div>

            {/* Trajectory Progress Bar */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1">
                <span>Displacement Progress</span>
                <span className="text-[#0878D1]">{activeData.displacementKm} / 47 km</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00E5FF] via-[#2979FF] to-[#00E676] transition-all duration-500"
                  style={{ width: `${Math.min(100, (activeData.displacementKm / 47) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Time-step Selector */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-black text-[#071A33] uppercase flex items-center justify-between border-b border-slate-100 pb-2">
              <span>FORECAST HORIZON STEPS</span>
              <span className="text-slate-400 font-normal">Click step to view</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {stepsList.map((step) => {
                const isSelected = currentStep === step;
                const d = DRIFT_TRAJECTORY_DATA[step];
                return (
                  <button
                    key={step}
                    onClick={() => setCurrentStep(step)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0878D1] text-white border-[#0878D1] shadow-md'
                        : 'bg-[#F5F9FC] text-[#071A33] border-slate-200/80 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-black mb-0.5">{step} Horizon</div>
                    <div className={`text-[11px] font-bold ${isSelected ? 'text-cyan-200' : 'text-[#0878D1]'}`}>
                      {d.displacementKm} km displacement
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
