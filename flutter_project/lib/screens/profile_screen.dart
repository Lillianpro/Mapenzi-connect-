// Tab 3: Profile & Subscription Screen
// Shows: User Phone, 7-Day Free Trial status, Expiry, MTN/Airtel subscription,
// Download APK link, and testing controls

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/firebase_service.dart';
import 'paywall_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final fb = Provider.of<FirebaseService>(context);
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile & Subscription', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // User Header Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
                ),
              ),
              child: Row(
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      color: const Color(0xFFDCFCE7),
                      shape: BoxShape.circle,
                      border: Border.all(color: const Color(0xFF16A34A), width: 2),
                    ),
                    child: const Icon(Icons.person, color: Color(0xFF16A34A), size: 30),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          fb.currentUser?.phone ?? '+256 700 000 000',
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: fb.isSubscribed ? const Color(0xFF16A34A) : Colors.amber.shade700,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            fb.isSubscribed ? 'VIP SUBSCRIBER' : '7-DAY TRIAL ACTIVE',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Subscription Details Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'SUBSCRIPTION STATUS',
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF94A3B8)),
                  ),
                  const SizedBox(height: 12),
                  _buildDetailRow(
                    'Current Plan',
                    fb.isSubscribed ? 'UGX 15,000 / Month' : '7-Day Free Trial',
                  ),
                  _buildDetailRow(
                    'Trial Status',
                    fb.isTrialExpired
                        ? 'Expired'
                        : '${fb.trialDaysRemaining} days remaining',
                  ),
                  _buildDetailRow(
                    'Trial Started',
                    fb.currentUser?.trialStartDate != null
                        ? fb.currentUser!.trialStartDate.toString().split(' ')[0]
                        : 'Today',
                  ),
                  _buildDetailRow(
                    'Payment Carrier',
                    fb.currentUser?.paymentMethod != 'None'
                        ? fb.currentUser!.paymentMethod
                        : 'Pending (MTN / Airtel Uganda)',
                  ),
                  const Divider(height: 24),

                  // Subscribe Button (UGX 15,000)
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF16A34A),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      icon: const Icon(Icons.star),
                      label: Text(
                        fb.isSubscribed ? 'Extend Subscription (UGX 15,000)' : 'Subscribe Now (UGX 15,000 / Mo)',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => const PaywallScreen()),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Prediction Performance Calendar
            _buildMonthlyCalendarSection(context, isDark),
            const SizedBox(height: 16),

            // App Specifications & Download APK Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'APP SPECS & DOWNLOAD',
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF94A3B8)),
                  ),
                  const SizedBox(height: 12),
                  const Row(
                    children: [
                      Icon(Icons.speed, color: Color(0xFF16A34A), size: 20),
                      SizedBox(width: 8),
                      Text('Lightweight APK: <20MB', style: TextStyle(fontWeight: FontWeight.w600)),
                    ],
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Engineered for low-end Android smartphones (Android 6.0+) with minimal RAM and fast 2G/3G loading.',
                    style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                  ),
                  const SizedBox(height: 14),

                  // Simulate Trial Expired Toggle (Testing requirement)
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const Icon(Icons.timer_off, color: Colors.amber),
                    title: const Text('Test Paywall Flow', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                    subtitle: const Text('Simulate 7-day trial expired', style: TextStyle(fontSize: 12)),
                    trailing: Switch(
                      value: fb.isTrialExpired,
                      activeColor: Colors.amber,
                      onChanged: (val) => fb.toggleSimulateExpired(),
                    ),
                  ),
                  const Divider(height: 16),

                  // Logout
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const Icon(Icons.logout, color: Colors.red),
                    title: const Text('Sign Out', style: TextStyle(color: Colors.red, fontWeight: FontWeight.w600)),
                    onTap: () => fb.logout(),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Color(0xFF64748B), fontSize: 13)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
        ],
      ),
    );
  }

  Widget _buildMonthlyCalendarSection(BuildContext context, bool isDark) {
    // Days representation for September 2026 (1=Tue, starts after 2 empty slots)
    // 0: empty, 1: win, 2: mixed, 3: loss, 4: today, 5: upcoming
    final daysData = [
      {'d': 1, 's': 'win', 'w': '5/5'},
      {'d': 2, 's': 'win', 'w': '4/5'},
      {'d': 3, 's': 'win', 'w': '5/6'},
      {'d': 4, 's': 'loss', 'w': '1/4'},
      {'d': 5, 's': 'win', 'w': '4/4'},
      {'d': 6, 's': 'win', 'w': '5/6'},
      {'d': 7, 's': 'win', 'w': '4/5'},
      {'d': 8, 's': 'mixed', 'w': '3/5'},
      {'d': 9, 's': 'win', 'w': '4/4'},
      {'d': 10, 's': 'win', 'w': '5/6'},
      {'d': 11, 's': 'win', 'w': '4/4'},
      {'d': 12, 's': 'win', 'w': '6/7'},
      {'d': 13, 's': 'win', 'w': '5/6'},
      {'d': 14, 's': 'win', 'w': '4/4'},
      {'d': 15, 's': 'win', 'w': '5/5'},
      {'d': 16, 's': 'win', 'w': '5/6'},
      {'d': 17, 's': 'win', 'w': '4/5'},
      {'d': 18, 's': 'win', 'w': '4/4'},
      {'d': 19, 's': 'win', 'w': '5/6'},
      {'d': 20, 's': 'today', 'w': '3/4'},
      {'d': 21, 's': 'up', 'w': '-'},
      {'d': 22, 's': 'up', 'w': '-'},
      {'d': 23, 's': 'up', 'w': '-'},
      {'d': 24, 's': 'up', 'w': '-'},
      {'d': 25, 's': 'up', 'w': '-'},
      {'d': 26, 's': 'up', 'w': '-'},
      {'d': 27, 's': 'up', 'w': '-'},
      {'d': 28, 's': 'up', 'w': '-'},
      {'d': 29, 's': 'up', 'w': '-'},
      {'d': 30, 's': 'up', 'w': '-'},
    ];

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              const Row(
                children: [
                  Icon(Icons.calendar_month, color: Color(0xFF16A34A), size: 20),
                  SizedBox(width: 8),
                  Text(
                    'September 2026 Record',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFFDCFCE7),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  '86.4% WIN RATE',
                  style: TextStyle(
                    color: Color(0xFF16A34A),
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          const Text(
            'Monthly performance calendar color-coded by win/loss consistency.',
            style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
          ),
          const SizedBox(height: 12),

          // Mini summary bar
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: const [
                Column(
                  children: [
                    Text('17 Days', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF16A34A))),
                    Text('Wins (≥75%)', style: TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                  ],
                ),
                Column(
                  children: [
                    Text('1 Day', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.amber)),
                    Text('Mixed (50-74%)', style: TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                  ],
                ),
                Column(
                  children: [
                    Text('1 Day', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red)),
                    Text('Loss (<50%)', style: TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Days Grid (7 columns: Sun..Sat, Sept 2026 starts on Tue so 2 blank)
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 7,
              crossAxisSpacing: 4,
              mainAxisSpacing: 4,
              childAspectRatio: 1.0,
            ),
            itemCount: 2 + daysData.length,
            itemBuilder: (context, idx) {
              if (idx < 2) {
                return Container(); // padding for Sun, Mon
              }
              final item = daysData[idx - 2];
              final status = item['s'] as String;
              final dayNum = item['d'] as int;
              final record = item['w'] as String;

              Color bg = Colors.transparent;
              Color border = Colors.grey.shade300;
              Color textCol = Colors.black87;

              if (status == 'win') {
                bg = const Color(0xFFDCFCE7);
                border = const Color(0xFF16A34A);
                textCol = const Color(0xFF166534);
              } else if (status == 'mixed') {
                bg = const Color(0xFFFEF3C7);
                border = Colors.amber;
                textCol = Colors.amber.shade900;
              } else if (status == 'loss') {
                bg = const Color(0xFFFFE4E6);
                border = Colors.red;
                textCol = Colors.red.shade900;
              } else if (status == 'today') {
                bg = const Color(0xFFDCFCE7);
                border = const Color(0xFF16A34A);
                textCol = const Color(0xFF16A34A);
              }

              return Container(
                decoration: BoxDecoration(
                  color: bg,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: border, width: status == 'today' ? 2 : 1),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      '$dayNum',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: textCol,
                      ),
                    ),
                    if (record != '-')
                      Text(
                        record,
                        style: TextStyle(
                          fontSize: 8,
                          fontWeight: FontWeight.bold,
                          color: textCol,
                        ),
                      ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
