import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardHub } from './components/DashboardHub';
import { TodayTab } from './components/TodayTab';
import { VipTab } from './components/VipTab';
import { PredictionCalendar } from './components/PredictionCalendar';
import { LiveScoresTab } from './components/LiveScoresTab';
import { ProfileTab } from './components/ProfileTab';
import { NavigationDrawer } from './components/NavigationDrawer';
import { CommunityModal } from './components/CommunityModal';
import { PrivacyModal } from './components/PrivacyModal';
import { MomoPaymentModal } from './components/MomoPaymentModal';
import { PhoneAuthModal } from './components/PhoneAuthModal';
import { DownloadApkModal } from './components/DownloadApkModal';
import { FlutterCodeModal } from './components/FlutterCodeModal';
import { FixtureItem, UserSubscription, AppTab, VipCategory } from './types';
import { INITIAL_FIXTURES } from './data/sportsData';

export default function App() {
  // Theme & Layout state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('zinna_theme');
    return saved ? saved === 'dark' : true; // Default to dark luxury theme as shown in screenshot
  });

  const [currentTab, setCurrentTab] = useState<AppTab>('home');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [fixtures, setFixtures] = useState<FixtureItem[]>(INITIAL_FIXTURES);
  const [isLoadingFixtures, setIsLoadingFixtures] = useState<boolean>(false);
  const [selectedVipCategory, setSelectedVipCategory] = useState<VipCategory | undefined>(undefined);

  // Modal / Drawer state
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);

  // User & Subscription state
  const [user, setUser] = useState<UserSubscription | null>(() => {
    const saved = localStorage.getItem('zinna_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default demo user with active 7-day trial
    const trialStart = new Date().toISOString();
    return {
      phone: '+256772123456',
      trial_start_date: trialStart,
      is_subscribed: false,
      plan: '7-Day Free Trial (Active)',
      payment_method: 'None',
    };
  });

  // Paywall & Testing simulation state
  const [simulateExpired, setSimulateExpired] = useState<boolean>(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isDownloadApkOpen, setIsDownloadApkOpen] = useState<boolean>(false);
  const [isFlutterCodeOpen, setIsFlutterCodeOpen] = useState<boolean>(false);

  // Apply dark mode class to root HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('zinna_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('zinna_theme', 'light');
    }
  }, [darkMode]);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('zinna_user', JSON.stringify(user));
    }
  }, [user]);

  // Fetch daily fixtures from backend
  const fetchFixtures = async () => {
    setIsLoadingFixtures(true);
    try {
      const res = await fetch('/api/fixtures/today?sport=all');
      if (res.ok) {
        const data = await res.json();
        if (data.fixtures && data.fixtures.length > 0) {
          setFixtures(data.fixtures);
        }
      }
    } catch (e) {
      console.warn('Backend fixture fetch fallback to initial data:', e);
    } finally {
      setIsLoadingFixtures(false);
    }
  };

  useEffect(() => {
    fetchFixtures();
  }, []);

  // Compute 7-day free trial remaining
  const getTrialInfo = () => {
    if (!user) return { daysRemaining: 7, isExpired: false };
    if (simulateExpired) return { daysRemaining: 0, isExpired: true };
    if (user.is_subscribed) return { daysRemaining: 30, isExpired: false };

    const start = new Date(user.trial_start_date).getTime();
    const now = new Date().getTime();
    const elapsedDays = (now - start) / (1000 * 3600 * 24);
    const isExpired = elapsedDays >= 7;
    const daysRemaining = Math.max(0, Math.ceil(7 - elapsedDays));

    return { daysRemaining, isExpired };
  };

  const { daysRemaining, isExpired } = getTrialInfo();
  const liveCount = fixtures.filter((f) => f.status === 'live').length;

  // Handle phone registration (User registers with phone number -> automatically starts 7-day free trial)
  const handleRegister = async (phone: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthOpen(false);
        setSimulateExpired(false);
        return true;
      }
    } catch (e) {
      console.error(e);
    }

    // Client fallback
    const now = new Date().toISOString();
    const newUser: UserSubscription = {
      phone,
      trial_start_date: now,
      is_subscribed: false,
      plan: '7-Day Free Trial (Active)',
      payment_method: 'None',
    };
    setUser(newUser);
    setIsAuthOpen(false);
    setSimulateExpired(false);
    return true;
  };

  // Handle Mobile Money & Card subscription (UGX, KES, TZS, RWF, or USD)
  const handleSubscribe = async (
    provider: string,
    currency: string = 'UGX',
    amount: number = 15000,
    country: string = 'UG'
  ): Promise<boolean> => {
    try {
      const res = await fetch('/api/user/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: user?.phone || '+256772123456',
          provider,
          currency,
          amount,
          country,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setSimulateExpired(false);
        setIsPaywallOpen(false);
        return true;
      }
    } catch (e) {
      console.error(e);
    }

    // Client fallback
    if (user) {
      const expiry = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
      const planDesc = `${currency} ${amount.toLocaleString()} / Month (VIP AI Access)`;
      setUser({
        ...user,
        country,
        currency,
        is_subscribed: true,
        subscription_expiry: expiry,
        plan: planDesc,
        payment_method: provider,
      });
      setSimulateExpired(false);
      setIsPaywallOpen(false);
      return true;
    }
    return false;
  };

  const handleUpdateUserCountry = (newCountryCode: string) => {
    if (user) {
      setUser({
        ...user,
        country: newCountryCode,
      });
    }
  };

  const handleToggleSimulateExpired = () => {
    setSimulateExpired(!simulateExpired);
  };

  const handleLogout = () => {
    localStorage.removeItem('zinna_user');
    setUser(null);
    setIsAuthOpen(true);
  };

  // If user is not logged in, prompt Auth screen
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors">
        <PhoneAuthModal isOpen={true} onRegister={handleRegister} />
      </div>
    );
  }

  // Hard lock paywall if trial is expired and user hasn't subscribed
  const shouldHardLock = isExpired && !user.is_subscribed;

  return (
    <div className="min-h-screen bg-[#090514] text-slate-100 font-sans transition-colors flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Sticky App Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        user={user}
        trialDaysRemaining={daysRemaining}
        isTrialExpired={isExpired}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenDownloadApk={() => setIsDownloadApkOpen(true)}
        onOpenFlutterCode={() => setIsFlutterCodeOpen(true)}
        onOpenPaywall={() => setIsPaywallOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-4 md:p-6">
        {/* Tab 1: Home Dashboard (Exact visual layout of the screenshot with custom enhancements) */}
        {currentTab === 'home' && (
          <DashboardHub
            onSelectLiveAnalysis={() => setCurrentTab('today')}
            onSelectPerformanceTracker={() => setCurrentTab('calendar')}
            onSelectVipCategory={(cat) => {
              setSelectedVipCategory(cat);
              setCurrentTab('vip');
            }}
            onOpenCommunity={() => setIsCommunityOpen(true)}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            selectedSport={selectedSport}
            setSelectedSport={setSelectedSport}
            liveMatchesCount={liveCount}
            isSubscribed={user.is_subscribed}
            trialDaysRemaining={daysRemaining}
          />
        )}

        {/* Tab 2: Live Match Analysis */}
        {currentTab === 'today' && (
          <TodayTab
            fixtures={fixtures}
            isLoading={isLoadingFixtures}
            selectedSport={selectedSport}
            setSelectedSport={setSelectedSport}
            onRefresh={fetchFixtures}
            trialDaysRemaining={daysRemaining}
            isSubscribed={user.is_subscribed}
            onOpenPaywall={() => setIsPaywallOpen(true)}
            onOpenVipTab={() => setCurrentTab('vip')}
            user={user}
          />
        )}

        {/* Tab 3: Performance Tracker Calendar */}
        {currentTab === 'calendar' && (
          <div className="space-y-4 pb-20 max-w-2xl mx-auto">
            <PredictionCalendar />
          </div>
        )}

        {/* Tab 4: Exclusive VIP Tips & Slips */}
        {currentTab === 'vip' && (
          <VipTab
            initialCategory={selectedVipCategory}
            isSubscribed={user.is_subscribed}
            trialDaysRemaining={daysRemaining}
            isTrialExpired={isExpired}
            onOpenPaywall={() => setIsPaywallOpen(true)}
          />
        )}

        {/* Tab 5: Live Scores */}
        {currentTab === 'live' && (
          <LiveScoresTab
            fixtures={fixtures}
            onRefresh={fetchFixtures}
            isLoading={isLoadingFixtures}
          />
        )}

        {/* Tab 6: Profile & Subscription */}
        {currentTab === 'profile' && (
          <ProfileTab
            user={user}
            trialDaysRemaining={daysRemaining}
            isTrialExpired={isExpired}
            onOpenPaywall={() => setIsPaywallOpen(true)}
            onToggleSimulateExpired={handleToggleSimulateExpired}
            onOpenDownloadApk={() => setIsDownloadApkOpen(true)}
            onOpenFlutterCode={() => setIsFlutterCodeOpen(true)}
            onLogout={handleLogout}
            onChangeCountry={handleUpdateUserCountry}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'vip') setSelectedVipCategory(undefined);
          setCurrentTab(tab);
        }}
        liveCount={liveCount}
      />

      {/* Slide-out Navigation Drawer (Hamburger Menu) */}
      <NavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentTab={currentTab}
        onNavigate={(tab) => {
          if (tab === 'vip') setSelectedVipCategory(undefined);
          setCurrentTab(tab);
        }}
        user={user}
        trialDaysRemaining={daysRemaining}
        isTrialExpired={isExpired}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenPaywall={() => setIsPaywallOpen(true)}
        onOpenDownloadApk={() => setIsDownloadApkOpen(true)}
        onOpenCommunity={() => setIsCommunityOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Telegram & WhatsApp VIP Community Modal */}
      <CommunityModal
        isOpen={isCommunityOpen}
        onClose={() => setIsCommunityOpen(false)}
      />

      {/* Privacy Policy & Terms Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Momo Payment Modal with Automatic Country & Currency Detection */}
      <MomoPaymentModal
        isOpen={shouldHardLock || isPaywallOpen}
        onClose={shouldHardLock ? undefined : () => setIsPaywallOpen(false)}
        user={user}
        onSubscribe={handleSubscribe}
        isLocked={shouldHardLock}
      />

      {/* Download APK Modal */}
      <DownloadApkModal
        isOpen={isDownloadApkOpen}
        onClose={() => setIsDownloadApkOpen(false)}
      />

      {/* Flutter Source Code Modal */}
      <FlutterCodeModal
        isOpen={isFlutterCodeOpen}
        onClose={() => setIsFlutterCodeOpen(false)}
      />
    </div>
  );
}
