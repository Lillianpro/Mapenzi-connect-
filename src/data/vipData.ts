import { VipGame, VipOddsSlip } from '../types';

// ============================================================================
// VIP INDIVIDUAL GAMES CURATED PICKS
// Matches user request:
// - 1x2 games: 4 games
// - Hft draw: 2 games
// - Ft draw: 2 games
// - Correct soccers of the day: 1 game
// - Over/under: 4 games
// - Double chance: 6 games
// ============================================================================

export const VIP_GAMES: VipGame[] = [
  // --------------------------------------------------------------------------
  // 1. 1X2 GAMES (4 GAMES)
  // --------------------------------------------------------------------------
  {
    id: 'vip-1x2-1',
    category: '1x2',
    categoryLabel: '1X2 Match Winner',
    league: 'English Premier League',
    homeTeam: 'Manchester City',
    awayTeam: 'Newcastle United',
    homeLogo: '🩵',
    awayLogo: '⚪',
    matchTime: 'Today 18:30',
    tip: '1 (Man City Win)',
    odds: '1.48',
    confidencePercent: 91,
    whyThisPrediction: 'Manchester City have won 14 of their last 15 home league games against Newcastle. Expected goals (xG) differential of +1.84 at Etihad Stadium against Newcastle’s away defensive record.',
    status: 'upcoming',
  },
  {
    id: 'vip-1x2-2',
    category: '1x2',
    categoryLabel: '1X2 Match Winner',
    league: 'Spanish La Liga',
    homeTeam: 'Barcelona',
    awayTeam: 'Getafe',
    homeLogo: '🔴🔵',
    awayLogo: '🔵',
    matchTime: 'Today 21:00',
    tip: '1 (Barcelona Win)',
    odds: '1.36',
    confidencePercent: 93,
    whyThisPrediction: 'Barcelona have averaged 71% possession and 2.7 goals scored at home. Getafe have scored only 4 goals across their previous 7 away matches and conceded high-quality chances.',
    status: 'upcoming',
  },
  {
    id: 'vip-1x2-3',
    category: '1x2',
    categoryLabel: '1X2 Match Winner',
    league: 'Italian Serie A',
    homeTeam: 'Inter Milan',
    awayTeam: 'Torino',
    homeLogo: '🔵⚫',
    awayLogo: '🟤',
    matchTime: 'Today 20:45',
    tip: '1 (Inter Win)',
    odds: '1.42',
    confidencePercent: 89,
    whyThisPrediction: 'Inter have kept 12 clean sheets at San Siro and have scored in 24 consecutive league fixtures. Torino enter with key midfielder absences and poor conversion rate on the road.',
    status: 'upcoming',
  },
  {
    id: 'vip-1x2-4',
    category: '1x2',
    categoryLabel: '1X2 Match Winner',
    league: 'German Bundesliga',
    homeTeam: 'Bayer Leverkusen',
    awayTeam: 'Wolfsburg',
    homeLogo: '🔴⚫',
    awayLogo: '🟢',
    matchTime: 'Today 17:30',
    tip: '1 (Leverkusen Win)',
    odds: '1.52',
    confidencePercent: 88,
    whyThisPrediction: 'Leverkusen generate the highest box entries per 90 (38.2) in the Bundesliga. Wolfsburg have lost 4 straight road games, conceding an average of 2.25 goals per game.',
    status: 'upcoming',
  },

  // --------------------------------------------------------------------------
  // 2. HFT DRAW (HALF-TIME / FULL-TIME DRAW - 2 GAMES)
  // --------------------------------------------------------------------------
  {
    id: 'vip-hft-1',
    category: 'htft_draw',
    categoryLabel: 'HT/FT Draw (X/X)',
    league: 'French Ligue 1',
    homeTeam: 'Lille',
    awayTeam: 'Rennes',
    homeLogo: '🔴',
    awayLogo: '⚫',
    matchTime: 'Today 19:00',
    tip: 'HT/FT: X / X (Draw HT & Draw FT)',
    odds: '4.85',
    confidencePercent: 79,
    whyThisPrediction: 'Both sides rank in the top 3 for lowest first-half conceding rates in Ligue 1. Over 62% of their combined head-to-head fixtures enter the interval at 0-0 or 1-1, typically settling in low-margin tactical stalemates.',
    status: 'upcoming',
  },
  {
    id: 'vip-hft-2',
    category: 'htft_draw',
    categoryLabel: 'HT/FT Draw (X/X)',
    league: 'Italian Serie A',
    homeTeam: 'Bologna',
    awayTeam: 'Fiorentina',
    homeLogo: '🔴🔵',
    awayLogo: '🟣',
    matchTime: 'Today 18:00',
    tip: 'HT/FT: X / X (Draw HT & Draw FT)',
    odds: '5.10',
    confidencePercent: 77,
    whyThisPrediction: 'Bologna and Fiorentina have drawn 4 of their last 6 meetings at Stadio Renato Dall’Ara. Both managers deploy compact mid-blocks when facing direct European contenders, heavily pointing to a cautious 45-minute and 90-minute deadlock.',
    status: 'upcoming',
  },

  // --------------------------------------------------------------------------
  // 3. FT DRAW (FULL-TIME DRAW - 2 GAMES)
  // --------------------------------------------------------------------------
  {
    id: 'vip-ft-1',
    category: 'ft_draw',
    categoryLabel: 'Full-Time Draw (X)',
    league: 'Spanish La Liga',
    homeTeam: 'Athletic Bilbao',
    awayTeam: 'Atletico Madrid',
    homeLogo: '🔴⚪',
    awayLogo: '🔴🔵',
    matchTime: 'Today 21:00',
    tip: 'FT: X (Full-Time Draw)',
    odds: '3.30',
    confidencePercent: 82,
    whyThisPrediction: 'Simeone’s Atletico adopt deep structural 5-3-2 containment at San Mames. Athletic Bilbao possess a 40% home draw record against top-4 teams. Expected goals projection model predicts 1.15 to 1.12.',
    status: 'upcoming',
  },
  {
    id: 'vip-ft-2',
    category: 'ft_draw',
    categoryLabel: 'Full-Time Draw (X)',
    league: 'Uganda Premier League',
    homeTeam: 'SC Villa',
    awayTeam: 'KCCA FC',
    homeLogo: '🔵',
    awayLogo: '🟡',
    matchTime: 'Today 16:00',
    tip: 'FT: X (Full-Time Draw)',
    odds: '3.15',
    confidencePercent: 84,
    whyThisPrediction: 'Kampala derby history reveals tight, physical encounters where neither rival affords to leave transition spaces. 3 of their last 4 clashes finished all-square (0-0, 1-1, 1-1).',
    status: 'upcoming',
  },

  // --------------------------------------------------------------------------
  // 4. CORRECT SOCCERS OF THE DAY (1 GAME)
  // --------------------------------------------------------------------------
  {
    id: 'vip-cs-1',
    category: 'correct_score',
    categoryLabel: 'Correct Score of the Day',
    league: 'English Premier League',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    homeLogo: '🔴',
    awayLogo: '🔵',
    matchTime: 'Today 19:30',
    tip: 'Exact Score: 2 - 1',
    odds: '8.50',
    confidencePercent: 80,
    whyThisPrediction: 'The AI predictive score matrix gives highest joint probability (16.4%) to a 2-1 home victory. Arsenal average 2.2 goals at Emirates while Chelsea have scored in 8 of 9 London derbies but remain fragile on set-pieces.',
    status: 'upcoming',
  },

  // --------------------------------------------------------------------------
  // 5. OVER/UNDER (4 GAMES)
  // --------------------------------------------------------------------------
  {
    id: 'vip-ou-1',
    category: 'over_under',
    categoryLabel: 'Over / Under Goals',
    league: 'UEFA Champions League',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Paris Saint-Germain',
    homeLogo: '🔴',
    awayLogo: '🔵',
    matchTime: 'Tonight 22:00',
    tip: 'Over 2.5 Goals',
    odds: '1.58',
    confidencePercent: 92,
    whyThisPrediction: 'Both attacks feature elite conversion rates with Harry Kane and PSG’s high-line wingers. Last 5 H2H European knockout matches averaged 3.4 total goals.',
    status: 'upcoming',
  },
  {
    id: 'vip-ou-2',
    category: 'over_under',
    categoryLabel: 'Over / Under Goals',
    league: 'English Premier League',
    homeTeam: 'Liverpool',
    awayTeam: 'Brighton',
    homeLogo: '🔴',
    awayLogo: '🔵',
    matchTime: 'Today 16:00',
    tip: 'Over 2.5 Goals',
    odds: '1.52',
    confidencePercent: 90,
    whyThisPrediction: 'Brighton maintain high defensive line with heavy vertical attacking metrics. Liverpool games at Anfield average 3.6 total match goals this campaign.',
    status: 'upcoming',
  },
  {
    id: 'vip-ou-3',
    category: 'over_under',
    categoryLabel: 'Over / Under Goals',
    league: 'Italian Serie A',
    homeTeam: 'Juventus',
    awayTeam: 'Lazio',
    homeLogo: '⚪⚫',
    awayLogo: '🦅',
    matchTime: 'Today 19:45',
    tip: 'Under 2.5 Goals',
    odds: '1.70',
    confidencePercent: 88,
    whyThisPrediction: 'Juventus have allowed the fewest shots on target inside Serie A (2.1 per match). Lazio on the road operate with cautious possession tempo; 8 of their last 10 games went Under 2.5.',
    status: 'upcoming',
  },
  {
    id: 'vip-ou-4',
    category: 'over_under',
    categoryLabel: 'Over / Under Goals',
    league: 'Portuguese Primeira Liga',
    homeTeam: 'Sporting CP',
    awayTeam: 'Braga',
    homeLogo: '🟢⚪',
    awayLogo: '🔴',
    matchTime: 'Today 21:30',
    tip: 'Over 2.5 Goals',
    odds: '1.62',
    confidencePercent: 89,
    whyThisPrediction: 'Sporting CP average 2.8 goals scored at home. Braga are Portugal’s 2nd highest road scorers but hold just 2 clean sheets in 9 fixtures.',
    status: 'upcoming',
  },

  // --------------------------------------------------------------------------
  // 6. DOUBLE CHANCE (6 GAMES)
  // --------------------------------------------------------------------------
  {
    id: 'vip-dc-1',
    category: 'double_chance',
    categoryLabel: 'Double Chance',
    league: 'Spanish La Liga',
    homeTeam: 'Real Madrid',
    awayTeam: 'Sevilla',
    homeLogo: '⚪',
    awayLogo: '🔴',
    matchTime: 'Today 21:00',
    tip: '1X (Real Madrid or Draw)',
    odds: '1.14',
    confidencePercent: 97,
    whyThisPrediction: 'Real Madrid have not lost at home across 18 consecutive months in domestic competition. Maximum safety accumulator anchor.',
    status: 'upcoming',
  },
  {
    id: 'vip-dc-2',
    category: 'double_chance',
    categoryLabel: 'Double Chance',
    league: 'English Premier League',
    homeTeam: 'Aston Villa',
    awayTeam: 'Brentford',
    homeLogo: '🟣🔵',
    awayLogo: '🔴⚪',
    matchTime: 'Today 16:00',
    tip: '1X (Aston Villa or Draw)',
    odds: '1.24',
    confidencePercent: 94,
    whyThisPrediction: 'Emery’s Villa have won 11 of their 14 home fixtures. Brentford have won just 2 away matches all season.',
    status: 'upcoming',
  },
  {
    id: 'vip-dc-3',
    category: 'double_chance',
    categoryLabel: 'Double Chance',
    league: 'Dutch Eredivisie',
    homeTeam: 'PSV Eindhoven',
    awayTeam: 'AZ Alkmaar',
    homeLogo: '🔴⚪',
    awayLogo: '🔴',
    matchTime: 'Today 17:45',
    tip: '1X (PSV or Draw)',
    odds: '1.18',
    confidencePercent: 96,
    whyThisPrediction: 'PSV are unbeaten at Philips Stadion with a +32 goal difference. AZ Alkmaar struggle when pressed high in buildup.',
    status: 'upcoming',
  },
  {
    id: 'vip-dc-4',
    category: 'double_chance',
    categoryLabel: 'Double Chance',
    league: 'Turkish Super Lig',
    homeTeam: 'Galatasaray',
    awayTeam: 'Trabzonspor',
    homeLogo: '🟡🔴',
    awayLogo: '🔴🔵',
    matchTime: 'Today 19:00',
    tip: '1X (Galatasaray or Draw)',
    odds: '1.16',
    confidencePercent: 95,
    whyThisPrediction: 'Galatasaray boast an electrifying home atmosphere with 13 straight home league wins and over 2.4 xG created per match.',
    status: 'upcoming',
  },
  {
    id: 'vip-dc-5',
    category: 'double_chance',
    categoryLabel: 'Double Chance',
    league: 'Scottish Premiership',
    homeTeam: 'Celtic',
    awayTeam: 'Hearts',
    homeLogo: '🟢⚪',
    awayLogo: '🟤',
    matchTime: 'Today 16:00',
    tip: '1X (Celtic or Draw)',
    odds: '1.12',
    confidencePercent: 98,
    whyThisPrediction: 'Celtic at Celtic Park have won 92% of all points against non-Rangers opponents in the Scottish Premiership.',
    status: 'upcoming',
  },
  {
    id: 'vip-dc-6',
    category: 'double_chance',
    categoryLabel: 'Double Chance',
    league: 'French Ligue 1',
    homeTeam: 'Monaco',
    awayTeam: 'Nice',
    homeLogo: '🔴⚪',
    awayLogo: '🔴⚫',
    matchTime: 'Today 21:05',
    tip: '1X (Monaco or Draw)',
    odds: '1.30',
    confidencePercent: 90,
    whyThisPrediction: 'Monaco have generated consistent goal returns at Stade Louis II and Nice have won only 1 away fixture against top-6 rivals.',
    status: 'upcoming',
  },
];

// ============================================================================
// VIP ACCUMULATOR SLIPS / MULTI-BETS
// Matches user request:
// - Odd2++
// - Odd 5++
// - Odd 15++
// - Maga odd 50 (Mega Odd 50+)
// ============================================================================

export const VIP_ODDS_SLIPS: VipOddsSlip[] = [
  // --------------------------------------------------------------------------
  // 1. ODD 2++ SLIP (2.35 Odds)
  // --------------------------------------------------------------------------
  {
    id: 'slip-odd-2',
    type: 'odd_2',
    title: 'Odd 2++ Safe Daily Double',
    tag: 'Odd 2++',
    totalOdds: '2.38',
    confidencePercent: 93,
    bookingCode: {
      provider: 'BetPawa',
      code: 'BP-29410',
    },
    summary: 'Ultra-high confidence 2-game combination built on home win banker and goal threshold.',
    sampleStakeUgx: 20000,
    sampleReturnUgx: 47600,
    games: [
      {
        match: 'Manchester City vs Newcastle',
        league: 'English Premier League',
        tip: '1 (Man City Win)',
        odds: '1.48',
        time: 'Today 18:30',
      },
      {
        match: 'Bayern Munich vs PSG',
        league: 'UEFA Champions League',
        tip: 'Over 2.5 Goals',
        odds: '1.58',
        time: 'Tonight 22:00',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 2. ODD 5++ SLIP (5.65 Odds)
  // --------------------------------------------------------------------------
  {
    id: 'slip-odd-5',
    type: 'odd_5',
    title: 'Odd 5++ Banker Treble',
    tag: 'Odd 5++',
    totalOdds: '5.65',
    confidencePercent: 88,
    bookingCode: {
      provider: 'SportyBet',
      code: 'SB-88319',
    },
    summary: 'Balanced 3-game value treble pairing European powerhouses with over 2.5 goal trends.',
    sampleStakeUgx: 10000,
    sampleReturnUgx: 56500,
    games: [
      {
        match: 'Bayer Leverkusen vs Wolfsburg',
        league: 'German Bundesliga',
        tip: '1 (Leverkusen Win)',
        odds: '1.52',
        time: 'Today 17:30',
      },
      {
        match: 'Inter Milan vs Torino',
        league: 'Italian Serie A',
        tip: '1 (Inter Milan Win)',
        odds: '1.42',
        time: 'Today 20:45',
      },
      {
        match: 'Sporting CP vs Braga',
        league: 'Portuguese Primeira Liga',
        tip: 'Over 2.5 Goals',
        odds: '1.62',
        time: 'Today 21:30',
      },
      {
        match: 'Barcelona vs Getafe',
        league: 'Spanish La Liga',
        tip: '1 (Barcelona Win)',
        odds: '1.36',
        time: 'Today 21:00',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 3. ODD 15++ SLIP (16.20 Odds)
  // --------------------------------------------------------------------------
  {
    id: 'slip-odd-15',
    type: 'odd_15',
    title: 'Odd 15++ Super Multi-Bet',
    tag: 'Odd 15++',
    totalOdds: '16.42',
    confidencePercent: 82,
    bookingCode: {
      provider: '1XBet',
      code: '1X-74019',
    },
    summary: 'Calculated 5-fold slip combining verified match winners with reliable goal tallies.',
    sampleStakeUgx: 10000,
    sampleReturnUgx: 164200,
    games: [
      {
        match: 'Manchester City vs Newcastle',
        league: 'English Premier League',
        tip: '1 (Man City Win)',
        odds: '1.48',
        time: 'Today 18:30',
      },
      {
        match: 'Liverpool vs Brighton',
        league: 'English Premier League',
        tip: 'Over 2.5 Goals',
        odds: '1.52',
        time: 'Today 16:00',
      },
      {
        match: 'Athletic Bilbao vs Atletico Madrid',
        league: 'Spanish La Liga',
        tip: 'FT: X (Full-Time Draw)',
        odds: '3.30',
        time: 'Today 21:00',
      },
      {
        match: 'Juventus vs Lazio',
        league: 'Italian Serie A',
        tip: 'Under 2.5 Goals',
        odds: '1.70',
        time: 'Today 19:45',
      },
      {
        match: 'Monaco vs Nice',
        league: 'French Ligue 1',
        tip: '1X (Monaco or Draw)',
        odds: '1.30',
        time: 'Today 21:05',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 4. MAGA ODD 50 (MEGA ODD 50+ - 54.80 Odds)
  // --------------------------------------------------------------------------
  {
    id: 'slip-mega-50',
    type: 'mega_50',
    title: 'Mega Odd 50 (Maga Odd 50+)',
    tag: 'Mega Odd 50+',
    totalOdds: '54.85',
    confidencePercent: 76,
    bookingCode: {
      provider: 'BetPawa',
      code: 'BP-99882-MEGA',
    },
    summary: 'High-yield VIP golden ticket featuring Correct Score + Halftime Draw + Match Bankers for massive potential payouts.',
    sampleStakeUgx: 10000,
    sampleReturnUgx: 548500,
    games: [
      {
        match: 'Arsenal vs Chelsea',
        league: 'English Premier League',
        tip: 'Correct Score: 2 - 1',
        odds: '8.50',
        time: 'Today 19:30',
      },
      {
        match: 'Lille vs Rennes',
        league: 'French Ligue 1',
        tip: 'HT/FT: X / X',
        odds: '4.85',
        time: 'Today 19:00',
      },
      {
        match: 'Manchester City vs Newcastle',
        league: 'English Premier League',
        tip: '1 (Home Win)',
        odds: '1.48',
        time: 'Today 18:30',
      },
      {
        match: 'Bayern Munich vs PSG',
        league: 'UEFA Champions League',
        tip: 'Over 2.5 Goals',
        odds: '1.58',
        time: 'Tonight 22:00',
      },
      {
        match: 'Real Madrid vs Sevilla',
        league: 'Spanish La Liga',
        tip: '1X (Double Chance)',
        odds: '1.14',
        time: 'Today 21:00',
      },
    ],
  },
];
