import React from 'react';
import { ShieldAlert, Globe, Sun, Moon, Wifi, WifiOff, Sparkles, UserCheck, LogIn } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { UI_TRANSLATIONS } from '../data/mockData';

interface HeaderProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  isLowDataMode: boolean;
  onToggleLowDataMode: () => void;
  onOpenPanic: () => void;
  isAdminView?: boolean;
  onToggleAdminView?: () => void;
  onOpenAdmin?: () => void;
  onOpenAuth?: () => void;
  onOpenMomo: () => void;
  isPremium: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  isDarkMode = true,
  onToggleDarkMode,
  isLowDataMode,
  onToggleLowDataMode,
  onOpenPanic,
  isAdminView = false,
  onToggleAdminView,
  onOpenAdmin,
  onOpenAuth,
  onOpenMomo,
  isPremium,
}) => {
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;

  const handleAdminClick = () => {
    if (typeof onToggleAdminView === 'function') {
      onToggleAdminView();
    } else if (typeof onOpenAdmin === 'function') {
      onOpenAdmin();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-stone-900/95 text-stone-100 backdrop-blur-md border-b border-amber-900/40 px-3 py-2.5 sm:px-5">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-orange-950/30 border border-amber-500/50 shrink-0 bg-stone-950">
            <img
              src="/app_icon.png"
              alt="Mapenzi Connect"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-amber-100 bg-clip-text text-transparent">
                Mapenzi Connect
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-600/30">
                East Africa
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-medium hidden sm:block">
              {t.subtagline}
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Low Data 2G Mode Indicator */}
          <button
            id="low-data-toggle-btn"
            onClick={onToggleLowDataMode}
            title={isLowDataMode ? "Low-data 2G Mode Active (<15MB)" : "Switch to Low-Data 2G Mode"}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all ${
              isLowDataMode
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 border border-stone-700/50'
            }`}
          >
            {isLowDataMode ? <WifiOff className="w-3.5 h-3.5 text-emerald-400" /> : <Wifi className="w-3.5 h-3.5" />}
            <span className="text-[10px] hidden md:inline">{isLowDataMode ? '2G Low-Data' : 'Full-Data'}</span>
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-amber-400 absolute left-2 pointer-events-none" />
            <select
              id="language-select-header"
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              className="bg-stone-800 text-stone-200 text-xs font-semibold pl-6 pr-2 py-1 rounded-lg border border-stone-700 hover:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer appearance-none"
            >
              <option value="en">🇬🇧 English</option>
              <option value="sw">🇹🇿 Swahili</option>
              <option value="lg">🇺🇬 Luganda</option>
              <option value="rw">🇷🇼 Kinyarwanda</option>
            </select>
          </div>

          {/* Premium / MoMo Badge */}
          {isPremium ? (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span className="text-[10px]">VIP Member</span>
            </div>
          ) : (
            <button
              id="header-upgrade-btn"
              onClick={onOpenMomo}
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white text-xs font-bold hover:brightness-110 shadow-sm"
              title="Upgrade to VIP via Airtel Money or MTN MoMo"
            >
              <Sparkles className="w-3 h-3" />
              <span className="text-[10px] hidden sm:inline">VIP (15k/40k UGX)</span>
              <span className="text-[10px] sm:hidden">VIP</span>
            </button>
          )}

          {/* Panic Emergency Button */}
          <button
            id="panic-quick-btn"
            onClick={onOpenPanic}
            title="Emergency Panic Button: Dispatches Live GPS via SMS"
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-950 text-red-300 border border-red-600 hover:bg-red-900 transition-all font-bold text-xs"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span className="text-[10px] font-extrabold tracking-wider hidden sm:inline">PANIC</span>
          </button>

          {/* Admin Switcher */}
          <button
            id="admin-toggle-btn"
            onClick={handleAdminClick}
            title="Switch to East Africa Admin Console"
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              isAdminView
                ? 'bg-amber-600 text-white border-amber-400'
                : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-amber-300'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
          </button>

          {/* Auth / OTP Login Button */}
          {onOpenAuth && (
            <button
              id="header-auth-btn"
              onClick={onOpenAuth}
              title="SMS OTP Login"
              className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-700 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Dark / Light toggle (if handler supplied) */}
          {onToggleDarkMode && (
            <button
              id="dark-mode-toggle-btn"
              onClick={onToggleDarkMode}
              title="Toggle Dark / Light Theme"
              className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-700 transition-colors"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-stone-300" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
