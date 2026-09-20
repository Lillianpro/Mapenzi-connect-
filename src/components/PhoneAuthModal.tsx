import React, { useState } from 'react';
import { Zap, Phone, ArrowRight, ShieldCheck, Gift } from 'lucide-react';

interface PhoneAuthModalProps {
  isOpen: boolean;
  onRegister: (phone: string) => Promise<boolean>;
}

export const PhoneAuthModal: React.FC<PhoneAuthModalProps> = ({ isOpen, onRegister }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phone.trim();
    if (clean.length < 8) {
      setError('Please enter a valid phone number (e.g. 0772123456 or +256 / +254 / +255 / +250)');
      return;
    }

    setIsLoading(true);
    setError(null);
    const ok = await onRegister(clean);
    setIsLoading(false);
    if (!ok) {
      setError('Registration failed. Please check connection and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in zoom-in-95">
        {/* Brand Bolt Logo */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-600/30">
          <Zap className="w-9 h-9 fill-white" />
        </div>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Welcome to Zinna Tips
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          High-accuracy AI predictions for Football & Basketball
        </p>

        {/* Free trial callout */}
        <div className="mt-5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-left flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
              Automatic 7-Day Free Trial
            </h3>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300/90 mt-0.5">
              Enter your phone number to immediately start your 7-day unrestricted trial. No payment or credit card required upfront.
            </p>
          </div>
        </div>

        {/* Phone Input Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="text-left">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Mobile Number (Uganda, Kenya, Tanzania, Rwanda, or International)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4 text-emerald-600" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0772 123 456 or +256 / +254 / +255 / +250..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>
            {error && (
              <p className="text-xs text-rose-500 font-medium mt-1.5 text-left">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.99] disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Start 7-Day Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secured via Firebase Firestore & Uganda Carrier Auth</span>
        </div>
      </div>
    </div>
  );
};
