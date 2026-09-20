import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Calendar, 
  CreditCard, 
  Smartphone, 
  Download, 
  Code2, 
  LogOut, 
  Clock, 
  Sparkles,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  Globe,
  ChevronDown
} from 'lucide-react';
import { UserSubscription } from '../types';
import { PredictionCalendar } from './PredictionCalendar';
import { 
  detectCountryFromProfile, 
  ALL_SUPPORTED_COUNTRIES, 
  CountryCode 
} from '../utils/countryCurrency';

interface ProfileTabProps {
  user: UserSubscription | null;
  trialDaysRemaining: number;
  isTrialExpired: boolean;
  onOpenPaywall: () => void;
  onToggleSimulateExpired: () => void;
  onOpenDownloadApk: () => void;
  onOpenFlutterCode: () => void;
  onLogout: () => void;
  onChangeCountry?: (countryCode: string) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  trialDaysRemaining,
  isTrialExpired,
  onOpenPaywall,
  onToggleSimulateExpired,
  onOpenDownloadApk,
  onOpenFlutterCode,
  onLogout,
  onChangeCountry,
}) => {
  const detected = detectCountryFromProfile(user);
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  return (
    <div className="space-y-4 pb-20 max-w-xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xl border-2 border-emerald-500/30">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {user?.phone || '+256 700 000 000'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1 ${
                  user?.is_subscribed
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : isTrialExpired
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                {user?.is_subscribed
                  ? 'VIP Active (UGX 15k/Mo)'
                  : isTrialExpired
                  ? 'Trial Expired'
                  : `7-Day Trial (${trialDaysRemaining}d left)`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Status Card */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Subscription Details (Stored in Firebase)
          </h3>
          <span className="text-[11px] text-emerald-600 font-semibold">Firestore Synced</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px]">Current Tier</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {user?.is_subscribed ? 'Monthly VIP' : '7-Day Free Trial'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px]">Detected Country & Currency</span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5">
                <span>{detected.flag}</span>
                <span>{detected.currency}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowCountrySelector(!showCountrySelector)}
                className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                Change
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px]">Payment Carrier</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              {user?.payment_method || (detected.code === 'UG' ? 'Airtel (+256703320730)' : detected.paymentType === 'momo' ? `${detected.name} MoMo` : 'International Card')}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px]">Pricing Plan</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              {detected.formattedPrice} {detected.perPeriod}
            </span>
          </div>
        </div>

        {/* Inline Country Switcher */}
        {showCountrySelector && (
          <div className="p-3 bg-slate-100 dark:bg-purple-950/40 rounded-xl border border-slate-200 dark:border-purple-800/40 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                Select Profile Country:
              </span>
              <span className="text-[10px] text-slate-400">Updates MoMo currency</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {ALL_SUPPORTED_COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    if (onChangeCountry) onChangeCountry(c.code);
                    setShowCountrySelector(false);
                  }}
                  className={`p-2 rounded-lg text-left text-xs flex items-center gap-1.5 border transition ${
                    c.code === detected.code
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>{c.flag}</span>
                  <div className="truncate">
                    <span className="block font-bold">{c.currency}</span>
                    <span className="text-[10px] text-slate-400">{c.formattedPrice}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Subscribe or Extend Button */}
        <button
          onClick={onOpenPaywall}
          className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition active:scale-[0.99]"
        >
          <CreditCard className="w-4 h-4" />
          <span>
            {user?.is_subscribed 
              ? `Renew VIP (${detected.formattedPrice})` 
              : `Upgrade to VIP (${detected.formattedPrice} / Month)`}
          </span>
        </button>

        {/* VIP Features Covered */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
          <div className="font-bold text-slate-700 dark:text-slate-300">
            Active VIP Sections Included:
          </div>
          <div className="grid grid-cols-2 gap-1">
            <span>• 1X2 Games (4 games)</span>
            <span>• HT/FT Draw (2 games)</span>
            <span>• FT Draw (2 games)</span>
            <span>• Correct Score of the Day</span>
            <span>• Over/Under (4 games)</span>
            <span>• Double Chance (6 games)</span>
            <span>• Odd 2++ & Odd 5++ Slips</span>
            <span>• Odd 15++ & Mega Odd 50</span>
          </div>
        </div>
      </div>

      {/* Monthly Performance Calendar Section */}
      <PredictionCalendar />

      {/* Developer / Testing Switch for Paywall Lock */}
      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/60 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Developer Paywall Test Mode</span>
          </div>
          <button
            onClick={onToggleSimulateExpired}
            className={`text-xs px-3 py-1 rounded-full font-bold transition-all ${
              isTrialExpired
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300'
            }`}
          >
            {isTrialExpired ? 'Trial Expired (LOCKED)' : 'Simulate Expired'}
          </button>
        </div>
        <p className="text-[11px] text-amber-800 dark:text-amber-300/80 leading-relaxed">
          Toggle this to test the requirement: <em>"After 7 days, lock the app. Show a paywall screen: Trial Ended. Subscribe for UGX 15,000 / Month to continue"</em>.
        </p>
      </div>

      {/* Mobile Download & Flutter Source Code */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Mobile App & Flutter Code
        </h3>

        <button
          onClick={onOpenDownloadApk}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 text-left flex items-center justify-between transition text-xs"
        >
          <div className="flex items-center gap-2.5">
            <Download className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Download Android APK (&lt;20MB)
              </span>
              <span className="text-[10px] text-slate-400">
                Lightweight build optimized for low-end Android phones
              </span>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
            18.2 MB
          </span>
        </button>

        <button
          onClick={onOpenFlutterCode}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 text-left flex items-center justify-between transition text-xs"
        >
          <div className="flex items-center gap-2.5">
            <Code2 className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Browse Flutter + Firebase Project Code
              </span>
              <span className="text-[10px] text-slate-400">
                View pubspec.yaml, main.dart, models, and screens
              </span>
            </div>
          </div>
          <span className="text-slate-400 font-bold text-xs">&rarr;</span>
        </button>
      </div>

      {/* Log out / Switch phone */}
      <button
        onClick={onLogout}
        className="w-full py-3 px-4 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs flex items-center justify-center gap-2 transition"
      >
        <LogOut className="w-4 h-4" />
        <span>Switch Phone Number / Log Out</span>
      </button>
    </div>
  );
};
