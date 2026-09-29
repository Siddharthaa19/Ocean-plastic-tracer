import React, { useState } from 'react';
import { MapView } from '../components/MapView';
import { ActiveLayers } from '../components/LayerControl';
import { VERIFICATION_CANDIDATES } from '../data/mockData';
import { VerificationCandidate } from '../types';
import { Target, CheckCircle2, PlusCircle, ChevronDown, ChevronUp, Maximize, Minimize } from 'lucide-react';

export const FieldVerificationPage: React.FC = () => {
  const [candidates] = useState(VERIFICATION_CANDIDATES);
  const [selectedCand, setSelectedCand] = useState<VerificationCandidate>(VERIFICATION_CANDIDATES[0]);
  const [showModal, setShowModal] = useState(false);
  const [showDataDetails, setShowDataDetails] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  const layers: ActiveLayers = {
    aiDetection: true,
    predictedDrift: true,
    accumulationHotspots: false,
    oceanCurrents: true,
    wind: false,
    verificationPoints: true,
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto select-none space-y-6">
      {/* Title & One-line Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A33] tracking-tight">
          Where should we check first?
        </h1>
        <p className="text-sm text-slate-500 font-normal">
          Find the best locations for boats or drones to verify ocean debris.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Map View */}
        <div className={isMapFullscreen ? "fixed inset-4 z-[9999] rounded-2xl overflow-hidden shadow-2xl bg-slate-950 flex flex-col p-4" : "lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm relative flex flex-col"}>
          <button
            onClick={() => setIsMapFullscreen(!isMapFullscreen)}
            className="absolute top-6 right-6 z-[400] p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center shadow-md"
            title="Toggle Fullscreen"
          >
            {isMapFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
          <MapView
            layers={layers}
            currentStep="NOW"
            onSelectVerification={setSelectedCand}
            className={isMapFullscreen ? "flex-1 w-full h-full" : "h-[300px] sm:h-[420px] lg:h-[500px]"}
          />
        </div>

        {/* Right 5 Cols: BEST PLACE TO CHECK CARD */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-[#062B5C] to-[#0A3D7F] text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
            {/* Marine Drone / Vessel Image Background Feature */}
            <div className="relative rounded-xl overflow-hidden mb-4 h-32 border border-white/20">
              <img
                src="/user_plastic_photo.jpg"
                alt="Floating Marine Plastic Field Inspection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062B5C] via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 text-[10px] font-bold text-[#24C6C5] uppercase bg-black/60 px-2 py-0.5 rounded">
                RECOMMENDED ASSET: BOAT / DRONE
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#24C6C5] uppercase">
                <Target className="w-5 h-5 text-[#24C6C5] animate-pulse" />
                BEST PLACE TO CHECK (P1)
              </div>
              <span className="px-2.5 py-1 rounded bg-[#18B77A] text-white text-[11px] font-black">
                P1 Target
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-1">{selectedCand.zoneCode}</h3>
            <div className="text-xs text-slate-300 mb-4">
              Offshore Distance: <strong>{selectedCand.distanceOffshoreKm} km</strong> | Lat 9.965, Lng 75.862
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/10 border border-white/10 text-xs mb-4">
              <div>
                <span className="text-[10px] text-slate-300 uppercase block font-semibold">
                  Debris Likelihood
                </span>
                <span className="font-extrabold text-[#24C6C5]">{selectedCand.potentialDebrisLikelihood}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-300 uppercase block font-semibold">
                  Forecast Uncertainty
                </span>
                <span className="font-extrabold text-white">{selectedCand.modelUncertainty}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-300 uppercase block font-semibold">
                  Information Gain
                </span>
                <span className="font-extrabold text-[#18B77A]">{selectedCand.expectedInformationGain}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-300 uppercase block font-semibold">
                  Asset Type
                </span>
                <span className="font-bold text-white">{selectedCand.recommendedAsset}</span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full py-3 rounded-xl bg-[#0878D1] hover:bg-[#168BE8] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#0878D1]/40 transition-all cursor-pointer transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Start Verification</span>
            </button>
          </div>
        </div>
      </div>

      {/* VERIFICATION QUEUE TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-[#071A33] uppercase">VERIFICATION QUEUE</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase">
                <th className="py-2 px-3">ZONE CODE</th>
                <th className="py-2 px-3">OFFSHORE DISTANCE</th>
                <th className="py-2 px-3">INFO GAIN</th>
                <th className="py-2 px-3">RECOMMENDED ASSET</th>
                <th className="py-2 px-3">STATUS</th>
                <th className="py-2 px-3">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-[#071A33]">
              {candidates.map((cand) => (
                <tr key={cand.id} className="hover:bg-[#F5F9FC]">
                  <td className="py-3 px-3 font-bold">{cand.zoneCode}</td>
                  <td className="py-3 px-3 text-slate-600">{cand.distanceOffshoreKm} km</td>
                  <td className="py-3 px-3 text-[#0878D1] font-extrabold">
                    {cand.expectedInformationGain}
                  </td>
                  <td className="py-3 px-3 text-slate-700">{cand.recommendedAsset}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        cand.status === 'Confirmed Debris'
                          ? 'bg-[#18B77A]/15 text-[#18B77A]'
                          : cand.status === 'Needs Check'
                          ? 'bg-[#E9A72F]/15 text-[#E9A72F]'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {cand.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => setSelectedCand(cand)}
                      className="text-xs text-[#0878D1] font-bold hover:underline cursor-pointer"
                    >
                      Inspect →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-fade-in select-none">
            <div className="w-12 h-12 rounded-full bg-[#18B77A]/20 text-[#18B77A] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#071A33]">Verification Mission Started!</h3>
            <p className="text-xs text-slate-600">
              Dispatch coordinates sent to <strong>Ocean Cleanup Unit 4 (Boat/Drone Team)</strong>. GPS waypoint 9.965°N, 75.862°E loaded.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 bg-[#0878D1] text-white text-xs font-bold rounded-xl hover:bg-[#0766B3] cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
