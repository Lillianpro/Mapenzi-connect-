import React, { useState } from 'react';
import { 
  Sparkles, 
  Activity, 
  Flame, 
  TrendingUp, 
  ShieldAlert, 
  Calendar, 
  CheckCircle2, 
  RefreshCw, 
  Gift, 
  HelpCircle, 
  Trophy,
  Crown,
  ArrowRight
} from 'lucide-react';
import { FixtureItem, SportType, UserSubscription } from '../types';
import { detectCountryFromProfile } from '../utils/countryCurrency';

interface TodayTabProps {
  fixtures: FixtureItem[];
  isLoading: boolean;
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
  onRefresh: () => void;
  trialDaysRemaining: number;
  isSubscribed: boolean;
  onOpenPaywall: () => void;
  onOpenVipTab?: () => void;
  user?: UserSubscription | null;
}

export const TodayTab: React.FC<TodayTabProps> = ({
  fixtures,
  isLoading,
  selectedSport,
  setSelectedSport,
  onRefresh,
  trialDaysRemaining,
  isSubscribed,
  onOpenPaywall,
  onOpenVipTab,
  user,
}) => {
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({});
  const countryConfig = detectCountryFromProfile(user);

  const toggleReasoning = (id: string) => {
    setExpandedReasoning((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFixtures = fixtures.filter((f) => {
    if (selectedSport === 'all') return true;
    return f.sport === selectedSport;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* 7-DAY FREE TRIAL BANNER */}
      {!isSubscribed && (
        <div className="rounded-xl p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 shadow-sm flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Gift className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                7-Day Free Trial Active ({trialDaysRemaining} days remaining)
              </h3>
              <button
                onClick={onOpenPaywall}
                className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 underline shrink-0 hover:text-emerald-800"
              >
                Plan Details
              </button>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-300/80 mt-0.5 leading-relaxed">
              You have unrestricted VIP access to all AI sports models. After 7 days, subscribe for only{' '}
              <strong className="font-bold text-emerald-800 dark:text-emerald-200">
                {countryConfig.formattedPrice} {countryConfig.perPeriod}
              </strong>{' '}
              via{' '}
              {countryConfig.code === 'UG'
                ? 'Airtel Money (+256703320730) • MTN soon coming'
                : countryConfig.paymentType === 'momo'
                ? `${countryConfig.flag} ${countryConfig.name} Mobile Money`
                : 'International Card / $'}.
            </p>
          </div>
        </div>
      )}

      {/* VIP SECTION QUICK BANNER */}
      {onOpenVipTab && (
        <div 
          onClick={onOpenVipTab}
          className="cursor-pointer rounded-xl p-3.5 bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-transparent border border-amber-400/40 dark:border-amber-500/30 hover:border-amber-400 transition-all flex items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm font-black">
              <Crown className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wide">
                  VIP Section Ready
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  19 Games + 4 Slips
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                1X2 (4), HT/FT Draw (2), FT Draw (2), Correct Score (1), Over/Under (4), Double Chance (6), Odd 2+, 5+, 15+, Mega 50+
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenVipTab();
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shrink-0 flex items-center gap-1 shadow-sm transition-all"
          >
            <span>Open VIP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* FILTER BUTTONS & CONTROLS */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedSport('all')}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
              selectedSport === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            All Sports
          </button>
          <button
            onClick={() => setSelectedSport('football')}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 ${
              selectedSport === 'football'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>⚽</span> Football
          </button>
          <button
            onClick={() => setSelectedSport('basketball')}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 ${
              selectedSport === 'basketball'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>🏀</span> Basketball (NBA)
          </button>
        </div>

        <button
          onClick={onRefresh}
          title="Refresh Fixtures"
          className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
        </button>
      </div>

      {/* MATCH PREDICTIONS LIST */}
      {isLoading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Analyzing fixtures with Gemini AI sports logic...
          </p>
        </div>
      ) : filteredFixtures.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <Trophy className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No fixtures scheduled for this filter today
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Switch to 'All Sports' to view today's available football and basketball matches.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFixtures.map((match) => (
            <div
              key={match.id}
              className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm overflow-hidden transition-all hover:border-emerald-500/40"
            >
              {/* Card Header: League & AI Accuracy Confidence Badge */}
              <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {match.sport === 'basketball' ? '🏀' : '⚽'}
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {match.league}
                  </span>
                </div>

                {/* AI Confidence Badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold text-[11px]">
                  <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>AI Confidence: {match.confidencePercent}%</span>
                </div>
              </div>

              {/* Match Score / Kickoff & Teams */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  {/* Home Team */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{match.homeLogo}</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        {match.homeTeam}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium ml-7">Home</span>
                  </div>

                  {/* Kickoff or Live Time */}
                  <div className="text-center px-3">
                    {match.status === 'live' ? (
                      <div className="space-y-0.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 animate-pulse">
                          LIVE {match.liveMinute}
                        </span>
                        <div className="text-base font-black text-slate-900 dark:text-white tracking-wider">
                          {match.liveScore}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded">
                          {match.matchTime}
                        </span>
                        <span className="block text-[10px] text-slate-400">Scheduled</span>
                      </div>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        {match.awayTeam}
                      </span>
                      <span className="text-lg">{match.awayLogo}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium mr-7">Away</span>
                  </div>
                </div>

                {/* Form Analysis & Table Standing */}
                <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    {/* Home Form */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-medium text-slate-500">
                        {match.homeTeam.substring(0, 10)}:
                      </span>
                      <div className="flex items-center gap-1">
                        {match.homeForm.map((res, i) => (
                          <span
                            key={i}
                            className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center text-white ${
                              res === 'W'
                                ? 'bg-emerald-600'
                                : res === 'D'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                          >
                            {res}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Away Form */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-medium text-slate-500">
                        {match.awayTeam.substring(0, 10)}:
                      </span>
                      <div className="flex items-center gap-1">
                        {match.awayForm.map((res, i) => (
                          <span
                            key={i}
                            className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center text-white ${
                              res === 'W'
                                ? 'bg-emerald-600'
                                : res === 'D'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                          >
                            {res}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Standing & Head to head */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800 pt-1.5 gap-1">
                    <span>📊 {match.tableStanding}</span>
                    <span>⚔️ {match.headToHeadSummary}</span>
                  </div>

                  {/* Injuries note */}
                  {match.injuriesReport && (
                    <div className="text-[10px] text-amber-700 dark:text-amber-300 flex items-start gap-1">
                      <ShieldAlert className="w-3 h-3 shrink-0 mt-0.5" />
                      <span>{match.injuriesReport}</span>
                    </div>
                  )}
                </div>

                {/* AI PREDICTED MARKETS */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    AI Predicted Markets:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {match.sport === 'basketball' ? (
                      <>
                        <div className="p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50">
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                            Winner (ML)
                          </span>
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                            {match.basketballWinner || match.homeTeam}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50">
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                            Total Points
                          </span>
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                            {match.basketballOverUnderPoints || 'Over 224.5'}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                            Double Chance
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {match.doubleChance}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                            Confidence
                          </span>
                          <span className="text-xs font-bold text-emerald-600">
                            {match.confidencePercent}%
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50">
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                            1X2 Pick
                          </span>
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                            {match.prediction1X2}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50">
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                            Double Chance
                          </span>
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                            {match.doubleChance}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                            Goals O/U
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {match.overUnder}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                            Both Score (BTTS)
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {match.btts}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* "WHY THIS PREDICTION?" SECTION (Required by user) */}
                <div className="rounded-xl p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-200">
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Why this prediction?</span>
                  </div>
                  <p className="text-xs text-emerald-900 dark:text-emerald-100/90 leading-relaxed">
                    {match.whyThisPrediction}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
