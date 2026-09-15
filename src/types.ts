export type CountryCode = '+256' | '+254' | '+255' | '+250' | '+257';

export interface EastAfricaCountry {
  code: CountryCode;
  name: string;
  flag: string;
  currency: string;
  carrierPrefixes: string[];
  sampleNumber: string;
  cities: string[];
}

export type SupportedLanguage = 'en' | 'sw' | 'lg' | 'rw';

export type Gender = 'woman' | 'man' | 'non-binary';

export type LookingFor = 'Serious Relationship' | 'Marriage' | 'Friendship' | 'Cultural Partnership';

export type Religion = 'Christian' | 'Muslim' | 'Traditional' | 'Spiritual / Other';

export type DowryIntention = 
  | 'Traditional custom respected'
  | 'Open to family negotiation'
  | 'Symbolic / Modest'
  | 'Not practicing dowry'
  | 'Prefer to discuss in person';

export interface UserProfile {
  id: string;
  phone: string;
  name: string;
  age: number;
  gender: Gender;
  country: string;
  city: string;
  tribe: string;
  primaryLanguage: string;
  religion: Religion;
  lookingFor: LookingFor;
  dowryIntention: DowryIntention;
  photos: string[];
  voiceIntroUrl?: string;
  voiceIntroDuration?: number;
  voiceIntroTranscript?: string;
  bio: string;
  occupation?: string;
  isVerified: boolean;
  isPremium: boolean;
  premiumExpiresAt?: string;
  likesRemainingToday: number;
  chaperone?: {
    name: string;
    relationship: string;
    phone: string;
    enabled: boolean;
  };
  distanceKm?: number;
  createdAt: string;
  respectPoints?: number;
}

export type SwipeType = 'pass' | 'like' | 'respect';

export interface SwipePayload {
  targetUserId: string;
  type: SwipeType;
  respectNote?: string;
}

export interface ChatMessage {
  id: string;
  matchId: string;
  senderId: string;
  text?: string;
  voiceNoteUrl?: string;
  voiceNoteDuration?: number;
  timestamp: string;
  translations?: Record<string, string>;
  isChaperoneVisible?: boolean;
}

export interface MatchProfile {
  matchId: string;
  user: UserProfile;
  matchedAt: string;
  isRespectMatch: boolean;
  respectNote?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  chaperoneActive: boolean;
}

export interface ReportItem {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reporterId: string;
  reason: string;
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  timestamp: string;
}

export interface MomoTransaction {
  id: string;
  userId: string;
  phone: string;
  provider: 'MTN Mobile Money' | 'Airtel Money' | 'M-Pesa Safaricom';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
  timestamp: string;
}

export interface LocalEvent {
  id: string;
  title: string;
  country: string;
  city: string;
  district: string;
  venue: string;
  date: string;
  time: string;
  description: string;
  attendees: number;
  category: 'Singles Mixer' | 'Cultural Night' | 'Speed Dating' | 'Sundowner';
  entryFee: string;
  image?: string;
}

export interface FilterSettings {
  country: string;
  tribe: string;
  religion: string;
  minAge: number;
  maxAge: number;
  maxDistanceKm: number;
  lookingFor: string;
  dowryIntention: string;
}

export type NavigationTab = 'discover' | 'likes' | 'chat' | 'events' | 'profile' | 'admin';
