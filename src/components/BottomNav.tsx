import React from 'react';
import { Home, Zap, Calendar as CalendarIcon, Crown, User } from 'lucide-react';
import { AppTab } from '../types';

interface BottomNavProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  liveCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab, liveCount }) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#090514]/95 backdrop-blur-md border-t border-purple-900/40 transition-colors">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 px-1">
        {/* Tab 1: Home Dashboard (Matches Screenshot) */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            currentTab === 'home'
              ? 'text-purple-400 font-bold'
              : 'text-slate-500 hover:text-slate-300 font-medium'
          }`}
        >
          <div className="relative">
            <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5] text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.7)]' : ''}`} />
          </div>
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* Tab 2: Live Match Analysis */}
        <button
          onClick={() => onSelectTab('today')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            currentTab === 'today'
              ? 'text-amber-400 font-bold'
              : 'text-slate-500 hover:text-slate-300 font-medium'
          }`}
        >
          <div className="relative">
            <Zap className={`w-5 h-5 ${currentTab === 'today' ? 'stroke-[2.5] fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.7)]' : ''}`} />
            {liveCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[8px] font-black bg-cyan-500 text-slate-950 animate-pulse">
                {liveCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Analysis</span>
        </button>

        {/* Tab 3: Performance Calendar */}
        <button
          onClick={() => onSelectTab('calendar')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            currentTab === 'calendar'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-500 hover:text-slate-300 font-medium'
          }`}
        >
          <div className="relative">
            <CalendarIcon className={`w-5 h-5 ${currentTab === 'calendar' ? 'stroke-[2.5] text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.7)]' : ''}`} />
          </div>
          <span className="text-[10px] tracking-tight">Calendar</span>
        </button>

        {/* Tab 4: Exclusive VIP */}
        <button
          onClick={() => onSelectTab('vip')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            currentTab === 'vip'
              ? 'text-amber-300 font-bold'
              : 'text-slate-500 hover:text-slate-300 font-medium'
          }`}
        >
          <div className="relative">
            <Crown className={`w-5 h-5 ${currentTab === 'vip' ? 'stroke-[2.5] fill-amber-400 text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.7)]' : ''}`} />
            <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full text-[7px] font-black bg-amber-400 text-slate-950 uppercase">
              VIP
            </span>
          </div>
          <span className="text-[10px] tracking-tight">VIP Tips</span>
        </button>

        {/* Tab 5: Profile / UGX 15k Mobile Money */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            currentTab === 'profile'
              ? 'text-cyan-400 font-bold'
              : 'text-slate-500 hover:text-slate-300 font-medium'
          }`}
        >
          <div className="relative">
            <User className={`w-5 h-5 ${currentTab === 'profile' ? 'stroke-[2.5] text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.7)]' : ''}`} />
          </div>
          <span className="text-[10px] tracking-tight">Profile</span>
        </button>
      </div>
    </nav>
  );
};


