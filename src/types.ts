// Zinna Tips - Type Definitions

export type SportType = 'football' | 'basketball';

export interface FixtureItem {
  id: string;
  sport: SportType;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  matchTime: string;
  status: 'upcoming' | 'live' | 'finished';
  liveScore?: string;
  liveMinute?: string;
  
  // Statistical inputs analyzed by AI
  homeForm: string[]; // e.g. ['W', 'W', 'D', 'W', 'W']
  awayForm: string[];
  headToHeadSummary: string;
  tableStanding: string;
  injuriesReport: string;

  // AI Prediction outputs
  confidencePercent: number; // e.g. 86
  prediction1X2: string; // '1 (Home Win)', 'X (Draw)', '2 (Away Win)'
  doubleChance: string; // '1X', 'X2', '12'
  overUnder: string; // 'Over 2.5', 'Under 2.5'
  btts: string; // 'Yes', 'No'
  
  // Basketball markets
  basketballWinner?: string;
  basketballOverUnderPoints?: string;

  // AI reasoning
  whyThisPrediction: string;
}

export interface UserSubscription {
  phone: string;
  country?: string; // 'UG' | 'KE' | 'TZ' | 'RW' | 'OTHER'
  currency?: string; // 'UGX' | 'KES' | 'TZS' | 'RWF' | 'USD'
  trial_start_date: string; // ISO string
  is_subscribed: boolean;
  subscription_expiry?: string;
  plan: string;
  payment_method: string;
  updatedAt?: string;
}

export interface MomoTransaction {
  id: string;
  phone: string;
  amount: number;
  currency: string;
  provider: string;
  reference: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
}

export type AppTab = 'home' | 'today' | 'vip' | 'calendar' | 'live' | 'profile' | 'code';

export type VipCategory = 
  | 'all'
  | '1x2' 
  | 'htft_draw' 
  | 'ft_draw' 
  | 'correct_score' 
  | 'over_under' 
  | 'double_chance'
  | 'slips';

export interface VipGame {
  id: string;
  category: '1x2' | 'htft_draw' | 'ft_draw' | 'correct_score' | 'over_under' | 'double_chance';
  categoryLabel: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  matchTime: string;
  tip: string;
  odds: string;
  confidencePercent: number;
  whyThisPrediction: string;
  status: 'upcoming' | 'won' | 'live';
}

export interface VipOddsSlipLeg {
  match: string;
  league: string;
  tip: string;
  odds: string;
  time: string;
}

export interface VipOddsSlip {
  id: string;
  type: 'odd_2' | 'odd_5' | 'odd_15' | 'mega_50';
  title: string;
  tag: string;
  totalOdds: string;
  confidencePercent: number;
  bookingCode: {
    provider: 'BetPawa' | '1XBet' | 'SportyBet';
    code: string;
  };
  games: VipOddsSlipLeg[];
  summary: string;
  sampleStakeUgx: number;
  sampleReturnUgx: number;
}

export interface DayPredictionResult {
  id: string;
  match: string;
  league: string;
  tip: string;
  odds: string;
  result: 'won' | 'lost';
  finalScore: string;
}

export interface DayPerformance {
  date: string; // 'YYYY-MM-DD'
  wins: number;
  losses: number;
  totalPicks: number;
  winRate: number; // percentage, e.g. 85.7
  status: 'win' | 'mixed' | 'loss' | 'today' | 'upcoming';
  totalOddsWon?: string;
  highlights?: string;
  predictions: DayPredictionResult[];
}
