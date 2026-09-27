import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AREA_TREND_DATA, FORECAST_DISPLACEMENT_CHART, MODEL_CONFIDENCE_BREAKDOWN } from '../data/mockData';
import { TrendingUp } from 'lucide-react';

export const AnalyticsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 select-none">
      {/* CARD 1: DETECTED DEBRIS AREA */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            DETECTED AREA
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#18B77A]/15 text-[#18B77A] text-[10px] font-extrabold">
            <TrendingUp className="w-3 h-3" />
            +12.4%
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-black text-[#071A33]">4.8 km²</span>
          <span className="text-xs text-slate-500 font-semibold">Observation Trend</span>
        </div>

        {/* Line / Area Chart */}
        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={AREA_TREND_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0878D1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0878D1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#607086' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#607086' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  fontSize: '11px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Area type="monotone" dataKey="areaKm2" stroke="#0878D1" strokeWidth={2.5} fillOpacity={1} fill="url(#areaGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CARD 2: EXPECTED MOVEMENT */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            EXPECTED MOVEMENT
          </span>
          <span className="px-2 py-0.5 rounded bg-[#EAF8FA] text-[#0878D1] text-[10px] font-bold">
            72H Horizon
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-black text-[#071A33]">47 km</span>
          <span className="text-xs text-slate-500 font-semibold">Max Displacement</span>
        </div>

        {/* Bar Chart */}
        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={FORECAST_DISPLACEMENT_CHART} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <XAxis dataKey="step" tick={{ fontSize: 10, fill: '#607086', fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#607086' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  fontSize: '11px',
                  border: '1px solid #E2E8F0',
                }}
              />
              <Bar dataKey="displacement" fill="#168BE8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CARD 3: DETECTION CONFIDENCE BREAKDOWN */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            DETECTION CONFIDENCE BREAKDOWN
          </span>
          <span className="px-2 py-0.5 rounded bg-[#18B77A]/15 text-[#18B77A] text-[10px] font-extrabold">
            Combined 89%
          </span>
        </div>

        <div className="space-y-3 mt-4">
          {MODEL_CONFIDENCE_BREAKDOWN.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 truncate max-w-[200px]">{item.module}</span>
                <span className="font-extrabold text-[#071A33]">{item.score}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
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
