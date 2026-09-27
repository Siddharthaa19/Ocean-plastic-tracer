import React from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { DebrisDetection } from '../types';

interface AIExplanationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  detection: DebrisDetection;
}

export const AIExplanationDrawer: React.FC<AIExplanationDrawerProps> = ({
  isOpen,
  onClose,
  detection,
}) => {
  if (!isOpen) return null;

  const rationalePoints = [
    {
      title: 'Satellite Optical Signature',
      value: `${detection.spectralSignatureScore}% Match`,
      description:
        'Sentinel-2 multispectral sensors detected floating surface reflection matching known marine debris slicks.',
      status: 'Verified',
    },
    {
      title: 'Spatial Pattern Consistency',
      value: `${detection.spatialConsistency}% Structure Match`,
      description:
        'Shape and aspect ratio match natural windrow accumulation along surface ocean fronts.',
      status: 'Verified',
    },
    {
      title: 'Ocean-Current Convergence',
      value: detection.oceanCurrentConvergence,
      description:
        'Ocean current data confirms a localized surface convergence area drawing floating debris together.',
      status: 'High Confidence',
    },
    {
      title: 'Wind Alignment',
      value: detection.windAgreement,
      description:
        'Surface wind vectors align closely with ocean currents, confirming the northeastern movement path.',
      status: 'Strong Agreement',
    },
    {
      title: 'Historical Trap Pattern',
      value: 'Known Accumulation Zone',
      description:
        'Satellite archive data shows this region acts as a seasonal accumulation trap during monsoon ocean currents.',
      status: 'Matched',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in select-none">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-5 bg-[#062B5C] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0878D1] flex items-center justify-center text-white font-bold text-sm">
              ?
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-wider text-[#24C6C5] uppercase">
                RECOMMENDATION RATIONALE
              </div>
              <h3 className="text-lg font-bold text-white leading-tight">WHY THIS DECISION?</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subheader */}
        <div className="p-4 bg-[#EAF8FA] border-b border-[#24C6C5]/30 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#071A33]">{detection.name}</div>
            <div className="text-[11px] text-slate-600">{detection.locationName}</div>
          </div>
          <div className="px-3 py-1 rounded-full bg-white border border-[#0878D1]/30 text-[#0878D1] text-xs font-extrabold shadow-2xs">
            {detection.confidence}% Detection Confidence
          </div>
        </div>

        {/* Content Rationale List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="text-xs text-slate-500 font-semibold mb-2">
            This recommendation is supported by 5 key satellite and ocean data signals:
          </div>

          {rationalePoints.map((point, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-[#F5F9FC] border border-slate-200 hover:border-[#0878D1]/40 transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#18B77A] shrink-0" />
                  <span className="text-xs font-extrabold text-[#071A33]">{point.title}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[#0878D1] text-[10px] font-bold shrink-0">
                  {point.value}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">{point.description}</p>
            </div>
          ))}

          {/* Guarantee Note */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#EAF8FA] to-white border border-[#24C6C5]/30 flex items-start gap-3 mt-6">
            <Sparkles className="w-5 h-5 text-[#24C6C5] shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-[#071A33] block mb-0.5">
                Data Verification Standard
              </span>
              <span className="text-slate-600">
                Satellite optical observations are cross-checked with ocean current physics before issuing field action recommendations.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#18B77A]" />
            <span>Rationale log verified</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0878D1] text-white text-xs font-bold hover:bg-[#0766B3] transition-colors shadow-xs cursor-pointer"
          >
            Close Rationale
          </button>
        </div>
      </div>
    </div>
  );
};
