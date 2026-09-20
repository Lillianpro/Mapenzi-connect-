import React from 'react';
import { X, ShieldCheck, AlertCircle, FileText } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-slate-950 border border-purple-900/50 rounded-2xl p-6 text-white shadow-2xl z-10 max-h-[85vh] flex flex-col space-y-4">
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-700/50 text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Privacy Policy & Terms</h3>
              <p className="text-[11px] text-slate-400">Zinna Tips Sports Analytics Platform</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3.5 text-xs text-slate-300 pr-1 leading-relaxed">
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200">
            <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>18+ Responsible Sports Analytics Disclaimer</span>
            </div>
            <p className="text-[11px]">
              Zinna Tips provides statistical modeling, machine learning analysis, and mathematical probabilities for entertainment and informational reference only. We do not operate a sportsbook or accept real-money wagers. Please gamble responsibly and only within your means.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-1">1. Information Collection</h4>
            <p className="text-slate-400">
              We only collect your phone number during trial registration or subscription to identify your account and grant VIP entitlement across devices. We never sell, rent, or distribute personal information to third parties.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-1">2. Uganda Mobile Money Security</h4>
            <p className="text-slate-400">
              Payments via MTN Mobile Money and Airtel Money (UGX 15,000 / month) are handled through verified telecom aggregator APIs. Your PIN and sensitive telecom credentials are never recorded or stored by our servers.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-1">3. Mathematical Predictions</h4>
            <p className="text-slate-400">
              While our historical performance yields verified high strike rates, past match outcomes do not guarantee future results. Punters are advised to apply proper stake management.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
