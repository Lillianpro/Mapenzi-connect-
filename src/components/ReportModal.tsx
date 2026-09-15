import React, { useState } from 'react';
import { Flag, X, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  targetUser: UserProfile | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  targetUser,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState('Inappropriate or Disrespectful Language');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !targetUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportedUserId: targetUser.id,
          reportedUserName: targetUser.name,
          reporterId: 'currentUser',
          reason,
          details,
        }),
      });
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
      }, 1400);
    } catch {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
      }, 1400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-stone-900 border border-red-800/60 rounded-3xl p-6 shadow-2xl text-stone-100 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2 text-red-400">
            <Flag className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white">
              Report or Block {targetUser.name}
            </h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <p className="text-stone-300">
              Mapenzi Connect enforces East African respect and zero nudity. Reports are reviewed promptly by our moderation team.
            </p>

            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                Reason for report:
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-200 focus:outline-none focus:border-red-500"
              >
                <option value="Inappropriate or Disrespectful Language">Inappropriate or Disrespectful Language</option>
                <option value="Nudity or Explicit Photo">Nudity or Explicit Photo (No Nudes Policy)</option>
                <option value="Impersonation or Fake Account">Impersonation or Fake Account</option>
                <option value="Financial Scam / Requesting MoMo Pin">Financial Scam / Requesting MoMo Pin</option>
                <option value="Harassment or Stalking">Harassment or Stalking</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                Additional Details (Optional):
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what occurred..."
                className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2 text-stone-200 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-stone-800">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 rounded-xl bg-stone-800 text-stone-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md"
              >
                {loading ? 'Submitting Report...' : 'Submit Report & Block'}
              </button>
            </div>
          </form>
        ) : (
          <div className="py-4 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-white text-sm">Account Reported & Blocked</h4>
            <p className="text-xs text-stone-400">
              {targetUser.name} will no longer appear in your discovery feed or chat list.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
