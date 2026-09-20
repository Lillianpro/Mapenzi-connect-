import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../services/firebase_service.dart';
import 'paywall_screen.dart';

class VipScreen extends StatefulWidget {
  const VipScreen({super.key});

  @override
  State<VipScreen> createState() => _VipScreenState();
}

class _VipScreenState extends State<VipScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // 1X2 Games (4 games)
  final List<Map<String, dynamic>> _games1x2 = [
    {
      'league': 'English Premier League',
      'match': 'Man City vs Newcastle',
      'time': '18:30',
      'tip': '1 (Man City Win)',
      'odds': '1.48',
      'acc': '91%',
      'reason': '14 wins in last 15 home games. +1.84 xG differential.',
    },
    {
      'league': 'Spanish La Liga',
      'match': 'Barcelona vs Getafe',
      'time': '21:00',
      'tip': '1 (Barcelona Win)',
      'odds': '1.36',
      'acc': '93%',
      'reason': '71% possession and 2.7 goals/game at home. Getafe weak away.',
    },
    {
      'league': 'Italian Serie A',
      'match': 'Inter Milan vs Torino',
      'time': '20:45',
      'tip': '1 (Inter Win)',
      'odds': '1.42',
      'acc': '89%',
      'reason': '12 clean sheets at San Siro. Scored in 24 straight games.',
    },
    {
      'league': 'German Bundesliga',
      'match': 'Leverkusen vs Wolfsburg',
      'time': '17:30',
      'tip': '1 (Leverkusen Win)',
      'odds': '1.52',
      'acc': '88%',
      'reason': 'Highest box entries in Bundesliga (38.2). Wolfsburg 4 road losses.',
    },
  ];

  // HFT Draw (2 games)
  final List<Map<String, dynamic>> _gamesHftDraw = [
    {
      'league': 'French Ligue 1',
      'match': 'Lille vs Rennes',
      'time': '19:00',
      'tip': 'HT/FT: X / X',
      'odds': '4.85',
      'acc': '79%',
      'reason': 'Both rank top 3 for lowest 1st half concession. 62% H2H level at HT.',
    },
    {
      'league': 'Italian Serie A',
      'match': 'Bologna vs Fiorentina',
      'time': '18:00',
      'tip': 'HT/FT: X / X',
      'odds': '5.10',
      'acc': '77%',
      'reason': 'Drawn 4 of last 6 at Dall’Ara. Both deploy conservative mid-blocks.',
    },
  ];

  // FT Draw (2 games)
  final List<Map<String, dynamic>> _gamesFtDraw = [
    {
      'league': 'Spanish La Liga',
      'match': 'Bilbao vs Atl. Madrid',
      'time': '21:00',
      'tip': 'FT: X (Draw)',
      'odds': '3.30',
      'acc': '82%',
      'reason': 'Simeone deep 5-3-2 setup. Bilbao 40% home draw rate vs top-4.',
    },
    {
      'league': 'Uganda Premier League',
      'match': 'SC Villa vs KCCA FC',
      'time': '16:00',
      'tip': 'FT: X (Draw)',
      'odds': '3.15',
      'acc': '84%',
      'reason': 'Kampala derby intensity. 3 of last 4 clashes finished level.',
    },
  ];

  // Correct Score of the Day (1 game)
  final List<Map<String, dynamic>> _gamesCorrectScore = [
    {
      'league': 'English Premier League',
      'match': 'Arsenal vs Chelsea',
      'time': '19:30',
      'tip': 'Exact Score: 2 - 1',
      'odds': '8.50',
      'acc': '80%',
      'reason': 'Predictive matrix scores 2-1 as top probability outcome (16.4%).',
    },
  ];

  // Over/Under (4 games)
  final List<Map<String, dynamic>> _gamesOverUnder = [
    {
      'league': 'UEFA Champions League',
      'match': 'Bayern Munich vs PSG',
      'time': '22:00',
      'tip': 'Over 2.5 Goals',
      'odds': '1.58',
      'acc': '92%',
      'reason': 'Both attacks with elite xG. Last 5 H2H games averaged 3.4 goals.',
    },
    {
      'league': 'English Premier League',
      'match': 'Liverpool vs Brighton',
      'time': '16:00',
      'tip': 'Over 2.5 Goals',
      'odds': '1.52',
      'acc': '90%',
      'reason': 'Brighton high line. Liverpool Anfield games average 3.6 goals.',
    },
    {
      'league': 'Italian Serie A',
      'match': 'Juventus vs Lazio',
      'time': '19:45',
      'tip': 'Under 2.5 Goals',
      'odds': '1.70',
      'acc': '88%',
      'reason': 'Juventus allowed fewest shots on target (2.1). 8 of 10 went Under.',
    },
    {
      'league': 'Portuguese Primeira Liga',
      'match': 'Sporting CP vs Braga',
      'time': '21:30',
      'tip': 'Over 2.5 Goals',
      'odds': '1.62',
      'acc': '89%',
      'reason': 'Sporting average 2.8 goals at home; Braga concede heavily away.',
    },
  ];

  // Double Chance (6 games)
  final List<Map<String, dynamic>> _gamesDoubleChance = [
    {
      'league': 'Spanish La Liga',
      'match': 'Real Madrid vs Sevilla',
      'time': '21:00',
      'tip': '1X (Real Madrid or Draw)',
      'odds': '1.14',
      'acc': '97%',
      'reason': 'Unbeaten at Bernabeu for 18 months.',
    },
    {
      'league': 'English Premier League',
      'match': 'Aston Villa vs Brentford',
      'time': '16:00',
      'tip': '1X (Villa or Draw)',
      'odds': '1.24',
      'acc': '94%',
      'reason': 'Villa 11 wins in 14 home fixtures.',
    },
    {
      'league': 'Dutch Eredivisie',
      'match': 'PSV vs AZ Alkmaar',
      'time': '17:45',
      'tip': '1X (PSV or Draw)',
      'odds': '1.18',
      'acc': '96%',
      'reason': 'PSV unbeaten with +32 goal difference at home.',
    },
    {
      'league': 'Turkish Super Lig',
      'match': 'Galatasaray vs Trabzonspor',
      'time': '19:00',
      'tip': '1X (Galatasaray or Draw)',
      'odds': '1.16',
      'acc': '95%',
      'reason': '13 consecutive home league victories.',
    },
    {
      'league': 'Scottish Premiership',
      'match': 'Celtic vs Hearts',
      'time': '16:00',
      'tip': '1X (Celtic or Draw)',
      'odds': '1.12',
      'acc': '98%',
      'reason': '92% win record at Celtic Park.',
    },
    {
      'league': 'French Ligue 1',
      'match': 'Monaco vs Nice',
      'time': '21:05',
      'tip': '1X (Monaco or Draw)',
      'odds': '1.30',
      'acc': '90%',
      'reason': 'Nice only won 1 away game vs top-6 sides.',
    },
  ];

  // Slips: Odd 2++, Odd 5++, Odd 15++, Mega Odd 50
  final List<Map<String, dynamic>> _slips = [
    {
      'tag': 'Odd 2++',
      'title': 'Odd 2++ Safe Daily Double',
      'odds': '2.38',
      'legs': '2 Matches',
      'code': 'BP-29410 (BetPawa)',
      'returnUgx': 'UGX 47,600 (Stake 20k)',
    },
    {
      'tag': 'Odd 5++',
      'title': 'Odd 5++ Banker Treble',
      'odds': '5.65',
      'legs': '4 Matches',
      'code': 'SB-88319 (SportyBet)',
      'returnUgx': 'UGX 56,500 (Stake 10k)',
    },
    {
      'tag': 'Odd 15++',
      'title': 'Odd 15++ Super Multi-Bet',
      'odds': '16.42',
      'legs': '5 Matches',
      'code': '1X-74019 (1XBet)',
      'returnUgx': 'UGX 164,200 (Stake 10k)',
    },
    {
      'tag': 'Mega Odd 50',
      'title': 'Mega Odd 50 (Maga Odd 50+)',
      'odds': '54.85',
      'legs': '5 VIP Banker Legs',
      'code': 'BP-99882-MEGA (BetPawa)',
      'returnUgx': 'UGX 548,500 (Stake 10k)',
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 7, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final fb = Provider.of<FirebaseService>(context);
    final isLocked = fb.isTrialExpired && !fb.isSubscribed;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: const [
            Icon(Icons.workspace_premium, color: Color(0xFFF59E0B)),
            SizedBox(width: 8),
            Text(
              "Zinna VIP Section",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 12),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFF16A34A).withOpacity(0.12),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Text(
              "92.4% ACC",
              style: TextStyle(
                color: Color(0xFF16A34A),
                fontWeight: FontWeight.bold,
                fontSize: 11,
              ),
            ),
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          labelColor: const Color(0xFF16A34A),
          unselectedLabelColor: Colors.grey,
          indicatorColor: const Color(0xFF16A34A),
          tabs: const [
            Tab(text: "Slips (2+, 5+, 15+, 50+)"),
            Tab(text: "1X2 (4 Games)"),
            Tab(text: "HFT Draw (2 Games)"),
            Tab(text: "FT Draw (2 Games)"),
            Tab(text: "Correct Score (1 Game)"),
            Tab(text: "Over/Under (4 Games)"),
            Tab(text: "Double Chance (6 Games)"),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildSlipsTab(isLocked),
          _buildGamesTab(_games1x2, isLocked),
          _buildGamesTab(_gamesHftDraw, isLocked),
          _buildGamesTab(_gamesFtDraw, isLocked),
          _buildGamesTab(_gamesCorrectScore, isLocked),
          _buildGamesTab(_gamesOverUnder, isLocked),
          _buildGamesTab(_gamesDoubleChance, isLocked),
        ],
      ),
    );
  }

  Widget _buildSlipsTab(bool isLocked) {
    return ListView.builder(
      padding: const EdgeInsets.all(12),
      itemCount: _slips.length,
      itemBuilder: (context, i) {
        final slip = _slips[i];
        final isMega = slip['tag'] == 'Mega Odd 50';

        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(
              color: isMega ? const Color(0xFFF59E0B) : Colors.grey.shade200,
              width: isMega ? 2 : 1,
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: isMega ? const Color(0xFFF59E0B) : const Color(0xFF16A34A),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        slip['tag'],
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ),
                    Text(
                      "@${slip['odds']} Odds",
                      style: const TextStyle(
                        fontWeight: FontWeight.w900,
                        fontSize: 20,
                        color: Color(0xFF16A34A),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text(
                  slip['title'],
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  "Return: ${slip['returnUgx']} • ${slip['legs']}",
                  style: TextStyle(fontSize: 13, color: Colors.grey.shade700),
                ),
                const Divider(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Text(
                      isLocked ? "Code: Locked (VIP)" : "Code: ${slip['code']}",
                      style: TextStyle(
                        fontFamily: 'monospace',
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                        color: isLocked ? Colors.red : Colors.blue.shade900,
                      ),
                    ),
                    if (isLocked)
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF16A34A),
                        ),
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const PaywallScreen()),
                          );
                        },
                        icon: const Icon(Icons.lock, size: 14),
                        label: const Text("Unlock"),
                      )
                    else
                      OutlinedButton.icon(
                        onPressed: () {
                          Clipboard.setData(ClipboardData(text: slip['code']));
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text("Booking code copied!")),
                          );
                        },
                        icon: const Icon(Icons.copy, size: 14),
                        label: const Text("Copy"),
                      ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildGamesTab(List<Map<String, dynamic>> list, bool isLocked) {
    return ListView.builder(
      padding: const EdgeInsets.all(12),
      itemCount: list.length,
      itemBuilder: (context, i) {
        final g = list[i];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Text(
                      g['league'],
                      style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                    ),
                    Text(
                      g['time'],
                      style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  g['match'],
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                  decoration: BoxDecoration(
                    color: const Color(0xFF16A34A).withOpacity(0.08),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Text(
                        isLocked ? "VIP Pick: [Locked]" : "Tip: ${g['tip']}",
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF16A34A),
                        ),
                      ),
                      Text(
                        "@${g['odds']} • Acc ${g['acc']}",
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  g['reason'],
                  style: TextStyle(fontSize: 12, color: Colors.grey.shade700),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
