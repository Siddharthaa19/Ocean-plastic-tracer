import React, { useState } from 'react';
import { MapView } from '../components/MapView';
import { LayerControl, ActiveLayers } from '../components/LayerControl';
import { DriftTimeline } from '../components/DriftTimeline';
import { TimelineStep } from '../types';
import { DRIFT_TRAJECTORY_DATA } from '../data/mockData';
import { Wind, Navigation, Waves, ChevronDown, ChevronUp } from 'lucide-react';

export const DriftForecastPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<TimelineStep>('48H');
  const [showModelDetails, setShowModelDetails] = useState(false);
  const [layers, setLayers] = useState<ActiveLayers>({
    aiDetection: true,
    predictedDrift: true,
    accumulationHotspots: true,
    oceanCurrents: true,
    wind: true,
    verificationPoints: false,
  });

  const activeData = DRIFT_TRAJECTORY_DATA[currentStep];

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto select-none space-y-6">
      {/* Title & One-line Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A33] tracking-tight">
          Where could it move next?
        </h1>
        <p className="text-sm text-slate-500 font-normal">
          See where detected debris may move over the next 72 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Map & Scrubber */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm relative">
            <MapView layers={layers} currentStep={currentStep} className="h-[480px]" />
            <div className="absolute top-7 left-7 z-[400] hidden sm:block">
              <LayerControl
                layers={layers}
                onToggleLayer={(k) => setLayers((p) => ({ ...p, [k]: !p[k] }))}
              />
            </div>
          </div>
          <DriftTimeline currentStep={currentStep} onSelectStep={setCurrentStep} />
        </div>

        {/* Right 4 Cols: Ocean Conditions Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-[#071A33] uppercase border-b border-slate-100 pb-3">
              OCEAN & WIND CONDITIONS ({currentStep})
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#F5F9FC] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#0878D1]" />
                  <span className="text-xs font-bold text-slate-700">CURRENT SPEED & DIR</span>
                </div>
                <span className="text-xs font-black text-[#071A33]">
                  {activeData.currentSpeedKnots} kn → SE
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F9FC] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-[#168BE8]" />
                  <span className="text-xs font-bold text-slate-700">WIND SPEED & DIR</span>
                </div>
                <span className="text-xs font-black text-[#071A33]">
                  {activeData.windSpeedKmh} km/h → NE
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F9FC] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Waves className="w-4 h-4 text-[#24C6C5]" />
                  <span className="text-xs font-bold text-slate-700">WAVE HEIGHT</span>
                </div>
                <span className="text-xs font-black text-[#071A33]">1.2 m</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Forecast Confidence:</span>
                <span className="font-black text-[#0878D1]">82%</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Expected Movement:</span>
                <span className="font-black text-slate-900">{activeData.displacementKm} km</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Accumulation Risk:</span>
                <span className="font-extrabold text-[#18B77A]">High</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
