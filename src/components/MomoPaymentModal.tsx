import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Check, 
  Phone, 
  ArrowRight, 
  Loader2, 
  X, 
  Globe, 
  CreditCard,
  Smartphone,
  ChevronDown,
  Copy,
  MessageCircle,
  Clock,
  AlertCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { UserSubscription } from '../types';
import { 
  detectCountryFromProfile, 
  getCountryConfig, 
  ALL_SUPPORTED_COUNTRIES, 
  CountryCode, 
  CountryPaymentConfig,
  PaymentProvider
} from '../utils/countryCurrency';

export interface MomoPaymentModalProps {
  isOpen: boolean;
  onClose?: () => void;
  user: UserSubscription | null;
  onSubscribe: (provider: string, currency?: string, amount?: number, country?: string) => Promise<boolean>;
  isLocked: boolean;
}

export const MomoPaymentModal: React.FC<MomoPaymentModalProps> = ({
  isOpen,
  onClose,
  user,
  onSubscribe,
  isLocked,
}) => {
  // Automatically detect user's country from profile
  const detectedConfig = detectCountryFromProfile(user);
  const [selectedCountryCode, setSelectedCountryCode] = useState<CountryCode>(detectedConfig.code);
  const [activeConfig, setActiveConfig] = useState<CountryPaymentConfig>(detectedConfig);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ussdStep, setUssdStep] = useState<string | null>(null);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [mtnNoticeOpen, setMtnNoticeOpen] = useState(false);

  // Sync when user prop updates or changes
  useEffect(() => {
    const updated = detectCountryFromProfile(user);
    setSelectedCountryCode(updated.code);
    setActiveConfig(updated);
  }, [user]);

  // When country code changes, update activeConfig and reset selected provider
  useEffect(() => {
    const config = getCountryConfig(selectedCountryCode);
    setActiveConfig(config);
    if (config.providers.length > 0) {
      setSelectedProvider(config.providers[0].name);
    }
  }, [selectedCountryCode]);

  if (!isOpen) return null;

  const handleCopyNumber = (num: string) => {
    navigator.clipboard?.writeText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const handlePay = async (provider: PaymentProvider) => {
    if (provider.isComingSoon) {
      setMtnNoticeOpen(true);
      return;
    }

    setSelectedProvider(provider.name);
    setIsProcessing(true);

    if (provider.recipientNumber) {
      setUssdStep(
        `Initiating ${provider.shortName} payment prompt (${provider.ussd}) to ${provider.recipientNumber} for ${activeConfig.formattedPrice}...`
      );
    } else if (provider.ussd) {
      setUssdStep(
        `Initiating ${provider.shortName} push prompt (${provider.ussd}) to ${user?.phone || activeConfig.samplePhone}...`
      );
    } else {
      setUssdStep(`Opening secure checkout for ${activeConfig.formattedPrice} (${provider.name})...`);
    }

    const ok = await onSubscribe(
      provider.recipientNumber ? `${provider.name} (${provider.recipientNumber})` : provider.name,
      activeConfig.currency,
      activeConfig.price,
      activeConfig.code
    );

    setIsProcessing(false);
    setUssdStep(null);
    if (ok && onClose && !isLocked) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#110b26] w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-purple-900/60 relative overflow-hidden text-slate-900 dark:text-white max-h-[92vh] overflow-y-auto">
        {/* Close button only allowed if not hard-locked */}
        {!isLocked && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Lock & Header */}
        <div className="text-center space-y-2 mb-4">
          <div className="w-12 h-12 bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          
          <h2 className="text-xl font-black tracking-tight">
            Trial Ended.
          </h2>
          
          {/* Dynamic headline updated according to detected currency */}
          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
            {activeConfig.headline}
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Your 7-day free trial has concluded. Re-activate all daily football & basketball AI predictions with 85%+ accuracy.
          </p>
        </div>

        {/* COUNTRY AUTO-DETECTION & SELECTOR BAR */}
        <div className="mb-4 p-2.5 rounded-2xl bg-slate-100 dark:bg-purple-950/40 border border-slate-200 dark:border-purple-800/40">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              <span>Country & Currency:</span>
            </div>
            <button
              type="button"
              onClick={() => setShowCountryPicker(!showCountryPicker)}
              className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Change</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showCountryPicker ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Current Active Selection pill */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-purple-900/50 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-lg leading-none">{activeConfig.flag}</span>
              <div>
                <span className="text-xs font-bold block">{activeConfig.name}</span>
                <span className="text-[10px] text-slate-400">
                  {user?.phone ? `Detected from phone (${user.phone})` : 'System Auto-Detected'}
                </span>
              </div>
            </div>
            <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/30">
              {activeConfig.currency}
            </span>
          </div>

          {/* Expandable Country Switcher Grid */}
          {showCountryPicker && (
            <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-purple-800/40 grid grid-cols-2 sm:grid-cols-3 gap-1.5 animate-in slide-in-from-top-1">
              {ALL_SUPPORTED_COUNTRIES.map((c) => {
                const isSelected = c.code === selectedCountryCode;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setSelectedCountryCode(c.code);
                      setShowCountryPicker(false);
                    }}
                    className={`p-2 rounded-xl text-left flex items-center gap-2 transition border ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-base">{c.flag}</span>
                    <div className="truncate">
                      <span className="text-xs block truncate">{c.currency}</span>
                      <span className="text-[10px] text-slate-400 block truncate">{c.formattedPrice}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Dynamic Pricing Plan Display */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-500/70 mb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
              VIP Full Access ({activeConfig.flag} {activeConfig.name})
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
              {activeConfig.formattedPrice}{' '}
              <span className="text-xs font-normal text-slate-500 font-sans">{activeConfig.perPeriod}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-600 text-white font-bold inline-block shadow-xs">
              {activeConfig.paymentType === 'momo' ? 'Instant MoMo' : 'Instant Card / $'}
            </span>
            <span className="block text-[10px] text-slate-400 mt-0.5">30-day validity</span>
          </div>
        </div>

        {/* Value Prop List */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-3 space-y-2 mb-4 border border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-semibold">VIP 1X2 Games (4 games) & Double Chance (6 games)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-semibold">HT/FT Draw (2 games) & Full-Time Draw (2 games)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-semibold">Correct Score of the Day (high return odds)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-semibold">Over/Under 2.5 Goals (4 games)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <Check className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-bold text-amber-600 dark:text-amber-400">
              Odd 2++, Odd 5++, Odd 15++, and Mega Odd 50 Slips
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Copyable booking codes (BetPawa, 1XBet, SportyBet)</span>
          </div>
        </div>

        {/* Processing State */}
        {isProcessing ? (
          <div className="py-6 text-center space-y-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-100">
              {ussdStep}
            </p>
            <p className="text-[11px] text-slate-400">
              Awaiting network authorization... Please confirm on your mobile handset.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* SPECIAL DEDICATED AIRTEL MONEY & MTN NOTICE FOR UGANDA */}
            {activeConfig.code === 'UG' && (
              <div className="space-y-3">
                {/* Official Airtel Money Payment Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-red-50 dark:from-red-950/30 dark:to-slate-900 border-2 border-red-500/60 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-[11px] flex items-center justify-center">
                        AIR
                      </span>
                      <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                        Official Airtel Money Payment
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                      Active
                    </span>
                  </div>

                  {/* Payment Number Highlight */}
                  <div className="bg-white dark:bg-slate-900/90 rounded-xl p-3 border border-red-200 dark:border-red-900/50 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                        Payment Recipient Number:
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                        <span className="text-base sm:text-lg font-black font-mono tracking-tight text-slate-900 dark:text-white">
                          +256703320730
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyNumber('+256703320730')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                        copiedNumber
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      {copiedNumber ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Step-by-step instructions */}
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 bg-red-50/50 dark:bg-red-950/20 p-2.5 rounded-xl border border-red-100 dark:border-red-900/30">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-red-600" />
                      <span>How to pay via Airtel Money:</span>
                    </div>
                    <p>1. Dial <strong className="font-mono text-red-700 dark:text-red-400">*185#</strong> on Airtel Uganda.</p>
                    <p>2. Choose <strong>Send Money</strong> & enter number <strong className="font-mono font-bold text-red-700 dark:text-red-300">0703320730</strong>.</p>
                    <p>3. Enter amount <strong className="font-mono font-bold text-slate-900 dark:text-white">UGX 15,000</strong> & your Airtel PIN.</p>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const airtel = activeConfig.providers.find((p) => p.id === 'Airtel Money') || activeConfig.providers[0];
                        handlePay(airtel);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-[0.99]"
                    >
                      <Check className="w-4 h-4" />
                      <span>Activate VIP Now</span>
                    </button>
                    <a
                      href="https://wa.me/256703320730?text=Hello%20Zinna%20Tips%20Support%2C%20I%20have%20sent%20UGX%2015000%20via%20Airtel%20Money%20to%20%2B256703320730%20for%20VIP%20activation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-[0.99]"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Proof</span>
                    </a>
                  </div>
                </div>

                {/* MTN Money Soon Coming Banner */}
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700/50 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 font-black text-xs shadow-sm">
                    MTN
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                        MTN Mobile Money
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 border border-amber-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Soon Coming
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300/90 mt-1 leading-relaxed">
                      MTN money is soon coming. In the meantime, please complete your VIP subscription via <strong>Airtel Money (+256703320730)</strong> above or contact WhatsApp support.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* General Provider Buttons */}
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                {activeConfig.code === 'UG'
                  ? 'All Uganda Payment Options'
                  : activeConfig.paymentType === 'momo'
                  ? `Select ${activeConfig.name} Mobile Money Carrier`
                  : `Select International Payment Method ($ USD)`}
              </div>

              {activeConfig.providers.map((p) => {
                const isComingSoon = p.isComingSoon;
                return (
                  <button
                    key={p.id}
                    onClick={() => handlePay(p)}
                    style={{ backgroundColor: p.color, color: p.textColor }}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md flex items-center justify-between transition-transform active:scale-[0.99] hover:opacity-95 ${
                      isComingSoon ? 'opacity-90 ring-2 ring-amber-400/50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span 
                        className="w-6 h-6 rounded-full font-black text-[10px] flex items-center justify-center border"
                        style={{ 
                          backgroundColor: p.textColor, 
                          color: p.color,
                          borderColor: p.textColor 
                        }}
                      >
                        {p.badge || p.shortName.slice(0, 3)}
                      </span>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="block text-xs sm:text-sm font-bold">{p.name}</span>
                          {p.statusBadge && (
                            <span 
                              className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                                isComingSoon 
                                  ? 'bg-amber-950 text-amber-300 border border-amber-600' 
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                              }`}
                            >
                              {p.statusBadge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] opacity-80 block font-normal">{p.note}</span>
                      </div>
                    </div>
                    {isComingSoon ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-black/30 text-white border border-white/20">
                        Soon Coming
                      </span>
                    ) : (
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* MTN Coming Soon Modal / Notice Popup */}
        {mtnNoticeOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 border border-amber-500/50 rounded-2xl p-5 max-w-sm w-full text-center space-y-3 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center mx-auto border border-amber-500/40">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                MTN Money is Soon Coming!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Direct automated MTN Mobile Money is currently being finalized. You can easily subscribe now using <strong>Airtel Money (+256703320730)</strong>, or chat with our admin on WhatsApp.
              </p>
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMtnNoticeOpen(false);
                    const airtel = activeConfig.providers.find((p) => p.id === 'Airtel Money');
                    if (airtel) handlePay(airtel);
                  }}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Pay via Airtel Money (+256703320730)</span>
                </button>
                <a
                  href="https://wa.me/256703320730?text=Hello%20Zinna%20Tips%20Support%2C%20I%20want%20to%20pay%20via%20MTN%20Mobile%20Money"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 block text-center"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Contact WhatsApp Support (+256703320730)</span>
                </a>
                <button
                  type="button"
                  onClick={() => setMtnNoticeOpen(false)}
                  className="w-full py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 text-center">
          <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 inline" />
            Registered phone: {user?.phone || activeConfig.samplePhone} • Carrier-grade SSL encryption
          </span>
        </div>
      </div>
    </div>
  );
};

export default MomoPaymentModal;
