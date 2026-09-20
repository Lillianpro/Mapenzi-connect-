import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/firebase_service.dart';

class DashboardScreen extends StatelessWidget {
  final VoidCallback? onNavigateToToday;
  final VoidCallback? onNavigateToCalendar;
  final Function(String category)? onNavigateToVip;

  const DashboardScreen({
    super.key,
    this.onNavigateToToday,
    this.onNavigateToCalendar,
    this.onNavigateToVip,
  });

  @override
  Widget build(BuildContext context) {
    final fb = Provider.of<FirebaseService>(context);

    return Scaffold(
      backgroundColor: const Color(0xFF090514),
      appBar: AppBar(
        backgroundColor: const Color(0xFF090514),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.menu, color: Colors.white),
          onPressed: () {
            Scaffold.of(context).openDrawer();
          },
        ),
        title: Column(
          children: const [
            Text(
              'ZINNA TIPS & PICKS',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.1,
                color: Colors.white,
              ),
            ),
            SizedBox(height: 2),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.circle, size: 6, color: Color(0xFF06B6D4)),
                SizedBox(width: 4),
                Text(
                  'PREMIUM INSIGHTS',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF06B6D4),
                    letterSpacing: 0.8,
                  ),
                ),
              ],
            ),
          ],
        ),
        centerTitle: true,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: Container(
              width: 36,
              height: 36,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: [Color(0xFFD97706), Color(0xFFFBBF24), Color(0xFFF59E0B)],
                ),
              ),
              padding: const EdgeInsets.all(2),
              child: Container(
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Color(0xFF120B26),
                ),
                alignment: Alignment.center,
                child: const Text(
                  'VIP',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFFFCD34D),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Hero Card 1: Live Match Analysis
            _buildHeroCard(
              title: 'Live Match Analysis',
              subtitle: 'Hand-picked free predictions for today',
              icon: Icons.bolt,
              iconColor: const Color(0xFFFBBF24),
              accentColor: const Color(0xFFA855F7),
              arrowColor: const Color(0xFFA855F7),
              onTap: onNavigateToToday,
            ),
            const SizedBox(height: 12),

            // Hero Card 2: Performance Tracker
            _buildHeroCard(
              title: 'Performance Tracker',
              subtitle: 'Check previous winning odds and results',
              icon: Icons.bar_chart,
              iconColor: const Color(0xFF34D399),
              accentColor: const Color(0xFFFBBF24),
              arrowColor: const Color(0xFFA3E635),
              onTap: onNavigateToCalendar,
            ),
            const SizedBox(height: 20),

            // Exclusive Tips VIP Header
            Row(
              children: [
                Container(
                  width: 4,
                  height: 16,
                  decoration: BoxDecoration(
                    color: const Color(0xFF06B6D4),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(width: 8),
                const Text(
                  'EXCLUSIVE TIPS',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                    letterSpacing: 1.0,
                  ),
                ),
                const SizedBox(width: 6),
                const Text(
                  'VIP',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFFA855F7),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // 2-Column Grid of 6 Exclusive VIP Categories
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              mainAxisSpacing: 10,
              crossAxisSpacing: 10,
              childAspectRatio: 1.6,
              children: [
                _buildVipTile('FT', const Color(0xFFA855F7), 'Draws VIP', '@3.40', () => onNavigateToVip?.call('ft_draw')),
                _buildVipTile('2+', const Color(0xFFA3E635), 'Odds VIP', '@2.15 Avg', () => onNavigateToVip?.call('slips')),
                _buildVipTile('5+', const Color(0xFFA855F7), 'Odds VIP', '@5.42 Avg', () => onNavigateToVip?.call('slips')),
                _buildVipTile('15+', const Color(0xFFA3E635), 'Odds VIP', '@16.8 Avg', () => onNavigateToVip?.call('slips')),
                _buildVipTile('SCORE', const Color(0xFFA855F7), 'Correct Score', 'High Return', () => onNavigateToVip?.call('correct_score')),
                _buildVipTile('HT/FT', const Color(0xFFA3E635), '100+ HT-FT', 'Mega Slip', () => onNavigateToVip?.call('htft_draw')),
              ],
            ),
            const SizedBox(height: 16),

            // Telegram and WhatsApp Community Buttons
            Row(
              children: [
                Expanded(
                  child: InkWell(
                    onTap: () {
                      // Launch Telegram channel link https://t.me/copyerror
                    },
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 10),
                      decoration: BoxDecoration(
                        color: const Color(0xFF110B26),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFF0284C7).withOpacity(0.5)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Icon(Icons.send, size: 15, color: Color(0xFF38BDF8)),
                          SizedBox(width: 6),
                          Flexible(
                            child: Text(
                              '@copyerror',
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: InkWell(
                    onTap: () {
                      // Launch WhatsApp chat https://wa.me/256703320730
                    },
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 10),
                      decoration: BoxDecoration(
                        color: const Color(0xFF110B26),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFF059669).withOpacity(0.5)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Icon(Icons.chat, size: 15, color: Color(0xFF34D399)),
                          SizedBox(width: 6),
                          Flexible(
                            child: Text(
                              '+256703320730',
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Privacy Policy Link
            Center(
              child: Text(
                'Privacy Policy',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[500],
                  decoration: TextDecoration.underline,
                ),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildHeroCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color iconColor,
    required Color accentColor,
    required Color arrowColor,
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: const Color(0xFF110B26),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFF581C87).withOpacity(0.5)),
        ),
        child: Row(
          children: [
            Container(
              width: 4,
              height: 40,
              decoration: BoxDecoration(
                color: accentColor,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(width: 12),
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: const Color(0xFF090514),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF3B0764).withOpacity(0.5)),
              ),
              child: Icon(icon, color: iconColor, size: 24),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 11,
                      color: Colors.grey[400],
                    ),
                  ),
                ],
              ),
            ),
            Icon(Icons.chevron_right, color: arrowColor, size: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildVipTile(
    String badge,
    Color badgeColor,
    String title,
    String odds,
    VoidCallback onTap,
  ) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF110B26),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFF581C87).withOpacity(0.4)),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              badge,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w900,
                color: badgeColor,
              ),
            ),
            const SizedBox(height: 3),
            Text(
              title,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 2),
            Text(
              odds,
              style: TextStyle(
                fontSize: 10,
                color: Colors.grey[400],
                fontFamily: 'monospace',
              ),
            ),
          ],
        ),
      ),
    );
  }
}
