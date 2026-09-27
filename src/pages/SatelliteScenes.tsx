import React from 'react';
import { SATELLITE_SCENES } from '../data/mockData';
import { Eye } from 'lucide-react';

export const SatelliteScenesPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto select-none space-y-6">
      {/* Title & One-line Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A33] tracking-tight">
          What does the satellite see?
        </h1>
        <p className="text-sm text-slate-500 font-normal">
          Browse satellite imagery passes over target ocean regions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SATELLITE_SCENES.map((scene) => (
          <div
            key={scene.id}
            className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 overflow-hidden bg-slate-900">
                <img
                  src={scene.thumbnailUrl}
                  alt={scene.satellite}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-[#062B5C] text-[#24C6C5] px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">
                  {scene.satellite}
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                  Cloud: {scene.cloudCoverPct}%
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-extrabold text-[#071A33]">{scene.id}</h3>
                  <span className="text-xs font-black text-[#18B77A]">FCI {scene.fciIndex}</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sensor:</span>
                    <span className="font-bold text-slate-800">{scene.sensorType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Acquired:</span>
                    <span className="font-semibold text-slate-700">{scene.acquisitionDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Resolution:</span>
                    <span className="font-bold text-slate-800">{scene.resolutionMeters}m per pixel</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <button className="w-full py-2 bg-[#0878D1] text-white text-xs font-bold rounded-xl hover:bg-[#0766B3] flex items-center justify-center gap-2 cursor-pointer">
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Satellite Scene</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
