import React, { useState } from 'react';
import { 
  User, Shield, Sparkles, Phone, MapPin, BookOpen, Volume2, 
  Handshake, AlertTriangle, CheckCircle, Edit3, Save, ShieldAlert, Zap
} from 'lucide-react';
import { UserProfile, SupportedLanguage, DowryIntention } from '../types';
import { UI_TRANSLATIONS } from '../data/mockData';
import { VoiceIntroPlayer } from './VoiceIntroPlayer';

interface ProfileViewProps {
  user: UserProfile;
  currentLang: SupportedLanguage;
  onUpdateUser: (updated: UserProfile) => void;
  onOpenMomo: () => void;
  onOpenPanic: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentLang,
  onUpdateUser,
  onOpenMomo,
  onOpenPanic,
}) => {
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user.bio || 'Looking for a God-fearing, respectful life partner in East Africa.');
  const [dowryIntention, setDowryIntention] = useState<DowryIntention>(user.dowryIntention || 'Traditional custom respected');
  const [chaperoneName, setChaperoneName] = useState(user.chaperone?.name || 'Brian Kigozi (Brother)');
  const [chaperonePhone, setChaperonePhone] = useState(user.chaperone?.phone || '+256701555123');
  const [chaperoneEnabled, setChaperoneEnabled] = useState(user.chaperone?.enabled ?? true);
  const [isVerified, setIsVerified] = useState(user.isVerified);

  const handleSave = () => {
    const updated: UserProfile = {
      ...user,
      bio,
      dowryIntention,
      isVerified,
      chaperone: {
        name: chaperoneName,
        relationship: 'Brother / Trusted Contact',
        phone: chaperonePhone,
        enabled: chaperoneEnabled,
      },
    };
    onUpdateUser(updated);
    setIsEditing(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-3 pb-24 space-y-4">
      {/* Profile Header Card */}
      <div className="p-5 rounded-3xl bg-stone-900 border border-amber-900/40 shadow-xl space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-500/60 shrink-0">
            <img
              src={user.photos[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
              alt={user.name}
              className="w-full h-full object-cover"
            />
            {user.isVerified && (
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white border-2 border-stone-900">
                <CheckCircle className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white truncate">
                {user.name || 'East African Member'}
              </h2>
              <span className="text-stone-400 font-mono text-sm">
                {user.age}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{user.city}, {user.country}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-amber-300 mt-1 font-semibold">
              <Phone className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{user.phone}</span>
            </div>
          </div>
        </div>

        {/* Verification & Premium Status */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800">
          <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
            user.isVerified
              ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
              : 'bg-stone-800 border-stone-700 text-stone-400'
          }`}>
            <Shield className="w-4 h-4 text-emerald-400" />
            <div>
              <div>{user.isVerified ? 'ID Verified' : 'Unverified'}</div>
              <button
                type="button"
                onClick={() => setIsVerified(!isVerified)}
                className="text-[10px] text-amber-400 hover:underline"
              >
                {user.isVerified ? 'Toggle status' : 'Verify with Selfie'}
              </button>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
            user.isPremium
              ? 'bg-amber-950/60 border-amber-500/60 text-amber-300'
              : 'bg-stone-800 border-stone-700 text-stone-400'
          }`}>
            <Sparkles className="w-4 h-4 text-amber-400" />
            <div>
              <div>{user.isPremium ? 'Mapenzi VIP Active' : 'Free Tier (20 likes)'}</div>
              {!user.isPremium && (
                <button
                  type="button"
                  id="profile-upgrade-btn"
                  onClick={onOpenMomo}
                  className="text-[10px] text-amber-400 hover:underline font-bold"
                >
                  Upgrade (15k / 40k UGX)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 15s Voice Intro Player Card */}
      <div className="space-y-1.5">
        <VoiceIntroPlayer profile={user} variant="expanded" />
      </div>

      {/* Cultural Values & Dowry Section */}
      <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-stone-100">
              {t.dowryTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <Edit3 className="w-3 h-3" />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                Dowry / Bride Price Custom:
              </label>
              <select
                id="profile-dowry-select"
                value={dowryIntention}
                onChange={(e) => setDowryIntention(e.target.value as DowryIntention)}
                className="w-full bg-stone-800 border border-amber-500 rounded-xl p-2.5 text-xs text-stone-100 focus:outline-none"
              >
                <option value="Traditional custom respected">Traditional custom respected (Kwanjula / Ruracio)</option>
                <option value="Open to family negotiation">Open to family negotiation</option>
                <option value="Symbolic / Modest">Symbolic / Modest gift</option>
                <option value="Not practicing dowry">Not practicing dowry</option>
                <option value="Prefer to discuss in person">Prefer to discuss in person</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                Bio & Intentions:
              </label>
              <textarea
                id="profile-bio-textarea"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="button"
              id="save-profile-btn"
              onClick={handleSave}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Cultural Preferences</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2 text-xs text-stone-300">
            <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700/60">
              <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">
                Current Custom:
              </span>
              <span className="font-semibold text-white">
                {user.dowryIntention}
              </span>
            </div>
            <p className="italic text-stone-400">
              "{user.bio || bio}"
            </p>
          </div>
        )}
      </div>

      {/* Chaperone Mode Configuration */}
      <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Handshake className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-stone-100">
              Chaperone Mode (Brother / Auntie)
            </h3>
          </div>
          <input
            id="profile-chaperone-toggle"
            type="checkbox"
            checked={chaperoneEnabled}
            onChange={(e) => setChaperoneEnabled(e.target.checked)}
            className="w-4 h-4 accent-amber-500 rounded"
          />
        </div>

        <p className="text-[11px] text-stone-400">
          In East Africa, courting with family awareness brings respect and peace of mind. Your chaperone gets match summaries and can view chat logs.
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="block text-[10px] text-stone-400 mb-1">Chaperone Name</label>
            <input
              type="text"
              value={chaperoneName}
              onChange={(e) => setChaperoneName(e.target.value)}
              placeholder="e.g. Brian Kigozi"
              className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2 text-stone-100 text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] text-stone-400 mb-1">Chaperone Mobile</label>
            <input
              type="text"
              value={chaperonePhone}
              onChange={(e) => setChaperonePhone(e.target.value)}
              placeholder="+256701555123"
              className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2 text-stone-100 text-xs font-mono focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Safety & Panic Emergency Hotkey */}
      <div className="p-4 rounded-3xl bg-red-950/40 border border-red-800/40 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <h3 className="font-bold text-sm text-red-200">
              {t.panicButton}
            </h3>
          </div>
          <button
            type="button"
            id="profile-panic-btn"
            onClick={onOpenPanic}
            className="px-3 py-1 rounded-full bg-red-600 text-white font-bold text-xs hover:bg-red-500 shadow-md"
          >
            Test Panic Button
          </button>
        </div>
        <p className="text-[11px] text-stone-300">
          {t.panicHelp}
        </p>
      </div>
    </div>
  );
};
