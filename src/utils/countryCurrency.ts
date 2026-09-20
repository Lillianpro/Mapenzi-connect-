import { UserSubscription } from '../types';

export type CountryCode = 'UG' | 'KE' | 'TZ' | 'RW' | 'OTHER';
export type CurrencyCode = 'UGX' | 'KES' | 'TZS' | 'RWF' | 'USD';

export interface PaymentProvider {
  id: string;
  name: string;
  shortName: string;
  ussd?: string;
  color: string;
  textColor: string;
  badge?: string;
  note: string;
  recipientNumber?: string;
  isComingSoon?: boolean;
  statusBadge?: string;
}

export interface CountryPaymentConfig {
  code: CountryCode;
  name: string;
  flag: string;
  currency: CurrencyCode;
  currencySymbol: string;
  price: number;
  formattedPrice: string;
  perPeriod: string;
  dialCode: string;
  samplePhone: string;
  paymentType: 'momo' | 'card';
  headline: string;
  providers: PaymentProvider[];
  airtelPaymentNumber?: string;
}

export const COUNTRY_CONFIGS: Record<CountryCode, CountryPaymentConfig> = {
  UG: {
    code: 'UG',
    name: 'Uganda',
    flag: '🇺🇬',
    currency: 'UGX',
    currencySymbol: 'UGX',
    price: 15000,
    formattedPrice: 'UGX 15,000',
    perPeriod: '/ month',
    dialCode: '+256',
    samplePhone: '0772 123 456',
    paymentType: 'momo',
    headline: 'Subscribe for UGX 15,000 / Month to continue',
    airtelPaymentNumber: '+256703320730',
    providers: [
      {
        id: 'Airtel Money',
        name: 'Airtel Money Uganda',
        shortName: 'Airtel',
        ussd: '*185#',
        color: '#E50914',
        textColor: '#FFFFFF',
        badge: 'Airtel',
        note: 'Pay to: +256703320730 (*185#)',
        recipientNumber: '+256703320730',
        statusBadge: 'Active',
      },
      {
        id: 'MTN Mobile Money',
        name: 'MTN Mobile Money Uganda',
        shortName: 'MTN',
        ussd: '*165#',
        color: '#FFCC00',
        textColor: '#000000',
        badge: 'MoMo',
        note: 'MTN money is soon coming',
        isComingSoon: true,
        statusBadge: 'Soon Coming',
      },
    ],
  },
  KE: {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    currency: 'KES',
    currencySymbol: 'KSh',
    price: 600,
    formattedPrice: 'KES 600',
    perPeriod: '/ month',
    dialCode: '+254',
    samplePhone: '0712 345 678',
    paymentType: 'momo',
    headline: 'Subscribe for KES 600 / Month to continue',
    providers: [
      {
        id: 'Safaricom M-Pesa',
        name: 'Safaricom M-Pesa Kenya',
        shortName: 'M-PESA',
        ussd: '*334#',
        color: '#00A859',
        textColor: '#FFFFFF',
        badge: 'M-Pesa',
        note: 'STK Push prompt to your Safaricom line (*334#)',
      },
      {
        id: 'Airtel Money Kenya',
        name: 'Airtel Money Kenya',
        shortName: 'AIRTEL',
        ussd: '*334#',
        color: '#E50914',
        textColor: '#FFFFFF',
        badge: 'Airtel',
        note: 'Direct payment via Airtel Money (*334#)',
      },
    ],
  },
  TZ: {
    code: 'TZ',
    name: 'Tanzania',
    flag: '🇹🇿',
    currency: 'TZS',
    currencySymbol: 'TSh',
    price: 12000,
    formattedPrice: 'TZS 12,000',
    perPeriod: '/ month',
    dialCode: '+255',
    samplePhone: '0754 123 456',
    paymentType: 'momo',
    headline: 'Subscribe for TZS 12,000 / Month to continue',
    providers: [
      {
        id: 'Vodacom M-Pesa TZ',
        name: 'Vodacom M-Pesa Tanzania',
        shortName: 'M-PESA',
        ussd: '*150*00#',
        color: '#E60000',
        textColor: '#FFFFFF',
        badge: 'M-Pesa',
        note: 'Direct push via Vodacom M-Pesa (*150*00#)',
      },
      {
        id: 'Tigo Pesa Tanzania',
        name: 'Tigo Pesa Tanzania',
        shortName: 'TIGO',
        ussd: '*150*01#',
        color: '#00377B',
        textColor: '#FFFFFF',
        badge: 'Tigo',
        note: 'Direct push via Tigo Pesa (*150*01#)',
      },
      {
        id: 'Airtel Money TZ',
        name: 'Airtel Money Tanzania',
        shortName: 'AIRTEL',
        ussd: '*150*60#',
        color: '#E50914',
        textColor: '#FFFFFF',
        badge: 'Airtel',
        note: 'Direct push via Airtel Money (*150*60#)',
      },
    ],
  },
  RW: {
    code: 'RW',
    name: 'Rwanda',
    flag: '🇷🇼',
    currency: 'RWF',
    currencySymbol: 'FRw',
    price: 6000,
    formattedPrice: 'RWF 6,000',
    perPeriod: '/ month',
    dialCode: '+250',
    samplePhone: '0788 123 456',
    paymentType: 'momo',
    headline: 'Subscribe for RWF 6,000 / Month to continue',
    providers: [
      {
        id: 'MTN MoMo Rwanda',
        name: 'MTN Mobile Money Rwanda',
        shortName: 'MTN',
        ussd: '*182#',
        color: '#FFCC00',
        textColor: '#000000',
        badge: 'MoMo',
        note: 'Instant PIN prompt via MTN MoMo (*182#)',
      },
      {
        id: 'Airtel Money Rwanda',
        name: 'Airtel Money Rwanda',
        shortName: 'AIRTEL',
        ussd: '*500#',
        color: '#E50914',
        textColor: '#FFFFFF',
        badge: 'Airtel',
        note: 'Direct push via Airtel Money Rwanda (*500#)',
      },
    ],
  },
  OTHER: {
    code: 'OTHER',
    name: 'International (All Countries)',
    flag: '🌐',
    currency: 'USD',
    currencySymbol: '$',
    price: 4.99,
    formattedPrice: '$4.99',
    perPeriod: '/ month',
    dialCode: '+1',
    samplePhone: '+1 234 567 8900',
    paymentType: 'card',
    headline: 'Subscribe for $4.99 / Month to continue',
    providers: [
      {
        id: 'Credit/Debit Card',
        name: 'Visa / Mastercard / Amex',
        shortName: 'CARD',
        color: '#2563EB',
        textColor: '#FFFFFF',
        badge: 'Card',
        note: 'Instant 3D-Secure card authorization (USD $4.99)',
      },
      {
        id: 'PayPal / Apple Pay',
        name: 'PayPal / Google Pay / Apple Pay',
        shortName: 'PAYPAL',
        color: '#003087',
        textColor: '#FFFFFF',
        badge: 'Wallet',
        note: 'Fast 1-click international checkout in USD',
      },
    ],
  },
};

export const ALL_SUPPORTED_COUNTRIES: CountryPaymentConfig[] = [
  COUNTRY_CONFIGS.UG,
  COUNTRY_CONFIGS.KE,
  COUNTRY_CONFIGS.TZ,
  COUNTRY_CONFIGS.RW,
  COUNTRY_CONFIGS.OTHER,
];

/**
 * Automatically detects the user's country code from their profile information:
 * 1. user.country if explicitly set (UG, KE, TZ, RW, or OTHER)
 * 2. International phone number prefix (+256, +254, +255, +250, etc.)
 * 3. Browser system timezone fallback (Kampala, Nairobi, Dar es Salaam, Kigali)
 */
export function detectCountryFromProfile(user: UserSubscription | null | undefined): CountryPaymentConfig {
  if (!user) {
    return getFallbackCountryFromTimezone();
  }

  // 1. Explicit country property on user profile
  if (user.country) {
    const norm = user.country.toUpperCase().trim();
    if (norm === 'UG' || norm === 'UGANDA') return COUNTRY_CONFIGS.UG;
    if (norm === 'KE' || norm === 'KENYA') return COUNTRY_CONFIGS.KE;
    if (norm === 'TZ' || norm === 'TANZANIA') return COUNTRY_CONFIGS.TZ;
    if (norm === 'RW' || norm === 'RWANDA') return COUNTRY_CONFIGS.RW;
    if (norm === 'OTHER' || norm === 'INTL' || norm === 'INTERNATIONAL' || norm === 'USD') return COUNTRY_CONFIGS.OTHER;
  }

  // 2. Parse phone number
  const rawPhone = (user.phone || '').trim();
  if (rawPhone) {
    const cleanDigits = rawPhone.replace(/\D/g, ''); // keep only digits

    // Check with leading '+' or country dial digits
    if (rawPhone.startsWith('+256') || cleanDigits.startsWith('256')) {
      return COUNTRY_CONFIGS.UG;
    }
    if (rawPhone.startsWith('+254') || cleanDigits.startsWith('254')) {
      return COUNTRY_CONFIGS.KE;
    }
    if (rawPhone.startsWith('+255') || cleanDigits.startsWith('255')) {
      return COUNTRY_CONFIGS.TZ;
    }
    if (rawPhone.startsWith('+250') || cleanDigits.startsWith('250')) {
      return COUNTRY_CONFIGS.RW;
    }

    // Check international numbers starting with +
    if (rawPhone.startsWith('+') && !cleanDigits.startsWith('256') && !cleanDigits.startsWith('254') && !cleanDigits.startsWith('255') && !cleanDigits.startsWith('250')) {
      return COUNTRY_CONFIGS.OTHER;
    }

    // Local 10-digit Uganda numbers (e.g. 0772..., 0701..., 0752...)
    if (cleanDigits.length === 10 && (cleanDigits.startsWith('07') || cleanDigits.startsWith('03'))) {
      // In East Africa, 07 is common across UG, KE, TZ, RW. Check timezone to disambiguate:
      return getFallbackCountryFromTimezone();
    }
  }

  // 3. Fallback to device timezone
  return getFallbackCountryFromTimezone();
}

/**
 * Inspects device timezone / locale to detect country
 */
export function getFallbackCountryFromTimezone(): CountryPaymentConfig {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Kampala')) return COUNTRY_CONFIGS.UG;
    if (tz.includes('Nairobi')) return COUNTRY_CONFIGS.KE;
    if (tz.includes('Dar_es_Salaam')) return COUNTRY_CONFIGS.TZ;
    if (tz.includes('Kigali')) return COUNTRY_CONFIGS.RW;
  } catch {
    // ignore
  }

  // Default primary launch market is Uganda (UGX)
  return COUNTRY_CONFIGS.UG;
}

/**
 * Helper to get country configuration by country code
 */
export function getCountryConfig(code: string): CountryPaymentConfig {
  const norm = (code || '').toUpperCase().trim();
  if (norm in COUNTRY_CONFIGS) {
    return COUNTRY_CONFIGS[norm as CountryCode];
  }
  return COUNTRY_CONFIGS.OTHER;
}
