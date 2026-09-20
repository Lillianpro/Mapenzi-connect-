import React, { useState } from 'react';
import { X, Send, MessageCircle, Copy, Check, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

interface CommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunityModal: React.FC<CommunityModalProps> = ({ isOpen, onClose }) => {
  const [copiedTelegram, setCopiedTelegram] = useState<boolean>(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = (type: 'telegram' | 'whatsapp', text: string) => {
    navigator.clipboard?.writeText(text);
    if (type === 'telegram') {
      setCopiedTelegram(true);
      setTimeout(() => setCopiedTelegram(false), 2000);
    } else {
      setCopiedWhatsApp(true);
      setTimeout(() => setCopiedWhatsApp(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-slate-950 border border-purple-900/50 rounded-2xl p-6 text-white shadow-2xl z-10 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Join VIP Community
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-900/60 text-purple-300 border border-purple-700/50">
                  Daily Drops
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Instant match alerts, booking codes & rollover slips
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 pt-1">
          {/* Telegram Option */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-sky-600/30 hover:border-sky-500 transition space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-xs block text-white">Telegram VIP Chat</span>
                  <span className="text-[11px] text-sky-400 font-mono">@copyerror</span>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-sky-950 text-sky-300 border border-sky-800">
                Primary
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Get 24/7 instant notifications when high-confidence HT/FT & Correct Score tips drop.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://t.me/copyerror"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <span>Open @copyerror</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => handleCopy('telegram', 'https://t.me/copyerror')}
                className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition"
              >
                {copiedTelegram ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTelegram ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Option */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-600/30 hover:border-emerald-500 transition space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <MessageCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-xs block text-white">WhatsApp VIP Support</span>
                  <span className="text-[11px] text-emerald-400 font-mono">+256 703 320 730</span>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                Direct
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Direct betting code sharing, community VIP support & official Airtel Money payment line (<strong>+256703320730</strong>). MTN money is soon coming.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://wa.me/256703320730?text=Hello%20Zinna%20Tips%20VIP%20Access"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => handleCopy('whatsapp', '+256703320730')}
                className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition"
              >
                {copiedWhatsApp ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWhatsApp ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Verified official channels. Always check the admin handles.
          </p>
        </div>
      </div>
    </div>
  );
};
