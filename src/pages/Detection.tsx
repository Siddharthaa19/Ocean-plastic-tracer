import React, { useState } from 'react';
import { Eye, Download, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

export const DetectionPage: React.FC = () => {
  const [selectedBand, setSelectedBand] = useState<'RGB' | 'NIR' | 'SWIR' | 'FCI'>('FCI');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto select-none space-y-6">
      {/* Page Title & One-line Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A33] tracking-tight">
          Where is floating debris?
        </h1>
        <p className="text-sm text-slate-500 font-normal">
          Find and confirm potential ocean plastic slicks from satellite observations.
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-extrabold uppercase text-slate-400">SATELLITE SOURCE</div>
            <div className="text-lg font-black text-[#071A33]">Sentinel-2 A/B</div>
            <div className="text-xs text-slate-500">Multispectral (10m resolution)</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#EAF8FA] text-[#0878D1] flex items-center justify-center font-bold">
            S2
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-extrabold uppercase text-slate-400">LATEST SCENE PASS</div>
            <div className="text-lg font-black text-[#071A33]">27 Sep 2026</div>
            <div className="text-xs text-slate-500">09:20 UTC · Orbit 108</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#EAF8FA] text-[#168BE8] flex items-center justify-center font-bold">
            09:20
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-extrabold uppercase text-slate-400">DETECTION CONFIDENCE</div>
            <div className="text-lg font-black text-[#18B77A]">86% High</div>
            <div className="text-xs text-slate-500">Detected Area: 4.8 km²</div>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-[#18B77A]/15 text-[#18B77A] text-xs font-bold">
            Confirmed
          </div>
        </div>
      </div>

      {/* Main Satellite Scene Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Scene Viewer */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#0878D1]" />
              <span className="text-xs font-extrabold text-[#071A33] uppercase">
                SCENE VIEW (Arabian Sea · Kerala Coast)
              </span>
            </div>

            {/* Band selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              {(['RGB', 'NIR', 'SWIR', 'FCI'] as const).map((band) => (
                <button
                  key={band}
                  onClick={() => setSelectedBand(band)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedBand === band
                      ? 'bg-[#0878D1] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {band} {band === 'FCI' && '(Debris Index)'}
                </button>
              ))}
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden h-[420px] bg-slate-900 border border-slate-200">
            <img
              src="/floating_marine_plastic_debris.jpg"
              alt="Floating Marine Plastic Debris Survey Scene"
              className={`w-full h-full object-cover transition-filter duration-500 ${
                selectedBand === 'FCI'
                  ? 'hue-rotate-90 contrast-125'
                  : selectedBand === 'NIR'
                  ? 'grayscale contrast-150'
                  : selectedBand === 'SWIR'
                  ? 'invert brightness-75'
                  : ''
              }`}
            />

            {/* Slick Box Overlay */}
            <div className="absolute top-1/3 left-1/3 w-48 h-36 border-2 border-dashed border-[#24C6C5] bg-[#24C6C5]/20 rounded-xl p-2 flex flex-col justify-between backdrop-blur-2xs animate-pulse">
              <div className="flex justify-between items-center text-[10px] font-extrabold text-white bg-[#062B5C] px-2 py-0.5 rounded">
                <span>DEBRIS SLICK DET-408</span>
                <span className="text-[#24C6C5]">86% CONF</span>
              </div>
              <div className="text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded self-start">
                Debris Area: 4.8 km²
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Detection Details & Plain Language Actions */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-[#071A33] uppercase">DETECTION SUMMARY</h3>
            <span className="px-2 py-0.5 rounded bg-[#18B77A]/15 text-[#18B77A] text-[10px] font-extrabold">
              Confirmed
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-2.5 rounded-xl bg-[#F5F9FC]">
              <span className="text-slate-500 font-medium">Detection Confidence:</span>
              <span className="font-extrabold text-[#0878D1]">86%</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-[#F5F9FC]">
              <span className="text-slate-500 font-medium">Detected Area:</span>
              <span className="font-extrabold text-slate-800">4.8 km²</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-[#F5F9FC]">
              <span className="text-slate-500 font-medium">Quality Check:</span>
              <span className="font-extrabold text-[#18B77A]">Passed</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-[#F5F9FC]">
              <span className="text-slate-500 font-medium">Cloud Interference:</span>
              <span className="font-bold text-slate-700">4.2% (Low)</span>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button className="w-full py-2.5 rounded-xl bg-[#0878D1] hover:bg-[#0766B3] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer">
              <span>Analyze Scene</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer">
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
