import React, { useState, useEffect } from 'react';
import { 
  Heart, X, Handshake, Shield, Sparkles, Volume2, SlidersHorizontal, 
  MapPin, BookOpen, AlertCircle, Info, Check, MessageSquare, Flag, ChevronUp, ChevronDown
} from 'lucide-react';
import { UserProfile, SupportedLanguage, FilterSettings } from '../types';
import { UI_TRANSLATIONS, EAST_AFRICA_COUNTRIES, TRIBES_BY_COUNTRY } from '../data/mockData';
import { VoiceIntroPlayer } from './VoiceIntroPlayer';
import { globalVoicePlayer } from '../utils/voicePlayer';

interface DiscoverViewProps {
  profiles: UserProfile[];
  currentLang: SupportedLanguage;
  likesRemainingToday: number;
  isPremium: boolean;
  onSwipe: (targetUserId: string, type: 'like' | 'pass' | 'respect', respectNote?: string) => void;
  onOpenMomo: () => void;
  onReport: (user: UserProfile) => void;
  isLowDataMode: boolean;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  profiles,
  currentLang,
  likesRemainingToday,
  isPremium,
  onSwipe,
  onOpenMomo,
  onReport,
  isLowDataMode,
}) => {
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [respectModalOpen, setRespectModalOpen] = useState(false);
  const [respectNote, setRespectNote] = useState('');
  const [profileDetailsModalOpen, setProfileDetailsModalOpen] = useState(false);

  // Stop any playing voice audio when leaving the discover tab
  useEffect(() => {
    return () => {
      globalVoicePlayer.stop();
    };
  }, []);
  
  // Filters state (strictly East African)
  const [filters, setFilters] = useState<FilterSettings>({
    country: 'all',
    tribe: 'all',
    religion: 'all',
    minAge: 18,
    maxAge: 60,
    maxDistanceKm: 100,
    lookingFor: 'all',
    dowryIntention: 'all',
  });

  // Apply filters
  const filteredProfiles = profiles.filter((p) => {
    if (filters.country !== 'all' && p.country.toLowerCase() !== filters.country.toLowerCase()) return false;
    if (filters.tribe !== 'all' && !p.tribe.toLowerCase().includes(filters.tribe.toLowerCase())) return false;
    if (filters.religion !== 'all' && p.religion.toLowerCase() !== filters.religion.toLowerCase()) return false;
    if (p.age < filters.minAge || p.age > filters.maxAge) return false;
    if (filters.dowryIntention !== 'all' && !p.dowryIntention.toLowerCase().includes(filters.dowryIntention.toLowerCase())) return false;
    return true;
  });

  const currentProfile: UserProfile | undefined = filteredProfiles[currentIndex];

  const handleAction = (type: 'like' | 'pass' | 'respect') => {
    if (!currentProfile) return;

    if (type === 'respect') {
      setRespectModalOpen(true);
      return;
    }

    if (type === 'like' && !isPremium && likesRemainingToday <= 0) {
      onOpenMomo();
      return;
    }

    onSwipe(currentProfile.id, type);
    nextCard();
  };

  const submitRespect = () => {
    if (!currentProfile) return;
    onSwipe(currentProfile.id, 'respect', respectNote || 'Greetings with utmost respect. Your cultural values and family intention are deeply appreciated.');
    setRespectModalOpen(false);
    setRespectNote('');
    nextCard();
  };

  const nextCard = () => {
    setPhotoIndex(0);
    globalVoicePlayer.stop();
    setProfileDetailsModalOpen(false);
    if (currentIndex < filteredProfiles.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // loop for demo
    }
  };

  return (
    <div className="max-w-md mx-auto px-3 py-2 pb-24 relative">
      {/* Top action bar: Filter toggle & Likes quota */}
      <div className="flex items-center justify-between gap-2 mb-3">
        {/* Likes quota badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 border border-amber-900/50 text-xs shadow-sm">
          <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="text-stone-300 font-medium">
            {isPremium ? (
              <span className="text-amber-400 font-bold">Unlimited Likes</span>
            ) : (
              <span>
                <strong className="text-white font-bold">{likesRemainingToday}</strong> / 20 {t.likesLeft}
              </span>
            )}
          </span>
          {!isPremium && (
            <button
              id="upgrade-likes-chip"
              onClick={onOpenMomo}
              className="text-[10px] text-amber-400 hover:text-amber-300 font-bold ml-1 underline"
            >
              Get VIP
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <button
          id="open-filters-btn"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
            showFilters
              ? 'bg-amber-600 text-white border-amber-400'
              : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-amber-600/40'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
          <span>Filters</span>
          {filters.country !== 'all' && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          )}
        </button>
      </div>

      {/* FILTER DRAWER / MODAL */}
      {showFilters && (
        <div className="mb-4 p-4 rounded-3xl bg-stone-900 border border-amber-900/60 shadow-xl space-y-3 animate-in slide-in-from-top-3">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <h3 className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4" />
              East African Dating Filters
            </h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-xs text-stone-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                Country (East Africa Only)
              </label>
              <select
                id="filter-country-select"
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2 text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="all">🌍 All East Africa</option>
                <option value="uganda">🇺🇬 Uganda</option>
                <option value="kenya">🇰🇪 Kenya</option>
                <option value="tanzania">🇹🇿 Tanzania</option>
                <option value="rwanda">🇷🇼 Rwanda</option>
                <option value="burundi">🇧🇮 Burundi</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                Religion
              </label>
              <select
                id="filter-religion-select"
                value={filters.religion}
                onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2 text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Religions</option>
                <option value="christian">Christian</option>
                <option value="muslim">Muslim</option>
                <option value="traditional">Traditional / Cultural</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                Tribe / Community
              </label>
              <select
                id="filter-tribe-select"
                value={filters.tribe}
                onChange={(e) => setFilters({ ...filters, tribe: e.target.value })}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2 text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Tribes</option>
                <option value="muganda">Muganda (Baganda)</option>
                <option value="munyankole">Munyankole / Mukiga</option>
                <option value="kikuyu">Kikuyu</option>
                <option value="luo">Luo</option>
                <option value="kalenjin">Kalenjin</option>
                <option value="sukuma">Sukuma / Chagga</option>
                <option value="swahili">Swahili (Coast)</option>
                <option value="banyarwanda">Banyarwanda</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                Dowry / Bride Price
              </label>
              <select
                id="filter-dowry-select"
                value={filters.dowryIntention}
                onChange={(e) => setFilters({ ...filters, dowryIntention: e.target.value })}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2 text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="all">Any Custom</option>
                <option value="traditional">Traditional Custom Respected</option>
                <option value="negotiation">Open to Family Negotiation</option>
                <option value="symbolic">Symbolic / Modest</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-stone-800 text-xs">
            <span className="text-stone-400">
              Matching {filteredProfiles.length} East African singles
            </span>
            <button
              onClick={() => {
                setFilters({
                  country: 'all',
                  tribe: 'all',
                  religion: 'all',
                  minAge: 18,
                  maxAge: 60,
                  maxDistanceKm: 100,
                  lookingFor: 'all',
                  dowryIntention: 'all',
                });
                setCurrentIndex(0);
              }}
              className="text-amber-400 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* SWIPE CARD */}
      {currentProfile ? (
        <div className="relative rounded-3xl overflow-hidden bg-stone-900 border border-amber-900/40 shadow-2xl transition-all duration-300">
          {/* Card Media (Photos with tap progression) */}
          <div className="relative aspect-[3/4] w-full bg-stone-950 select-none">
            {/* Low-data indicator or standard photo */}
            <img
              src={currentProfile.photos[photoIndex] || currentProfile.photos[0]}
              alt={currentProfile.name}
              className={`w-full h-full object-cover transition-all duration-300 ${
                isLowDataMode ? 'contrast-105' : ''
              }`}
              loading="lazy"
            />

            {/* Gradient overlays for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-transparent to-transparent pointer-events-none h-24" />

            {/* Photo pagination dashes */}
            {currentProfile.photos.length > 1 && (
              <div className="absolute top-3 left-4 right-4 z-10 flex gap-1.5">
                {currentProfile.photos.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i === photoIndex ? 'bg-white shadow-sm' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Photo click zones (left/right) */}
            <div
              className="absolute inset-y-0 left-0 w-1/2 cursor-pointer z-10"
              onClick={() => {
                if (photoIndex > 0) setPhotoIndex((prev) => prev - 1);
              }}
            />
            <div
              className="absolute inset-y-0 right-0 w-1/2 cursor-pointer z-10"
              onClick={() => {
                if (photoIndex < currentProfile.photos.length - 1) setPhotoIndex((prev) => prev + 1);
              }}
            />

            {/* Top Badges: Verification & Chaperone */}
            <div className="absolute top-7 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              <div className="flex flex-wrap items-center gap-1.5">
                {currentProfile.isVerified && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/70 text-emerald-300 text-[11px] font-bold backdrop-blur-md shadow-md">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    ID Verified
                  </span>
                )}

                {currentProfile.chaperone?.enabled && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/90 border border-amber-500/70 text-amber-200 text-[11px] font-bold backdrop-blur-md shadow-md">
                    <Handshake className="w-3.5 h-3.5 text-amber-400" />
                    Chaperone Active
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 pointer-events-auto">
                <button
                  type="button"
                  id="view-full-details-top-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileDetailsModalOpen(true);
                  }}
                  className="p-2 rounded-full bg-black/50 text-stone-300 hover:text-amber-300 hover:bg-black/80 transition-colors backdrop-blur-sm"
                  title="View full bio and voice transcript"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  id="report-profile-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReport(currentProfile);
                  }}
                  className="p-2 rounded-full bg-black/50 text-stone-400 hover:text-red-400 hover:bg-black/80 transition-colors backdrop-blur-sm"
                  title="Report or block profile"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 15-second Voice Intro player pill */}
            <div className="absolute bottom-24 left-4 z-20 pointer-events-auto">
              <VoiceIntroPlayer profile={currentProfile} variant="compact" />
            </div>

            {/* Profile Info Card Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
              <div className="flex items-end justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                    <span>{currentProfile.name}</span>
                    <span className="text-xl font-normal text-amber-300 font-mono">
                      {currentProfile.age}
                    </span>
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-stone-300 mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{currentProfile.city}, {currentProfile.country}</span>
                    <span className="text-stone-500">•</span>
                    <span className="text-amber-300">{currentProfile.distanceKm} km away</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-[11px] font-extrabold text-white shadow-sm shrink-0">
                  {currentProfile.lookingFor}
                </span>
              </div>

              {/* Cultural Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                <span className="px-2.5 py-0.5 rounded-lg bg-stone-800/80 border border-stone-700/80 text-[11px] font-semibold text-stone-200">
                  Tribe: {currentProfile.tribe}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-stone-800/80 border border-stone-700/80 text-[11px] font-semibold text-stone-200">
                  {currentProfile.religion}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-950/70 border border-amber-700/50 text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-amber-400" />
                  {currentProfile.dowryIntention}
                </span>
              </div>

              {/* Bio */}
              <p className="text-xs text-stone-300 mt-2 line-clamp-2 leading-relaxed">
                "{currentProfile.bio}"
              </p>

              <button
                type="button"
                id="open-profile-details-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDetailsModalOpen(true);
                }}
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold hover:underline"
              >
                <span>View Full Profile & Voice Intro</span>
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ACTION BUTTON BAR: Pass, RESPECT (East African special), and Like */}
          <div className="p-3.5 bg-stone-900 border-t border-stone-800 flex items-center justify-around">
            {/* Pass */}
            <button
              id="swipe-pass-btn"
              onClick={() => handleAction('pass')}
              className="w-14 h-14 rounded-full bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-400 hover:text-stone-200 flex items-center justify-center transition-all duration-150 active:scale-95 shadow-md group"
              title="Pass (Vaako)"
            >
              <X className="w-7 h-7 group-hover:scale-110 transition-transform text-stone-400" />
            </button>

            {/* THE SIGNATURE RESPECT BUTTON (Heshima / Kitiibwa) */}
            <button
              id="swipe-respect-btn"
              onClick={() => handleAction('respect')}
              className="relative px-5 h-14 rounded-full bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:brightness-110 border-2 border-amber-400/80 text-white font-black text-sm flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 shadow-xl shadow-amber-950/50 group"
              title="Give Respect (Heshima / Kitiibwa)"
            >
              <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center">
                <Handshake className="w-5 h-5 text-amber-200 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-left leading-tight">
                <div className="text-xs font-black tracking-wider uppercase">RESPECT</div>
                <div className="text-[10px] text-amber-200 font-medium">Heshima Note</div>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </button>

            {/* Like */}
            <button
              id="swipe-like-btn"
              onClick={() => handleAction('like')}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 hover:brightness-110 text-white flex items-center justify-center transition-all duration-150 active:scale-95 shadow-lg shadow-red-950/40 group"
              title="Like (Penda)"
            >
              <Heart className="w-7 h-7 fill-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-stone-900 border border-stone-800 rounded-3xl text-stone-300 space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-stone-800 flex items-center justify-center text-amber-400 text-2xl">
            🌍
          </div>
          <h3 className="font-bold text-lg text-white">No More Profiles in this District</h3>
          <p className="text-xs text-stone-400 max-w-xs mx-auto">
            Expand your filter to include Kampala, Nairobi, Dar es Salaam, or Kigali.
          </p>
          <button
            onClick={() => {
              setFilters({
                country: 'all',
                tribe: 'all',
                religion: 'all',
                minAge: 18,
                maxAge: 60,
                maxDistanceKm: 100,
                lookingFor: 'all',
                dowryIntention: 'all',
              });
              setCurrentIndex(0);
            }}
            className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* RESPECT MODAL (Compose respectful East African greeting) */}
      {respectModalOpen && currentProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-stone-900 border border-amber-500/70 rounded-3xl p-6 shadow-2xl text-stone-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-600/30 flex items-center justify-center text-amber-400">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-amber-300">
                    Send Respect (Heshima) to {currentProfile.name}
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    A formal, honorable East African greeting prioritizes dignity over casual swiping.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRespectModalOpen(false)}
                className="text-stone-400 hover:text-white text-sm"
              >
                ×
              </button>
            </div>

            {/* Cultural quick compliments */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Select or Customize Respect Greeting:
              </label>
              <div className="space-y-1.5 mb-2.5">
                {[
                  `Greetings with utmost respect. Your commitment to family traditions and Kwanjula is admirable.`,
                  `Habari ya heshima. Ningependa kuzungumza nawe kwa adabu na staha.`,
                  `Oli otya nnyabo. I would be honored to introduce myself respectfully.`,
                  `Muraho neza. Your grace and architectural passions deeply inspire me.`,
                ].map((template, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRespectNote(template)}
                    className="w-full p-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-left text-xs text-stone-200 border border-stone-700 hover:border-amber-500/60 transition-colors"
                  >
                    "{template}"
                  </button>
                ))}
              </div>

              <textarea
                id="respect-note-custom"
                rows={2}
                value={respectNote}
                onChange={(e) => setRespectNote(e.target.value)}
                placeholder="Write your custom respectful note here..."
                className="w-full bg-stone-800 border border-stone-700 focus:border-amber-500 rounded-xl p-2.5 text-stone-100 text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setRespectModalOpen(false)}
                className="w-1/3 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-respect-btn"
                onClick={submitRespect}
                className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:brightness-110 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-1.5"
              >
                <Handshake className="w-4 h-4" />
                <span>Send Heshima Note</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* FULL PROFILE & VOICE INTRO DETAILS MODAL */}
      {profileDetailsModalOpen && currentProfile && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md max-h-[90vh] bg-stone-900 border border-stone-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  {currentProfile.name}, {currentProfile.age}
                </h3>
                {currentProfile.isVerified && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                    <Shield className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              <button
                type="button"
                id="close-profile-details-modal-btn"
                onClick={() => setProfileDetailsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center font-bold text-lg"
              >
                ×
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-4 overflow-y-auto space-y-4">
              {/* Photo carousel */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-950">
                <img
                  src={currentProfile.photos[photoIndex] || currentProfile.photos[0]}
                  alt={currentProfile.name}
                  className="w-full h-full object-cover"
                />
                {currentProfile.photos.length > 1 && (
                  <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1">
                    {currentProfile.photos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPhotoIndex(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === photoIndex ? 'w-5 bg-white' : 'w-2 bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* DEDICATED EXPANDED VOICE INTRO PLAYER */}
              <div>
                <VoiceIntroPlayer profile={currentProfile} variant="expanded" />
              </div>

              {/* Cultural & Relationship Preferences */}
              <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Cultural & Background Details
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">Tribe / Heritage</span>
                    <span className="font-semibold text-white">{currentProfile.tribe}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">Religion</span>
                    <span className="font-semibold text-white">{currentProfile.religion}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">Location</span>
                    <span className="font-semibold text-white">{currentProfile.city}, {currentProfile.country}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">Looking For</span>
                    <span className="font-semibold text-amber-300">{currentProfile.lookingFor}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-xs">
                  <span className="text-[10px] text-amber-400 font-bold block mb-0.5">
                    Dowry & Marriage Intention
                  </span>
                  <p className="text-amber-200">
                    {currentProfile.dowryIntention}
                  </p>
                </div>

                {currentProfile.chaperone?.enabled && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/30 text-xs">
                    <span className="text-[10px] text-emerald-400 font-bold block mb-0.5">
                      Family Chaperone (Heshima)
                    </span>
                    <p className="text-emerald-200">
                      Guided by {currentProfile.chaperone.name} ({currentProfile.chaperone.relationship})
                    </p>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  About Me
                </h4>
                <p className="text-xs text-stone-200 leading-relaxed">
                  {currentProfile.bio}
                </p>
              </div>
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="p-3 border-t border-stone-800 bg-stone-950 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setProfileDetailsModalOpen(false);
                  handleAction('pass');
                }}
                className="flex-1 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Pass</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfileDetailsModalOpen(false);
                  handleAction('respect');
                }}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <Handshake className="w-4 h-4" />
                <span>Give Respect</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfileDetailsModalOpen(false);
                  handleAction('like');
                }}
                className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Like</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
