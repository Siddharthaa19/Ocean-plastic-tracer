import React, { useState } from 'react';
import {
  LayoutDashboard,
  Eye,
  Wind,
  Flame,
  CheckCircle2,
  History,
  Settings,
  ChevronRight,
  Compass,
  Menu,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationId } from '../types';

interface SidebarProps {
  currentNav: NavigationId;
  onNavigate: (id: NavigationId) => void;
}

const NAV_ITEMS = [
  { id: 'overview' as NavigationId, label: 'Overview', icon: LayoutDashboard },
  { id: 'detection' as NavigationId, label: 'Detection', icon: Eye },
  { id: 'drift' as NavigationId, label: 'Drift Forecast', icon: Wind },
  { id: 'hotspots' as NavigationId, label: 'Hotspots', icon: Flame },
  { id: 'verification' as NavigationId, label: 'Field Verification', icon: CheckCircle2 },
  { id: 'historical' as NavigationId, label: 'Historical Replay', icon: History },
];

const SYSTEM_ITEMS = [
  { id: 'settings' as NavigationId, label: 'Settings', icon: Settings },
];

function NavItem({
  item,
  isActive,
  onClick,
}: {
  item: typeof NAV_ITEMS[0];
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
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
      {isActive && (
        <motion.div layoutId="active-nav-indicator">
          <ChevronRight className="w-3.5 h-3.5 text-white/80" />
        </motion.div>
      )}
    </motion.button>
  );
}

function SidebarContent({
  currentNav,
  onNavigate,
  onClose,
}: {
  currentNav: NavigationId;
  onNavigate: (id: NavigationId) => void;
  onClose?: () => void;
}) {
  const handleNav = (id: NavigationId) => {
    onNavigate(id);
    onClose?.();
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="p-4 overflow-y-auto flex-1">
        {/* Logo */}
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
          {/* Mobile close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Main Nav */}
        <div className="mb-6">
          <div className="px-3 mb-2 text-[10px] font-extrabold tracking-wider uppercase text-slate-400">
            NAVIGATION
          </div>
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={currentNav === item.id}
                onClick={() => handleNav(item.id)}
              />
            ))}
          </div>
        </div>

        {/* System */}
        <div className="mb-6">
          <div className="px-3 mb-2 text-[10px] font-extrabold tracking-wider uppercase text-slate-400">
            SYSTEM
          </div>
          <div className="space-y-1">
            {SYSTEM_ITEMS.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={currentNav === item.id}
                onClick={() => handleNav(item.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[#0A3D7F]/60 bg-[#041F44]">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0878D1] to-[#7666D9] text-white flex items-center justify-center font-bold text-xs shadow-inner shrink-0">
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
    </div>
  );
}

export const Sidebar: React.FC<SidebarProps> = ({ currentNav, onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── DESKTOP SIDEBAR (lg+) ── */}
      <aside className="hidden lg:flex w-[230px] shrink-0 bg-[#062B5C] text-white flex-col h-screen sticky top-0 border-r border-[#0A3D7F]/40 shadow-xl z-30 select-none">
        <SidebarContent currentNav={currentNav} onNavigate={onNavigate} />
      </aside>

      {/* ── MOBILE: Hamburger Button in fixed corner ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-50 p-2 rounded-xl bg-[#062B5C] text-white shadow-lg shadow-[#062B5C]/40"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="lg:hidden fixed top-0 left-0 h-full w-[260px] bg-[#062B5C] text-white z-50 shadow-2xl flex flex-col select-none"
            >
              <SidebarContent
                currentNav={currentNav}
                onNavigate={onNavigate}
                onClose={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
