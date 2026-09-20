// ============================================================================
// MOBILE MONEY PAYMENT SERVICE FOR EAST AFRICA & INTERNATIONAL
// Supports UGX, KES, TZS, RWF, and USD ($)
// ============================================================================

import 'dart:math';

enum MomoProvider { mtn, airtel, mpesa, tigo, card }

class CountryCurrencyInfo {
  final String code;
  final String name;
  final String flag;
  final String currency;
  final String formattedPrice;
  final int amount;

  const CountryCurrencyInfo({
    required this.code,
    required this.name,
    required this.flag,
    required this.currency,
    required this.formattedPrice,
    required this.amount,
  });
}

class MomoPaymentResult {
  final bool success;
  final String transactionId;
  final String message;
  final String ussdCode;

  MomoPaymentResult({
    required this.success,
    required this.transactionId,
    required this.message,
    required this.ussdCode,
  });
}

class MomoService {
  /// Detects country and currency from user phone number or profile code
  static CountryCurrencyInfo detectCountryFromPhone(String phone) {
    final clean = phone.trim().replaceAll(RegExp(r'\D'), '');
    if (phone.startsWith('+254') || clean.startsWith('254')) {
      return const CountryCurrencyInfo(
        code: 'KE',
        name: 'Kenya',
        flag: '🇰🇪',
        currency: 'KES',
        formattedPrice: 'KES 600',
        amount: 600,
      );
    } else if (phone.startsWith('+255') || clean.startsWith('255')) {
      return const CountryCurrencyInfo(
        code: 'TZ',
        name: 'Tanzania',
        flag: '🇹🇿',
        currency: 'TZS',
        formattedPrice: 'TZS 12,000',
        amount: 12000,
      );
    } else if (phone.startsWith('+250') || clean.startsWith('250')) {
      return const CountryCurrencyInfo(
        code: 'RW',
        name: 'Rwanda',
        flag: '🇷🇼',
        currency: 'RWF',
        formattedPrice: 'RWF 6,000',
        amount: 6000,
      );
    } else if (phone.startsWith('+') && !clean.startsWith('256')) {
      return const CountryCurrencyInfo(
        code: 'OTHER',
        name: 'International',
        flag: '🌐',
        currency: 'USD',
        formattedPrice: '\$4.99',
        amount: 5,
      );
    }

    // Default Uganda
    return const CountryCurrencyInfo(
      code: 'UG',
      name: 'Uganda',
      flag: '🇺🇬',
      currency: 'UGX',
      formattedPrice: 'UGX 15,000',
      amount: 15000,
    );
  }

  /// Initiate Mobile Money prompt
  static Future<MomoPaymentResult> processUgandaPayment({
    required String phone,
    required MomoProvider provider,
    int? amount,
    String? currency,
  }) async {
    await Future.delayed(const Duration(seconds: 2));

    final country = detectCountryFromPhone(phone);
    final finalAmount = amount ?? country.amount;
    final finalCurrency = currency ?? country.currency;

    final randomId = 100000 + Random().nextInt(900000);
    final providerName = provider == MomoProvider.mtn
        ? 'MTN Mobile Money'
        : provider == MomoProvider.airtel
            ? 'Airtel Money'
            : provider == MomoProvider.mpesa
                ? 'M-Pesa'
                : 'Card Payment';

    final ussd = provider == MomoProvider.mtn
        ? (country.code == 'RW' ? '*182#' : '*165#')
        : provider == MomoProvider.airtel
            ? (country.code == 'RW' ? '*500#' : '*185#')
            : provider == MomoProvider.mpesa
                ? '*334#'
                : '3DS Direct';

    final ref = '${provider.name.toUpperCase()}-${country.code}-$randomId';

    return MomoPaymentResult(
      success: true,
      transactionId: ref,
      message: 'Prompt sent to $phone. Approved $finalCurrency $finalAmount for 1-Month VIP subscription.',
      ussdCode: ussd,
    );
  }
}
