import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DiscoverView } from './components/DiscoverView';
import { LikesView } from './components/LikesView';
import { ChatView } from './components/ChatView';
import { EventsView } from './components/EventsView';
import { ProfileView } from './components/ProfileView';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { MomoPaymentModal } from './components/MomoPaymentModal';
import { PanicModal } from './components/PanicModal';
import { ReportModal } from './components/ReportModal';
import { 
  UserProfile, MatchProfile, SupportedLanguage, NavigationTab, LocalEvent 
} from './types';
import { 
  INITIAL_PROFILES, INITIAL_MATCHES, INITIAL_EVENTS, UI_TRANSLATIONS 
} from './data/mockData';
import { Handshake, Heart, Sparkles, MessageCircle, X } from 'lucide-react';

export default function App() {
  // Global State
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
  const [currentTab, setCurrentTab] = useState<NavigationTab>('discover');
  const [isLowDataMode, setIsLowDataMode] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'user-me',
    phone: '+256772123456',
    name: 'Kiconco Patricia',
    age: 24,
    gender: 'woman',
    country: 'Uganda',
    city: 'Kampala',
    district: 'Matuga / Wakiso',
    tribe: 'Muganda',
    language: ['Luganda', 'English'],
    religion: 'Christian',
    lookingFor: 'Serious Relationship',
    bio: 'Proud Muganda woman passionate about East African literature, church choir, and traditional family harmony. Seeking a respectful partner.',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    ],
    voiceIntroUrl: '/audio/intro-user.mp3',
    voiceIntroDuration: 14,
    voiceIntroTranscript: 'Oli otya nnyabo ne ssebo! Welcome to my profile. I value sincere conversation, choir, and cultural respect. Looking forward to connecting with someone special.',
    dowryIntention: 'Traditional custom respected',
    chaperone: {
      name: 'Brian Kigozi (Brother)',
      relationship: 'Brother',
      phone: '+256701555123',
      enabled: true,
    },
    isVerified: true,
    isPremium: false,
    likesRemainingToday: 20,
    distanceKm: 4,
  });

  const [profiles, setProfiles] = useState<UserProfile[]>(INITIAL_PROFILES);
  const [matches, setMatches] = useState<MatchProfile[]>(INITIAL_MATCHES);
  const [events, setEvents] = useState<LocalEvent[]>(INITIAL_EVENTS);
  const [likesRemainingToday, setLikesRemainingToday] = useState(20);
  const [isPremium, setIsPremium] = useState(false);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);
  const [momoModalOpen, setMomoModalOpen] = useState(false);
  const [panicModalOpen, setPanicModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<UserProfile | null>(null);
  
  // Match celebration modal state
  const [celebrationMatch, setCelebrationMatch] = useState<{ match: MatchProfile; isRespect: boolean } | null>(null);

  // Fetch initial profiles and matches from backend
  useEffect(() => {
    fetch('/api/profiles')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setProfiles(data);
      })
      .catch(() => {});

    fetch('/api/matches')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setMatches(data);
      })
      .catch(() => {});

    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setEvents(data);
      })
      .catch(() => {});
  }, []);

  // Handle Swipe Action: Like, Pass, or Respect
  const handleSwipe = async (targetUserId: string, type: 'like' | 'pass' | 'respect', respectNote?: string) => {
    const targetProfile = profiles.find((p) => p.id === targetUserId);
    if (!targetProfile) return;

    if (type === 'like' && !isPremium) {
      setLikesRemainingToday((prev) => Math.max(0, prev - 1));
    }

    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          targetUserId,
          action: type,
          respectNote,
        }),
      });
      const data = await res.json();

      if (data.isMatch && data.match) {
        setMatches((prev) => [data.match, ...prev]);
        setCelebrationMatch({ match: data.match, isRespect: type === 'respect' });
      }
    } catch {
      // Offline fallback: create local match on respect or like
      if (type === 'respect' || type === 'like') {
        const newMatch: MatchProfile = {
          matchId: 'match-' + Date.now(),
          user: targetProfile,
          matchedAt: 'Just now',
          isRespectMatch: type === 'respect',
          respectNote: respectNote,
          chaperoneActive: true,
          lastMessage: type === 'respect' ? `Respect Note: "${respectNote}"` : 'You both liked each other!',
          lastMessageTime: 'Just now',
          unreadCount: 1,
        };
        setMatches((prev) => [newMatch, ...prev]);
        setCelebrationMatch({ match: newMatch, isRespect: type === 'respect' });
      }
    }
  };

  const handleMomoSuccess = (provider: string, amount: number, currency: string) => {
    setIsPremium(true);
    setCurrentUser((prev) => ({ ...prev, isPremium: true, likesRemainingToday: 9999 }));
    setLikesRemainingToday(9999);
    setMomoModalOpen(false);
  };

  const handleAuthComplete = (phone: string, isNewUser: boolean) => {
    setCurrentUser((prev) => ({ ...prev, phone }));
    setAuthModalOpen(false);
    if (isNewUser) {
      setOnboardingModalOpen(true);
    }
  };

  const handleOnboardingComplete = (completed: UserProfile) => {
    setCurrentUser(completed);
    setOnboardingModalOpen(false);
  };

  const unreadMatchesCount = matches.filter((m) => m.unreadCount > 0).length;

  return (
    <div className={`min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black ${
      isLowDataMode ? 'low-data-mode' : ''
    }`}>
      {/* Top Header with country flags, language toggle, and mode controls */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        isLowDataMode={isLowDataMode}
        onToggleLowDataMode={() => setIsLowDataMode(!isLowDataMode)}
        onOpenPanic={() => setPanicModalOpen(true)}
        onOpenMomo={() => setMomoModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        isAdminView={currentTab === 'admin'}
        onToggleAdminView={() => setCurrentTab(currentTab === 'admin' ? 'discover' : 'admin')}
        onOpenAdmin={() => setCurrentTab('admin')}
        isPremium={isPremium}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto flex flex-col">
        {currentTab === 'discover' && (
          <DiscoverView
            profiles={profiles}
            currentLang={currentLang}
            likesRemainingToday={likesRemainingToday}
            isPremium={isPremium}
            onSwipe={handleSwipe}
            onOpenMomo={() => setMomoModalOpen(true)}
            onReport={(target) => {
              setReportTarget(target);
              setReportModalOpen(true);
            }}
            isLowDataMode={isLowDataMode}
          />
        )}

        {currentTab === 'likes' && (
          <LikesView
            profiles={profiles}
            isPremium={isPremium}
            onOpenMomo={() => setMomoModalOpen(true)}
            onSwipeBack={(suitor) => {
              handleSwipe(suitor.id, 'like');
              setCurrentTab('chat');
            }}
            currentLang={currentLang}
          />
        )}

        {currentTab === 'chat' && (
          <ChatView
            matches={matches}
            currentLang={currentLang}
            currentUser={currentUser}
            isLowDataMode={isLowDataMode}
            onToggleLowDataMode={() => setIsLowDataMode(!isLowDataMode)}
          />
        )}

        {currentTab === 'events' && (
          <EventsView
            events={events}
            currentLang={currentLang}
            onOpenMomo={() => setMomoModalOpen(true)}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            user={currentUser}
            currentLang={currentLang}
            onUpdateUser={setCurrentUser}
            onOpenMomo={() => setMomoModalOpen(true)}
            onOpenPanic={() => setPanicModalOpen(true)}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPanel
            onBack={() => setCurrentTab('discover')}
            currentLang={currentLang}
            onLanguageChange={setCurrentLang}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onSelectTab={setCurrentTab}
        unreadCount={unreadMatchesCount}
        likesCount={profiles.length > 0 ? 4 : 0}
        currentLang={currentLang}
      />

      {/* MATCH CELEBRATION MODAL */}
      {celebrationMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in zoom-in-95">
          <div className="w-full max-w-sm bg-gradient-to-b from-stone-900 to-amber-950 border-2 border-amber-500 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 animate-bounce">
              {celebrationMatch.isRespect ? <Handshake className="w-8 h-8" /> : <Heart className="w-8 h-8 fill-red-500 text-red-500" />}
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                {celebrationMatch.isRespect ? 'Honor & Respect Connected' : "It's a Mutual Match!"}
              </span>
              <h2 className="text-xl font-extrabold text-white mt-1">
                You & {celebrationMatch.match.user.name}
              </h2>
              <p className="text-xs text-stone-300 mt-1">
                {celebrationMatch.isRespect
                  ? 'Your formal respect greeting was accepted with high esteem.'
                  : 'You both expressed interest. Chat is now unlocked!'}
              </p>
            </div>

            {/* Suitor photo preview */}
            <div className="flex items-center justify-center gap-2">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 shadow-md">
                <img
                  src={currentUser.photos[0]}
                  alt="You"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black font-black text-xs">
                {celebrationMatch.isRespect ? '🤝' : '❤️'}
              </div>
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 shadow-md">
                <img
                  src={celebrationMatch.match.user.photos[0]}
                  alt={celebrationMatch.match.user.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                id="open-match-chat-btn"
                onClick={() => {
                  setCelebrationMatch(null);
                  setCurrentTab('chat');
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:brightness-110 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open Respectful Chat</span>
              </button>
              <button
                onClick={() => setCelebrationMatch(null)}
                className="w-full py-2 text-stone-400 hover:text-white text-xs font-semibold"
              >
                Keep Exploring Singles
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALL MODALS */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onComplete={handleAuthComplete}
      />

      <OnboardingModal
        isOpen={onboardingModalOpen}
        initialProfile={currentUser}
        onComplete={handleOnboardingComplete}
      />

      <MomoPaymentModal
        isOpen={momoModalOpen}
        onClose={() => setMomoModalOpen(false)}
        onSuccess={handleMomoSuccess}
        defaultPhone={currentUser.phone}
      />

      <PanicModal
        isOpen={panicModalOpen}
        onClose={() => setPanicModalOpen(false)}
        currentUser={currentUser}
      />

      <ReportModal
        isOpen={reportModalOpen}
        targetUser={reportTarget}
        onClose={() => {
          setReportModalOpen(false);
          setReportTarget(null);
        }}
        onSuccess={() => {
          setReportModalOpen(false);
          if (reportTarget) {
            setProfiles((prev) => prev.filter((p) => p.id !== reportTarget.id));
          }
          setReportTarget(null);
        }}
      />
    </div>
  );
}
