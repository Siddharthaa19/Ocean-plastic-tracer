import React from 'react';
import {
  LayoutDashboard,
  Eye,
  Wind,
  Flame,
  CheckCircle2,
  ListOrdered,
  Layers,
  Activity,
  History,
  Settings,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { NavigationId } from '../types';

interface SidebarProps {
  currentNav: NavigationId;
  onNavigate: (id: NavigationId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentNav, onNavigate }) => {
  const decisionItems = [
    { id: 'overview' as NavigationId, label: 'Overview', icon: LayoutDashboard },
    { id: 'detection' as NavigationId, label: 'Detection', icon: Eye },
    { id: 'drift' as NavigationId, label: 'Drift Forecast', icon: Wind },
    { id: 'hotspots' as NavigationId, label: 'Hotspots', icon: Flame },
    { id: 'verification' as NavigationId, label: 'Field Verification', icon: CheckCircle2 },
    { id: 'historical' as NavigationId, label: 'Historical Replay', icon: History },
  ];

  const systemItems = [
    { id: 'settings' as NavigationId, label: 'Settings', icon: Settings },
  ];

  const renderNavGroup = (title: string, items: typeof decisionItems) => (
    <div className="mb-6">
      <div className="px-3 mb-2 text-[10px] font-extrabold tracking-wider uppercase text-slate-400">
        {title}
      </div>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentNav === item.id;
          return (
            <motion.button
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.98 }}
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#0878D1] text-white shadow-md shadow-[#0878D1]/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <motion.div layoutId="active-nav-indicator"><ChevronRight className="w-3.5 h-3.5 text-white/80" /></motion.div>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-[230px] shrink-0 bg-[#062B5C] text-white flex flex-col justify-between h-screen sticky top-0 border-r border-[#0A3D7F]/40 shadow-xl z-30 select-none">
      <div className="p-4 overflow-y-auto custom-scrollbar">
        {/* Logo Branding */}
        <div className="flex items-center justify-between mb-7 px-1 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#168BE8] to-[#24C6C5] flex items-center justify-center shadow-lg shadow-[#168BE8]/30">
              <Compass className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight text-white leading-none">
                Aquatrace
              </div>
              <div className="text-[10px] text-[#24C6C5] font-medium tracking-wide mt-1">
                Marine Debris Intelligence
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        {renderNavGroup('NAVIGATION', decisionItems)}
      </div>

      {/* Footer System Status & User Profile */}
      <div className="p-3 border-t border-[#0A3D7F]/60 bg-[#041F44]">
        {/* User / Org card */}
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0878D1] to-[#7666D9] text-white flex items-center justify-center font-bold text-xs shadow-inner">
            K
          </div>
          <div className="truncate">
            <div className="text-[11px] font-bold text-white truncate leading-tight">
              Kerala Marine Ops
            </div>
            <div className="text-[9px] text-slate-400 truncate">Ocean Cleanup Unit 4</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
