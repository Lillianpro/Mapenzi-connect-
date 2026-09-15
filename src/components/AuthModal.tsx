import React, { useState } from 'react';
import { Phone, ShieldCheck, ArrowRight, MessageSquare, Sparkles, CheckCircle2, X } from 'lucide-react';
import { EAST_AFRICA_COUNTRIES } from '../data/mockData';
import { CountryCode, SupportedLanguage, UserProfile } from '../types';
import { UI_TRANSLATIONS } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  currentLang?: SupportedLanguage;
  onClose?: () => void;
  onSuccess?: (user: UserProfile, isNew: boolean) => void;
  onComplete?: (phone: string, isNew: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  currentLang = 'en',
  onClose,
  onSuccess,
  onComplete,
}) => {
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;

  const [selectedCountryCode, setSelectedCountryCode] = useState<CountryCode>('+256');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [simulatedSms, setSimulatedSms] = useState<{ message: string; code: string; carrier: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCountry = EAST_AFRICA_COUNTRIES.find((c) => c.code === selectedCountryCode) || EAST_AFRICA_COUNTRIES[0];

  const handleAuthCompleted = (user: UserProfile, isNew: boolean) => {
    if (typeof onSuccess === 'function') {
      onSuccess(user, isNew);
    }
    if (typeof onComplete === 'function') {
      onComplete(user.phone, isNew);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setError('Please enter your mobile phone number');
      return;
    }

    const cleanNumber = phoneNumber.replace(/\s+/g, '');
    const fullPhone = `${selectedCountryCode}${cleanNumber.startsWith('0') ? cleanNumber.slice(1) : cleanNumber}`;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, countryCode: selectedCountryCode }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSimulatedSms({
          message: data.message,
          code: data.debugOtp,
          carrier: data.carrier,
        });
        setStep('otp');
      } else {
        setError(data.error || 'Failed to send verification SMS');
      }
    } catch {
      // Offline fallback simulation
      const fallbackCode = '742918';
      setSimulatedSms({
        message: `OTP sent via ${currentCountry.name} SMS gateway to ${fullPhone}`,
        code: fallbackCode,
        carrier: 'MTN / Safaricom SMS',
      });
      setStep('otp');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    const cleanNumber = phoneNumber.replace(/\s+/g, '');
    const fullPhone = `${selectedCountryCode}${cleanNumber.startsWith('0') ? cleanNumber.slice(1) : cleanNumber}`;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, code: otpCode.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        handleAuthCompleted(data.user, data.isNew);
      } else {
        setError(data.error || 'Incorrect code. Please try again or use 123456');
      }
    } catch {
      // Fallback
      handleAuthCompleted(
        {
          id: 'usr-' + Date.now(),
          phone: fullPhone,
          name: '',
          age: 23,
          gender: 'woman',
          country: currentCountry.name,
          city: currentCountry.cities[0],
          tribe: 'Muganda',
          primaryLanguage: 'Luganda & English',
          religion: 'Christian',
          lookingFor: 'Serious Relationship',
          dowryIntention: 'Traditional custom respected',
          photos: [],
          bio: '',
          isVerified: false,
          isPremium: false,
          likesRemainingToday: 20,
          createdAt: new Date().toISOString(),
          respectPoints: 10,
        },
        true
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-stone-900 border border-amber-900/60 rounded-3xl p-6 shadow-2xl text-stone-100">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-950/40 mb-3 text-white font-black text-2xl">
            MC
          </div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-300 via-orange-300 to-amber-100 bg-clip-text text-transparent">
            {t.loginTitle}
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
            {t.loginSubtitle}
          </p>
        </div>

        {/* Real-time SMS Toast Banner */}
        {simulatedSms && (
          <div className="mb-5 p-3 rounded-2xl bg-amber-950/90 border border-amber-500/60 shadow-lg text-xs space-y-1.5 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between text-amber-300 font-bold">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                Simulated East Africa SMS Gateway
              </span>
              <span className="text-[10px] uppercase bg-amber-500/20 px-2 py-0.5 rounded text-amber-200">
                {simulatedSms.carrier}
              </span>
            </div>
            <p className="text-stone-300 text-[11px]">
              {simulatedSms.message}
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-amber-800/40">
              <span className="text-stone-400 font-mono text-xs">
                Your OTP Code: <strong className="text-amber-200 font-bold text-sm tracking-widest">{simulatedSms.code}</strong>
              </span>
              <button
                type="button"
                id="autofill-otp-btn"
                onClick={() => setOtpCode(simulatedSms.code)}
                className="text-amber-400 hover:text-amber-300 underline font-semibold text-[11px] flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Auto-fill
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Select Country & Mobile Carrier
              </label>
              <div className="grid grid-cols-2 gap-1.5 mb-2.5">
                {EAST_AFRICA_COUNTRIES.map((country) => {
                  const isSelected = selectedCountryCode === country.code;
                  return (
                    <button
                      key={country.code}
                      type="button"
                      id={`country-select-${country.code.replace('+', '')}`}
                      onClick={() => setSelectedCountryCode(country.code)}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-left text-xs transition-all ${
                        isSelected
                          ? 'bg-amber-950/70 border-amber-500 text-amber-200 ring-1 ring-amber-500/50 font-bold'
                          : 'bg-stone-800/60 border-stone-700/80 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <span className="text-base">{country.flag}</span>
                      <div className="leading-none truncate">
                        <div className="truncate">{country.name}</div>
                        <div className="text-[10px] text-stone-500 font-mono mt-0.5">{country.code}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                {t.phoneNumber} ({currentCountry.name})
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center gap-1.5 text-stone-400 font-mono text-sm border-r border-stone-700 pr-2 pointer-events-none">
                  <span>{currentCountry.flag}</span>
                  <span>{currentCountry.code}</span>
                </div>
                <input
                  id="phone-number-input"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={currentCountry.sampleNumber}
                  className="w-full bg-stone-800/90 border border-stone-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-3 pl-24 pr-4 text-stone-100 text-sm font-mono placeholder:text-stone-600 focus:outline-none"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-stone-400 mt-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                East Africa mobile OTP authentication. No email spam.
              </p>
            </div>

            <button
              id="send-otp-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-bold text-sm shadow-lg shadow-orange-950/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-pulse">Connecting to East Africa SMS Gateway...</span>
              ) : (
                <>
                  <span>{t.sendOtp}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-300">
                  {t.enterOtp}
                </label>
                <button
                  type="button"
                  id="change-phone-btn"
                  onClick={() => {
                    setStep('phone');
                    setOtpCode('');
                  }}
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  Change number
                </button>
              </div>

              <input
                id="otp-code-input"
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="• • • • • •"
                className="w-full bg-stone-800/90 border border-amber-600/70 focus:border-amber-400 focus:ring-2 focus:ring-amber-500 rounded-xl py-3.5 px-4 text-stone-100 text-center text-2xl font-mono tracking-widest placeholder:text-stone-700 focus:outline-none"
                autoFocus
              />
              <p className="text-[11px] text-stone-400 mt-2 text-center">
                Sent to <span className="font-mono text-stone-300">{selectedCountryCode}{phoneNumber}</span>
              </p>
            </div>

            <button
              id="verify-otp-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-pulse">Verifying Code...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.verifyAndContinue}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
