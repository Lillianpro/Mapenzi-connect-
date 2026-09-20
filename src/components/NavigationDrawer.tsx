import React from 'react';
import { 
  X, 
  Home, 
  Zap, 
  Calendar as CalendarIcon, 
  Crown, 
  Radio, 
  Download, 
  Send, 
  MessageCircle,
  ShieldCheck, 
  Sun, 
  Moon, 
  FileText, 
  ChevronRight,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { AppTab, UserSubscription } from '../types';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: AppTab;
  onNavigate: (tab: AppTab) => void;
  user: UserSubscription | null;
  trialDaysRemaining: number;
  isTrialExpired: boolean;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenPaywall: () => void;
  onOpenDownloadApk: () => void;
  onOpenCommunity: () => void;
  onOpenPrivacy: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  currentTab,
  onNavigate,
  user,
  trialDaysRemaining,
  isTrialExpired,
  darkMode,
  setDarkMode,
  onOpenPaywall,
  onOpenDownloadApk,
  onOpenCommunity,
  onOpenPrivacy,
}) => {
  if (!isOpen) return null;

  const navItems = [
    {
      tab: 'home' as AppTab,
      label: 'Home Dashboard',
      subtitle: 'Overview & quick picks',
      icon: Home,
      accent: 'text-purple-400',
      badge: null,
    },
    {
      tab: 'today' as AppTab,
      label: 'Live Match Analysis',
      subtitle: 'Free hand-picked predictions',
      icon: Zap,
      accent: 'text-amber-400',
      badge: 'FREE',
    },
    {
      tab: 'calendar' as AppTab,
      label: 'Performance Tracker',
      subtitle: 'Monthly win/loss calendar',
      icon: CalendarIcon,
      accent: 'text-emerald-400',
      badge: '86% WIN',
    },
    {
      tab: 'vip' as AppTab,
      label: 'Exclusive VIP Tips',
      subtitle: 'Draws, 2+, 5+, 15+, HT/FT & Scores',
      icon: Crown,
      accent: 'text-amber-300',
      badge: 'VIP',
    },
    {
      tab: 'live' as AppTab,
      label: 'Live Scores',
      subtitle: 'Real-time match updates',
      icon: Radio,
      accent: 'text-cyan-400',
      badge: 'LIVE',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Content */}
      <div className="relative w-80 max-w-[85vw] bg-slate-950 text-white h-full shadow-2xl flex flex-col border-r border-purple-900/30 z-10">
        {/* Drawer Header */}
        <div className="p-5 border-b border-purple-900/30 flex items-center justify-between bg-gradient-to-r from-purple-950/40 via-slate-950 to-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-purple-900/50">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-wider bg-gradient-to-r from-white via-purple-100 to-cyan-300 bg-clip-text text-transparent">
                  ZINNA TIPS
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-black bg-purple-900/60 text-purple-300 border border-purple-700/50">
                  AI SPORT
                </span>
              </div>
              <p className="text-[10px] text-cyan-400 font-semibold tracking-wide flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block"></span>
                PREMIUM INSIGHTS
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Account / VIP Banner */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center text-purple-300 text-xs font-bold">
                {user?.phone ? user.phone.slice(-4) : 'VIP'}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 block truncate max-w-[140px]">
                  {user?.phone || 'Guest User'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {user?.is_subscribed ? 'UGX 15k Monthly VIP' : '7-Day Free Trial'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenPaywall();
              }}
              className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 flex items-center gap-1 shadow-sm"
            >
              <Crown className="w-3 h-3 fill-slate-950" />
              <span>{user?.is_subscribed ? 'Active VIP' : `${trialDaysRemaining}d Left`}</span>
            </button>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-1 block">
            Navigation
          </span>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => {
                  onNavigate(item.tab);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-purple-950/60 border border-purple-600/50 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-900/80 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900 border border-slate-800 ${item.accent}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-2">
                      {item.label}
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-black bg-purple-900/80 text-purple-300 border border-purple-700/50">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-600'}`} />
              </button>
            );
          })}

          <div className="pt-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-1 block">
              Quick Actions
            </span>

            {/* Telegram VIP Chat */}
            <a
              href="https://t.me/copyerror"
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
              className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-slate-300 hover:bg-slate-900/80 hover:text-white transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-950/70 border border-sky-600/30 text-sky-400 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Telegram Chat</span>
                  <span className="text-[10px] text-sky-400 font-mono">@copyerror</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </a>

            {/* WhatsApp VIP Support */}
            <a
              href="https://wa.me/256703320730?text=Hello%20Zinna%20Tips%20VIP%20Access"
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
              className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-slate-300 hover:bg-slate-900/80 hover:text-white transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-600/30 text-emerald-400 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">WhatsApp VIP Chat</span>
                  <span className="text-[10px] text-emerald-400 font-mono">+256 703 320 730</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </a>

            {/* Download Android APK */}
            <button
              onClick={() => {
                onClose();
                onOpenDownloadApk();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-slate-300 hover:bg-slate-900/80 hover:text-white transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-600/30 text-emerald-400 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Download Android APK</span>
                  <span className="text-[10px] text-slate-400">&lt;20MB Standalone App</span>
                </div>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                APK
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-slate-300 hover:bg-slate-900/80 hover:text-white transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-center">
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-300" />}
                </div>
                <div>
                  <span className="text-xs font-bold block">Theme Mode</span>
                  <span className="text-[10px] text-slate-400">{darkMode ? 'Dark Theme' : 'Light Theme'}</span>
                </div>
              </div>
              <span className="text-[10px] text-purple-400 font-bold">
                {darkMode ? 'DARK' : 'LIGHT'}
              </span>
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-purple-900/30 bg-slate-950 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              onClose();
              onOpenPrivacy();
            }}
            className="text-slate-400 hover:text-white flex items-center gap-1.5 transition text-[11px]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>
          <span className="text-[10px] text-slate-600 font-mono">v2.4.0</span>
        </div>
      </div>
    </div>
  );
};
