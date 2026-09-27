import React from 'react';

export const DataSourcesPage: React.FC = () => {
  const pipelines = [
    { name: 'Copernicus Marine Service (CMEMS)', type: 'Ocean Currents', latency: '6 hrs', status: 'ACTIVE' },
    { name: 'Sentinel-2 MSI (ESA)', type: 'Multispectral Satellite Pass (10m)', latency: 'Real-time Pass', status: 'ACTIVE' },
    { name: 'GFS 10m Wind Vectors (NOAA)', type: 'Surface Wind Vectors', latency: '3 hrs', status: 'ACTIVE' },
    { name: 'HYCOM Global Ocean Model', type: 'Ocean Convergence Physics', latency: '12 hrs', status: 'ACTIVE' },
    { name: 'Coastal HF Radar Network', type: 'Nearshore Surface Current Velocity', latency: '15 min', status: 'ACTIVE' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto select-none space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A33] tracking-tight">
          Where does the data come from?
        </h1>
        <p className="text-sm text-slate-500 font-normal">
          View live satellite and oceanography data feeds.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase">
                <th className="py-2.5 px-3">DATA PROVIDER</th>
                <th className="py-2.5 px-3">DATA TYPE</th>
                <th className="py-2.5 px-3">UPDATE FREQUENCY</th>
                <th className="py-2.5 px-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-[#071A33]">
              {pipelines.map((p, idx) => (
                <tr key={idx} className="hover:bg-[#F5F9FC]">
                  <td className="py-3 px-3 font-extrabold text-[#0878D1]">{p.name}</td>
                  <td className="py-3 px-3 text-slate-700">{p.type}</td>
                  <td className="py-3 px-3 text-slate-500">{p.latency}</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#18B77A]/15 text-[#18B77A] flex items-center gap-1.5 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#18B77A] animate-ping" />
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
