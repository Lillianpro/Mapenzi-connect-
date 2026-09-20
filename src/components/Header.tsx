import React from 'react';
import { Menu, Moon, Sun, Download, Code2, Crown, Sparkles } from 'lucide-react';
import { UserSubscription } from '../types';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  user: UserSubscription | null;
  trialDaysRemaining: number;
  isTrialExpired: boolean;
  onOpenMenu: () => void;
  onOpenDownloadApk: () => void;
  onOpenFlutterCode: () => void;
  onOpenPaywall: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  user,
  trialDaysRemaining,
  isTrialExpired,
  onOpenMenu,
  onOpenDownloadApk,
  onOpenFlutterCode,
  onOpenPaywall,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#090514]/95 dark:bg-[#090514]/95 backdrop-blur border-b border-purple-900/40 transition-colors">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between">
        {/* Left: Hamburger Navigation Menu */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMenu}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-purple-950/60 transition cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Center: Glowing App Title & Subtitle */}
        <div className="text-center flex-1 px-2">
          <h1 className="text-sm sm:text-base font-black tracking-wider bg-gradient-to-r from-purple-300 via-white to-purple-200 bg-clip-text text-transparent uppercase truncate">
            ZINNA TIPS & PICKS
          </h1>
          <p className="text-[10px] sm:text-[11px] font-semibold text-cyan-400 tracking-wide flex items-center justify-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse inline-block"></span>
            <span>PREMIUM INSIGHTS</span>
          </p>
        </div>

        {/* Right: Golden Circular VIP Badge & Utilities */}
        <div className="flex items-center gap-2">
          {/* Circular Golden VIP Badge (exact match to screenshot) */}
          <button
            onClick={onOpenPaywall}
            title="VIP Membership & Access"
            className="group relative flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            {/* Scalloped / Starburst Gold Ring Effect */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-300 p-0.5 shadow-md shadow-amber-500/30 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#120b26] flex items-center justify-center relative overflow-hidden border border-amber-300/40">
                <span className="text-[10px] font-black text-amber-300 tracking-tighter uppercase drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]">
                  VIP
                </span>
              </div>
            </div>

            {/* Trial Warning Dot if expiring */}
            {isTrialExpired && !user?.is_subscribed && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 border-2 border-[#090514] rounded-full animate-ping" />
            )}
          </button>

          {/* Quick theme toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-purple-950/60 transition hidden sm:flex"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>
        </div>
      </div>
    </header>
  );
};

