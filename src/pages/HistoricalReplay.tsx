import React, { useState } from 'react';
import { MapView } from '../components/MapView';
import { ActiveLayers } from '../components/LayerControl';
import { History, Info } from 'lucide-react';
import { DEMO_DISCLAIMER_TEXT } from '../data/mockData';

export const HistoricalReplayPage: React.FC = () => {
  const [activeStage, setActiveStage] = useState(2);

  const stages = [
    { num: '01', label: 'INCIDENT REPORT', date: '12 May 2025' },
    { num: '02', label: 'SATELLITE PASS', date: '13 May 2025' },
    { num: '03', label: 'DEBRIS DETECTION', date: '13 May 2025' },
    { num: '04', label: 'DRIFT FORECAST', date: '14 May 2025' },
    { num: '05', label: 'HOTSPOT MAP', date: '15 May 2025' },
    { num: '06', label: 'CLEANUP PLAN', date: '16 May 2025' },
  ];

  const layers: ActiveLayers = {
    aiDetection: true,
    predictedDrift: true,
    accumulationHotspots: true,
    oceanCurrents: true,
    wind: false,
    verificationPoints: true,
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto select-none space-y-6">
      {/* Title & One-line Subtitle */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7666D9]/15 border border-[#7666D9]/30 text-[#7666D9] text-xs font-black uppercase tracking-wider mb-2">
          <History className="w-3.5 h-3.5" />
          DEMONSTRATION · HISTORICAL REPLAY
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A33] tracking-tight">
          What happened during a previous event?
        </h1>
        <p className="text-sm text-slate-500 font-normal">
          Replay past ocean debris incidents step by step.
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {stages.map((st, i) => (
            <button
              key={i}
              onClick={() => setActiveStage(i)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                activeStage === i
                  ? 'bg-[#062B5C] text-white border-[#062B5C] shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-[10px] font-black text-[#24C6C5] mb-0.5">{st.num}</div>
              <div className="text-xs font-extrabold leading-tight">{st.label}</div>
              <div className="text-[10px] text-slate-400 mt-1">{st.date}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Map & Stage Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
          <MapView layers={layers} currentStep="48H" className="h-[480px]" />
        </div>

        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-[#071A33] uppercase border-b border-slate-100 pb-3">
            STAGE {stages[activeStage].num}: {stages[activeStage].label}
          </h3>

          <div className="space-y-3 text-xs text-slate-600">
            <p>
              During this phase, DRIFT-LENS processed Sentinel-2 multispectral passes over the Arabian Sea, identifying candidate floating slicks with a detection confidence score of 89%.
            </p>
            <div className="p-3 rounded-xl bg-[#EAF8FA] border border-[#24C6C5]/30">
              <span className="font-bold text-[#0878D1] block mb-1">Forecast Verification:</span>
              <span className="text-slate-700">
                Predicted 48-hour drift path matched actual shoreline arrival within 1.8 km precision, enabling deployment of coastal recovery barriers.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
