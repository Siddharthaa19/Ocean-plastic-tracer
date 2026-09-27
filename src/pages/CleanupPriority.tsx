import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';

export const CleanupPriorityPage: React.FC = () => {
  const priorityMissions = [
    {
      id: 'PR-01',
      rank: '01',
      zoneName: 'Kerala Coastal Zone (Inshore Front)',
      priority: 'High',
      visibleExtent: '4.8 km²',
      forecastWindow: '24 hrs',
      confidence: '89%',
      accessibility: 'Good (Skimmer Accessible)',
      recommendedAsset: 'Inshore Recovery Skimmer & Boom Barrier',
      imageUrl: '/user_plastic_photo.jpg',
    },
    {
      id: 'PR-02',
      rank: '02',
      zoneName: 'Offshore Convergence Boundary',
      priority: 'Medium',
      visibleExtent: '3.5 km²',
      forecastWindow: '48 hrs',
      confidence: '81%',
      accessibility: 'Moderate (Offshore Vessel Required)',
      recommendedAsset: 'High-speed Support Vessel + Trawl Net',
      imageUrl: '/ocean_plastic_trawl.jpg',
    },
    {
      id: 'PR-03',
      rank: '03',
      zoneName: 'Southern Shelf Coastal Eddy',
      priority: 'Watch',
      visibleExtent: '2.1 km²',
      forecastWindow: '72 hrs',
      confidence: '76%',
      accessibility: 'Easy (Shore Team)',
      recommendedAsset: 'Coastal Rapid Response Shore Team',
      imageUrl: '/coastal_plastic_cleanup.jpg',
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto select-none space-y-6">
      {/* Title & One-line Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A33] tracking-tight">
          Where should cleanup teams go first?
        </h1>
        <p className="text-sm text-slate-500 font-normal">
          Prioritize high-impact areas for ocean cleanup operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {priorityMissions.map((mission) => (
          <div
            key={mission.id}
            className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 overflow-hidden bg-slate-900">
                <img
                  src={mission.imageUrl}
                  alt={mission.zoneName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 w-8 h-8 rounded-xl bg-[#062B5C] text-white flex items-center justify-center font-black text-sm border border-white/20">
                  {mission.rank}
                </div>
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      mission.priority === 'High'
                        ? 'bg-[#E35D5D] text-white'
                        : 'bg-[#E9A72F] text-white'
                    }`}
                  >
                    {mission.priority} Priority
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-base font-extrabold text-[#071A33] mb-0.5">{mission.zoneName}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0878D1]" />
                    <span>Kerala Sector</span>
                  </div>
                </div>

                <div className="space-y-2 p-3 rounded-xl bg-[#F5F9FC] text-xs font-semibold">
                  <div className="flex justify-between text-slate-600">
                    <span>Detected Area:</span>
                    <span className="font-extrabold text-[#071A33]">{mission.visibleExtent}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Expected Arrival:</span>
                    <span className="font-extrabold text-[#168BE8]">{mission.forecastWindow}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Detection Confidence:</span>
                    <span className="font-extrabold text-[#0878D1]">{mission.confidence}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Accessibility:</span>
                    <span className="font-extrabold text-[#18B77A]">{mission.accessibility}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">
                    Recommended Cleanup Asset
                  </span>
                  <span className="font-bold text-[#071A33]">{mission.recommendedAsset}</span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button className="w-full py-2.5 rounded-xl bg-[#0878D1] hover:bg-[#0766B3] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer">
                <span>Start Cleanup Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
