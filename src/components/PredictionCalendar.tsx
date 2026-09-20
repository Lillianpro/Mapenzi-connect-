import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WinCelebration } from './WinCelebration';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  Award,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  MONTHLY_PERFORMANCE_RECORDS, 
  getMonthPerformanceStats 
} from '../data/calendarPerformanceData';
import { DayPerformance } from '../types';

export const PredictionCalendar: React.FC = () => {
  // Current calendar viewing month (defaults to Sept 2026 as per local context)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 9 = September
  
  // Selected day for inspection (defaults to latest complete day or today)
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-19');
  const [celebrationKey, setCelebrationKey] = useState<string>('2026-09-19');
  const [isDetailExpanded, setIsDetailExpanded] = useState<boolean>(true);

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleGoToToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(9);
    setSelectedDate('2026-09-20');
    setCelebrationKey(`2026-09-20-${Date.now()}`);
    setIsDetailExpanded(true);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonthName = monthNames[currentMonth - 1];

  // Calculate calendar grid days
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 = Sunday

  // Month summary metrics
  const monthStats = getMonthPerformanceStats(currentYear, currentMonth);

  // Day record currently selected
  const selectedRecord: DayPerformance | undefined = MONTHLY_PERFORMANCE_RECORDS[selectedDate];

  // Helper formatting for date
  const formatSelectedDateHeader = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div id="prediction-performance-calendar" className="bg-white dark:bg-[#0f0923] rounded-2xl border border-slate-200 dark:border-purple-900/50 p-4 sm:p-5 shadow-lg shadow-purple-950/20 space-y-4">
      {/* SECTION TITLE & HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Prediction Performance Calendar
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Verified History
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Track daily win/loss consistency, hit-rates & odds record
              </p>
            </div>
          </div>
        </div>

        {/* Month Navigator Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
            title="Previous Month"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 font-bold text-xs text-slate-800 dark:text-slate-200 min-w-[125px] text-center">
            {currentMonthName} {currentYear}
          </div>

          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
            title="Next Month"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleGoToToday}
            className="px-2.5 py-1 text-[11px] rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition ml-1"
          >
            Today
          </button>
        </div>
      </div>

      {/* MONTHLY SUMMARY METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Month Win Rate
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {monthStats.overallWinRate}%
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 inline" />
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Picks Won / Lost
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5 font-bold text-slate-800 dark:text-slate-200">
            <span className="text-emerald-600 dark:text-emerald-400">{monthStats.totalWins} W</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-rose-600 dark:text-rose-400">{monthStats.totalLosses} L</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Winning Days
          </span>
          <div className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{monthStats.winningDays} Days</span>
            <span className="text-[10px] text-slate-400">
              ({monthStats.activeDays > 0 ? Math.round((monthStats.winningDays / monthStats.activeDays) * 100) : 0}%)
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Mixed / Loss Days
          </span>
          <div className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {monthStats.mixedDays}
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              {monthStats.losingDays}
            </span>
          </div>
        </div>
      </div>

      {/* COLOR-CODED LEGEND */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
        <span className="font-bold text-slate-400 uppercase text-[10px]">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[8px] text-emerald-700 dark:text-emerald-300 font-bold">W</span>
          <span>Win Day (≥75% Won)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-amber-500/20 border border-amber-500 flex items-center justify-center text-[8px] text-amber-700 dark:text-amber-300 font-bold">M</span>
          <span>Mixed Day (50–74%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-rose-500/20 border border-rose-500 flex items-center justify-center text-[8px] text-rose-700 dark:text-rose-300 font-bold">L</span>
          <span>Loss Day (&lt;50%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md border-2 border-emerald-500 border-dashed bg-emerald-50 dark:bg-emerald-950/40"></span>
          <span>Today / Active</span>
        </div>
      </div>

      {/* MONTHLY CALENDAR GRID */}
      <div>
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-[11px] font-bold text-slate-400 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Pre-month empty days */}
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="h-14 sm:h-16 rounded-xl border border-transparent bg-slate-50/40 dark:bg-slate-900/20 opacity-30"
            />
          ))}

          {/* Days of current month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const record = MONTHLY_PERFORMANCE_RECORDS[dateStr];
            const isSelected = selectedDate === dateStr;
            const isToday = dateStr === '2026-09-20';

            // Determine styling based on day performance
            let bgClass = 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400';
            let badgeEl = null;

            if (record) {
              if (record.status === 'win') {
                bgClass = isSelected
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-600 dark:border-emerald-400 ring-2 ring-emerald-500 text-emerald-950 dark:text-white'
                  : 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80 hover:border-emerald-500 text-slate-900 dark:text-slate-100';
                badgeEl = (
                  <div className="mt-0.5 inline-flex items-center gap-0.5 px-1 py-0.2 rounded font-black text-[9px] bg-emerald-500 text-white shadow-xs">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>{record.wins}/{record.totalPicks}</span>
                  </div>
                );
              } else if (record.status === 'mixed') {
                bgClass = isSelected
                  ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-500 ring-2 ring-amber-500 text-amber-950 dark:text-white'
                  : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/80 hover:border-amber-500 text-slate-900 dark:text-slate-100';
                badgeEl = (
                  <div className="mt-0.5 inline-flex items-center gap-0.5 px-1 py-0.2 rounded font-black text-[9px] bg-amber-500 text-slate-950 shadow-xs">
                    <span>{record.wins}/{record.totalPicks}</span>
                  </div>
                );
              } else if (record.status === 'loss') {
                bgClass = isSelected
                  ? 'bg-rose-100 dark:bg-rose-950/80 border-rose-500 ring-2 ring-rose-500 text-rose-950 dark:text-white'
                  : 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/80 hover:border-rose-500 text-slate-900 dark:text-slate-100';
                badgeEl = (
                  <div className="mt-0.5 inline-flex items-center gap-0.5 px-1 py-0.2 rounded font-black text-[9px] bg-rose-500 text-white shadow-xs">
                    <XCircle className="w-2.5 h-2.5" />
                    <span>{record.wins}/{record.totalPicks}</span>
                  </div>
                );
              } else if (record.status === 'today') {
                bgClass = isSelected
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500 text-slate-900 dark:text-white'
                  : 'bg-emerald-500/10 dark:bg-emerald-500/20 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                badgeEl = (
                  <div className="mt-0.5 inline-flex items-center gap-0.5 px-1 py-0.2 rounded font-black text-[9px] bg-emerald-600 text-white shadow-xs animate-pulse">
                    <span>LIVE</span>
                  </div>
                );
              } else if (record.status === 'upcoming') {
                bgClass = isSelected
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-400 ring-2 ring-slate-400 text-slate-700 dark:text-slate-200'
                  : 'bg-slate-50/50 dark:bg-slate-900/30 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-400';
                badgeEl = (
                  <span className="text-[8px] font-semibold text-slate-400 block mt-0.5">
                    {record.totalPicks} picks
                  </span>
                );
              }
            }

            return (
              <motion.button
                key={dateStr}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                animate={isSelected && record?.status === 'win' ? { scale: [1, 1.04, 1] } : {}}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  setSelectedDate(dateStr);
                  setCelebrationKey(`${dateStr}-${Date.now()}`);
                  setIsDetailExpanded(true);
                }}
                className={`h-14 sm:h-16 rounded-xl border p-1 sm:p-1.5 flex flex-col justify-between text-left transition-all relative ${bgClass}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-bold ${isToday ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''}`}>
                    {dayNum}
                  </span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  )}
                </div>

                <div className="w-full truncate">
                  {badgeEl}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* SELECTED DAY PERFORMANCE INSPECTION DRAWER */}
      {selectedRecord ? (
        <div className="rounded-2xl border border-slate-200 dark:border-purple-900/40 bg-slate-50 dark:bg-[#110b26] p-4 space-y-3 transition-all shadow-md">
          {/* CELEBRATORY ANIMATION FOR WIN DAYS */}
          {selectedRecord.status === 'win' && (
            <WinCelebration
              record={selectedRecord}
              dateFormatted={formatSelectedDateHeader(selectedRecord.date)}
              triggerKey={celebrationKey}
            />
          )}

          <div className="flex items-center justify-between border-b border-slate-200 dark:border-purple-900/40 pb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {formatSelectedDateHeader(selectedRecord.date)}
                </span>
                {selectedRecord.date === '2026-09-20' && (
                  <span className="text-[10px] px-2 py-0.2 rounded-full font-black bg-emerald-500 text-white">
                    TODAY
                  </span>
                )}
              </div>
              {selectedRecord.highlights && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 italic">
                  "{selectedRecord.highlights}"
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
                  selectedRecord.status === 'win' || (selectedRecord.status === 'today' && selectedRecord.wins > 0)
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : selectedRecord.status === 'mixed'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    : selectedRecord.status === 'loss'
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {selectedRecord.status === 'win' && <CheckCircle2 className="w-3.5 h-3.5" />}
                {selectedRecord.status === 'loss' && <XCircle className="w-3.5 h-3.5" />}
                {selectedRecord.status === 'upcoming' ? (
                  'Upcoming Day'
                ) : (
                  `${selectedRecord.wins} Won / ${selectedRecord.losses} Lost (${selectedRecord.winRate}%)`
                )}
              </span>

              <button
                onClick={() => setIsDetailExpanded(!isDetailExpanded)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title={isDetailExpanded ? 'Collapse' : 'Expand'}
              >
                {isDetailExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar for Day */}
          {selectedRecord.status !== 'upcoming' && (
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/90 rounded-xl p-2.5 border border-slate-200/80 dark:border-slate-700/80">
              <div>
                <span className="text-slate-400 text-[10px] block">Day Strike Rate</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedRecord.winRate}% Accurate
                </span>
              </div>

              {selectedRecord.totalOddsWon && (
                <div>
                  <span className="text-slate-400 text-[10px] block">Odds Landed</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    @{selectedRecord.totalOddsWon} Total
                  </span>
                </div>
              )}

              <div>
                <span className="text-slate-400 text-[10px] block">Total Slips</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedRecord.totalPicks} Predictions
                </span>
              </div>
            </div>
          )}

          {/* Detailed predictions list */}
          {isDetailExpanded && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {selectedRecord.status === 'upcoming' ? 'Scheduled Fixtures' : 'Individual Prediction Results'}
              </span>

              {selectedRecord.predictions.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  Predictions for this date will be generated and published 12 hours prior to kickoff.
                </div>
              ) : (
                selectedRecord.predictions.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-slate-400">
                          {p.league}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono font-bold">
                          Score: {p.finalScore}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white truncate mt-0.5">
                        {p.match}
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Tip: <span className="font-bold">{p.tip}</span> (@{p.odds})
                      </div>
                    </div>

                    <div className="shrink-0">
                      {p.finalScore === 'Scheduled' ? (
                        <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500">
                          PENDING
                        </span>
                      ) : p.result === 'won' ? (
                        <span className="px-2.5 py-1 rounded-lg font-black text-[11px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1 shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          WON
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg font-black text-[11px] bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 inline-flex items-center gap-1 shadow-xs">
                          <XCircle className="w-3.5 h-3.5" />
                          LOST
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
          Select any date on the calendar above to view its detailed predictions and win/loss breakdown.
        </div>
      )}
    </div>
  );
};
