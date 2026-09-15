import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Handshake, Shield, Zap, Lock, ArrowUpRight, Volume2, Info, X } from 'lucide-react';
import { UserProfile, SupportedLanguage } from '../types';
import { UI_TRANSLATIONS } from '../data/mockData';
import { VoiceIntroPlayer } from './VoiceIntroPlayer';
import { globalVoicePlayer } from '../utils/voicePlayer';

interface LikesViewProps {
  profiles: UserProfile[];
  isPremium: boolean;
  onOpenMomo: () => void;
  onSwipeBack: (profile: UserProfile) => void;
  currentLang: SupportedLanguage;
}

export const LikesView: React.FC<LikesViewProps> = ({
  profiles,
  isPremium,
  onOpenMomo,
  onSwipeBack,
  currentLang,
}) => {
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;
  const admirers = profiles.slice(0, 4);

  const [selectedSuitor, setSelectedSuitor] = useState<UserProfile | null>(null);
  const [photoIdx, setPhotoIdx] = useState(0);

  // Stop audio on unmount or tab switch
  useEffect(() => {
    return () => {
      globalVoicePlayer.stop();
    };
  }, []);

  const handleOpenSuitor = (suitor: UserProfile) => {
    setSelectedSuitor(suitor);
    setPhotoIdx(0);
  };

  const handleCloseSuitor = () => {
    setSelectedSuitor(null);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-3 pb-24 space-y-4">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <span>{t.likes}</span>
          </h2>
          <p className="text-xs text-stone-400">
            East African singles who liked or respected your profile
          </p>
        </div>

        <button
          id="boost-profile-btn"
          onClick={onOpenMomo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-bold hover:brightness-110 shadow-md"
        >
          <Zap className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200" />
          <span>Boost (Matuga & Kampala)</span>
        </button>
      </div>

      {/* Premium upgrade teaser if free user */}
      {!isPremium && (
        <div className="p-4 rounded-3xl bg-gradient-to-br from-red-950/80 via-stone-900 to-amber-950/70 border-2 border-red-500/50 shadow-xl text-stone-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-sm text-amber-300">
                Unlock "Who Liked You"
              </h3>
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-600/30 text-red-300 border border-red-500/40 font-mono">
              15k / 40k UGX
            </span>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed">
            Pay to <strong>Airtel Money: 0703320730 (kyomugisha - WATER HUNTERS)</strong>. 15,000 UGX weekly or 40,000 UGX monthly. Instantly unblur all East African suitors, hear voice intros, and get unlimited daily likes.
          </p>

          <button
            id="momo-unlock-likes-btn"
            onClick={onOpenMomo}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:brightness-110 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
          >
            <span>Activate via Airtel Money (0703320730)</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid of Admirers */}
      <div className="grid grid-cols-2 gap-3">
        {admirers.map((suitor, index) => {
          const isBlurred = !isPremium && index > 0;
          return (
            <div
              key={suitor.id}
              className="relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 shadow-md group transition-all"
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-stone-950">
                <img
                  src={suitor.photos[0]}
                  alt={suitor.name}
                  onClick={() => !isBlurred && handleOpenSuitor(suitor)}
                  className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                    isBlurred ? 'blur-md filter scale-110 cursor-default' : 'cursor-pointer'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

                {isBlurred ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center z-10">
                    <div className="w-9 h-9 rounded-full bg-black/60 border border-amber-500/50 flex items-center justify-center text-amber-400 mb-2">
                      <Lock className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-white shadow-sm">
                      {suitor.city}, {suitor.country}
                    </span>
                    <span className="text-[10px] text-amber-300 mt-0.5">
                      Liked you recently
                    </span>
                    <button
                      onClick={onOpenMomo}
                      className="mt-2 px-2.5 py-1 rounded-full bg-amber-600/90 text-white text-[10px] font-bold hover:bg-amber-500 shadow-sm"
                    >
                      Unblur (MoMo)
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Top Badges & Voice Intro Audio Button */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 z-20">
                      {index === 0 ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-black text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                          <Handshake className="w-3 h-3" />
                          Respect
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-stone-900/80 text-amber-300 border border-amber-500/40 text-[10px] font-semibold backdrop-blur-sm">
                          Liked You
                        </span>
                      )}

                      {/* Compact Voice Intro Play Button on Card */}
                      <div className="shrink-0 pointer-events-auto">
                        <VoiceIntroPlayer profile={suitor} variant="compact" />
                      </div>
                    </div>

                    {/* Bottom Card details */}
                    <div className="absolute bottom-2 left-2 right-2 text-white z-20">
                      <div
                        onClick={() => handleOpenSuitor(suitor)}
                        className="cursor-pointer hover:text-amber-300 transition-colors"
                      >
                        <div className="font-bold text-sm truncate flex items-center justify-between">
                          <span>{suitor.name}, <span className="font-mono text-amber-300">{suitor.age}</span></span>
                          <Info className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-400 transition-colors" />
                        </div>
                        <div className="text-[11px] text-stone-300 truncate">
                          {suitor.tribe} • {suitor.city}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 mt-2">
                        <button
                          type="button"
                          onClick={() => onSwipeBack(suitor)}
                          className="flex-1 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-95"
                        >
                          <Heart className="w-3 h-3 fill-white" />
                          <span>Match Back</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADMIRER FULL PROFILE & VOICE INTRO MODAL */}
      {selectedSuitor && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md max-h-[90vh] bg-stone-900 border border-stone-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  {selectedSuitor.name}, {selectedSuitor.age}
                </h3>
                {selectedSuitor.isVerified && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                    <Shield className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              <button
                type="button"
                id="close-admirer-profile-modal-btn"
                onClick={handleCloseSuitor}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center font-bold text-lg"
              >
                ×
              </button>
            </div>

            {/* Scrollable details */}
            <div className="p-4 overflow-y-auto space-y-4">
              {/* Photo Carousel */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-950">
                <img
                  src={selectedSuitor.photos[photoIdx] || selectedSuitor.photos[0]}
                  alt={selectedSuitor.name}
                  className="w-full h-full object-cover"
                />
                {selectedSuitor.photos.length > 1 && (
                  <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1">
                    {selectedSuitor.photos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPhotoIdx(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === photoIdx ? 'w-5 bg-white' : 'w-2 bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* DEDICATED EXPANDED VOICE INTRO AUDIO PLAYER */}
              <div>
                <VoiceIntroPlayer profile={selectedSuitor} variant="expanded" />
              </div>

              {/* Cultural & Relationship Preferences */}
              <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Cultural Heritage & Values
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">Tribe / Heritage</span>
                    <span className="font-semibold text-white">{selectedSuitor.tribe}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">Religion</span>
                    <span className="font-semibold text-white">{selectedSuitor.religion}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">City & Country</span>
                    <span className="font-semibold text-white">{selectedSuitor.city}, {selectedSuitor.country}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">Looking For</span>
                    <span className="font-semibold text-amber-300">{selectedSuitor.lookingFor}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-xs">
                  <span className="text-[10px] text-amber-400 font-bold block mb-0.5">
                    Dowry & Marriage Intention
                  </span>
                  <p className="text-amber-200">
                    {selectedSuitor.dowryIntention}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  About {selectedSuitor.name}
                </h4>
                <p className="text-xs text-stone-200 leading-relaxed">
                  {selectedSuitor.bio}
                </p>
              </div>
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="p-3 border-t border-stone-800 bg-stone-950 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleCloseSuitor}
                className="flex-1 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs"
              >
                Close
              </button>
              <button
                type="button"
                id="match-back-modal-btn"
                onClick={() => {
                  handleCloseSuitor();
                  onSwipeBack(selectedSuitor);
                }}
                className="flex-[2] py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-transform active:scale-95"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Match Back with {selectedSuitor.name}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
