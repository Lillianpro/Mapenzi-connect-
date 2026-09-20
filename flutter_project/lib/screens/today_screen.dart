// Tab 1: Today Predictions Screen with Football & Basketball Filter,
// Form analysis, H2H, AI Confidence %, and "Why this prediction?"

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../services/firebase_service.dart';
import '../models/match_model.dart';

class TodayScreen extends StatefulWidget {
  const TodayScreen({super.key});

  @override
  State<TodayScreen> createState() => _TodayScreenState();
}

class _TodayScreenState extends State<TodayScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ApiService>(context, listen: false).fetchTodayPredictions();
    });
  }

  @override
  Widget build(BuildContext context) {
    final api = Provider.of<ApiService>(context);
    final fb = Provider.of<FirebaseService>(context);
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: const Color(0xFF16A34A),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.bolt, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Zinna Tips',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                ),
                Text(
                  fb.isSubscribed 
                      ? 'VIP Premium Active' 
                      : '7-Day Free Trial (${fb.trialDaysRemaining} days left)',
                  style: TextStyle(
                    fontSize: 11,
                    color: fb.isSubscribed ? const Color(0xFF16A34A) : Colors.orange,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            tooltip: 'Refresh Predictions',
            onPressed: () => api.fetchTodayPredictions(),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => api.fetchTodayPredictions(),
        color: const Color(0xFF16A34A),
        child: Column(
          children: [
            // 7-Day Free Trial Indicator Bar
            if (!fb.isSubscribed)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                color: const Color(0xFFDCFCE7),
                child: Row(
                  children: [
                    const Icon(Icons.verified, color: Color(0xFF16A34A), size: 18),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Enjoying 7-Day Free Trial: ${fb.trialDaysRemaining} days remaining with full AI predictions',
                        style: const TextStyle(
                          color: Color(0xFF14532D),
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

            // Sport Filter Tabs (All, Football, Basketball)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              child: Row(
                children: [
                  _buildSportChip('all', 'All Sports', Icons.sports, api),
                  const SizedBox(width: 8),
                  _buildSportChip('football', 'Football (Soccer)', Icons.sports_soccer, api),
                  const SizedBox(width: 8),
                  _buildSportChip('basketball', 'Basketball (NBA)', Icons.sports_basketball, api),
                ],
              ),
            ),

            // Matches List
            Expanded(
              child: api.isLoading
                  ? const Center(
                      child: CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF16A34A)),
                      ),
                    )
                  : api.filteredMatches.isEmpty
                      ? const Center(child: Text('No fixtures scheduled today.'))
                      : ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          itemCount: api.filteredMatches.length,
                          itemBuilder: (context, index) {
                            final match = api.filteredMatches[index];
                            return _buildMatchPredictionCard(match, isDark);
                          },
                        ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSportChip(String key, String label, IconData icon, ApiService api) {
    final isSelected = api.selectedSport == key;
    return GestureDetector(
      onTap: () => api.setSportFilter(key),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF16A34A) : Colors.grey.shade200,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 16,
              color: isSelected ? Colors.white : Colors.grey.shade700,
            ),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                color: isSelected ? Colors.white : Colors.grey.shade800,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMatchPredictionCard(MatchModel match, bool isDark) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
        side: BorderSide(
          color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
          width: 1,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // League & Confidence Badge
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(
                      match.sport == SportType.basketball
                          ? Icons.sports_basketball
                          : Icons.sports_soccer,
                      size: 16,
                      color: const Color(0xFF16A34A),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      match.league,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF64748B),
                      ),
                    ),
                  ],
                ),
                // AI Confidence Badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFDCFCE7),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFF22C55E)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.auto_awesome, size: 12, color: Color(0xFF15803D)),
                      const SizedBox(width: 4),
                      Text(
                        'AI Confidence: ${match.confidencePercent}%',
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF15803D),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Teams and Kickoff / Live time
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    match.homeTeam,
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: match.status == 'live' ? Colors.red.shade100 : Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    match.status == 'live' ? 'LIVE ${match.liveScore}' : match.matchTime,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: match.status == 'live' ? Colors.red : Colors.grey.shade800,
                    ),
                  ),
                ),
                Expanded(
                  child: Text(
                    match.awayTeam,
                    textAlign: TextAlign.end,
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Form Analysis & Standing
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildFormRow(match.homeTeam, match.homeForm),
                      _buildFormRow(match.awayTeam, match.awayForm),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Table: ${match.tableStanding}',
                    style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Predictions Grid: 1X2, Double Chance, Over/Under, BTTS (or Basketball Winner & Points)
            const Text(
              'AI PREDICTED MARKETS:',
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF94A3B8)),
            ),
            const SizedBox(height: 6),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: match.sport == SportType.basketball
                  ? [
                      _buildMarketPill('Winner', match.basketballWinner ?? match.homeTeam),
                      _buildMarketPill('Total Points', match.basketballOverUnderPoints ?? 'Over 220'),
                    ]
                  : [
                      _buildMarketPill('1X2', match.prediction1X2),
                      _buildMarketPill('Double Chance', match.doubleChance),
                      _buildMarketPill('Over/Under', match.overUnder),
                      _buildMarketPill('BTTS', match.btts),
                    ],
            ),
            const SizedBox(height: 12),

            // "Why this prediction?" Section (Required)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF0FDF4),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFFBBF7D0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.psychology, size: 16, color: Color(0xFF16A34A)),
                      SizedBox(width: 6),
                      Text(
                        'Why this prediction?',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF15803D),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    match.whyThisPrediction,
                    style: const TextStyle(
                      fontSize: 12,
                      color: Color(0xFF14532D),
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFormRow(String team, List<String> form) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          team.length > 8 ? '${team.substring(0, 8)}: ' : '$team: ',
          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
        ),
        Row(
          children: form.map((r) {
            Color c = r == 'W' ? Colors.green : (r == 'D' ? Colors.amber : Colors.red);
            return Container(
              margin: const EdgeInsets.symmetric(horizontal: 1.5),
              padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
              decoration: BoxDecoration(
                color: c,
                borderRadius: BorderRadius.circular(3),
              ),
              child: Text(
                r,
                style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildMarketPill(String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: const Color(0xFFCBD5E1)),
      ),
      child: RichText(
        text: TextSpan(
          style: const TextStyle(fontSize: 12, color: Colors.black87),
          children: [
            TextSpan(text: '$label: ', style: const TextStyle(color: Color(0xFF64748B))),
            TextSpan(text: value, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF16A34A))),
          ],
        ),
      ),
    );
  }
}
