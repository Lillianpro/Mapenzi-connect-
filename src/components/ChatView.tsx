import React, { useState, useEffect } from 'react';
import { 
  Send, Mic, Volume2, Globe, Shield, Sparkles, WifiOff, PhoneCall, 
  ArrowLeft, Check, CheckCheck, Square, Play, Pause, AlertCircle, MessageSquare
} from 'lucide-react';
import { MatchProfile, ChatMessage, SupportedLanguage, UserProfile } from '../types';
import { UI_TRANSLATIONS } from '../data/mockData';

interface ChatViewProps {
  matches: MatchProfile[];
  currentLang: SupportedLanguage;
  currentUser: UserProfile;
  isLowDataMode: boolean;
  onToggleLowDataMode: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  matches,
  currentLang,
  currentUser,
  isLowDataMode,
  onToggleLowDataMode,
}) => {
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;

  const [activeMatch, setActiveMatch] = useState<MatchProfile | null>(matches[0] || null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [offlineSmsAlert, setOfflineSmsAlert] = useState(true);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // Load messages for active match
  useEffect(() => {
    if (!activeMatch) return;
    fetch(`/api/messages/${activeMatch.matchId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch(() => {
        // Fallback demo message
        setMessages([
          {
            id: 'msg-demo-1',
            matchId: activeMatch.matchId,
            senderId: activeMatch.user.id,
            text: 'Oli otya! Glad we connected on Mapenzi Connect. Let us share our values.',
            timestamp: '10:30 AM',
            isChaperoneVisible: true,
          }
        ]);
      });
  }, [activeMatch]);

  // Voice note timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => (prev >= 15 ? 15 : prev + 1));
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeMatch) return;

    const payload = {
      senderId: 'currentUser',
      text: inputText.trim(),
      isChaperoneVisible: true,
    };

    setInputText('');

    try {
      const res = await fetch(`/api/messages/${activeMatch.matchId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, data]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-' + Date.now(),
          matchId: activeMatch.matchId,
          senderId: 'currentUser',
          text: payload.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isChaperoneVisible: true,
        }
      ]);
    }
  };

  const handleSendVoiceNote = async () => {
    if (!activeMatch) return;
    setIsRecording(false);

    const payload = {
      senderId: 'currentUser',
      voiceNoteUrl: 'voice-note.mp3',
      voiceNoteDuration: recordingSeconds || 8,
      isChaperoneVisible: true,
    };

    try {
      const res = await fetch(`/api/messages/${activeMatch.matchId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, data]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-' + Date.now(),
          matchId: activeMatch.matchId,
          senderId: 'currentUser',
          voiceNoteUrl: 'voice-note.mp3',
          voiceNoteDuration: recordingSeconds || 8,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isChaperoneVisible: true,
        }
      ]);
    }
  };

  const handleTranslateWithAi = async (msgId: string, text: string) => {
    setTranslatingId(msgId);
    try {
      const target = currentLang === 'sw' ? 'en' : 'sw';
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang: target }),
      });
      const data = await res.json();
      setTranslations((prev) => ({
        ...prev,
        [msgId]: data.translatedText || 'Translation completed.',
      }));
    } catch {
      setTranslations((prev) => ({
        ...prev,
        [msgId]: 'Greetings and respect in your honor.',
      }));
    } finally {
      setTranslatingId(null);
    }
  };

  if (matches.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center text-stone-400 space-y-3">
        <div className="w-14 h-14 mx-auto rounded-full bg-stone-900 border border-amber-900/50 flex items-center justify-center text-2xl">
          💬
        </div>
        <h3 className="text-lg font-bold text-white">No Matches Yet</h3>
        <p className="text-xs max-w-xs mx-auto">
          Start swiping or give a <strong>Respect (Heshima)</strong> note to someone in your district to open private conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-[calc(100vh-125px)] flex flex-col pb-16">
      {/* If no active match selected, show match list */}
      {!activeMatch ? (
        <div className="px-4 py-3 space-y-3 overflow-y-auto">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>{t.chat}</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
              {matches.length} Matches
            </span>
          </h2>

          <div className="divide-y divide-stone-800">
            {matches.map((m) => (
              <button
                key={m.matchId}
                id={`match-row-${m.matchId}`}
                onClick={() => setActiveMatch(m)}
                className="w-full flex items-center gap-3 py-3 text-left hover:bg-stone-900/60 transition-colors rounded-xl px-2"
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-amber-600/40">
                  <img
                    src={m.user.photos[0]}
                    alt={m.user.name}
                    className="w-full h-full object-cover"
                  />
                  {m.isRespectMatch && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-stone-900" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white truncate">
                      {m.user.name}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {m.lastMessageTime}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 truncate mt-0.5">
                    {m.lastMessage}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {m.chaperoneActive && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-600/30 flex items-center gap-1 font-semibold">
                        <Shield className="w-2.5 h-2.5" /> Chaperoned
                      </span>
                    )}
                    <span className="text-[10px] text-stone-500">
                      {m.user.city}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Active Chat Conversation
        <div className="flex-1 flex flex-col h-full bg-stone-950">
          {/* Chat Header */}
          <div className="p-3 bg-stone-900 border-b border-amber-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                id="back-to-matches-btn"
                onClick={() => setActiveMatch(null)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-amber-500/50">
                <img
                  src={activeMatch.user.photos[0]}
                  alt={activeMatch.user.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white truncate">
                    {activeMatch.user.name}
                  </h3>
                  {activeMatch.user.isVerified && (
                    <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                </div>
                <div className="text-[11px] text-stone-400 flex items-center gap-1.5 truncate">
                  <span>{activeMatch.user.tribe}</span>
                  <span>•</span>
                  <span>{activeMatch.user.city}</span>
                </div>
              </div>
            </div>

            {/* Offline SMS toggle & Low Data toggle */}
            <div className="flex items-center gap-1.5">
              <button
                id="offline-sms-alert-btn"
                onClick={() => setOfflineSmsAlert(!offlineSmsAlert)}
                title={offlineSmsAlert ? "Offline SMS Alert Active" : "Enable Offline SMS Alert"}
                className={`p-1.5 rounded-lg border text-xs ${
                  offlineSmsAlert
                    ? 'bg-amber-950 text-amber-300 border-amber-500'
                    : 'bg-stone-800 text-stone-400 border-stone-700'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>

              <button
                id="chat-low-data-btn"
                onClick={onToggleLowDataMode}
                title="Toggle 2G Low-Data Mode"
                className={`p-1.5 rounded-lg border text-xs ${
                  isLowDataMode
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                    : 'bg-stone-800 text-stone-400 border-stone-700'
                }`}
              >
                <WifiOff className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chaperone Notice Banner */}
          {activeMatch.chaperoneActive && (
            <div className="px-3 py-1.5 bg-amber-950/60 border-b border-amber-900/30 flex items-center justify-between text-[11px] text-amber-200">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  <strong>Chaperone Mode Active:</strong> {activeMatch.user.chaperone?.name || 'Family guardian'} is attached for respectful transparency.
                </span>
              </div>
            </div>
          )}

          {/* Offline SMS banner when active */}
          {offlineSmsAlert && (
            <div className="px-3 py-1 bg-stone-900 border-b border-stone-800 flex items-center justify-between text-[10px] text-stone-400">
              <span>📲 Offline SMS Relay: Suitor receives SMS summary if 2G/data drops</span>
              <span className="text-emerald-400 font-bold">Enabled</span>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3 space-y-3 overflow-y-auto">
            {messages.map((msg) => {
              const isMe = msg.senderId === 'currentUser';
              const isSystem = msg.senderId === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-stone-900 border border-amber-900/50 text-[11px] text-amber-300">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                      isMe
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-br-sm'
                        : 'bg-stone-900 border border-stone-800 text-stone-200 rounded-bl-sm'
                    }`}
                  >
                    {/* Voice note component */}
                    {msg.voiceNoteUrl ? (
                      <div className="flex items-center gap-2.5 py-1">
                        <button
                          type="button"
                          onClick={() => setPlayingVoiceId(playingVoiceId === msg.id ? null : msg.id)}
                          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 hover:bg-white/30"
                        >
                          {playingVoiceId === msg.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <div>
                          <div className="font-semibold text-xs flex items-center gap-1.5">
                            <Mic className="w-3.5 h-3.5" />
                            <span>Voice Note ({msg.voiceNoteDuration || 12}s)</span>
                          </div>
                          {/* Animated Waveform */}
                          <div className="flex items-center gap-0.5 mt-1 h-3">
                            {[4, 11, 7, 14, 9, 13, 6, 12, 15, 8, 10, 5].map((h, idx) => (
                              <span
                                key={idx}
                                className={`w-0.5 rounded-full ${
                                  playingVoiceId === msg.id ? 'bg-white animate-pulse' : 'bg-white/60'
                                }`}
                                style={{ height: `${h}px` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p>{msg.text}</p>
                    )}

                    {/* AI Translation result pill */}
                    {translations[msg.id] && (
                      <div className="mt-2 pt-2 border-t border-white/20 text-[11px] text-amber-200 bg-black/20 p-1.5 rounded-lg space-y-0.5">
                        <div className="flex items-center gap-1 font-bold text-[10px] text-amber-300">
                          <Sparkles className="w-3 h-3" />
                          Gemini AI Translation:
                        </div>
                        <p className="italic font-medium">"{translations[msg.id]}"</p>
                      </div>
                    )}
                  </div>

                  {/* Metadata line: Timestamp + AI Translate Button */}
                  <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-stone-500">
                    <span>{msg.timestamp}</span>
                    {msg.text && (
                      <button
                        type="button"
                        id={`translate-msg-${msg.id}`}
                        onClick={() => handleTranslateWithAi(msg.id, msg.text || '')}
                        disabled={translatingId === msg.id}
                        className="hover:text-amber-400 flex items-center gap-0.5 font-medium transition-colors"
                      >
                        <Globe className="w-3 h-3 text-amber-400" />
                        <span>{translatingId === msg.id ? 'Translating...' : 'Swahili <> English'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Voice Recording Bar */}
          {isRecording && (
            <div className="p-3 bg-red-950 border-t border-red-800 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-2 text-xs font-bold text-red-200">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <span>Recording East African Voice Note... ({recordingSeconds}s / 15s)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecording(false)}
                  className="text-xs text-stone-400 hover:text-white px-2 py-1"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="send-voice-btn"
                  onClick={handleSendVoiceNote}
                  className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-500"
                >
                  Send Note
                </button>
              </div>
            </div>
          )}

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-2.5 bg-stone-900 border-t border-stone-800 flex items-center gap-2">
            {/* 15s Voice Note record button */}
            <button
              type="button"
              id="record-voice-note-btn"
              onClick={() => {
                if (!isRecording) {
                  setIsRecording(true);
                } else {
                  handleSendVoiceNote();
                }
              }}
              className={`p-2.5 rounded-full transition-colors ${
                isRecording
                  ? 'bg-red-600 text-white animate-bounce'
                  : 'bg-stone-800 text-amber-400 hover:bg-stone-700'
              }`}
              title="Record 15s voice note"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              id="chat-text-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Send respectful message (Oli otya / Habari)..."
              className="flex-1 bg-stone-800 border border-stone-700 focus:border-amber-500 rounded-xl py-2 px-3 text-stone-100 text-xs focus:outline-none placeholder:text-stone-500"
            />

            <button
              id="send-chat-message-btn"
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 hover:brightness-110 text-white transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
