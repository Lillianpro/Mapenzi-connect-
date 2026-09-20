import React from 'react';
import { 
  Zap, 
  BarChart3, 
  ChevronRight, 
  Send, 
  MessageCircle,
  Sparkles, 
  Crown, 
  Flame, 
  TrendingUp, 
  Calendar as CalendarIcon,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { VipCategory, SportType } from '../types';

interface DashboardHubProps {
  onSelectLiveAnalysis: () => void;
  onSelectPerformanceTracker: () => void;
  onSelectVipCategory: (cat: VipCategory) => void;
  onOpenCommunity: () => void;
  onOpenPrivacy: () => void;
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
  liveMatchesCount: number;
  isSubscribed: boolean;
  trialDaysRemaining: number;
}

export const DashboardHub: React.FC<DashboardHubProps> = ({
  onSelectLiveAnalysis,
  onSelectPerformanceTracker,
  onSelectVipCategory,
  onOpenCommunity,
  onOpenPrivacy,
  selectedSport,
  setSelectedSport,
  liveMatchesCount,
  isSubscribed,
  trialDaysRemaining,
}) => {
  const exclusiveVipCards = [
    {
      id: 'ft_draw',
      category: 'ft_draw' as VipCategory,
      badgeText: 'FT',
      badgeColor: 'text-purple-400',
      title: 'Draws VIP',
      subtext: 'High odds split points',
      oddsRange: '@3.20 - @3.60',
      borderGlow: 'hover:border-purple-500/80',
    },
    {
      id: '2_odds',
      category: 'slips' as VipCategory,
      badgeText: '2+',
      badgeColor: 'text-lime-400',
      title: 'Odds VIP',
      subtext: 'Banker safe combo slip',
      oddsRange: '@2.15 Avg',
      borderGlow: 'hover:border-lime-500/80',
    },
    {
      id: '5_odds',
      category: 'slips' as VipCategory,
      badgeText: '5+',
      badgeColor: 'text-purple-400',
      title: 'Odds VIP',
      subtext: 'Optimal multiplier accumulator',
      oddsRange: '@5.42 Avg',
      borderGlow: 'hover:border-purple-500/80',
    },
    {
      id: '15_odds',
      category: 'slips' as VipCategory,
      badgeText: '15+',
      badgeColor: 'text-lime-400',
      title: 'Odds VIP',
      subtext: 'High yield weekend ticket',
      oddsRange: '@16.80 Avg',
      borderGlow: 'hover:border-lime-500/80',
    },
    {
      id: 'correct_score',
      category: 'correct_score' as VipCategory,
      badgeText: 'SCORE',
      badgeColor: 'text-purple-400',
      title: 'Correct Score',
      subtext: 'Exact goal line predictions',
      oddsRange: '@6.50 - @14.0',
      borderGlow: 'hover:border-purple-500/80',
    },
    {
      id: 'htft',
      category: 'htft_draw' as VipCategory,
      badgeText: 'HT/FT',
      badgeColor: 'text-lime-400',
      title: '100+ HT-FT',
      subtext: 'Half-time / Full-time mega slip',
      oddsRange: '@52.0 - @120+',
      borderGlow: 'hover:border-lime-500/80',
    },
  ];

  return (
    <div id="zinna-dashboard-hub" className="space-y-4 max-w-lg mx-auto pb-24 text-slate-100">
      {/* DISTINCTIVE SPORT SWITCHER (Unique improvement from generic apps) */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
          <button
            onClick={() => setSelectedSport('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedSport === 'all'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Sports
          </button>
          <button
            onClick={() => setSelectedSport('football')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              selectedSport === 'football'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>⚽</span>
            <span>Football</span>
          </button>
          <button
            onClick={() => setSelectedSport('basketball')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              selectedSport === 'basketball'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🏀</span>
            <span>Basketball</span>
          </button>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-purple-900/40 text-[11px] font-bold text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>{liveMatchesCount > 0 ? `${liveMatchesCount} In-Play` : 'Live AI Sync'}</span>
        </div>
      </div>

      {/* TOP HERO CARD 1: LIVE MATCH ANALYSIS */}
      <div
        onClick={onSelectLiveAnalysis}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelectLiveAnalysis(); }}
        className="group relative overflow-hidden rounded-2xl bg-[#110b26] hover:bg-[#160e33] border border-purple-900/50 hover:border-purple-500/70 p-4 transition-all duration-200 cursor-pointer shadow-lg shadow-purple-950/40"
      >
        {/* Left Vertical Glowing Purple Accent Bar */}
        <div className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full bg-gradient-to-b from-purple-500 to-indigo-600 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />

        <div className="flex items-center justify-between pl-2">
          <div className="flex items-center gap-3.5">
            {/* Dark rounded icon container */}
            <div className="w-12 h-12 rounded-xl bg-slate-950/80 border border-purple-800/40 flex items-center justify-center text-amber-400 shadow-inner group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide group-hover:text-purple-200 transition-colors">
                  Live Match Analysis
                </h3>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-black bg-purple-900/60 text-purple-300 border border-purple-700/50">
                  TODAY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Hand-picked free predictions for today
              </p>
            </div>
          </div>

          {/* Sleek Right Purple Arrow */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-purple-400 group-hover:text-purple-300 group-hover:translate-x-1 transition-all">
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* TOP HERO CARD 2: PERFORMANCE TRACKER */}
      <div
        onClick={onSelectPerformanceTracker}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelectPerformanceTracker(); }}
        className="group relative overflow-hidden rounded-2xl bg-[#110b26] hover:bg-[#160e33] border border-purple-900/50 hover:border-lime-500/70 p-4 transition-all duration-200 cursor-pointer shadow-lg shadow-purple-950/40"
      >
        {/* Left Vertical Glowing Amber Accent Bar */}
        <div className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full bg-gradient-to-b from-amber-400 to-yellow-500 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />

        <div className="flex items-center justify-between pl-2">
          <div className="flex items-center gap-3.5">
            {/* Dark rounded icon container with bar chart */}
            <div className="w-12 h-12 rounded-xl bg-slate-950/80 border border-amber-800/40 flex items-center justify-center text-emerald-400 shadow-inner group-hover:scale-105 transition-transform">
              <BarChart3 className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide group-hover:text-lime-200 transition-colors">
                  Performance Tracker
                </h3>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-black bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                  86.4% WIN
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Check previous winning odds and results
              </p>
            </div>
          </div>

          {/* Sleek Right Lime/Green Arrow */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-lime-400 group-hover:text-lime-300 group-hover:translate-x-1 transition-all">
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* SECTION HEADER: EXCLUSIVE TIPS VIP */}
      <div className="pt-2 pb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Vertical glowing cyan accent bar */}
            <span className="w-1 h-4 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] inline-block"></span>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black tracking-wider text-white uppercase">
                EXCLUSIVE TIPS
              </h2>
              <span className="text-xs font-bold text-purple-400 tracking-wider">
                VIP
              </span>
            </div>
          </div>

          <span className="text-[11px] text-slate-400 font-medium">
            High-Yield Categorized
          </span>
        </div>
        {/* Subtle horizontal glow underline */}
        <div className="h-px w-24 bg-gradient-to-r from-cyan-400 via-purple-500 to-transparent mt-1" />
      </div>

      {/* 2-COLUMN GRID OF 6 EXCLUSIVE VIP CARDS */}
      <div className="grid grid-cols-2 gap-3">
        {exclusiveVipCards.map((card) => (
          <div
            key={card.id}
            onClick={() => onSelectVipCategory(card.category)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onSelectVipCategory(card.category); }}
            className={`relative overflow-hidden rounded-2xl bg-[#110b26] hover:bg-[#170e36] border border-purple-900/40 ${card.borderGlow} p-4 flex flex-col items-center justify-center min-h-[105px] text-center cursor-pointer transition-all duration-200 group shadow-md shadow-purple-950/30`}
          >
            {/* Subtle corner sheen */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-purple-500/5 to-transparent pointer-events-none" />

            {/* Category Tag (FT, 2+, 5+, 15+, SCORE, HT/FT) */}
            <span className={`text-xs font-black tracking-wider ${card.badgeColor} mb-1 transition-transform group-hover:scale-110`}>
              {card.badgeText}
            </span>

            {/* Main Title (Draws VIP, Odds VIP, Correct Score, 100+ HT-FT) */}
            <h4 className="text-sm font-bold text-white group-hover:text-purple-100 transition-colors">
              {card.title}
            </h4>

            {/* Odds Hint / Subtitle */}
            <span className="text-[10px] text-slate-400 mt-1 font-mono">
              {card.oddsRange}
            </span>
          </div>
        ))}
      </div>

      {/* TELEGRAM & WHATSAPP VIP CHAT / COMMUNITY */}
      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <a
          href="https://t.me/copyerror"
          target="_blank"
          rel="noreferrer"
          className="relative overflow-hidden rounded-2xl bg-[#0f0923] hover:bg-[#160d33] border border-sky-600/40 hover:border-sky-500 p-3 flex items-center justify-between gap-2.5 text-white transition-all shadow-md group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center shrink-0 shadow-xs">
              <Send className="w-4 h-4 fill-sky-400/30" />
            </div>
            <div className="text-left truncate">
              <span className="text-xs font-bold block text-slate-100 group-hover:text-white">Telegram Chat</span>
              <span className="text-[11px] text-sky-400 font-mono">@copyerror</span>
            </div>
          </div>
          <span className="text-sky-400 group-hover:text-sky-300 group-hover:translate-x-0.5 transition-transform font-bold text-sm shrink-0">
            ➤
          </span>
        </a>

        <a
          href="https://wa.me/256703320730?text=Hello%20Zinna%20Tips%20VIP%20Access"
          target="_blank"
          rel="noreferrer"
          className="relative overflow-hidden rounded-2xl bg-[#0f0923] hover:bg-[#160d33] border border-emerald-600/40 hover:border-emerald-500 p-3 flex items-center justify-between gap-2.5 text-white transition-all shadow-md group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
              <MessageCircle className="w-4 h-4 fill-emerald-400/30" />
            </div>
            <div className="text-left truncate">
              <span className="text-xs font-bold block text-slate-100 group-hover:text-white">WhatsApp VIP</span>
              <span className="text-[11px] text-emerald-400 font-mono">+256 703 320 730</span>
            </div>
          </div>
          <span className="text-emerald-400 group-hover:text-emerald-300 group-hover:translate-x-0.5 transition-transform font-bold text-sm shrink-0">
            ➤
          </span>
        </a>
      </div>

      {/* FOOTER PRIVACY POLICY & DISCLAIMER */}
      <div className="pt-3 text-center space-y-1">
        <button
          onClick={onOpenPrivacy}
          className="text-xs text-slate-500 hover:text-slate-300 transition underline underline-offset-4 decoration-slate-700 hover:decoration-slate-400"
        >
          Privacy Policy
        </button>
        <p className="text-[10px] text-slate-600">
          Zinna Tips • 18+ Mathematical Sports Probability Platform
        </p>
      </div>
    </div>
  );
};
