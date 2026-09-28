import React, { useState } from 'react';
import {
  Eye,
  Download,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Layers,
  CheckCircle2,
  Sparkles,
  Info,
  ShieldCheck,
  MapPin,
  Calendar,
} from 'lucide-react';

export const DetectionPage: React.FC = () => {
  const [selectedBand, setSelectedBand] = useState<'RGB' | 'NIR' | 'SWIR' | 'FCI'>('FCI');
  const [showObsDetails, setShowObsDetails] = useState(false);
  const [showWhyDetected, setShowWhyDetected] = useState(false);
  const [showTechDetails, setShowTechDetails] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto select-none space-y-6">
      {/* 1. PAGE HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#071A33] tracking-tight uppercase">
          Where is floating debris?
        </h1>
        <p className="text-sm text-slate-500 font-normal mt-1">
          Review the latest satellite scene and confirm detected floating debris.
        </p>
      </div>

      {/* 2. TOP SUMMARY ROW (3 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* CARD 1: SATELLITE SOURCE */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              SATELLITE SOURCE
            </div>
            <div className="text-lg font-black text-[#071A33] mt-0.5">Sentinel-2 A/B</div>
            <div className="text-xs text-slate-500 font-medium">10 m resolution</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#EAF8FA] text-[#0878D1] flex items-center justify-center font-extrabold text-xs border border-[#24C6C5]/30">
            S2
          </div>
        </div>

        {/* CARD 2: LATEST SCENE */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              LATEST SCENE
            </div>
            <div className="text-lg font-black text-[#071A33] mt-0.5">27 Sep 2026</div>
            <div className="text-xs text-slate-500 font-medium">09:20 UTC</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#EAF8FA] text-[#168BE8] flex items-center justify-center font-bold text-xs border border-[#24C6C5]/30">
            <Calendar className="w-5 h-5 text-[#0878D1]" />
          </div>
        </div>

        {/* CARD 3: DETECTION RESULT */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              DETECTION RESULT
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-black text-[#18B77A]">86% confidence</span>
            </div>
            <div className="text-xs text-slate-500 font-medium">4.8 km² detected</div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#18B77A]/15 text-[#18B77A] text-[10px] font-extrabold uppercase tracking-wide border border-[#18B77A]/30">
            HIGH CONFIDENCE
          </span>
        </div>
      </div>

      {/* 3. MAIN CONTENT GRID (Scene View & Detection Result) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT 8 COLS (~67%): Large Satellite Scene Viewer */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#0878D1]" />
              <h2 className="text-xs font-black text-[#071A33] uppercase tracking-wider">
                SCENE VIEW (ARABIAN SEA · KERALA COAST)
              </h2>
            </div>

            {/* Visually secondary Spectral Band selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-bold">
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

          {/* Large Satellite Image Container */}
          <div className="relative rounded-2xl overflow-hidden h-[460px] sm:h-[520px] bg-slate-950 border border-slate-300/80 shadow-inner group select-none">
            <img
              src="/floating_marine_plastic_debris.jpg"
              alt="Floating Marine Debris Satellite Observation"
              className={`w-full h-full object-cover transition-all duration-500 ${
                selectedBand === 'FCI'
                  ? 'hue-rotate-90 contrast-125'
                  : selectedBand === 'NIR'
                  ? 'grayscale contrast-150'
                  : selectedBand === 'SWIR'
                  ? 'invert brightness-75'
                  : ''
              }`}
            />

            {/* Highlighted Boundary & Detection Overlay Mask */}
            <div className="absolute top-[28%] left-[26%] w-[48%] h-[42%] border-2 border-dashed border-[#EF4444] bg-[#EF4444]/20 rounded-2xl p-3 flex flex-col justify-between backdrop-blur-2xs shadow-2xl pointer-events-none">
              <span className="w-3 h-3 rounded-full bg-[#EF4444] animate-ping absolute -top-1.5 -left-1.5" />
            </div>

            {/* Clean Simple Overlay Box */}
            <div className="absolute top-[32%] left-[28%] z-10 bg-slate-900/90 backdrop-blur-md border border-[#EF4444]/80 text-white rounded-xl p-3.5 shadow-2xl space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-pulse" />
                <span className="text-xs font-black tracking-wider text-white uppercase">
                  DEBRIS DETECTED
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-200">
                Confidence: <strong className="text-[#18B77A]">86%</strong>
              </div>
              <div className="text-xs font-semibold text-slate-200">
                Area: <strong className="text-cyan-300">4.8 km²</strong>
              </div>
            </div>

            {/* Minimal Detection Legend (Bottom of Scene) */}
            <div className="absolute bottom-3 left-3 z-10 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-white rounded-xl px-3 py-1.5 shadow-lg text-[11px] font-bold flex items-center gap-3">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">
                DETECTION AREA
              </span>
              <span className="flex items-center gap-1 text-[10px]">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" /> High
              </span>
              <span className="flex items-center gap-1 text-[10px]">
                <span className="w-2 h-2 rounded-full bg-[#F97316]" /> Moderate
              </span>
              <span className="flex items-center gap-1 text-[10px]">
                <span className="w-2 h-2 rounded-full bg-[#0878D1]" /> Low
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT 4 COLS (~33%): Detection Result Card & Actions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-black text-[#071A33] uppercase tracking-wider">
                DETECTION RESULT
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#18B77A]/15 text-[#18B77A] text-[10px] font-extrabold uppercase">
                HIGH CONFIDENCE
              </span>
            </div>

            {/* Prominent Confidence Display */}
            <div className="text-center p-4 rounded-2xl bg-[#F5F9FC] border border-slate-200/70">
              <div className="text-4xl font-black text-[#0878D1] mb-1">86%</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wide">
                Detection Confidence
              </div>
            </div>

            {/* Essential Metrics */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-slate-500 font-medium">Detected area</span>
                <span className="font-extrabold text-[#071A33]">4.8 km²</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-slate-500 font-medium">Observation quality</span>
                <span className="font-extrabold text-[#18B77A]">Good</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-slate-500 font-medium">Cloud interference</span>
                <span className="font-bold text-slate-700">Low</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <button
                onClick={() => setIsReviewed(true)}
                className={`w-full py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer transform active:scale-95 ${
                  isReviewed
                    ? 'bg-[#18B77A] text-white'
                    : 'bg-[#0878D1] hover:bg-[#0766B3] text-white shadow-[#0878D1]/25'
                }`}
              >
                {isReviewed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Detection Confirmed</span>
                  </>
                ) : (
                  <>
                    <span>Review Detection</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                onClick={() => alert('Exporting high-resolution satellite scene...')}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Export Scene</span>
              </button>

              {/* Optional View Details Toggle */}
              <button
                onClick={() => setShowObsDetails((prev) => !prev)}
                className="w-full py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span>{showObsDetails ? 'Hide Details' : 'View Details'}</span>
                {showObsDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Expandable Observation Details Section */}
            {showObsDetails && (
              <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs space-y-2 animate-fade-in border border-slate-700">
                <div className="text-[10px] font-black uppercase text-cyan-300 tracking-wider pb-1 border-b border-slate-800">
                  Observation Details
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Satellite:</span>
                  <span className="font-bold text-white">Sentinel-2 A/B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Resolution:</span>
                  <span className="font-bold text-white">10 m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Observation:</span>
                  <span className="font-bold text-white">27 Sep 2026 · 09:20 UTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cloud interference:</span>
                  <span className="font-bold text-white">4.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Scene quality:</span>
                  <span className="font-bold text-[#18B77A]">Good</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. "WHAT WAS FOUND?" SECTION */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Info className="w-4 h-4 text-[#0878D1]" />
          <h2 className="text-sm font-black text-[#071A33] uppercase tracking-wider">
            WHAT WAS FOUND?
          </h2>
        </div>

        <p className="text-xs text-slate-700 font-medium leading-relaxed">
          Floating debris is visible in the observed ocean area.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-[#F5F9FC] border border-slate-200/70">
            <span className="text-slate-400 text-[10px] font-extrabold uppercase block mb-0.5">
              Detected area
            </span>
            <span className="text-base font-black text-[#071A33]">4.8 km²</span>
          </div>

          <div className="p-3 rounded-xl bg-[#F5F9FC] border border-slate-200/70">
            <span className="text-slate-400 text-[10px] font-extrabold uppercase block mb-0.5">
              Confidence
            </span>
            <span className="text-base font-black text-[#18B77A]">86%</span>
          </div>

          <div className="p-3 rounded-xl bg-[#F5F9FC] border border-slate-200/70">
            <span className="text-slate-400 text-[10px] font-extrabold uppercase block mb-0.5">
              Location
            </span>
            <span className="text-base font-black text-[#071A33]">Arabian Sea · Kerala Coast</span>
          </div>
        </div>
      </section>

      {/* 5. "WHY THIS DETECTION?" EXPANDABLE SECTION */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <button
          onClick={() => setShowWhyDetected((prev) => !prev)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0878D1]" />
            <span className="text-xs font-black text-[#071A33] uppercase tracking-wider">
              Why was this detected?
            </span>
          </div>
          {showWhyDetected ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showWhyDetected && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs animate-fade-in">
            <ul className="space-y-2 text-slate-700 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-[#0878D1] font-bold">•</span>
                <span>Unusual surface reflectance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0878D1] font-bold">•</span>
                <span>Debris-like floating pattern</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0878D1] font-bold">•</span>
                <span>Consistent surrounding water conditions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0878D1] font-bold">•</span>
                <span>Suitable satellite observation quality</span>
              </li>
            </ul>

            <div className="pt-2 border-t border-slate-200/80">
              <button
                onClick={() => setShowTechDetails((prev) => !prev)}
                className="text-[11px] font-bold text-[#0878D1] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>{showTechDetails ? 'Hide technical details' : 'View technical details'}</span>
                {showTechDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showTechDetails && (
                <div className="mt-3 p-3 rounded-xl bg-slate-900 text-white font-mono text-[11px] space-y-1.5">
                  <div>FCI Band Ratio: 1.48 (Threshold &gt; 1.25)</div>
                  <div>Spatial Coherence Index: 0.89</div>
                  <div>Water Matrix Subtraction: Clear Water Calibration Applied</div>
                  <div>Sensor Platform: Sentinel-2B MSI (Level-2A Bottom-Of-Atmosphere)</div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
