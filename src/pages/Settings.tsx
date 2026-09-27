import React, { useState } from 'react';
import { Download, Bell, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [exportedFormat, setExportedFormat] = useState<string | null>(null);

  const handleExport = (format: string) => {
    setExportedFormat(format);
    setTimeout(() => setExportedFormat(null), 3000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto select-none space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A33] tracking-tight">
          How to customize & export data?
        </h1>
        <p className="text-sm text-slate-500 font-normal">
          Adjust preferences and export maps as GeoJSON or KML.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Map Export */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-[#071A33] uppercase border-b border-slate-100 pb-3 flex items-center gap-2">
            <Download className="w-4 h-4 text-[#0878D1]" />
            EXPORT MAP LAYERS
          </h3>

          <p className="text-xs text-slate-600">
            Download detected debris areas, drift movement vectors, and hotspot priority zones in standard map formats.
          </p>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => handleExport('GeoJSON')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-[#0878D1] hover:text-white text-slate-800 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Export GeoJSON Map (.json)</span>
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleExport('KML')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-[#0878D1] hover:text-white text-slate-800 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Export KML Map Layer (.kml)</span>
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleExport('GeoTIFF')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-[#0878D1] hover:text-white text-slate-800 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Export Satellite Layer (.tif)</span>
              <Download className="w-4 h-4" />
            </button>
          </div>

          {exportedFormat && (
            <div className="p-3 rounded-xl bg-[#18B77A]/15 text-[#18B77A] text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Exported {exportedFormat} map file successfully!</span>
            </div>
          )}
        </div>

        {/* Alert Thresholds */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-[#071A33] uppercase border-b border-slate-100 pb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#168BE8]" />
            ALERT PREFERENCES
          </h3>

          <div className="space-y-4 text-xs font-semibold">
            <div>
              <label className="text-slate-700 block mb-1">Minimum Detection Confidence Threshold</label>
              <input type="range" min="50" max="95" defaultValue="80" className="w-full accent-[#0878D1]" />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>50% (Permissive)</span>
                <span>80% (Recommended)</span>
                <span>95% (Strict)</span>
              </div>
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Coastline Alert Window</label>
              <select className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-[#071A33]">
                <option>24 Hours before coastal arrival</option>
                <option>48 Hours before coastal arrival</option>
                <option>72 Hours before coastal arrival</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
