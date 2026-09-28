import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Download,
  Bell,
  Check,
  Sliders,
  Layers,
  Wind,
  History,
  ShieldAlert,
  Save,
  RotateCcw,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [exportedFormat, setExportedFormat] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Settings State
  const [satelliteSource, setSatelliteSource] = useState('Sentinel-2');
  const [cloudCoverMax, setCloudCoverMax] = useState(15);
  const [confidenceThreshold, setConfidenceThreshold] = useState(80);
  const [windDragCoeff, setWindDragCoeff] = useState(2.8);
  const [forecastHorizon, setForecastHorizon] = useState('72H');
  const [velocityUnits, setVelocityUnits] = useState('km/h');
  const [replaySpeed, setReplaySpeed] = useState('Medium');
  const [showCredibilityBadges, setShowCredibilityBadges] = useState(true);
  const [alertDistanceKm, setAlertDistanceKm] = useState(25);

  const handleExport = (format: string) => {
    setExportedFormat(format);
    setTimeout(() => setExportedFormat(null), 3000);
  };

  const handleSaveSettings = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto select-none space-y-6">
      {/* 1. Title & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0878D1]/10 border border-[#0878D1]/30 text-[#0878D1] text-xs font-black uppercase tracking-wider mb-1.5">
            <SettingsIcon className="w-3.5 h-3.5" />
            SYSTEM CONFIGURATION
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A33] tracking-tight">
            System Settings & Data Preferences
          </h1>
          <p className="text-sm text-slate-500 font-normal mt-0.5">
            Customize satellite detection rules, drift physics models, historical replay speeds, and export data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0878D1] hover:bg-[#0766B3] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer active:scale-95"
          >
            {isSaved ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'SETTINGS SAVED!' : 'SAVE PREFERENCES'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 1: SATELLITE DETECTION SETTINGS */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-[#071A33] uppercase border-b border-slate-100 pb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0878D1]" />
            1. SATELLITE DATA & DETECTION RULES
          </h3>

          <div className="space-y-4 text-xs font-semibold">
            {/* Primary Satellite Data Source */}
            <div>
              <label className="text-slate-700 block mb-1.5 font-bold">Primary Satellite Platform</label>
              <select
                value={satelliteSource}
                onChange={(e) => setSatelliteSource(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-[#071A33] focus:ring-2 focus:ring-[#0878D1]/20 outline-none cursor-pointer"
              >
                <option value="Sentinel-2">Sentinel-2 A/B (10m Multispectral - Default)</option>
                <option value="PlanetScope">PlanetScope SuperDove (3m High Frequency)</option>
                <option value="Landsat-9">Landsat-9 OLI-2 (15m Surface Thermal)</option>
              </select>
            </div>

            {/* Cloud Cover Threshold */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-700 font-bold">Maximum Cloud Cover Filter</label>
                <span className="text-[#0878D1] font-black">{cloudCoverMax}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                value={cloudCoverMax}
                onChange={(e) => setCloudCoverMax(Number(e.target.value))}
                className="w-full accent-[#0878D1] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0% (Clear Sky)</span>
                <span>15% (Balanced)</span>
                <span>35% (Permissive)</span>
              </div>
            </div>

            {/* Minimum Detection Confidence */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-700 font-bold">Detection Confidence Cutoff</label>
                <span className="text-[#0878D1] font-black">{confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-[#0878D1] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>50% (High Recall)</span>
                <span>80% (Recommended)</span>
                <span>95% (High Precision)</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: DRIFT PHYSICS & OCEAN MODEL CONTROLS */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-[#071A33] uppercase border-b border-slate-100 pb-3 flex items-center gap-2">
            <Wind className="w-4 h-4 text-[#24C6C5]" />
            2. DRIFT MODEL & OCEAN PHYSICS
          </h3>

          <div className="space-y-4 text-xs font-semibold">
            {/* Forecast Horizon Window */}
            <div>
              <label className="text-slate-700 block mb-1.5 font-bold">Default Forecast Horizon</label>
              <div className="grid grid-cols-3 gap-2">
                {['24H', '48H', '72H'].map((win) => (
                  <button
                    key={win}
                    onClick={() => setForecastHorizon(win)}
                    className={`py-2 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                      forecastHorizon === win
                        ? 'bg-[#071A33] text-white border-[#071A33] shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {win} Window
                  </button>
                ))}
              </div>
            </div>

            {/* Wind Drag Coefficient (Windage factor) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-700 font-bold">Wind Drift Drag Coefficient</label>
                <span className="text-[#24C6C5] font-black">{windDragCoeff}%</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={windDragCoeff}
                onChange={(e) => setWindDragCoeff(Number(e.target.value))}
                className="w-full accent-[#24C6C5] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1.5% (Submerged plastics)</span>
                <span>2.8% (Surface slicks)</span>
                <span>4.5% (Floating nets/gear)</span>
              </div>
            </div>

            {/* Velocity Units */}
            <div>
              <label className="text-slate-700 block mb-1.5 font-bold">Speed & Velocity Units</label>
              <div className="grid grid-cols-3 gap-2">
                {['km/h', 'knots', 'm/s'].map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setVelocityUnits(unit)}
                    className={`py-2 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                      velocityUnits === unit
                        ? 'bg-[#0878D1] text-white border-[#0878D1] shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: HISTORICAL REPLAY PREFERENCES */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-[#071A33] uppercase border-b border-slate-100 pb-3 flex items-center gap-2">
            <History className="w-4 h-4 text-[#7666D9]" />
            3. HISTORICAL REPLAY & DEMO CONTROLS
          </h3>

          <div className="space-y-4 text-xs font-semibold">
            {/* Auto-Replay Speed */}
            <div>
              <label className="text-slate-700 block mb-1.5 font-bold">Default Replay Playback Speed</label>
              <div className="grid grid-cols-3 gap-2">
                {['Slow (4s)', 'Medium (2.5s)', 'Fast (1s)'].map((speed) => {
                  const key = speed.split(' ')[0];
                  return (
                    <button
                      key={key}
                      onClick={() => setReplaySpeed(key)}
                      className={`py-2 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                        replaySpeed === key
                          ? 'bg-[#071A33] text-white border-[#071A33] shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {speed}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scientific Badges Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <div className="text-xs font-bold text-[#071A33]">Scientific Credibility Labels</div>
                <div className="text-[10px] text-slate-500">Show OBSERVED vs RECONSTRUCTED badges</div>
              </div>
              <input
                type="checkbox"
                checked={showCredibilityBadges}
                onChange={(e) => setShowCredibilityBadges(e.target.checked)}
                className="w-4 h-4 rounded text-[#0878D1] accent-[#0878D1] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* CARD 4: EXPORT MAP LAYERS & ALERTS */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-[#071A33] uppercase border-b border-slate-100 pb-3 flex items-center gap-2">
            <Download className="w-4 h-4 text-[#18B77A]" />
            4. EXPORT MAP LAYERS & ALERTS
          </h3>

          {/* Export Buttons */}
          <div className="space-y-2">
            <label className="text-slate-700 block text-xs font-bold">Download GIS & Map Data</label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleExport('GeoJSON')}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-[#0878D1] hover:text-white text-slate-800 text-xs font-extrabold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>GeoJSON (.json)</span>
                <Download className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleExport('KML')}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-[#0878D1] hover:text-white text-slate-800 text-xs font-extrabold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>KML Layer (.kml)</span>
                <Download className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleExport('GeoTIFF')}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-[#0878D1] hover:text-white text-slate-800 text-xs font-extrabold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>GeoTIFF (.tif)</span>
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>

            {exportedFormat && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Exported {exportedFormat} map file successfully!</span>
              </div>
            )}
          </div>

          {/* Alert Distance Window */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center mb-1 text-xs font-bold">
              <label className="text-slate-700">Coastline Alert Distance Threshold</label>
              <span className="text-[#18B77A] font-black">{alertDistanceKm} km</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={alertDistanceKm}
              onChange={(e) => setAlertDistanceKm(Number(e.target.value))}
              className="w-full accent-[#18B77A] cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
