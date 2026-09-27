import React from 'react';
import {
  Search,
  Bot,
  Bell,
  Clock,
  Radio,
  Wind,
  Waves,
  Navigation,
} from 'lucide-react';

interface TopHeaderProps {
  onOpenSearch: () => void;
  onOpenAIAssistant: () => void;
  hasUnreadNotification?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenSearch,
  onOpenAIAssistant,
  hasUnreadNotification = true,
}) => {
  return (
    <header className="h-[58px] bg-white border-b border-slate-200/80 px-5 flex items-center justify-between sticky top-0 z-20 shadow-xs select-none">
      {/* LEFT: Live Satellite Feed & Ocean Conditions Ticker */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#EAF8FA] border border-[#24C6C5]/30 text-[#071A33]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#18B77A] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#18B77A]"></span>
          </span>
          <span className="text-[11px] font-bold text-[#071A33] tracking-wider uppercase">LIVE</span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
            <Radio className="w-3 h-3 text-[#0878D1]" />
            Satellite Feed
          </span>
        </div>

        <div className="hidden xl:flex items-center gap-3 text-[11px] text-slate-600 border-l border-slate-200 pl-4">
          <div className="flex items-center gap-1.5 font-medium">
            <Navigation className="w-3.5 h-3.5 text-[#0878D1]" />
            <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">CURRENT</span>
            <span className="font-bold text-slate-800">1.4 kn → SE</span>
          </div>

          <span className="text-slate-300">•</span>

          <div className="flex items-center gap-1.5 font-medium">
            <Wind className="w-3.5 h-3.5 text-[#168BE8]" />
            <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">WIND</span>
            <span className="font-bold text-slate-800">18 km/h → NE</span>
          </div>

          <span className="text-slate-300">•</span>

          <div className="flex items-center gap-1.5 font-medium">
            <Waves className="w-3.5 h-3.5 text-[#24C6C5]" />
            <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">WAVE</span>
            <span className="font-bold text-slate-800">1.2 m</span>
          </div>
        </div>
      </div>

      {/* CENTER: Global Search Bar */}
      <div className="flex-1 max-w-md mx-6">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 text-slate-500 text-xs transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0878D1] transition-colors" />
            <span className="text-slate-500 font-medium">Search locations, detections, events...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white rounded border border-slate-200 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* RIGHT: Status, Assistant, Notifications & User */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Updated 2 min ago</span>
        </div>

        {/* Assistant CTA Button */}
        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0878D1] to-[#168BE8] text-white text-xs font-bold shadow-sm shadow-[#0878D1]/20 hover:shadow-md transition-all cursor-pointer transform active:scale-95"
        >
          <Bot className="w-4 h-4 text-cyan-200 animate-bounce" />
          <span>Assistant</span>
        </button>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer">
          <Bell className="w-4 h-4" />
          {hasUnreadNotification && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E35D5D] ring-2 ring-white" />
          )}
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#062B5C] text-white flex items-center justify-center font-bold text-xs shadow-xs border border-slate-200 cursor-pointer hover:ring-2 hover:ring-[#0878D1] transition-all">
          K
        </div>
      </div>
    </header>
  );
};
