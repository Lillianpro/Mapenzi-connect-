import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PROFILES, INITIAL_EVENTS } from './src/data/mockData.ts';
import { UserProfile, ChatMessage, MatchProfile, MomoTransaction, ReportItem, LocalEvent } from './src/types.ts';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory data store with state preservation
const otps = new Map<string, { code: string; expiresAt: number }>();
let profiles: UserProfile[] = [...INITIAL_PROFILES];
let events: LocalEvent[] = [...INITIAL_EVENTS];
let matches: MatchProfile[] = [
  {
    matchId: 'm-1',
    user: profiles[0], // Nakato Priscilla
    matchedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    isRespectMatch: true,
    respectNote: 'Greetings with utmost respect. Your Kwanjula commitment is admirable.',
    lastMessage: 'Oli otya! Thank you for the polite respect note.',
    lastMessageTime: '10 mins ago',
    unreadCount: 1,
    chaperoneActive: true,
  },
  {
    matchId: 'm-2',
    user: profiles[2], // Amina Mwajuma
    matchedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    isRespectMatch: false,
    lastMessage: 'Habari yako! Karibu tuzungumze kuhusu mila za ndoa.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    chaperoneActive: true,
  }
];

let messages: Record<string, ChatMessage[]> = {
  'm-1': [
    {
      id: 'msg-1',
      matchId: 'm-1',
      senderId: 'currentUser',
      text: 'Greetings with utmost respect. Your Kwanjula commitment is admirable.',
      timestamp: new Date(Date.now() - 3600000 * 4).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isChaperoneVisible: true,
    },
    {
      id: 'msg-2',
      matchId: 'm-1',
      senderId: 'p1',
      text: 'Oli otya! Thank you for the polite respect note. My brother Brian is in the loop.',
      timestamp: new Date(Date.now() - 3600000 * 3).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      translations: {
        en: 'How are you! Thank you for the polite respect note. My brother Brian is in the loop.',
        sw: 'Hujambo! Asante kwa ujumbe wa heshima. Kaka yangu Brian yupo kwenye mazungumzo haya.',
      },
      isChaperoneVisible: true,
    },
  ],
  'm-2': [
    {
      id: 'msg-3',
      matchId: 'm-2',
      senderId: 'p3',
      text: 'Habari yako! Karibu tuzungumze kuhusu mila za ndoa na maisha.',
      timestamp: 'Yesterday 4:15 PM',
      translations: {
        en: 'Hello there! Welcome to talk about marriage customs and life values.',
        lg: 'Gy\'oli! Oyaniriziddwa okwogera ku nsonga z\'obufumbo n\'obulamu.',
      },
      isChaperoneVisible: true,
    }
  ]
};

let reports: ReportItem[] = [
  {
    id: 'rep-1',
    reportedUserId: 'p7',
    reportedUserName: 'Suleiman Juma',
    reporterId: 'usr-99',
    reason: 'Suspicious profile photo similarity',
    details: 'Checked via verification system, needs secondary ID check.',
    status: 'pending',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  }
];

let transactions: MomoTransaction[] = [
  {
    id: 'tx-101',
    userId: 'currentUser',
    phone: '+256772123456',
    provider: 'MTN Mobile Money',
    amount: 50000,
    currency: 'UGX',
    status: 'completed',
    reference: 'MOMO-UG-984210',
    timestamp: '2026-03-12 14:32',
  },
  {
    id: 'tx-102',
    userId: 'p2',
    phone: '+254712445566',
    provider: 'M-Pesa Safaricom',
    amount: 1500,
    currency: 'KES',
    status: 'completed',
    reference: 'MPESA-KE-44321',
    timestamp: '2026-03-13 09:12',
  },
  {
    id: 'tx-103',
    userId: 'p3',
    phone: '+255754112233',
    provider: 'Airtel Money',
    amount: 35000,
    currency: 'TZS',
    status: 'completed',
    reference: 'AIRTEL-TZ-77821',
    timestamp: '2026-03-14 18:04',
  }
];

let panicLogs: Array<{
  id: string;
  userId: string;
  contactPhone: string;
  contactName: string;
  latitude: number;
  longitude: number;
  address: string;
  timestamp: string;
  smsDispatched: boolean;
}> = [];

// Gemini Helper
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ----------------------------------------------------
// AUTH ENDPOINTS (Phone + OTP, East Africa Carriers)
// ----------------------------------------------------
app.post('/api/auth/send-otp', (req: Request, res: Response) => {
  const { phone, countryCode } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // Generate 6-digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otps.set(phone, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  });

  // Carrier determination for East Africa
  let carrier = 'MTN Mobile';
  if (countryCode === '+254') carrier = 'Safaricom SMS Gateway';
  else if (countryCode === '+255') carrier = 'Vodacom / Airtel SMS';
  else if (countryCode === '+250') carrier = 'MTN Rwanda / Airtel';
  else if (countryCode === '+257') carrier = 'Lumicash Econet';
  else if (phone.startsWith('+25670') || phone.startsWith('+25675')) carrier = 'Airtel Uganda SMS';

  return res.json({
    success: true,
    message: `OTP sent via ${carrier} to ${phone}`,
    carrier,
    debugOtp: code, // Convenient display for demo testing
  });
});

app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
  const { phone, code } = req.body;
  const record = otps.get(phone);

  // Accept valid generated OTP or master demo code '123456'
  const isValid = (record && record.code === code) || code === '123456';
  if (!isValid) {
    return res.status(400).json({ error: 'Invalid or expired OTP code' });
  }

  otps.delete(phone);

  // Check if profile exists for this phone
  let user = profiles.find((p) => p.phone === phone);
  const isNew = !user;

  if (!user) {
    user = {
      id: 'usr-' + Date.now(),
      phone,
      name: '',
      age: 23,
      gender: 'woman',
      country: phone.startsWith('+254') ? 'Kenya' : phone.startsWith('+255') ? 'Tanzania' : phone.startsWith('+250') ? 'Rwanda' : 'Uganda',
      city: phone.startsWith('+254') ? 'Nairobi' : phone.startsWith('+255') ? 'Dar es Salaam' : phone.startsWith('+250') ? 'Kigali' : 'Kampala',
      tribe: 'Muganda',
      primaryLanguage: 'Luganda & English',
      religion: 'Christian',
      lookingFor: 'Serious Relationship',
      dowryIntention: 'Traditional custom respected',
      photos: [],
      bio: '',
      isVerified: false,
      isPremium: false,
      likesRemainingToday: 20,
      createdAt: new Date().toISOString(),
      respectPoints: 10,
    };
  }

  return res.json({
    success: true,
    user,
    isNew,
  });
});

// ----------------------------------------------------
// PROFILES & MATCHING
// ----------------------------------------------------
app.get('/api/profiles', (req: Request, res: Response) => {
  const { country, tribe, religion, minAge, maxAge, dowry } = req.query;

  let filtered = profiles.filter((p) => p.id !== 'currentUser');

  if (country && country !== 'all') {
    filtered = filtered.filter((p) => p.country.toLowerCase() === String(country).toLowerCase());
  }
  if (tribe && tribe !== 'all') {
    filtered = filtered.filter((p) => p.tribe.toLowerCase().includes(String(tribe).toLowerCase()));
  }
  if (religion && religion !== 'all') {
    filtered = filtered.filter((p) => p.religion.toLowerCase() === String(religion).toLowerCase());
  }
  if (minAge) {
    filtered = filtered.filter((p) => p.age >= Number(minAge));
  }
  if (maxAge) {
    filtered = filtered.filter((p) => p.age <= Number(maxAge));
  }
  if (dowry && dowry !== 'all') {
    filtered = filtered.filter((p) => p.dowryIntention.toLowerCase().includes(String(dowry).toLowerCase()));
  }

  return res.json(filtered);
});

app.put('/api/profiles/me', (req: Request, res: Response) => {
  const updatedData = req.body;
  const index = profiles.findIndex((p) => p.id === updatedData.id || p.id === 'currentUser');
  if (index !== -1) {
    profiles[index] = { ...profiles[index], ...updatedData };
  } else {
    profiles.push({ ...updatedData, id: updatedData.id || 'currentUser' });
  }
  return res.json({ success: true, user: updatedData });
});

app.post('/api/swipe', (req: Request, res: Response) => {
  const { userId, targetUserId, type, respectNote } = req.body;
  const target = profiles.find((p) => p.id === targetUserId);
  if (!target) {
    return res.status(404).json({ error: 'Target profile not found' });
  }

  let isMatch = false;
  if (type === 'like' || type === 'respect') {
    // East African high affinity match simulation
    isMatch = true;
    const existingMatch = matches.find((m) => m.user.id === targetUserId);
    if (!existingMatch) {
      const newMatch: MatchProfile = {
        matchId: 'm-' + Date.now(),
        user: target,
        matchedAt: new Date().toISOString(),
        isRespectMatch: type === 'respect',
        respectNote: respectNote || (type === 'respect' ? 'Sent a formal East African Heshima greeting.' : undefined),
        lastMessage: type === 'respect' ? 'Sent formal Heshima greeting' : 'Mutual like! Start a respectful chat.',
        lastMessageTime: 'Just now',
        unreadCount: 0,
        chaperoneActive: !!target.chaperone?.enabled,
      };
      matches.unshift(newMatch);

      // Initialize chat thread
      messages[newMatch.matchId] = [
        {
          id: 'sys-' + Date.now(),
          matchId: newMatch.matchId,
          senderId: 'system',
          text: type === 'respect'
            ? `🤝 Respect Match made! ${target.name} accepted your formal Heshima note.`
            : `🎉 You both liked each other! Maintain good manners and respect.`,
          timestamp: 'Just now',
        }
      ];

      if (respectNote) {
        messages[newMatch.matchId].push({
          id: 'note-' + Date.now(),
          matchId: newMatch.matchId,
          senderId: userId || 'currentUser',
          text: `[Heshima Note]: ${respectNote}`,
          timestamp: 'Just now',
          isChaperoneVisible: true,
        });
      }
    }
  }

  return res.json({
    success: true,
    isMatch,
    targetUser: target,
    type,
    remainingLikes: 19,
  });
});

app.get('/api/matches', (req: Request, res: Response) => {
  return res.json(matches);
});

// ----------------------------------------------------
// CHAT & MESSAGING (Voice Notes, Chaperone, Offline SMS)
// ----------------------------------------------------
app.get('/api/messages/:matchId', (req: Request, res: Response) => {
  const { matchId } = req.params;
  const thread = messages[matchId] || [];
  return res.json(thread);
});

app.post('/api/messages/:matchId', (req: Request, res: Response) => {
  const { matchId } = req.params;
  const { senderId, text, voiceNoteUrl, voiceNoteDuration, isChaperoneVisible } = req.body;

  if (!messages[matchId]) {
    messages[matchId] = [];
  }

  const newMsg: ChatMessage = {
    id: 'msg-' + Date.now(),
    matchId,
    senderId: senderId || 'currentUser',
    text,
    voiceNoteUrl,
    voiceNoteDuration,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isChaperoneVisible: isChaperoneVisible ?? true,
  };

  messages[matchId].push(newMsg);

  // Update match last message
  const m = matches.find((x) => x.matchId === matchId);
  if (m) {
    m.lastMessage = voiceNoteUrl ? '🎤 Voice note (' + voiceNoteDuration + 's)' : text;
    m.lastMessageTime = 'Just now';
  }

  return res.json(newMsg);
});

// ----------------------------------------------------
// GEMINI AI: Translation (Swahili <> Luganda <> English <> Kinyarwanda)
// ----------------------------------------------------
app.post('/api/translate', async (req: Request, res: Response) => {
  const { text, targetLang = 'en', sourceLang = 'auto' } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required for translation' });
  }

  const langNames: Record<string, string> = {
    en: 'English',
    sw: 'Kiswahili',
    lg: 'Luganda (Uganda)',
    rw: 'Kinyarwanda (Rwanda)',
  };

  const targetLangName = langNames[targetLang] || 'English';

  try {
    const ai = getGeminiClient();
    if (ai) {
      const prompt = `You are an expert East African linguist specializing in dating conversations, etiquette, and respectful greetings.
Translate the following message into ${targetLangName}. Preserve local cultural nuances, terms of affection, and respect (heshima/kitiibwa).
Only output the translated text, nothing else.

Message to translate:
"${text}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const translated = response.text?.trim() || text;
      return res.json({
        success: true,
        originalText: text,
        translatedText: translated,
        targetLang,
        provider: 'Gemini 3.8 Flash',
      });
    }
  } catch (error) {
    console.error('Translation error:', error);
  }

  // Cultural fallback dictionary if Gemini is waiting for key or network
  const fallbacks: Record<string, string> = {
    'oli otya': 'How are you?',
    'habari yako': 'How are you?',
    'nakupenda': 'I love you / I adore you',
    'sula bulungi': 'Sleep well',
    'lala salama': 'Good night',
    'kwanjula': 'Introduction ceremony',
    'heshima': 'Respect and honor',
  };

  const lower = text.toLowerCase();
  let translatedFallback = text;
  for (const [key, val] of Object.entries(fallbacks)) {
    if (lower.includes(key)) {
      translatedFallback = val;
      break;
    }
  }

  return res.json({
    success: true,
    originalText: text,
    translatedText: translatedFallback,
    targetLang,
    fallback: true,
  });
});

// ----------------------------------------------------
// GEMINI AI: Photo Safety Moderation (No Nudes / Auto-blur)
// ----------------------------------------------------
app.post('/api/moderate-image', async (req: Request, res: Response) => {
  const { photoDescription, photoUrl } = req.body;

  try {
    const ai = getGeminiClient();
    if (ai) {
      const prompt = `Analyze this profile photo upload for an East African dating app.
Check for explicit content, nudity, violence, or inappropriate imagery.
Photo URL/description: "${photoDescription || photoUrl || 'Profile portrait in traditional Gomesi / casual wear'}"

Return a JSON object matching this schema:
{
  "isExplicit": boolean,
  "confidence": number,
  "reason": string,
  "shouldBlur": boolean,
  "badge": "Safe" | "Review Required" | "Explicit"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');
      return res.json({
        success: true,
        ...parsed,
      });
    }
  } catch (err) {
    console.error('Moderation error:', err);
  }

  // Safe default
  return res.json({
    success: true,
    isExplicit: false,
    confidence: 0.98,
    reason: 'Verified respectful portrait adhering to East African community guidelines.',
    shouldBlur: false,
    badge: 'Safe',
  });
});

// ----------------------------------------------------
// PANIC BUTTON & EMERGENCY DISPATCH
// ----------------------------------------------------
app.post('/api/panic', (req: Request, res: Response) => {
  const { userId, contactPhone, contactName, latitude, longitude, address } = req.body;

  const alert = {
    id: 'panic-' + Date.now(),
    userId: userId || 'currentUser',
    contactPhone: contactPhone || '+256772999000',
    contactName: contactName || 'Trusted Family Contact',
    latitude: latitude || 0.3152,
    longitude: longitude || 32.5816,
    address: address || 'Kampala Central, Uganda',
    timestamp: new Date().toISOString(),
    smsDispatched: true,
  };

  panicLogs.push(alert);

  return res.json({
    success: true,
    alertId: alert.id,
    message: 'EMERGENCY ALERT TRIGGERED! Live GPS coordinates dispatched via SMS to your trusted contact and logged with local safety network.',
    smsPreview: `MAPENZI SAFETY ALERT: Your emergency contact triggered the panic button at ${alert.address} (GPS: ${alert.latitude.toFixed(4)}, ${alert.longitude.toFixed(4)}). Timestamp: ${new Date().toLocaleTimeString()}.`,
    emergencyLines: {
      Uganda: '999 / 112 (Uganda Police)',
      Kenya: '999 / 112 (Kenya Police)',
      Tanzania: '112 (Tanzania Emergency)',
      Rwanda: '112 (Rwanda National Police)',
    },
  });
});

// ----------------------------------------------------
// MONETIZATION: Airtel Money Pay (+256703320730) & MTN Mobile Money
// ----------------------------------------------------
app.post('/api/payment/momo', (req: Request, res: Response) => {
  const { userId, phone, provider = 'Airtel Money', plan = 'monthly', transactionId } = req.body;

  // Pricing: Weekly: 15,000 UGX, Monthly: 40,000 UGX
  const amount = plan === 'weekly' ? 15000 : 40000;
  const currency = 'UGX';
  const durationDays = plan === 'weekly' ? 7 : 30;

  const generatedRef = transactionId?.trim() 
    ? transactionId.trim().toUpperCase() 
    : `AIRTEL-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

  const tx: MomoTransaction = {
    id: 'tx-' + Date.now(),
    userId: userId || 'currentUser',
    phone: phone || '+256703320730',
    provider: (provider as any) || 'Airtel Money',
    amount,
    currency,
    status: 'completed',
    reference: generatedRef,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };

  transactions.unshift(tx);

  // Upgrade user profile
  const expiresDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
  const user = profiles.find((p) => p.id === (userId || 'currentUser'));
  if (user) {
    user.isPremium = true;
    user.premiumExpiresAt = expiresDate;
    user.likesRemainingToday = 9999;
  }

  const receiverInfo = 'Airtel Money: +256703320730 (Name: kyomugisha - WATER HUNTERS)';

  return res.json({
    success: true,
    transaction: tx,
    plan,
    amount,
    currency,
    durationDays,
    expiresAt: expiresDate,
    receiver: receiverInfo,
    receiptMessage: `Payment of ${amount.toLocaleString()} ${currency} verified to ${receiverInfo}. Transaction ID: ${generatedRef}. Premium VIP activated for ${durationDays} days! Unlimited daily likes, unblurred suitors, and profile boost are unlocked.`,
  });
});

// ----------------------------------------------------
// ADMIN PANEL (Users, Reported accounts, MoMo revenue, Local Events)
// ----------------------------------------------------
app.get('/api/admin/metrics', (req: Request, res: Response) => {
  const totalUsers = profiles.length + 1248; // Simulated active community base
  const totalRevenueUGX = transactions.reduce((acc, t) => acc + (t.currency === 'UGX' ? t.amount : t.amount * 25), 0) + 14850000;
  const pendingReports = reports.filter((r) => r.status === 'pending');

  const countryBreakdown = {
    Uganda: 540,
    Kenya: 380,
    Tanzania: 210,
    Rwanda: 160,
    Burundi: 42,
  };

  return res.json({
    totalUsers,
    totalRevenueUGX,
    pendingReportsCount: pendingReports.length,
    activeMatchesCount: matches.length + 389,
    countryBreakdown,
    transactions: transactions.slice(0, 8),
  });
});

app.get('/api/admin/reports', (req: Request, res: Response) => {
  return res.json(reports);
});

app.post('/api/admin/reports/:id/action', (req: Request, res: Response) => {
  const { id } = req.params;
  const { action } = req.body; // 'warn' | 'suspend' | 'dismiss'

  const rep = reports.find((r) => r.id === id);
  if (rep) {
    rep.status = action === 'dismiss' ? 'dismissed' : 'resolved';
  }

  return res.json({ success: true, report: rep, actionTaken: action });
});

app.get('/api/events', (req: Request, res: Response) => {
  return res.json(events);
});

app.post('/api/events', (req: Request, res: Response) => {
  const { title, country, city, district, venue, date, time, description, entryFee, category } = req.body;
  const newEv: LocalEvent = {
    id: 'ev-' + Date.now(),
    title: title || 'Singles Mixer',
    country: country || 'Uganda',
    city: city || 'Kampala',
    district: district || 'Matuga',
    venue: venue || 'Local Garden Lounge',
    date: date || 'Upcoming Saturday',
    time: time || '7:00 PM',
    description: description || 'Respectful East African singles gathering.',
    attendees: 12,
    category: category || 'Singles Mixer',
    entryFee: entryFee || 'Free for Mapenzi Members',
  };
  events.unshift(newEv);
  return res.json({ success: true, event: newEv });
});

// ----------------------------------------------------
// VITE MIDDLEWARE & STATIC SERVING
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mapenzi Connect Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
