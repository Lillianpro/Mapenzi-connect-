import React from 'react';
import { Activity, Radio, Sparkles, Trophy } from 'lucide-react';
import { FixtureItem } from '../types';

interface LiveScoresTabProps {
  fixtures: FixtureItem[];
  onRefresh: () => void;
  isLoading: boolean;
}

export const LiveScoresTab: React.FC<LiveScoresTabProps> = ({ fixtures, onRefresh, isLoading }) => {
  const liveMatches = fixtures.filter((f) => f.status === 'live');
  const finishedMatches = fixtures.filter((f) => f.status === 'finished');

  return (
    <div className="space-y-4 pb-20">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Live In-Play Scores ({liveMatches.length})
          </h2>
        </div>
        <button
          onClick={onRefresh}
          className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-200"
        >
          {isLoading ? 'Updating...' : 'Sync Live'}
        </button>
      </div>

      {/* Live Match Cards */}
      {liveMatches.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
          <Radio className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No Live Games in Progress Right Now
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            Matches kick off later today. Head over to the <strong>Today</strong> tab to check pre-match AI picks and confidence percentages.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {liveMatches.map((match) => (
            <div
              key={match.id}
              className="bg-white dark:bg-slate-800/90 rounded-2xl border-2 border-rose-500/30 dark:border-rose-500/40 p-4 shadow-sm relative overflow-hidden"
            >
              <div className="flex items-center justify-between text-xs mb-3 border-b border-slate-100 dark:border-slate-700/60 pb-2">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <span>{match.sport === 'basketball' ? '🏀' : '⚽'}</span>
                  {match.league}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-black text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                  {match.liveMinute || 'LIVE'}
                </span>
              </div>

              {/* Match Score Display */}
              <div className="flex items-center justify-between my-2">
                <div className="flex-1">
                  <span className="text-xl block">{match.homeLogo}</span>
                  <span className="font-bold text-slate-900 dark:text-white text-base">
                    {match.homeTeam}
                  </span>
                </div>

                <div className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-black text-xl tracking-wider shadow-sm">
                  {match.liveScore || '0 - 0'}
                </div>

                <div className="flex-1 text-right">
                  <span className="text-xl block">{match.awayLogo}</span>
                  <span className="font-bold text-slate-900 dark:text-white text-base">
                    {match.awayTeam}
                  </span>
                </div>
              </div>

              {/* Live AI Tracking */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-900/50 -mx-4 -mb-4 p-3 rounded-b-2xl">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pre-Match AI Prediction:</span>
                </div>
                <div className="font-bold text-emerald-700 dark:text-emerald-300">
                  {match.prediction1X2} ({match.confidencePercent}% Confidence)
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
