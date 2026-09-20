// ============================================================================
// PAYWALL SCREEN: Trial Ended. Subscribe for UGX 15,000 / Month to continue
// Payment methods: MTN Mobile Money Uganda & Airtel Money Uganda API
// Stores user status in Firebase: trial_start_date, is_subscribed, subscription_expiry
// ============================================================================

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/firebase_service.dart';
import '../services/momo_service.dart';

class PaywallScreen extends StatefulWidget {
  const PaywallScreen({super.key});

  @override
  State<PaywallScreen> createState() => _PaywallScreenState();
}

class _PaywallScreenState extends State<PaywallScreen> {
  bool _isProcessing = false;
  String? _statusMessage;

  void _handlePayment(MomoProvider provider) async {
    setState(() {
      _isProcessing = true;
      _statusMessage = provider == MomoProvider.mtn 
          ? 'Initiating MTN Mobile Money Uganda prompt (*165#)...' 
          : 'Initiating Airtel Money Uganda prompt (*185#)...';
    });

    final fb = Provider.of<FirebaseService>(context, listen: false);
    final phone = fb.currentUser?.phone ?? '+256772000000';

    try {
      final res = await MomoService.processUgandaPayment(
        phone: phone,
        provider: provider,
        amount: 15000,
      );

      if (res.success) {
        final providerName = provider == MomoProvider.mtn ? 'MTN Mobile Money' : 'Airtel Money';
        await fb.activateSubscription(
          provider: providerName,
          transactionRef: res.transactionId,
        );

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              backgroundColor: const Color(0xFF16A34A),
              content: Text('Payment Approved! 1-Month VIP Unlocked via $providerName.'),
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _statusMessage = 'Error processing payment. Please try again.';
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          _isProcessing = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final fb = Provider.of<FirebaseService>(context);
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final phone = fb.currentUser?.phone ?? '+256772000000';
    final country = MomoService.detectCountryFromPhone(phone);

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 20),

              // Lock Icon
              Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  color: Colors.amber.shade100,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.lock_clock, size: 40, color: Colors.amber),
              ),
              const SizedBox(height: 16),

              // Headline requested: "Trial Ended. Subscribe for [Currency Amount] / Month to continue"
              const Text(
                'Trial Ended',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                'Subscribe for ${country.formattedPrice} / Month to continue',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF16A34A),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Your 7-day free trial period has concluded. (${country.flag} ${country.name}). Re-activate daily high-confidence football and basketball predictions.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 13, color: Colors.grey.shade600, height: 1.4),
              ),
              const SizedBox(height: 24),

              // Features List
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
                  ),
                ),
                child: Column(
                  children: [
                    _buildFeatureRow('Daily 80%+ High Accuracy Predictions'),
                    _buildFeatureRow('Football: 1X2, Double Chance, Over/Under, BTTS'),
                    _buildFeatureRow('Basketball: Winner & Over/Under Points'),
                    _buildFeatureRow('In-depth "Why this prediction?" AI reasoning'),
                    _buildFeatureRow('Live Match Scores and In-play Analysis'),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // Plan Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFDCFCE7),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF16A34A), width: 1.5),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'VIP 1-MONTH PASS',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF15803D),
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          country.formattedPrice,
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF14532D),
                          ),
                        ),
                      ],
                    ),
                    Text(
                      'Billed Monthly\nCancel anytime',
                      textAlign: TextAlign.end,
                      style: TextStyle(fontSize: 11, color: Color(0xFF15803D)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              if (_isProcessing)
                Column(
                  children: [
                    const CircularProgressIndicator(
                      valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF16A34A)),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      _statusMessage ?? 'Processing payment...',
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                  ],
                )
              else ...[
                // Official Airtel Money Payment Card with +256703320730
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF3F1316) : const Color(0xFFFEF2F2),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFFEF4444), width: 1.5),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'AIRTEL MONEY PAYMENT',
                            style: TextStyle(
                              color: Color(0xFFDC2626),
                              fontWeight: FontWeight.bold,
                              fontSize: 11,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFFDCFCE7),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Text(
                              'Active',
                              style: TextStyle(
                                color: Color(0xFF16A34A),
                                fontWeight: FontWeight.bold,
                                fontSize: 10,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Payment Number: +256703320730',
                        style: TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.bold,
                          fontFamily: 'monospace',
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Dial *185# > Send Money to 0703320730 > ${country.formattedPrice}',
                        style: TextStyle(fontSize: 12, color: isDark ? Colors.white70 : Colors.black87),
                      ),
                    ],
                  ),
                ),

                // Airtel Money Button (Primary)
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFE50914), // Airtel Red
                      foregroundColor: Colors.white,
                      elevation: 1,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    onPressed: () => _handlePayment(MomoProvider.airtel),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.phonelink_ring, size: 20),
                        SizedBox(width: 8),
                        Text(
                          'Pay via Airtel (+256703320730)',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),

                // MTN Mobile Money Button (Marked Soon Coming)
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      backgroundColor: isDark ? const Color(0xFF2E2405) : const Color(0xFFFFFBEB),
                      side: const BorderSide(color: Color(0xFFF59E0B), width: 1.5),
                      foregroundColor: const Color(0xFFB45309),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          backgroundColor: Color(0xFFD97706),
                          content: Text(
                            'MTN Money is soon coming! Please send payment to Airtel Money (+256703320730) or contact WhatsApp.',
                          ),
                        ),
                      );
                    },
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.access_time_filled, size: 18, color: Color(0xFFD97706)),
                        SizedBox(width: 8),
                        Text(
                          'MTN Mobile Money (Soon Coming)',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
              const SizedBox(height: 20),

              // Developer toggle button to exit paywall for testing
              TextButton(
                onPressed: () => fb.toggleSimulateExpired(),
                child: const Text(
                  'Restore / Exit Paywall Test Mode',
                  style: TextStyle(color: Color(0xFF64748B), fontSize: 12),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFeatureRow(String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          const Icon(Icons.check_circle, color: Color(0xFF16A34A), size: 18),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }
}
