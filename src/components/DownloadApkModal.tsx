import React from 'react';
import { Download, X, Smartphone, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface DownloadApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadApkModal: React.FC<DownloadApkModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-5">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 shadow-inner">
            <Smartphone className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Download Zinna Tips APK
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Lightweight release build under 20MB engineered for low-end Android phones
          </p>
        </div>

        {/* Specs Box */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs mb-5">
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
            <span className="text-slate-400">Package:</span>
            <span className="font-mono font-bold">com.zinnatips.app</span>
          </div>
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
            <span className="text-slate-400">App Size:</span>
            <span className="font-bold text-emerald-600">&lt;20MB (18.2 MB split-abi)</span>
          </div>
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
            <span className="text-slate-400">Compatibility:</span>
            <span>Android 6.0 (Marshmallow) and higher</span>
          </div>
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
            <span className="text-slate-400">Network Opt:</span>
            <span>Zero-lag on 2G / 3G / 4G Uganda mobile data</span>
          </div>
        </div>

        {/* Installation Steps */}
        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 mb-6">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>1. Click Download APK below to save <code>zinna-tips-v1.0.apk</code>.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>2. On your Android phone, tap "Allow install from this source".</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>3. Launch the app and enjoy your automatic 7-Day Free Trial!</span>
          </div>
        </div>

        {/* Direct Download Button */}
        <a
          href="/api/download-apk"
          download="zinna-tips-v1.0.apk"
          className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
        >
          <Download className="w-4 h-4" />
          <span>Download Zinna Tips APK (18.2MB)</span>
        </a>
      </div>
    </div>
  );
};
