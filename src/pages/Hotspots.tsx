import React, { useState } from 'react';
import { MapView } from '../components/MapView';
import { ActiveLayers } from '../components/LayerControl';
import { HOTSPOT_ZONES } from '../data/mockData';
import { HotspotZone } from '../types';
import { Flame, MapPin, ShieldCheck, AlertTriangle, Anchor, Truck, CheckCircle2, FileText, ArrowRight, Maximize, Minimize } from 'lucide-react';

export const HotspotsPage: React.FC = () => {
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotZone>(HOTSPOT_ZONES[0]);
  const [dispatchLogged, setDispatchLogged] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  // Hotspot focused map layers: Drift trajectory OFF, Hotspots ON
  const layers: ActiveLayers = {
    aiDetection: true,
    predictedDrift: false, // Turn off drift lines to distinguish from Drift Forecast
    accumulationHotspots: true, // Primary focus
    oceanCurrents: false,
    wind: false,
    verificationPoints: true,
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto select-none space-y-6">
      {/* Title & Distinct Coastal Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/30 text-[11px] font-black uppercase tracking-wider">
              High Risk Accumulation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#071A33] tracking-tight uppercase mt-1">
            Debris Accumulation Hotspots
          </h1>
          <p className="text-sm text-slate-500 font-normal mt-0.5">
            Find coastal areas where floating ocean plastic will gather, and plan cleanup response.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setDispatchLogged(!dispatchLogged)}
            className={`px-4 py-2.5 rounded-xl text-xs font-black shadow-sm flex items-center gap-2 transition-all cursor-pointer ${
              dispatchLogged 
                ? 'bg-emerald-600 text-white' 
                : 'bg-[#062B5C] hover:bg-[#041F44] text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{dispatchLogged ? 'CLEANUP PLAN ACTIVE ✓' : 'CREATE CLEANUP PLAN'}</span>
          </button>
        </div>
      </div>

      {/* Selected Hotspot Risk & Intercept Summary Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E1B4B] text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 text-white flex items-center justify-center font-black text-base shadow-md">
            0{selectedHotspot.rank}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                HOTSPOT ACCUMULATION ZONE
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-medium">
                Lat {selectedHotspot.lat}°N, Lng {selectedHotspot.lng}°E
              </span>
            </div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              {selectedHotspot.name}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/10">
            <span className="text-slate-400 block text-[9px] uppercase font-bold">ESTIMATED LANDFALL</span>
            <span className="font-black text-amber-300 text-sm">~{selectedHotspot.forecastArrivalHours} Hours</span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/10">
            <span className="text-slate-400 block text-[9px] uppercase font-bold">ACCUMULATION AREA</span>
            <span className="font-black text-cyan-300 text-sm">{selectedHotspot.estimatedAreaKm2} km²</span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/10">
            <span className="text-slate-400 block text-[9px] uppercase font-bold">COASTAL ACCESS</span>
            <span className="font-black text-emerald-400 text-sm">{selectedHotspot.accessibility}</span>
          </div>

          <span
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase shadow-sm ${
              selectedHotspot.priority === 'High'
                ? 'bg-red-600 text-white'
                : 'bg-amber-600 text-white'
            }`}
          >
            {selectedHotspot.priority} Priority
          </span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Map View */}
        <div className={isMapFullscreen ? "fixed inset-4 z-[9999] rounded-2xl overflow-hidden shadow-2xl bg-slate-950 flex flex-col p-4" : "lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-3"}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-black text-[#071A33] uppercase">
                COASTAL ACCUMULATION TARGET MAP
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Focus: Zone 0{selectedHotspot.rank} ({selectedHotspot.name})
              </span>
              <button
                onClick={() => setIsMapFullscreen(!isMapFullscreen)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center"
                title="Toggle Fullscreen"
              >
                {isMapFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <MapView
            layers={layers}
            currentStep="24H"
            selectedHotspotId={selectedHotspot.id}
            onSelectHotspot={setSelectedHotspot}
            className={isMapFullscreen ? "flex-1 w-full h-full" : "h-[520px]"}
          />

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>Red/Orange highlighted zones indicate high debris trapping probability.</span>
            </div>
            <span className="font-bold text-[#0878D1]">Click markers to focus</span>
          </div>
        </div>

        {/* Right 5 Cols: Containment Action Plan & Ranked Hotspots List */}
        <div className="lg:col-span-5 space-y-5">
          {/* Actionable Containment & Intercept Plan Card */}
          <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none" />
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-black text-[#071A33] uppercase flex items-center gap-2">
                <Anchor className="w-4 h-4 text-amber-600" />
                CONTAINMENT & CLEANUP ACTION PLAN
              </h3>
              <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded">
                Zone 0{selectedHotspot.rank} Response
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Containment Strategy</span>
                <span className="font-black text-[#071A33] block mt-0.5">{selectedHotspot.recommendedMethod}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Required Gear</span>
                <span className="font-black text-slate-800 block mt-0.5">Type-II Harbor Booms + Skimmers</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 text-white text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Coastal Impact Window
                </span>
                <span className="text-slate-300 font-mono">T-{selectedHotspot.forecastArrivalHours}h</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Debris expected to reach coastal bottleneck near <strong className="text-white">{selectedHotspot.name}</strong>. Deploying intercept barriers before high tide reduces cleanup costs by up to 75%.
              </p>
            </div>
          </div>

          {/* Ranked Hotspots Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-xs font-black text-[#071A33] uppercase flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500" />
                RANKED ACCUMULATION TARGETS
              </h3>
              <span className="text-xs text-slate-500 font-semibold">Sorted by Urgency</span>
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
                        ? 'bg-white border-amber-500 ring-2 ring-amber-500/20 shadow-md transform -translate-y-0.5'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                            isSelected ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-800 text-white'
                          }`}
                        >
                          0{spot.rank}
                        </span>
                        <div>
                          <h4 className="text-sm font-black text-[#071A33]">{spot.name}</h4>
                          <div className="text-[11px] text-slate-500 font-medium">
                            Arrival: <strong className="text-slate-800">~{spot.forecastArrivalHours} hrs</strong>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          spot.priority === 'High'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {spot.priority} Priority
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-xl bg-slate-50 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-black block">
                          Confidence
                        </span>
                        <span className="font-extrabold text-[#0878D1]">{spot.confidence}%</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-black block">
                          Area
                        </span>
                        <span className="font-extrabold text-slate-800">{spot.estimatedAreaKm2} km²</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-black block">
                          Access
                        </span>
                        <span className="font-extrabold text-emerald-600">{spot.accessibility}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-slate-600 font-bold truncate max-w-[200px]">
                        Method: <span className="text-slate-800">{spot.recommendedMethod}</span>
                      </span>

                      <button className="font-black text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer">
                        <span>{isSelected ? 'Selected 📍' : 'Focus Zone →'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

