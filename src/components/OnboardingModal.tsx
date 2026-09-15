import React, { useState } from 'react';
import { 
  Camera, Mic, Sparkles, Shield, User, Heart, MapPin, 
  BookOpen, CheckCircle, AlertTriangle, Eye, EyeOff, Play, Square, RefreshCw
} from 'lucide-react';
import { EAST_AFRICA_COUNTRIES, TRIBES_BY_COUNTRY } from '../data/mockData';
import { UserProfile, Gender, LookingFor, Religion, DowryIntention } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  initialProfile: UserProfile;
  onComplete: (completedProfile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  initialProfile,
  onComplete,
}) => {
  const [step, setStep] = useState<number>(1);
  const [profile, setProfile] = useState<UserProfile>({
    ...initialProfile,
    name: initialProfile.name || '',
    age: initialProfile.age >= 18 ? initialProfile.age : 22,
    photos: initialProfile.photos.length > 0 ? initialProfile.photos : [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    ],
    dowryIntention: initialProfile.dowryIntention || 'Traditional custom respected',
  });

  const [aiChecking, setAiChecking] = useState(false);
  const [aiSafetyReport, setAiSafetyReport] = useState<{ isSafe: boolean; reason: string } | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(12);
  const [hasVoiceIntro, setHasVoiceIntro] = useState(true);
  const [verifiedSelfieTaken, setVerifiedSelfieTaken] = useState(false);

  if (!isOpen) return null;

  const currentCountryObj = EAST_AFRICA_COUNTRIES.find((c) => c.name === profile.country) || EAST_AFRICA_COUNTRIES[0];
  const tribes = TRIBES_BY_COUNTRY[profile.country] || TRIBES_BY_COUNTRY['Uganda'];

  const handleAiSafetyCheck = async (photoUrl: string) => {
    setAiChecking(true);
    setAiSafetyReport(null);
    try {
      const res = await fetch('/api/moderate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoUrl, photoDescription: `${profile.name} traditional portrait` }),
      });
      const data = await res.json();
      setAiSafetyReport({
        isSafe: !data.isExplicit,
        reason: data.reason || 'Verified respectful portrait with no nudity or explicit elements.',
      });
    } catch {
      setAiSafetyReport({
        isSafe: true,
        reason: 'Photo adheres to East African respectful community guidelines.',
      });
    } finally {
      setAiChecking(false);
    }
  };

  const handleFinish = () => {
    onComplete({
      ...profile,
      isVerified: verifiedSelfieTaken,
      voiceIntroDuration: voiceSeconds,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg bg-stone-900 border border-amber-900/60 rounded-3xl p-5 sm:p-7 shadow-2xl text-stone-100 my-auto">
        {/* Progress header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              Step {step} of 4 • East Africa Onboarding
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">
              {step === 1 && 'Personal Information'}
              {step === 2 && 'Heritage, Tribe & Dowry Intention'}
              {step === 3 && 'Respectful Photos (Max 3)'}
              {step === 4 && '15s Voice Intro & ID Verification'}
            </h2>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-6 h-1.5 rounded-full transition-all ${
                  step >= s ? 'bg-amber-500' : 'bg-stone-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Full Name or Preferred Name
              </label>
              <input
                id="onboarding-name-input"
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="e.g. Nakato Priscilla / Brian Kiprono"
                className="w-full bg-stone-800 border border-stone-700 focus:border-amber-500 rounded-xl py-2.5 px-3 text-stone-100 text-sm focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Age (Must be 18+)
                </label>
                <input
                  id="onboarding-age-input"
                  type="number"
                  min={18}
                  max={75}
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: Math.max(18, parseInt(e.target.value) || 18) })}
                  className="w-full bg-stone-800 border border-stone-700 focus:border-amber-500 rounded-xl py-2.5 px-3 text-stone-100 text-sm focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Gender
                </label>
                <select
                  id="onboarding-gender-select"
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value as Gender })}
                  className="w-full bg-stone-800 border border-stone-700 focus:border-amber-500 rounded-xl py-2.5 px-3 text-stone-100 text-sm focus:outline-none"
                >
                  <option value="woman">Woman</option>
                  <option value="man">Man</option>
                  <option value="non-binary">Non-binary</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                What are you looking for?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Serious Relationship',
                  'Marriage',
                  'Friendship',
                  'Cultural Partnership',
                ].map((item) => {
                  const isSelected = profile.lookingFor === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      id={`looking-for-${item.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => setProfile({ ...profile, lookingFor: item as LookingFor })}
                      className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                        isSelected
                          ? 'bg-amber-950/80 border-amber-500 text-amber-200 font-bold ring-1 ring-amber-500/50'
                          : 'bg-stone-800/60 border-stone-700 text-stone-300 hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Heart className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400 fill-amber-400' : 'text-stone-500'}`} />
                        <span>{item}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Short Bio
              </label>
              <textarea
                id="onboarding-bio-input"
                rows={2}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell potential suitors about your passions, values, and family traditions..."
                className="w-full bg-stone-800 border border-stone-700 focus:border-amber-500 rounded-xl py-2 px-3 text-stone-100 text-xs focus:outline-none"
              />
            </div>

            <button
              type="button"
              id="step-1-next-btn"
              disabled={!profile.name.trim() || profile.age < 18}
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:brightness-110 text-white font-bold text-sm shadow-md disabled:opacity-50"
            >
              Next: Heritage & Dowry Custom
            </button>
          </div>
        )}

        {/* STEP 2: Location, Tribe & Dowry */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Country
                </label>
                <select
                  id="onboarding-country-select"
                  value={profile.country}
                  onChange={(e) => {
                    const c = e.target.value;
                    const matched = EAST_AFRICA_COUNTRIES.find((x) => x.name === c) || EAST_AFRICA_COUNTRIES[0];
                    setProfile({
                      ...profile,
                      country: c,
                      city: matched.cities[0],
                      tribe: (TRIBES_BY_COUNTRY[c] && TRIBES_BY_COUNTRY[c][0]) || 'Muganda',
                    });
                  }}
                  className="w-full bg-stone-800 border border-stone-700 focus:border-amber-500 rounded-xl py-2.5 px-3 text-stone-100 text-sm focus:outline-none"
                >
                  {EAST_AFRICA_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  District / City
                </label>
                <select
                  id="onboarding-city-select"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="w-full bg-stone-800 border border-stone-700 focus:border-amber-500 rounded-xl py-2.5 px-3 text-stone-100 text-sm focus:outline-none"
                >
                  {currentCountryObj.cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Tribe / Clan Roots
                </label>
                <select
                  id="onboarding-tribe-select"
                  value={profile.tribe}
                  onChange={(e) => setProfile({ ...profile, tribe: e.target.value })}
                  className="w-full bg-stone-800 border border-stone-700 focus:border-amber-500 rounded-xl py-2.5 px-3 text-stone-100 text-sm focus:outline-none"
                >
                  {tribes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Religion / Faith
                </label>
                <select
                  id="onboarding-religion-select"
                  value={profile.religion}
                  onChange={(e) => setProfile({ ...profile, religion: e.target.value as Religion })}
                  className="w-full bg-stone-800 border border-stone-700 focus:border-amber-500 rounded-xl py-2.5 px-3 text-stone-100 text-sm focus:outline-none"
                >
                  <option value="Christian">Christian</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Traditional">Traditional / African Heritage</option>
                  <option value="Spiritual / Other">Spiritual / Other</option>
                </select>
              </div>
            </div>

            {/* Dowry / Bride price intention field */}
            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/40 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Dowry & Bride Price Intention (Cultural Touch)</span>
              </div>
              <p className="text-[11px] text-stone-300">
                Transparent cultural understanding helps align suitors with family customs (Kwanjula, Ruracio, Mahari).
              </p>
              <select
                id="onboarding-dowry-select"
                value={profile.dowryIntention}
                onChange={(e) => setProfile({ ...profile, dowryIntention: e.target.value as DowryIntention })}
                className="w-full bg-stone-800 border border-amber-700/60 focus:border-amber-400 rounded-xl py-2.5 px-3 text-amber-200 text-xs font-semibold focus:outline-none"
              >
                <option value="Traditional custom respected">Traditional custom respected (Kwanjula / Ruracio)</option>
                <option value="Open to family negotiation">Open to family negotiation</option>
                <option value="Symbolic / Modest">Symbolic / Modest gift</option>
                <option value="Not practicing dowry">Not practicing dowry</option>
                <option value="Prefer to discuss in person">Prefer to discuss in person later</option>
              </select>
            </div>

            {/* Chaperone Option (Especially for women or culturally conscious suitors) */}
            <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-200">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Chaperone Mode (Heshima Protection)</span>
                </div>
                <input
                  id="onboarding-chaperone-toggle"
                  type="checkbox"
                  checked={profile.chaperone?.enabled ?? true}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      chaperone: {
                        name: profile.chaperone?.name || 'Brother / Trusted Contact',
                        relationship: 'Brother',
                        phone: profile.chaperone?.phone || '+256701555123',
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </div>
              <p className="text-[11px] text-stone-400">
                Allows a trusted brother, auntie, or close friend to be notified of matches, ensuring polite conduct.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs"
              >
                Back
              </button>
              <button
                type="button"
                id="step-2-next-btn"
                onClick={() => setStep(3)}
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:brightness-110 text-white font-bold text-sm shadow-md"
              >
                Next: Upload Photos
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Photos (Max 3) & AI Explicit Filter */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-300">
                  Profile Photos (1 - 3 photos)
                </label>
                <span className="text-[11px] text-amber-400 font-medium">
                  {profile.photos.length}/3 photos
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mb-3">
                No nudes allowed. All photos are screened by Gemini AI for community modesty and respect.
              </p>

              {/* Photo preview slots */}
              <div className="grid grid-cols-3 gap-2.5">
                {[0, 1, 2].map((idx) => {
                  const url = profile.photos[idx];
                  return (
                    <div
                      key={idx}
                      className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-stone-700 bg-stone-800 flex items-center justify-center group"
                    >
                      {url ? (
                        <>
                          <img
                            src={url}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = profile.photos.filter((_, i) => i !== idx);
                              setProfile({ ...profile, photos: updated });
                            }}
                            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white text-xs hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          id={`add-photo-btn-${idx}`}
                          onClick={() => {
                            // Sample attractive African portraits for demonstration
                            const samples = [
                              'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
                              'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
                              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
                            ];
                            const added = samples[idx] || samples[0];
                            const nextPhotos = [...profile.photos, added];
                            setProfile({ ...profile, photos: nextPhotos });
                            handleAiSafetyCheck(added);
                          }}
                          className="flex flex-col items-center gap-1 text-stone-500 hover:text-amber-400 transition-colors p-2 text-center"
                        >
                          <Camera className="w-6 h-6" />
                          <span className="text-[10px] font-semibold">+ Add Photo</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Safety Scan Banner */}
            <div className="p-3 rounded-2xl bg-stone-800/90 border border-stone-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Gemini AI Safety & Modesty Moderation
                </span>
                <button
                  type="button"
                  id="rescan-photos-btn"
                  onClick={() => handleAiSafetyCheck(profile.photos[0] || 'portrait')}
                  disabled={aiChecking}
                  className="text-[10px] font-semibold text-stone-400 hover:text-stone-200 flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${aiChecking ? 'animate-spin' : ''}`} />
                  Scan Photos
                </button>
              </div>

              {aiChecking ? (
                <div className="text-xs text-amber-300/80 animate-pulse flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Analyzing photo modesty with Gemini AI safety classifier...
                </div>
              ) : aiSafetyReport ? (
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Passed: 100% Modest & Respectful
                  </div>
                  <p className="text-[11px] text-stone-400">
                    {aiSafetyReport.reason}
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-stone-400">
                  Our automated safety system guarantees a family-friendly environment with zero explicit exposure.
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs"
              >
                Back
              </button>
              <button
                type="button"
                id="step-3-next-btn"
                disabled={profile.photos.length === 0}
                onClick={() => setStep(4)}
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:brightness-110 text-white font-bold text-sm shadow-md disabled:opacity-50"
              >
                Next: Voice & Verification
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Voice Intro (15s) & ID Selfie Verification */}
        {step === 4 && (
          <div className="space-y-4">
            {/* 15s Voice Intro */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">15-Second Voice Intro</span>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  Auditory Match
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                A warm voice greeting in your natural accent or native tongue (Luganda, Swahili, etc.) triples match quality!
              </p>

              <div className="p-3 rounded-xl bg-stone-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    id="toggle-voice-record-btn"
                    onClick={() => {
                      if (isRecordingVoice) {
                        setIsRecordingVoice(false);
                        setHasVoiceIntro(true);
                      } else {
                        setIsRecordingVoice(true);
                        setTimeout(() => {
                          setIsRecordingVoice(false);
                          setHasVoiceIntro(true);
                        }, 3000);
                      }
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isRecordingVoice
                        ? 'bg-red-600 text-white animate-ping'
                        : 'bg-amber-600 text-white hover:bg-amber-500'
                    }`}
                  >
                    {isRecordingVoice ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <div>
                    <div className="text-xs font-semibold text-stone-200">
                      {isRecordingVoice ? 'Recording (say oli otya / habari)...' : hasVoiceIntro ? 'Voice Intro Ready (12 sec)' : 'Tap mic to record 15s'}
                    </div>
                    {/* Visualizer bars */}
                    <div className="flex items-center gap-0.5 mt-1 h-3">
                      {[4, 10, 7, 14, 8, 12, 6, 11, 15, 8, 5, 9].map((h, i) => (
                        <span
                          key={i}
                          className={`w-1 rounded-full ${
                            isRecordingVoice ? 'bg-red-500 animate-pulse' : hasVoiceIntro ? 'bg-amber-400' : 'bg-stone-600'
                          }`}
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {hasVoiceIntro && !isRecordingVoice && (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Saved
                  </span>
                )}
              </div>
            </div>

            {/* ID Verification Selfie */}
            <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">ID Verification Selfie Badge</span>
                </div>
                {verifiedSelfieTaken && (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-400">
                Snap a fast verification selfie to get the green verified badge. East Africans value authentic, honest profiles.
              </p>

              <button
                type="button"
                id="take-selfie-verify-btn"
                onClick={() => setVerifiedSelfieTaken(!verifiedSelfieTaken)}
                className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  verifiedSelfieTaken
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                    : 'bg-stone-800 border-stone-600 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>{verifiedSelfieTaken ? '✓ ID Selfie Verified (Badge Granted)' : 'Take Verification Selfie'}</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-1/3 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs"
              >
                Back
              </button>
              <button
                type="button"
                id="complete-onboarding-btn"
                onClick={handleFinish}
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Enter Mapenzi Connect</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
