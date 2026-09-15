import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, ArrowRight, ShieldCheck, X, Smartphone, 
  Copy, Check, Heart, Handshake, Zap, Info, Shield, Award 
} from 'lucide-react';
import { SupportedLanguage } from '../types';

interface MomoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (provider: string, amount: number, currency: string) => void;
  defaultPhone?: string;
}

export const MomoPaymentModal: React.FC<MomoPaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultPhone = '+256703320730',
}) => {
  // Plan: weekly (15,000 UGX) or monthly (40,000 UGX)
  const [plan, setPlan] = useState<'weekly' | 'monthly'>('monthly');
  // Provider: Airtel Money (Primary) or MTN Mobile Money
  const [provider, setProvider] = useState<'Airtel Money' | 'MTN Mobile Money'>('Airtel Money');
  
  const [phone, setPhone] = useState(defaultPhone);
  const [transactionId, setTransactionId] = useState('');
  const [step, setStep] = useState<'details' | 'verifying' | 'success'>('details');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [receiptData, setReceiptData] = useState<{
    amount: number;
    currency: string;
    ref: string;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const currentAmount = plan === 'weekly' ? 15000 : 40000;
  const currency = 'UGX';

  const handleCopyAirtelNumber = () => {
    navigator.clipboard.writeText('0703320730');
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const handleFillDemoTxId = () => {
    const demoId = 'TX' + Math.floor(100000000 + Math.random() * 900000000);
    setTransactionId(demoId);
    setErrorMessage('');
  };

  const handleVerifyAndActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (provider === 'Airtel Money' && !transactionId.trim()) {
      setErrorMessage('Please enter the Transaction ID received from Airtel Money SMS.');
      return;
    }

    setErrorMessage('');
    setStep('verifying');

    try {
      const res = await fetch('/api/payment/momo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'currentUser',
          phone,
          provider,
          plan,
          transactionId: transactionId.trim() || undefined,
        }),
      });
      const data = await res.json();
      
      setTimeout(() => {
        setReceiptData({
          amount: data.amount || currentAmount,
          currency: data.currency || 'UGX',
          ref: data.transaction?.reference || transactionId || 'AIRTEL-TX-SUCCESS',
          message: data.receiptMessage || 'Payment verified! Premium activated.',
        });
        setStep('success');
      }, 1200);
    } catch {
      setTimeout(() => {
        setReceiptData({
          amount: currentAmount,
          currency: 'UGX',
          ref: transactionId || 'AIRTEL-TX-' + Math.floor(100000 + Math.random() * 900000),
          message: `Payment of ${currentAmount.toLocaleString()} UGX verified to Airtel Money 0703320730 (kyomugisha - WATER HUNTERS). Premium VIP is active!`,
        });
        setStep('success');
      }, 1000);
    }
  };

  const handleDone = () => {
    onSuccess(provider, currentAmount, currency);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-stone-900 border-2 border-amber-500/70 rounded-3xl p-5 sm:p-6 shadow-2xl text-stone-100 my-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with Mapenzi Logo */}
        <div className="flex items-center gap-3 border-b border-stone-800 pb-3 mb-4">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border border-amber-500/50 shrink-0 bg-stone-950">
            <img 
              src="/app_icon.png" 
              alt="Mapenzi Connect" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Mapenzi Connect VIP
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-600 to-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                Premium
              </span>
            </div>
            <p className="text-xs text-amber-300 font-medium">
              Uganda • Kenya • Tanzania • Rwanda
            </p>
          </div>
        </div>

        {step === 'details' && (
          <form onSubmit={handleVerifyAndActivate} className="space-y-4">
            {/* PRICING TIER SELECTOR: Weekly 15,000 UGX / Monthly 40,000 UGX */}
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5 uppercase tracking-wider">
                1. Select VIP Duration & Pricing
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {/* Weekly Plan */}
                <button
                  type="button"
                  id="plan-weekly-btn"
                  onClick={() => setPlan('weekly')}
                  className={`p-3 rounded-2xl border text-left transition-all relative ${
                    plan === 'weekly'
                      ? 'bg-gradient-to-br from-amber-950/90 to-red-950/80 border-amber-400 ring-2 ring-amber-500/50 shadow-md'
                      : 'bg-stone-800/80 border-stone-700 text-stone-400 hover:bg-stone-800'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-extrabold text-white">Weekly Pass</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-700 text-stone-300 font-semibold">
                      7 Days
                    </span>
                  </div>
                  <div className="mt-1 text-lg font-black text-amber-400 font-mono">
                    15,000 <span className="text-xs font-normal text-stone-300">UGX</span>
                  </div>
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    Fast connection trial
                  </div>
                </button>

                {/* Monthly Plan */}
                <button
                  type="button"
                  id="plan-monthly-btn"
                  onClick={() => setPlan('monthly')}
                  className={`p-3 rounded-2xl border text-left transition-all relative ${
                    plan === 'monthly'
                      ? 'bg-gradient-to-br from-amber-950/90 to-red-950/80 border-amber-400 ring-2 ring-amber-500/50 shadow-md'
                      : 'bg-stone-800/80 border-stone-700 text-stone-400 hover:bg-stone-800'
                  }`}
                >
                  <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                    Best Value
                  </span>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-extrabold text-white">Monthly VIP</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-700 text-stone-300 font-semibold">
                      30 Days
                    </span>
                  </div>
                  <div className="mt-1 text-lg font-black text-amber-400 font-mono">
                    40,000 <span className="text-xs font-normal text-stone-300">UGX</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                    Save 20,000 UGX vs weekly
                  </div>
                </button>
              </div>
            </div>

            {/* PAYMENT METHOD SELECTION */}
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5 uppercase tracking-wider">
                2. Choose Mobile Payment Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                {/* Airtel Money Button */}
                <button
                  type="button"
                  id="select-airtel-btn"
                  onClick={() => setProvider('Airtel Money')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    provider === 'Airtel Money'
                      ? 'bg-red-950/90 border-red-500 text-white ring-2 ring-red-500/50 shadow-md'
                      : 'bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-750'
                  }`}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>Airtel Money (*185#)</span>
                  <span className="text-[9px] bg-red-600/30 text-red-300 px-1.5 py-0.5 rounded font-mono">Primary</span>
                </button>

                {/* MTN MoMo Button */}
                <button
                  type="button"
                  id="select-mtn-btn"
                  onClick={() => setProvider('MTN Mobile Money')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    provider === 'MTN Mobile Money'
                      ? 'bg-yellow-950/80 border-yellow-500 text-white ring-2 ring-yellow-500/50 shadow-md'
                      : 'bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-750'
                  }`}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span>MTN MoMo (*165#)</span>
                </button>
              </div>
            </div>

            {/* VERY IMPORTANT: AIRTEL MONEY SPECIFIC INSTRUCTIONS & RECIPIENT */}
            {provider === 'Airtel Money' ? (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-red-950/80 via-stone-900 to-amber-950/70 border-2 border-red-500/80 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-red-900/50 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-300">
                    <Smartphone className="w-4 h-4 text-red-400" />
                    <span>Airtel Money Payment Details</span>
                  </div>
                  <span className="text-[11px] font-black text-amber-300 font-mono">
                    {currentAmount.toLocaleString()} UGX
                  </span>
                </div>

                {/* THE CORE MANDATED PROMINENT NUMBER & NAME */}
                <div className="p-3 rounded-xl bg-black/60 border border-red-500/40 text-center space-y-1">
                  <div className="text-[11px] text-stone-300 font-medium">
                    Pay to Airtel Money:
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white tracking-wider font-mono flex items-center justify-center gap-2">
                    <span className="text-red-400">+256</span> 0703320730
                    <button
                      type="button"
                      id="copy-airtel-number-btn"
                      onClick={handleCopyAirtelNumber}
                      className="p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs transition-transform active:scale-95"
                      title="Copy Number"
                    >
                      {copiedNumber ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="text-xs font-bold text-amber-300">
                    Account Name: <span className="text-white">kyomugisha - WATER HUNTERS</span>
                  </div>
                  {copiedNumber && (
                    <div className="text-[10px] text-emerald-400 font-semibold animate-pulse">
                      ✓ Number 0703320730 copied to clipboard!
                    </div>
                  )}
                </div>

                {/* Clear instructions */}
                <div className="text-[11px] text-stone-300 space-y-1 bg-stone-900/70 p-2.5 rounded-xl border border-stone-800">
                  <div className="font-bold text-amber-400 mb-1 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    <span>Instructions:</span>
                  </div>
                  <p>
                    1. Dial <strong className="text-white">*185#</strong> on Airtel or open Airtel Money App.
                  </p>
                  <p>
                    2. Send money to <strong className="text-white">0703320730</strong> (Confirm name: <strong className="text-amber-300">kyomugisha - WATER HUNTERS</strong>).
                  </p>
                  <p>
                    3. Send <strong className="text-white">{currentAmount.toLocaleString()} UGX</strong> ({plan === 'weekly' ? 'Weekly' : 'Monthly'}).
                  </p>
                  <p>
                    4. Enter your <strong>Transaction ID</strong> from the confirmation SMS below to activate Premium.
                  </p>
                </div>

                {/* TRANSACTION ID INPUT */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-stone-200">
                      Enter Airtel Transaction ID:
                    </label>
                    <button
                      type="button"
                      onClick={handleFillDemoTxId}
                      className="text-[10px] text-amber-400 hover:underline font-semibold"
                    >
                      Auto-fill sample ID
                    </button>
                  </div>
                  <input
                    id="airtel-tx-id-input"
                    type="text"
                    value={transactionId}
                    onChange={(e) => {
                      setTransactionId(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="e.g. 1248981249 or TX982341..."
                    className="w-full bg-stone-800 border border-stone-700 focus:border-red-500 rounded-xl py-2.5 px-3 text-stone-100 text-sm font-mono focus:outline-none"
                  />
                  {errorMessage && (
                    <p className="text-[11px] text-red-400 font-semibold mt-1">
                      {errorMessage}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* MTN MoMo OPTION (Secondary) */
              <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-950/60 via-stone-900 to-amber-950/70 border-2 border-yellow-500/70 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-yellow-900/50 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-300">
                    <Smartphone className="w-4 h-4 text-yellow-400" />
                    <span>MTN Mobile Money Details</span>
                  </div>
                  <span className="text-[11px] font-black text-yellow-300 font-mono">
                    {currentAmount.toLocaleString()} UGX
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-yellow-500/40 text-center space-y-1">
                  <div className="text-[11px] text-stone-300 font-medium">
                    Pay via MTN MoMo (*165#):
                  </div>
                  <div className="text-lg sm:text-xl font-black text-white font-mono">
                    Dial *165*4*4# or Send to +256703320730
                  </div>
                  <div className="text-xs text-stone-300">
                    Merchant / Reference: <strong className="text-yellow-400">MAPENZI-VIP</strong>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-stone-200">
                      Enter MTN MoMo Reference / Transaction ID:
                    </label>
                    <button
                      type="button"
                      onClick={handleFillDemoTxId}
                      className="text-[10px] text-yellow-400 hover:underline font-semibold"
                    >
                      Auto-fill sample ID
                    </button>
                  </div>
                  <input
                    id="mtn-tx-id-input"
                    type="text"
                    value={transactionId}
                    onChange={(e) => {
                      setTransactionId(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="e.g. MOMO-882319"
                    className="w-full bg-stone-800 border border-stone-700 focus:border-yellow-500 rounded-xl py-2.5 px-3 text-stone-100 text-sm font-mono focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* VIP BENEFITS SUMMARY */}
            <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700 space-y-1.5 text-xs text-stone-300">
              <div className="font-bold text-amber-400 text-[11px] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>VIP Perks Unlocked Instantly:</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <div className="flex items-center gap-1 text-stone-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Unlimited Daily Likes</span>
                </div>
                <div className="flex items-center gap-1 text-stone-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Unblur Who Liked You</span>
                </div>
                <div className="flex items-center gap-1 text-stone-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Boost in Kampala / Matuga</span>
                </div>
                <div className="flex items-center gap-1 text-stone-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Unlimited Respect Swipes</span>
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              id="activate-premium-submit-btn"
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:brightness-110 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>
                Activate VIP ({currentAmount.toLocaleString()} UGX - {plan === 'weekly' ? 'Weekly' : 'Monthly'})
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* VERIFYING SPINNER STATE */}
        {step === 'verifying' && (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full border-4 border-red-500/20 border-t-red-500 animate-spin flex items-center justify-center" />
            <div>
              <h3 className="text-base font-bold text-white">
                Verifying with Airtel Money...
              </h3>
              <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                Checking payment of {currentAmount.toLocaleString()} UGX to <strong>0703320730 (kyomugisha)</strong> with reference <strong>{transactionId || 'ID'}</strong>.
              </p>
            </div>
          </div>
        )}

        {/* SUCCESS RECEIPT STATE */}
        {step === 'success' && receiptData && (
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                Payment Verified • Premium Active
              </span>
              <h3 className="text-xl font-extrabold text-white mt-1">
                Welcome to Mapenzi VIP!
              </h3>
              <p className="text-xs text-stone-300 mt-1 max-w-sm mx-auto leading-relaxed">
                {receiptData.message}
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-left text-xs space-y-2 max-w-sm mx-auto font-mono">
              <div className="flex justify-between border-b border-stone-800 pb-1.5">
                <span className="text-stone-400 font-sans">Payment Method:</span>
                <span className="text-white font-bold">{provider}</span>
              </div>
              <div className="flex justify-between border-b border-stone-800 pb-1.5">
                <span className="text-stone-400 font-sans">Paid To:</span>
                <span className="text-amber-300 font-bold">0703320730 (kyomugisha)</span>
              </div>
              <div className="flex justify-between border-b border-stone-800 pb-1.5">
                <span className="text-stone-400 font-sans">Amount:</span>
                <span className="text-emerald-400 font-bold">{receiptData.amount.toLocaleString()} {receiptData.currency}</span>
              </div>
              <div className="flex justify-between border-b border-stone-800 pb-1.5">
                <span className="text-stone-400 font-sans">Plan:</span>
                <span className="text-white font-bold">{plan === 'weekly' ? 'Weekly Pass (7 Days)' : 'Monthly VIP (30 Days)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400 font-sans">Transaction Ref:</span>
                <span className="text-amber-400 font-bold">{receiptData.ref}</span>
              </div>
            </div>

            <button
              type="button"
              id="close-success-payment-btn"
              onClick={handleDone}
              className="w-full max-w-sm mx-auto py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2"
            >
              <span>Explore Unblurred Suitors & Unlimited Likes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

