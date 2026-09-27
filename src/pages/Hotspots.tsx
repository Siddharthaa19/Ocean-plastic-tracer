import React, { useState } from 'react';
import { MapView } from '../components/MapView';
import { ActiveLayers } from '../components/LayerControl';
import { HOTSPOT_ZONES } from '../data/mockData';
import { HotspotZone } from '../types';
import { Flame, ArrowRight } from 'lucide-react';

export const HotspotsPage: React.FC = () => {
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotZone>(HOTSPOT_ZONES[0]);
  const layers: ActiveLayers = {
    aiDetection: true,
    predictedDrift: true,
    accumulationHotspots: true,
    oceanCurrents: true,
    wind: false,
    verificationPoints: false,
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto select-none space-y-6">
      {/* Title & One-line Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A33] tracking-tight">
          Where could debris accumulate?
        </h1>
        <p className="text-sm text-slate-500 font-normal">
          Identify coastal areas where floating debris is likely to collect.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Map View */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
          <MapView
            layers={layers}
            currentStep="24H"
            selectedHotspotId={selectedHotspot.id}
            onSelectHotspot={setSelectedHotspot}
            className="h-[520px]"
          />
        </div>

        {/* Right 5 Cols: Ranked Hotspots List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-xs font-extrabold text-[#071A33] uppercase flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#E35D5D]" />
              TOP PREDICTED ACCUMULATION ZONES
            </h3>
            <span className="text-xs text-slate-500 font-semibold">Ranked by Priority</span>
          </div>

          <div className="space-y-3">
            {HOTSPOT_ZONES.map((spot) => {
              const isSelected = selectedHotspot.id === spot.id;
              return (
                <div
                  key={spot.id}
                  onClick={() => setSelectedHotspot(spot)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#0878D1] ring-2 ring-[#0878D1]/20 shadow-md'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-xl bg-[#062B5C] text-white flex items-center justify-center font-black text-xs">
                        0{spot.rank}
                      </span>
                      <div>
                        <h4 className="text-sm font-extrabold text-[#071A33]">{spot.name}</h4>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Expected Arrival: <strong>~{spot.forecastArrivalHours} hrs</strong>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        spot.priority === 'High'
                          ? 'bg-[#E35D5D]/15 text-[#E35D5D]'
                          : 'bg-[#E9A72F]/15 text-[#E9A72F]'
                      }`}
                    >
                      {spot.priority} Priority
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-xl bg-[#F5F9FC] text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Confidence
                      </span>
                      <span className="font-extrabold text-[#0878D1]">{spot.confidence}%</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Estimated Area
                      </span>
                      <span className="font-extrabold text-slate-800">{spot.estimatedAreaKm2} km²</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Access
                      </span>
                      <span className="font-bold text-[#18B77A]">{spot.accessibility}</span>
                    </div>
                  </div>

                  <button className="text-xs font-bold text-[#0878D1] flex items-center gap-1 hover:underline cursor-pointer">
                    <span>View on Map</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
