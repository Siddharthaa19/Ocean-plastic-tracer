import React, { useState, useEffect } from 'react';
import { MapView } from '../components/MapView';
import { ActiveLayers } from '../components/LayerControl';
import {
  History,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Info,
  CheckCircle2,
  ArrowRight,
  Maximize,
  Minimize,
} from 'lucide-react';

interface StageData {
  num: string;
  name: string;
  title: string;
  date: string;
  type: 'OBSERVED' | 'RECONSTRUCTED';
  typeLabel: string;
  subtitle: string;
  heading: string;
  description: string;
  keyInfo: { label: string; value: string; highlight?: boolean }[];
  layers: ActiveLayers;
  showIncidentOnly?: boolean;
  showSatelliteOverlay?: boolean;
  legend: { label: string; color: string; iconSymbol: string }[];
}

export const HistoricalReplayPage: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  const stages: StageData[] = [
    {
      num: '01',
      name: 'INCIDENT',
      title: 'INCIDENT REPORT',
      date: '12 May 2025',
      type: 'OBSERVED',
      typeLabel: 'Observed Event',
      subtitle: 'What started the event?',
      heading: 'MSC ELSA 3 Incident',
      description:
        'Historical marine incident reported off the Kerala Coast in the Arabian Sea, creating a potential source for floating surface debris.',
      keyInfo: [
        { label: 'Incident Name', value: 'MSC ELSA 3' },
        { label: 'Event Category', value: 'Historical Marine Incident' },
        { label: 'Date Reported', value: '12 May 2025' },
        { label: 'Location', value: 'Arabian Sea · Kerala Coast' },
      ],
      layers: {
        aiDetection: false,
        predictedDrift: false,
        accumulationHotspots: false,
        oceanCurrents: false,
        wind: false,
        verificationPoints: false,
      },
      showIncidentOnly: true,
      legend: [{ label: 'Incident Location (MSC ELSA 3)', color: '#00E5FF', iconSymbol: '🚢' }],
    },
    {
      num: '02',
      name: 'SATELLITE OBSERVATION',
      title: 'SATELLITE PASS',
      date: '13 May 2025',
      type: 'OBSERVED',
      typeLabel: 'Observed Pass',
      subtitle: 'Satellite scene captured over the marine area.',
      heading: 'Sentinel-2 A/B Satellite Scene',
      description:
        'Sentinel-2 constellation captured clear 10m multispectral imagery across the Arabian Sea coastal sector following the incident.',
      keyInfo: [
        { label: 'Satellite Platform', value: 'Sentinel-2 A/B' },
        { label: 'Observation Date', value: '13 May 2025' },
        { label: 'Spatial Resolution', value: '10 m' },
        { label: 'Scene Coverage Area', value: '1,200 km²' },
      ],
      layers: {
        aiDetection: false,
        predictedDrift: false,
        accumulationHotspots: false,
        oceanCurrents: false,
        wind: false,
        verificationPoints: false,
      },
      showSatelliteOverlay: true,
      legend: [{ label: 'Sentinel-2 Satellite Scene Boundary', color: '#00E5FF', iconSymbol: '📡' }],
    },
    {
      num: '03',
      name: 'DEBRIS DETECTION',
      title: 'DEBRIS IDENTIFIED',
      date: '13 May 2025',
      type: 'OBSERVED',
      typeLabel: 'Observed Detection',
      subtitle: 'Where was floating debris identified?',
      heading: 'Debris Detected from Satellite',
      description:
        'Multispectral analysis detected floating material slicks off the Kerala shoreline with high confidence.',
      keyInfo: [
        { label: 'Detected Area', value: '4.8 km²', highlight: true },
        { label: 'Detection Confidence', value: '86%' },
        { label: 'Location', value: 'Arabian Sea · Kerala Coast' },
        { label: 'Slick Status', value: 'Verified Surface Feature' },
      ],
      layers: {
        aiDetection: true,
        predictedDrift: false,
        accumulationHotspots: false,
        oceanCurrents: false,
        wind: false,
        verificationPoints: false,
      },
      legend: [{ label: 'Detected Debris (4.8 km²)', color: '#EF4444', iconSymbol: '🔴' }],
    },
    {
      num: '04',
      name: 'DRIFT',
      title: 'DRIFT TRAJECTORY',
      date: '14 May 2025',
      type: 'RECONSTRUCTED',
      typeLabel: 'Demonstration Replay',
      subtitle: 'Reconstructed drift path driven by ocean currents and wind drift.',
      heading: 'Where Did It Move?',
      description:
        'Debris movement trajectory reconstructed over a 72-hour period toward the northeast along coastal surface currents.',
      keyInfo: [
        { label: 'Expected Movement', value: '31 km', highlight: true },
        { label: 'Direction', value: 'Northeast (NE)' },
        { label: 'Forecast Window', value: '72 hours' },
        { label: 'Primary Drivers', value: 'Surface Currents & Wind' },
      ],
      layers: {
        aiDetection: true,
        predictedDrift: true,
        accumulationHotspots: false,
        oceanCurrents: false,
        wind: false,
        verificationPoints: false,
      },
      legend: [
        { label: 'Detected Debris', color: '#EF4444', iconSymbol: '🔴' },
        { label: 'Reconstructed Drift Path (24h / 48h / 72h)', color: '#00E5FF', iconSymbol: '—' },
      ],
    },
    {
      num: '05',
      name: 'HOTSPOTS',
      title: 'ACCUMULATION ZONES',
      date: '15 May 2025',
      type: 'RECONSTRUCTED',
      typeLabel: 'Reconstructed Hotspots',
      subtitle: 'Accumulation zones where debris was expected to gather.',
      heading: 'Where Did Debris Collect?',
      description:
        'Hydrodynamic coastal fronts created high-density accumulation zones along shelf regions near coastal settlements.',
      keyInfo: [
        { label: 'High Risk Zones', value: '2–3 Coastal Sectors', highlight: true },
        { label: 'Top Risk Location', value: '01 Malipuram Front' },
        { label: 'Estimated Area', value: '1.8 km²' },
        { label: 'Expected Arrival', value: '~48 hours' },
      ],
      layers: {
        aiDetection: true,
        predictedDrift: true,
        accumulationHotspots: true,
        oceanCurrents: false,
        wind: false,
        verificationPoints: false,
      },
      legend: [
        { label: 'Detected Debris', color: '#EF4444', iconSymbol: '🔴' },
        { label: 'Reconstructed Drift Path', color: '#00E5FF', iconSymbol: '—' },
        { label: 'Accumulation Hotspot Zone', color: '#F97316', iconSymbol: '🟠' },
      ],
    },
    {
      num: '06',
      name: 'FIELD RESPONSE',
      title: 'VERIFICATION PLAN',
      date: '16 May 2025',
      type: 'RECONSTRUCTED',
      typeLabel: 'Field Response Scenario',
      subtitle: 'Target locations for physical verification and response assets.',
      heading: 'Where Should Teams Check?',
      description:
        'Field verification points where boats, drones, or response teams can confirm debris presence prior to deployment.',
      keyInfo: [
        { label: 'Target Location', value: '14 km Offshore · Kerala Coast', highlight: true },
        { label: 'Recommended Asset', value: 'Boat / Drone' },
        { label: 'Key Action', value: 'Confirm presence before recovery' },
        { label: 'Priority Status', value: 'Best Place to Check' },
      ],
      layers: {
        aiDetection: true,
        predictedDrift: true,
        accumulationHotspots: true,
        oceanCurrents: false,
        wind: false,
        verificationPoints: true,
      },
      legend: [
        { label: 'Detected Debris', color: '#EF4444', iconSymbol: '🔴' },
        { label: 'Reconstructed Drift Path', color: '#00E5FF', iconSymbol: '—' },
        { label: 'Accumulation Hotspot Zone', color: '#F97316', iconSymbol: '🟠' },
        { label: 'Best Place to Check (Verification Pin)', color: '#10B981', iconSymbol: '📍' },
      ],
    },
  ];

  const currentStage = stages[activeStageIndex];

  // Auto-play timer logic
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStageIndex((prev) => {
          if (prev >= stages.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, stages.length]);

  const handleNext = () => {
    setActiveStageIndex((prev) => Math.min(prev + 1, stages.length - 1));
  };

  const handlePrev = () => {
    setActiveStageIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto select-none space-y-6">
      {/* 1. Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0878D1]/10 border border-[#0878D1]/30 text-[#0878D1] text-xs font-black uppercase tracking-wider mb-2">
          <History className="w-3.5 h-3.5" />
          HISTORICAL REPLAY
        </div>
        <h1 className="text-xl sm:text-3xl font-extrabold text-[#071A33] tracking-tight leading-tight">
          WHAT HAPPENED DURING A PREVIOUS EVENT?
        </h1>
        <p className="text-sm text-slate-500 font-normal mt-0.5">
          Replay a marine debris event from first observation to predicted movement and response.
        </p>
      </div>

      {/* 2. Stage Navigation Bar (6 Horizontal Stages) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {stages.map((st, i) => {
            const isActive = activeStageIndex === i;
            const isCompleted = activeStageIndex > i;
            return (
              <button
                key={st.num}
                onClick={() => {
                  setIsPlaying(false);
                  setActiveStageIndex(i);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  isActive
                    ? 'bg-[#071A33] text-white border-[#071A33] shadow-md ring-2 ring-[#00E5FF]/40'
                    : isCompleted
                    ? 'bg-slate-50/90 text-slate-800 border-slate-300 hover:bg-slate-100'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-black tracking-wider ${
                      isActive ? 'text-[#00E5FF]' : 'text-slate-400'
                    }`}
                  >
                    {st.num}
                  </span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
                <div className="text-xs font-extrabold leading-snug uppercase tracking-tight">{st.name}</div>
                <div
                  className={`text-[10px] font-semibold mt-1 ${
                    isActive ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  {st.date}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Replay Area (Map + Info Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Map & Replay Controls */}
        <div className={isMapFullscreen ? "fixed inset-4 z-[9999] rounded-2xl overflow-hidden shadow-2xl bg-slate-950 flex flex-col p-4" : "lg:col-span-8 space-y-3"}>
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-sm relative flex-1 flex flex-col">
            <button
              onClick={() => setIsMapFullscreen(!isMapFullscreen)}
              className="absolute top-4 right-4 z-[400] p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center shadow-md"
              title="Toggle Fullscreen"
            >
              {isMapFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
            <MapView
              layers={currentStage.layers}
              currentStep="48H"
              showIncidentOnly={currentStage.showIncidentOnly}
              showSatelliteOverlay={currentStage.showSatelliteOverlay}
              className={isMapFullscreen ? "flex-1 w-full h-full" : "h-[280px] sm:h-[400px] lg:h-[520px]"}
            />

            {/* Stage-Specific Map Legend Overlay */}
            <div className="absolute bottom-6 left-6 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-xl max-w-[280px]">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-800 pb-1">
                STAGE {currentStage.num} LEGEND
              </div>
              <div className="space-y-1.5">
                {currentStage.legend.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] font-bold text-white">
                    <span className="text-xs shrink-0">{item.iconSymbol}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Replay Controls Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-sm flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              disabled={activeStageIndex === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 font-extrabold text-xs hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>PREVIOUS</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-white font-black text-xs shadow-md transition-all cursor-pointer active:scale-95 ${
                  isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#0878D1] hover:bg-[#0766B3]'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    <span>PAUSE REPLAY</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>PLAY REPLAY</span>
                  </>
                )}
              </button>

              <span className="text-xs font-black text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">
                Stage {activeStageIndex + 1} of {stages.length}
              </span>
            </div>

            <button
              onClick={() => {
                if (activeStageIndex === stages.length - 1) {
                  setActiveStageIndex(0);
                  setIsPlaying(false);
                } else {
                  handleNext();
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#071A33] hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm cursor-pointer transition-all active:scale-95"
            >
              <span>{activeStageIndex === stages.length - 1 ? 'RESTART' : 'NEXT'}</span>
              {activeStageIndex === stages.length - 1 ? (
                <RotateCcw className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Stage Information Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-5">
          {/* Header & Badges */}
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase text-[#0878D1] tracking-wider">
                STAGE {currentStage.num} OF 06
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  currentStage.type === 'OBSERVED'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-amber-50 text-amber-700 border border-amber-300'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    currentStage.type === 'OBSERVED' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                {currentStage.type}
              </span>
            </div>

            <h2 className="text-lg font-black text-[#071A33] tracking-tight">{currentStage.heading}</h2>
            <p className="text-xs font-semibold text-[#0878D1]">{currentStage.subtitle}</p>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed font-normal">{currentStage.description}</p>

          {/* Key Information Box */}
          <div className="space-y-2.5 bg-slate-50 rounded-xl border border-slate-200/80 p-3.5">
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              KEY INFORMATION
            </div>

            <div className="space-y-2">
              {currentStage.keyInfo.map((info, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-200/50 last:border-0 last:pb-0">
                  <span className="text-slate-500 font-semibold">{info.label}</span>
                  <span
                    className={`font-black ${
                      info.highlight ? 'text-[#0878D1] text-sm font-extrabold' : 'text-[#071A33]'
                    }`}
                  >
                    {info.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Scientific Credibility Disclaimer Label */}
          <div className="p-2.5 rounded-xl bg-slate-100/80 border border-slate-200 text-[10px] text-slate-500 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              {currentStage.type === 'OBSERVED'
                ? 'Observation data reflects verified historical satellite passes.'
                : 'Reconstructed data represents illustrative demonstration simulation.'}
            </span>
          </div>

          {/* Bottom Action Button */}
          <button
            onClick={() => {
              if (activeStageIndex === stages.length - 1) {
                setActiveStageIndex(0);
                setIsPlaying(false);
              } else {
                handleNext();
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0878D1] hover:bg-[#0766B3] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer active:scale-95"
          >
            <span>
              {activeStageIndex === stages.length - 1
                ? 'RESTART REPLAY'
                : `GO TO STAGE ${stages[activeStageIndex + 1]?.num}: ${stages[activeStageIndex + 1]?.name}`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
