import React, { useState } from 'react';
import { Search, X, MapPin, Eye, History, Flame, CheckCircle2, ChevronRight } from 'lucide-react';
import { GLOBAL_SEARCH_ITEMS } from '../data/mockData';
import { NavigationId, SearchResultItem } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (id: NavigationId) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const filteredResults = GLOBAL_SEARCH_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const getCategoryIcon = (cat: SearchResultItem['category']) => {
    switch (cat) {
      case 'Location':
        return <MapPin className="w-4 h-4 text-[#0878D1]" />;
      case 'Detection':
        return <Eye className="w-4 h-4 text-[#168BE8]" />;
      case 'Incident':
        return <History className="w-4 h-4 text-[#7666D9]" />;
      case 'Hotspot':
        return <Flame className="w-4 h-4 text-[#E35D5D]" />;
      case 'Verification':
        return <CheckCircle2 className="w-4 h-4 text-[#18B77A]" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleSelect = (item: SearchResultItem) => {
    onNavigate(item.targetNav);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/40 backdrop-blur-xs select-none">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in mx-4">
        {/* Input area */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search locations, detections, events..."
            className="w-full text-sm font-semibold text-[#071A33] placeholder-slate-400 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredResults.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching intelligence results found for "{query}"
            </div>
          ) : (
            filteredResults.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className="p-3 rounded-xl hover:bg-[#F5F9FC] flex items-center justify-between cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-xs transition-all">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#071A33] group-hover:text-[#0878D1] transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500">{item.subtitle}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    {item.category}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0878D1]" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Search Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Search hints: Try "Kerala", "MSC ELSA 3", "Hotspot"</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
