import React from 'react';
import { ArrowRight, Compass, MapPin } from 'lucide-react';
import { NavigationId } from '../types';

interface HeroBannerProps {
  onNavigate: (id: NavigationId) => void;
  onExploreMap?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigate, onExploreMap }) => {
  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-r from-white via-[#F5F9FC] to-[#EAF8FA]/70 border border-slate-200/80 p-6 md:p-8 shadow-sm overflow-hidden">
      {/* Background Ocean Ripple Pattern */}
      <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#24C6C5]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-1/3 -bottom-20 w-80 h-80 bg-[#0878D1]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* LEFT COLUMN: Main Typography & CTAs */}
        <div className="lg:col-span-7">
          {/* Hero Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#071A33] tracking-tight leading-[1.15] mb-4">
            See where plastic is.{' '}
            <span className="block text-[#0878D1]">Predict where it goes.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed max-w-xl mb-6">
            Track floating marine debris, forecast its movement, and identify where teams should check first.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onExploreMap}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0878D1] hover:bg-[#0766B3] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0878D1]/25 hover:shadow-lg transition-all transform active:scale-95 cursor-pointer"
            >
              <span>Explore Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('hotspots')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#071A33] border border-slate-300 text-xs sm:text-sm font-bold shadow-xs hover:border-slate-400 transition-all cursor-pointer"
            >
              <span>View Hotspots</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Realistic Marine Imagery */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 group">
            <img
              src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80"
              alt="Ocean Marine Monitoring View"
              className="w-full h-48 sm:h-56 lg:h-64 object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#062B5C]/70 via-transparent to-transparent" />

            <div className="absolute bottom-3 left-4 text-white text-xs font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#24C6C5]" />
              <span>Sentinel-2 Satellite Pass · Kerala Coast</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
