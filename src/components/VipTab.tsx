import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Copy, 
  Check, 
  Flame, 
  Target, 
  Scale, 
  Percent, 
  ShieldCheck, 
  TrendingUp, 
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  Share2,
  RefreshCw
} from 'lucide-react';
import { VipCategory, VipGame, VipOddsSlip } from '../types';
import { VIP_GAMES, VIP_ODDS_SLIPS } from '../data/vipData';

interface VipTabProps {
  isSubscribed: boolean;
  trialDaysRemaining: number;
  isTrialExpired: boolean;
  onOpenPaywall: () => void;
  initialCategory?: VipCategory;
}

export const VipTab: React.FC<VipTabProps> = ({
  isSubscribed,
  trialDaysRemaining,
  isTrialExpired,
  onOpenPaywall,
  initialCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<VipCategory>(initialCategory || 'all');

  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [expandedReasonId, setExpandedReasonId] = useState<string | null>(null);
  const [customStake, setCustomStake] = useState<Record<string, number>>({
    'slip-odd-2': 20000,
    'slip-odd-5': 10000,
    'slip-odd-15': 10000,
    'slip-mega-50': 10000,
  });

  // Paywall lock check: Locked if trial has expired and user is not subscribed
  const isLocked = isTrialExpired && !isSubscribed;

  // Filter games according to selected category
  const filteredGames = selectedCategory === 'all' 
    ? VIP_GAMES 
    : selectedCategory === 'slips' 
      ? [] 
      : VIP_GAMES.filter((g) => g.category === selectedCategory);

  const shouldShowSlips = selectedCategory === 'all' || selectedCategory === 'slips';

  // Category counts
  const counts = {
    '1x2': VIP_GAMES.filter((g) => g.category === '1x2').length, // 4
    'htft_draw': VIP_GAMES.filter((g) => g.category === 'htft_draw').length, // 2
    'ft_draw': VIP_GAMES.filter((g) => g.category === 'ft_draw').length, // 2
    'correct_score': VIP_GAMES.filter((g) => g.category === 'correct_score').length, // 1
    'over_under': VIP_GAMES.filter((g) => g.category === 'over_under').length, // 4
    'double_chance': VIP_GAMES.filter((g) => g.category === 'double_chance').length, // 6
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => {
      setCopiedCodeId(null);
    }, 2500);
  };

  const handleShareWhatsApp = (title: string, odds: string, bookingCode: string) => {
    const text = encodeURIComponent(
      `🔥 Zinna Tips VIP Slip: *${title}* (Odds: ${odds}) | Booking Code: ${bookingCode}. Download Zinna Tips app for daily high accuracy football predictions!`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. VIP Header & Membership Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/15 via-emerald-600/10 to-slate-900/10 dark:from-amber-500/10 dark:via-emerald-500/10 dark:to-slate-900 border border-amber-400/40 dark:border-amber-500/30 p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 uppercase tracking-wide">
                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                VIP Access Active
              </span>
              {isSubscribed ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" /> Paid Member
                </span>
              ) : !isTrialExpired ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                  <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" /> {trialDaysRemaining} Days Free Trial Left
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                  <Lock className="w-3 h-3" /> Trial Ended
                </span>
              )}
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              VIP High-Accuracy Tips & Slips
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Curated daily VIP selections: 1X2 (4 games), HT/FT Draw (2 games), FT Draw (2 games), 
              Correct Score of the Day, Over/Under (4 games), Double Chance (6 games), plus Odd 2++, 
              Odd 5++, Odd 15++, and Mega Odd 50.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-center min-w-[110px]">
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                VIP Win Rate
              </div>
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-emerald-600 dark:fill-emerald-400" />
                92.4%
              </div>
              <div className="text-[10px] text-slate-400">Past 30 Days</div>
            </div>

            {isLocked && (
              <button
                onClick={onOpenPaywall}
                className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 animate-pulse"
              >
                <Lock className="w-4 h-4" />
                Unlock VIP (UGX 15,000)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Locked Warning Banner if Trial Expired */}
      {isLocked && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-rose-900 dark:text-rose-200">
            <div className="w-10 h-10 rounded-full bg-rose-200 dark:bg-rose-900 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-rose-700 dark:text-rose-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Your 7-Day Free Trial Has Ended</h3>
              <p className="text-xs text-rose-700 dark:text-rose-300">
                Subscribe for UGX 15,000 / Month via MTN Mobile Money or Airtel Money to unlock all VIP predictions.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenPaywall}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shrink-0 text-center"
          >
            Renew VIP Now
          </button>
        </div>
      )}

      {/* 3. Category Filter Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Select VIP Category:
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            19 Matches + 4 Slips Today
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <span>🌟 All VIP</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200/50 dark:bg-slate-700/50">
              {VIP_GAMES.length + VIP_ODDS_SLIPS.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('slips')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === 'slips'
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Odds Slips (4 Slips)</span>
          </button>

          <button
            onClick={() => setSelectedCategory('1x2')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === '1x2'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <span>🏆 1X2 Games</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
              {counts['1x2']}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('htft_draw')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === 'htft_draw'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <span>⚖️ HFT Draw</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
              {counts['htft_draw']}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('ft_draw')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === 'ft_draw'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <span>🤝 FT Draw</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
              {counts['ft_draw']}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('correct_score')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === 'correct_score'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <span>🎯 Correct Score</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
              {counts['correct_score']}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('over_under')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === 'over_under'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <span>⚽ Over/Under</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
              {counts['over_under']}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('double_chance')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === 'double_chance'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <span>🛡️ Double Chance</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
              {counts['double_chance']}
            </span>
          </button>
        </div>
      </div>

      {/* 4. SECTION A: SPECIAL ODDS SLIPS (Odd 2++, Odd 5++, Odd 15++, Mega Odd 50) */}
      {shouldShowSlips && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                VIP Special Odds Slips & Multi-Bets
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              4 Formatted Slips Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VIP_ODDS_SLIPS.map((slip) => {
              const stake = customStake[slip.id] || slip.sampleStakeUgx;
              const numericOdds = parseFloat(slip.totalOdds);
              const potentialReturn = Math.round(stake * numericOdds);
              const isMega = slip.type === 'mega_50';

              return (
                <div
                  key={slip.id}
                  className={`rounded-2xl p-5 transition-all relative ${
                    isMega
                      ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-slate-900/10 dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 border-2 border-amber-500/50 shadow-md'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm'
                  }`}
                >
                  {/* Top bar of slip */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide uppercase ${
                            isMega
                              ? 'bg-amber-500 text-slate-950'
                              : slip.type === 'odd_15'
                              ? 'bg-purple-600 text-white'
                              : slip.type === 'odd_5'
                              ? 'bg-blue-600 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {slip.tag}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {slip.games.length} Legs
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {slip.title}
                      </h3>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-400">Total Odds</div>
                      <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        {slip.totalOdds}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                    {slip.summary}
                  </p>

                  {/* Games in slip */}
                  <div className="space-y-2 mb-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Included Matches:
                    </div>

                    {slip.games.map((g, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 text-xs py-1 border-b last:border-0 border-slate-200/50 dark:border-slate-800/60"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {g.match}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {g.league} • {g.time}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          {isLocked ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 blur-sm select-none">
                              Pick Locked
                            </span>
                          ) : (
                            <div className="font-bold text-emerald-600 dark:text-emerald-400">
                              {g.tip}
                            </div>
                          )}
                          <div className="text-[10px] font-mono text-slate-500">
                            @{g.odds}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stake & Potential Return Calculator */}
                  <div className="bg-slate-100 dark:bg-slate-800/60 rounded-xl p-3 mb-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">
                        Enter Stake (UGX):
                      </span>
                      <input
                        type="number"
                        step="1000"
                        min="1000"
                        value={stake}
                        onChange={(e) =>
                          setCustomStake((prev) => ({
                            ...prev,
                            [slip.id]: Math.max(1000, Number(e.target.value) || 1000),
                          }))
                        }
                        className="w-28 text-right bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-2 py-1 font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Potential Return:
                      </span>
                      <span className="font-black text-sm text-emerald-600 dark:text-emerald-400 font-mono">
                        UGX {potentialReturn.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Booking Code & Action Bar */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-500">
                        {slip.bookingCode.provider} Code:
                      </span>
                      {isLocked ? (
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-400 blur-sm select-none">
                          XXXX-XXXX
                        </span>
                      ) : (
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          {slip.bookingCode.code}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isLocked ? (
                        <button
                          onClick={onOpenPaywall}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                        >
                          <Lock className="w-3.5 h-3.5" /> Unlock Code
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleCopyCode(slip.id, slip.bookingCode.code)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 transition-all"
                            title="Copy booking code"
                          >
                            {copiedCodeId === slip.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                  Copied!
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() =>
                              handleShareWhatsApp(
                                slip.title,
                                slip.totalOdds,
                                slip.bookingCode.code
                              )
                            }
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-all"
                            title="Share on WhatsApp"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. SECTION B: VIP INDIVIDUAL GAMES CURATED BY CATEGORY */}
      {filteredGames.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {selectedCategory === 'all'
                  ? 'All VIP Matches Today'
                  : `${filteredGames[0]?.categoryLabel} Selections (${filteredGames.length} Games)`}
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {filteredGames.length} Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGames.map((game) => {
              const isExpanded = expandedReasonId === game.id;
              const isCorrectScore = game.category === 'correct_score';

              return (
                <div
                  key={game.id}
                  className={`rounded-2xl p-4 md:p-5 transition-all relative ${
                    isCorrectScore
                      ? 'bg-gradient-to-br from-amber-500/10 to-emerald-500/10 border-2 border-amber-500/50 shadow-md'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm'
                  }`}
                >
                  {/* Category Pill & Kick-off Time */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        game.category === 'correct_score'
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : game.category === 'htft_draw'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : game.category === 'ft_draw'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : game.category === '1x2'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : game.category === 'over_under'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {game.categoryLabel}
                    </span>

                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {game.league} • {game.matchTime}
                    </span>
                  </div>

                  {/* Teams Row */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{game.homeLogo}</span>
                      <span className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
                        {game.homeTeam}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-slate-400 uppercase">VS</span>

                    <div className="flex items-center gap-2 text-right">
                      <span className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
                        {game.awayTeam}
                      </span>
                      <span className="text-2xl">{game.awayLogo}</span>
                    </div>
                  </div>

                  {/* VIP Prediction & Odds Box */}
                  <div className="bg-slate-50 dark:bg-slate-950/70 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        VIP Prediction
                      </div>
                      {isLocked ? (
                        <div className="flex items-center gap-1.5 text-sm font-bold text-amber-600 dark:text-amber-400 blur-sm select-none">
                          <Lock className="w-3.5 h-3.5" /> Hidden (VIP Locked)
                        </div>
                      ) : (
                        <div className="text-sm md:text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                          {game.tip}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Odds
                        </div>
                        <div className="text-base font-black text-slate-900 dark:text-white font-mono">
                          @{game.odds}
                        </div>
                      </div>

                      <div className="text-right pl-3 border-l border-slate-200 dark:border-slate-800">
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Accuracy
                        </div>
                        <div className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 inline-block">
                          {game.confidencePercent}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Why this prediction expandable */}
                  <div>
                    <button
                      onClick={() =>
                        setExpandedReasonId(isExpanded ? null : game.id)
                      }
                      className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Why this VIP prediction?</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 ml-auto" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 ml-auto" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800 leading-relaxed">
                        {isLocked ? (
                          <div className="flex items-center justify-between gap-2">
                            <span className="blur-xs select-none">
                              Tactical breakdown based on home form and xG metrics...
                            </span>
                            <button
                              onClick={onOpenPaywall}
                              className="text-emerald-600 font-bold hover:underline shrink-0"
                            >
                              Unlock Analysis
                            </button>
                          </div>
                        ) : (
                          game.whyThisPrediction
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. VIP Bottom Guarantee / Mobile Money Support Box */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-black text-amber-400 tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Uganda Mobile Money VIP Guarantee
            </span>
            <h3 className="text-lg font-bold mt-1">
              MTN & Airtel Money Instant Subscription (UGX 15,000 / Month)
            </h3>
            <p className="text-xs text-slate-300 max-w-xl mt-0.5">
              Get unlimited 24/7 access to all 1X2 games, HT/FT Draws, FT Draws, Correct Score of the Day, Over/Under, Double Chance, and Mega Odd 50.
            </p>
          </div>

          <button
            onClick={onOpenPaywall}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all shrink-0 flex items-center gap-1.5"
          >
            <Crown className="w-4 h-4 fill-slate-950" />
            Manage VIP Access
          </button>
        </div>
      </div>
    </div>
  );
};
