import React from 'react';
import { MODEL_CONFIDENCE_BREAKDOWN } from '../data/mockData';

export const ModelConfidencePage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto select-none space-y-6">
      {/* Title & One-line Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A33] tracking-tight">
          What are the ocean conditions?
        </h1>
        <p className="text-sm text-slate-500 font-normal">
          Check ocean currents, winds, and wave activity driving debris movement.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF8FA] text-[#0878D1] flex items-center justify-center font-black text-xl">
              89%
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#071A33]">Combined Detection Confidence</h3>
              <div className="text-xs text-slate-500">
                Data fusion score from satellite and ocean physics models
              </div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#18B77A]/15 text-[#18B77A] text-xs font-extrabold">
            High Confidence
          </span>
        </div>

        <div className="space-y-4">
          {MODEL_CONFIDENCE_BREAKDOWN.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#F5F9FC] border border-slate-200/80 space-y-2">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-[#071A33]">{item.module}</span>
                <span className="text-[#0878D1] font-black">{item.score}% Confidence</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${item.score}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
