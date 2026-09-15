import React from 'react';
import { Compass, Heart, Calendar, MessageCircle, User } from 'lucide-react';
import { SupportedLanguage, NavigationTab } from '../types';
import { UI_TRANSLATIONS } from '../data/mockData';

export type NavTab = NavigationTab;

interface BottomNavProps {
  currentTab: NavigationTab;
  onSelectTab?: (tab: NavigationTab) => void;
  onTabChange?: (tab: NavigationTab) => void;
  currentLang?: SupportedLanguage;
  unreadCount?: number;
  likesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onTabChange,
  currentLang = 'en',
  unreadCount = 0,
  likesCount = 0,
}) => {
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;

  const handleTabClick = (tabId: NavigationTab) => {
    if (typeof onSelectTab === 'function') {
      onSelectTab(tabId);
    }
    if (typeof onTabChange === 'function') {
      onTabChange(tabId);
    }
  };

  const tabs: Array<{ id: NavigationTab; label: string; icon: React.ReactNode; badge?: number }> = [
    {
      id: 'discover',
      label: t.discovering || 'Discover',
      icon: <Compass className="w-5 h-5" />,
    },
    {
      id: 'likes',
      label: t.likes || 'Likes',
      icon: <Heart className="w-5 h-5" />,
      badge: likesCount > 0 ? likesCount : undefined,
    },
    {
      id: 'chat',
      label: t.chat || 'Chat',
      icon: <MessageCircle className="w-5 h-5" />,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      id: 'profile',
      label: t.profile || 'Profile',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-stone-900/95 backdrop-blur-lg border-t border-amber-900/30 text-stone-300 py-1.5 px-2 sm:px-4">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              className={`relative flex flex-col items-center py-1 px-2.5 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-amber-400 scale-105 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 bg-red-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 font-medium tracking-tight">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
