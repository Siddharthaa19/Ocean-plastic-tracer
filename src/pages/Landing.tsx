import React from 'react';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Eye,
  Wind,
  Flame,
  CheckCircle2,
  ListOrdered,
  Layers,
  Radio,
  Sparkles,
} from 'lucide-react';
import { NavigationId } from '../types';

interface LandingProps {
  onEnterApp: (targetPage?: NavigationId) => void;
}

export const LandingPage: React.FC<LandingProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-[#061B3B] text-white flex flex-col font-sans select-none overflow-x-hidden">
      {/* TOP NAVIGATION BAR */}
      <header className="max-w-7xl w-full mx-auto px-6 py-5 flex items-center justify-between z-20">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onEnterApp('overview')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0878D1] to-[#24C6C5] flex items-center justify-center shadow-lg shadow-[#0878D1]/40">
            <Compass className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-white leading-none">Aquatrace</div>
            <div className="text-[10px] font-bold text-[#24C6C5] tracking-widest uppercase mt-1">
              Marine Intelligence
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-300">
          <button onClick={() => onEnterApp('overview')} className="hover:text-white transition-colors">
            Overview
          </button>
          <button onClick={() => onEnterApp('detection')} className="hover:text-white transition-colors">
            Detection
          </button>
          <button onClick={() => onEnterApp('drift')} className="hover:text-white transition-colors">
            Drift Forecast
          </button>
          <button onClick={() => onEnterApp('hotspots')} className="hover:text-white transition-colors">
            Hotspots
          </button>
          <button onClick={() => onEnterApp('verification')} className="hover:text-white transition-colors">
            Verification
          </button>
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-[#18B77A]">
            <span className="w-2 h-2 rounded-full bg-[#18B77A] animate-ping" />
            LIVE SATELLITE
          </div>

          <button
            onClick={() => onEnterApp('overview')}
            className="px-5 py-2.5 rounded-xl bg-[#0878D1] hover:bg-[#168BE8] text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-[#0878D1]/40 transition-all cursor-pointer transform active:scale-95"
          >
            <span>Enter Control Center</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative max-w-7xl w-full mx-auto px-6 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        {/* Background ocean glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0878D1]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#24C6C5]/20 rounded-full blur-3xl pointer-events-none" />

        {/* LEFT COLUMN: Hero Copy & Glass Card */}
        <div className="lg:col-span-7 relative z-10">
          <div className="p-8 sm:p-10 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#24C6C5]/15 border border-[#24C6C5]/40 text-[#24C6C5] text-xs font-extrabold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              MARITIME DECISION INTELLIGENCE
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-black text-white tracking-tight leading-[1.1] mb-6">
              See where plastic is.{' '}
              <span className="text-[#24C6C5] block">Predict where it goes.</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base font-normal leading-relaxed mb-8 max-w-xl">
              AI-powered satellite detection and ocean drift forecasting for faster marine debris verification and cleanup planning.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onEnterApp('overview')}
                className="px-6 py-3.5 rounded-xl bg-[#0878D1] hover:bg-[#168BE8] text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-xl shadow-[#0878D1]/40 transition-all cursor-pointer transform active:scale-95"
              >
                <span>Enter Control Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onEnterApp('detection')}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-bold transition-all cursor-pointer"
              >
                Explore Intelligence &gt;
              </button>
            </div>

            {/* Guarantee Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-8 mt-8 border-t border-white/10 text-xs text-slate-300 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#18B77A]" />
                <span>Explainable AI Rationale</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#24C6C5]" />
                <span>Copernicus & GFS Hydro</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0878D1]" />
                <span>Field Action Priority</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Stacked Floating Cards (As seen in FreightIQ landing screenshot 2) */}
        <div className="lg:col-span-5 space-y-4 relative z-10">
          {/* Card 1 */}
          <div className="bg-white/95 text-[#071A33] p-4 rounded-2xl border border-white/20 shadow-xl flex items-center justify-between transform hover:-translate-y-1 transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF8FA] text-[#0878D1] flex items-center justify-center">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  SATELLITE OUTLOOK
                </div>
                <div className="text-sm font-extrabold text-[#071A33]">Sentinel-2 / PlanetScope</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-[#18B77A]">86%</div>
              <div className="text-[10px] text-slate-500 font-semibold">Match Score</div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/95 text-[#071A33] p-4 rounded-2xl border border-white/20 shadow-xl flex items-center justify-between transform hover:-translate-y-1 transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF8FA] text-[#168BE8] flex items-center justify-center">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  DRIFT VECTOR MATCH
                </div>
                <div className="text-sm font-extrabold text-[#071A33]">31 km / 48H Trajectory</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-[#168BE8]">Northeast</div>
              <div className="text-[10px] text-slate-500 font-semibold">55° Bearing</div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/95 text-[#071A33] p-4 rounded-2xl border border-white/20 shadow-xl flex items-center justify-between transform hover:-translate-y-1 transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF8FA] text-[#24C6C5] flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  HOTSPOT READINESS
                </div>
                <div className="text-sm font-extrabold text-[#071A33]">KERALA SHELF (ZONE A)</div>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2 py-0.5 rounded bg-[#18B77A]/15 text-[#18B77A] text-[10px] font-extrabold">
                HIGH PRIORITY
              </span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-gradient-to-r from-[#18B77A] to-[#15A06B] text-white p-4 rounded-2xl shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-white" />
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider opacity-90">
                  DECISION CONFIDENCE
                </div>
                <div className="text-xs font-extrabold">AI RECOMMENDATION: FIELD VERIFY</div>
              </div>
            </div>
            <span className="text-lg font-black bg-white/20 px-2.5 py-1 rounded-lg">89%</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS WORKFLOW */}
      <section className="bg-[#041530] py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-[10px] font-extrabold text-[#24C6C5] uppercase tracking-widest mb-2">
              WORKFLOW PIPELINE
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              From Orbit Detection to Field Cleanup Action
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { num: '01', title: 'DETECT', desc: 'Multispectral satellite spectral analysis' },
              { num: '02', title: 'VERIFY', desc: 'Target Next Best Observation candidate' },
              { num: '03', title: 'FORECAST', desc: 'Lagrangian drift & windrow trajectory' },
              { num: '04', title: 'PRIORITIZE', desc: 'Rank accumulation hotspot severity' },
              { num: '05', title: 'RESPOND', desc: 'Dispatch recovery vessels and booms' },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-colors"
              >
                <div className="text-xl font-black text-[#24C6C5] mb-2">{step.num}</div>
                <div className="text-sm font-extrabold text-white mb-1">{step.title}</div>
                <div className="text-[11px] text-slate-400">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-[#031024] border-t border-white/10 text-center text-xs text-slate-400">
        Aquatrace Marine Decision Intelligence Platform © 2026. Built for ocean researchers, coast guards & response teams.
      </footer>
    </div>
  );
};
