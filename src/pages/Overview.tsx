import React, { useState } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { DecisionCard } from '../components/DecisionCard';
import { MapView } from '../components/MapView';
import { LayerControl, ActiveLayers } from '../components/LayerControl';
import { DriftTimeline } from '../components/DriftTimeline';
import { RightIntelligenceCards } from '../components/RightIntelligenceCards';
import { AnalyticsSection } from '../components/AnalyticsSection';
import { AIExplanationDrawer } from '../components/AIExplanationDrawer';
import { PRIMARY_DETECTION, DEMO_DISCLAIMER_TEXT } from '../data/mockData';
import { NavigationId, TimelineStep } from '../types';
import { MapPin, Info, Maximize, Minimize } from 'lucide-react';
import { motion } from 'framer-motion';

interface OverviewProps {
  onNavigate: (id: NavigationId) => void;
}

export const OverviewPage: React.FC<OverviewProps> = ({ onNavigate }) => {
  const [timelineStep, setTimelineStep] = useState<TimelineStep>('NOW');
  const [isWhyDrawerOpen, setIsWhyDrawerOpen] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [layers, setLayers] = useState<ActiveLayers>({
    aiDetection: true,
    predictedDrift: true,
    accumulationHotspots: true,
    oceanCurrents: true,
    wind: true,
    verificationPoints: true,
  });

  const handleToggleLayer = (key: keyof ActiveLayers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
      className="p-4 sm:p-6 max-w-[1600px] mx-auto select-none space-y-6"
    >
      {/* Overview Page Title & One-line Subtitle */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A33] tracking-tight">
          Marine Debris Situation Overview
        </h1>
        <p className="text-sm text-slate-500 font-normal">
          Current marine debris situation, predicted movement, and recommended field actions.
        </p>
      </motion.div>

      {/* 1. Large Maritime Hero Banner */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <HeroBanner 
          onNavigate={onNavigate} 
          onExploreMap={() => document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' })}
        />
      </motion.div>

      {/* 2. Primary Recommended Action Card */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <DecisionCard
          detection={PRIMARY_DETECTION}
          onReviewDetection={() => onNavigate('detection')}
          onOpenWhyDecision={() => setIsWhyDrawerOpen(true)}
        />
      </motion.div>

      {/* 3. Main Map & Right Intelligence Cards Section */}
      <motion.div id="map-section" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start scroll-mt-24">
        {/* LEFT 8 COLS: Integrated Map Card + Drift Timeline */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
            {/* Map Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0878D1]" />
                <h3 className="text-sm font-extrabold text-[#071A33] uppercase tracking-wider">
                  MARINE DEBRIS MAP
                </h3>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-semibold">
                  Kerala Coast · Lat 9.98°N, Lng 75.95°E
                </span>
              </div>

              {/* Quick layer pills */}
              <div className="flex items-center gap-1.5 text-[11px] font-bold">
                <button
                  onClick={() => setIsMapFullscreen(!isMapFullscreen)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer mr-2 flex items-center justify-center"
                  title="Toggle Fullscreen"
                >
                  {isMapFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => onNavigate('detection')}
                  className="px-2.5 py-1 rounded-lg bg-[#EAF8FA] text-[#0878D1] hover:bg-[#0878D1] hover:text-white transition-colors cursor-pointer"
                >
                  Detection
                </button>
                <button
                  onClick={() => onNavigate('drift')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-[#168BE8] hover:text-white transition-colors cursor-pointer"
                >
                  Drift
                </button>
                <button
                  onClick={() => onNavigate('hotspots')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-[#E35D5D] hover:text-white transition-colors cursor-pointer"
                >
                  Hotspots
                </button>
              </div>
            </div>

            {/* Map Canvas with Floating Layer Control Overlay */}
            <div className={isMapFullscreen ? "fixed inset-4 z-[9999] rounded-2xl overflow-hidden shadow-2xl bg-slate-950 flex flex-col" : "relative rounded-2xl overflow-hidden"}>
              {isMapFullscreen && (
                <button 
                  onClick={() => setIsMapFullscreen(false)}
                  className="absolute top-4 right-4 z-[10000] p-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 shadow-xl cursor-pointer"
                  title="Exit Fullscreen"
                >
                  <Minimize className="w-5 h-5" />
                </button>
              )}
              <MapView layers={layers} currentStep={timelineStep} className={isMapFullscreen ? "flex-1 w-full h-full" : "h-[460px] sm:h-[500px]"} />

              {/* Floating Layer Control Card */}
              <div className="absolute top-3 left-3 z-[400] hidden sm:block">
                <LayerControl layers={layers} onToggleLayer={handleToggleLayer} />
              </div>
            </div>
          </div>

          {/* Timeline Scrubber */}
          <DriftTimeline currentStep={timelineStep} onSelectStep={setTimelineStep} />
        </div>

        {/* RIGHT 4 COLS: Stacked Intelligence Cards */}
        <div className="lg:col-span-4">
          <RightIntelligenceCards onNavigate={onNavigate} />
        </div>
      </motion.div>

      {/* 4. Bottom Analytics Section */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <AnalyticsSection />
      </motion.div>

      {/* Explanation Drawer Modal */}
      <AIExplanationDrawer
        isOpen={isWhyDrawerOpen}
        onClose={() => setIsWhyDrawerOpen(false)}
        detection={PRIMARY_DETECTION}
      />
    </motion.div>
  );
};
