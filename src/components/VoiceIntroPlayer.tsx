import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Radio } from 'lucide-react';
import { UserProfile } from '../types';
import { globalVoicePlayer, VoicePlaybackState } from '../utils/voicePlayer';

interface VoiceIntroPlayerProps {
  profile: UserProfile;
  variant?: 'compact' | 'expanded' | 'card';
  className?: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export const VoiceIntroPlayer: React.FC<VoiceIntroPlayerProps> = ({
  profile,
  variant = 'compact',
  className = '',
  onPlayStateChange,
}) => {
  const [playbackState, setPlaybackState] = useState<VoicePlaybackState>(globalVoicePlayer.state);

  useEffect(() => {
    const unsubscribe = globalVoicePlayer.subscribe((state) => {
      setPlaybackState(state);
      if (state.activeProfileId === profile.id) {
        onPlayStateChange?.(state.isPlaying);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [profile.id, onPlayStateChange]);

  const isCurrentActive = playbackState.activeProfileId === profile.id;
  const isPlaying = isCurrentActive && playbackState.isPlaying;
  const currentDuration = profile.voiceIntroDuration || playbackState.duration || 12;
  const currentTime = isCurrentActive ? playbackState.currentTime : 0;
  const progressPercent = isCurrentActive ? playbackState.progressPercent : 0;

  const handleTogglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isPlaying) {
      globalVoicePlayer.pause();
    } else {
      globalVoicePlayer.play({
        profileId: profile.id,
        audioUrl: profile.voiceIntroUrl,
        duration: currentDuration,
        transcript: profile.voiceIntroTranscript || profile.bio,
        gender: profile.gender,
      });
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSeconds = ratio * currentDuration;

    if (!isCurrentActive) {
      globalVoicePlayer.play({
        profileId: profile.id,
        audioUrl: profile.voiceIntroUrl,
        duration: currentDuration,
        transcript: profile.voiceIntroTranscript || profile.bio,
        gender: profile.gender,
      });
    }
    globalVoicePlayer.seek(targetSeconds);
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    globalVoicePlayer.play({
      profileId: profile.id,
      audioUrl: profile.voiceIntroUrl,
      duration: currentDuration,
      transcript: profile.voiceIntroTranscript || profile.bio,
      gender: profile.gender,
    });
  };

  // Format seconds to mm:ss or 0:ss
  const formatTime = (secs: number) => {
    const s = Math.floor(secs);
    const m = Math.floor(s / 60);
    const remainder = s % 60;
    return `${m}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  // Waveform bars template
  const barHeights = [4, 9, 14, 8, 16, 11, 6, 13, 17, 9, 12, 5];

  // 1. COMPACT PILL VARIANT (Ideal for overlay on photo in Discover or Likes card)
  if (variant === 'compact') {
    return (
      <div className={`pointer-events-auto inline-flex items-center ${className}`}>
        <button
          type="button"
          id={`play-voice-btn-${profile.id}`}
          onClick={handleTogglePlay}
          className={`group flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-bold transition-all shadow-xl ${
            isPlaying
              ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white border-amber-300 ring-2 ring-amber-400/60 scale-105 animate-pulse'
              : 'bg-stone-900/90 text-amber-300 border-amber-600/50 hover:bg-stone-850 hover:border-amber-400'
          }`}
          title={isPlaying ? 'Pause Voice Intro' : 'Play 15s Voice Intro'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-white text-white shrink-0" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
          )}

          <span className="truncate max-w-[120px] sm:max-w-none">
            {isPlaying
              ? `${formatTime(currentTime)} / ${formatTime(currentDuration)}`
              : `15s Voice Intro`}
          </span>

          {/* Animated dynamic waveform */}
          <span className="flex items-center gap-0.5 h-3.5 pl-0.5">
            {barHeights.slice(0, 7).map((baseH, i) => {
              const activeHeight = isPlaying
                ? Math.max(3, (baseH * ((i + Math.floor(currentTime * 4)) % 5 + 2)) / 3)
                : baseH;
              return (
                <span
                  key={i}
                  className={`w-0.5 rounded-full transition-all duration-150 ${
                    isPlaying ? 'bg-white' : 'bg-amber-400/80'
                  }`}
                  style={{ height: `${Math.min(15, activeHeight)}px` }}
                />
              );
            })}
          </span>
        </button>
      </div>
    );
  }

  // 2. EXPANDED / CARD VARIANT (For full bio modal, profile view, or suitor modal)
  return (
    <div
      className={`p-4 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 border border-amber-500/40 shadow-xl text-stone-100 space-y-3 ${className}`}
    >
      {/* Header with audio badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce text-amber-300' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-white tracking-wide uppercase">
                Authentic Voice Intro
              </h4>
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                15s Max
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Spoken greeting in {profile.primaryLanguage || 'East African Native Tongue'}
            </p>
          </div>
        </div>

        {isCurrentActive && (
          <button
            onClick={handleReplay}
            title="Replay from start"
            className="p-1.5 rounded-lg text-stone-400 hover:text-amber-300 hover:bg-stone-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Transcript speech quote */}
      {profile.voiceIntroTranscript && (
        <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 text-xs italic text-amber-200/90 leading-relaxed relative">
          <span className="text-amber-500 font-serif text-lg leading-none absolute top-1.5 left-2">“</span>
          <p className="pl-3.5 pr-1">
            {profile.voiceIntroTranscript}
          </p>
        </div>
      )}

      {/* Interactive Waveform Scrubber */}
      <div className="space-y-1.5">
        <div
          onClick={handleSeek}
          className="relative h-8 bg-stone-950/90 rounded-xl px-2.5 flex items-center gap-1 cursor-pointer overflow-hidden border border-stone-800 group hover:border-amber-500/50 transition-colors"
          title="Click to seek audio"
        >
          {/* Progress bar overlay */}
          <div
            className="absolute left-0 top-0 bottom-0 bg-amber-600/20 transition-all pointer-events-none"
            style={{ width: `${progressPercent}%` }}
          />

          {/* Waveform bars */}
          {barHeights.map((h, i) => {
            const barProgress = (i / barHeights.length) * 100;
            const isPassed = progressPercent >= barProgress;
            const dynamicHeight = isPlaying
              ? Math.max(4, Math.min(22, h * (1 + 0.3 * Math.sin(currentTime * 8 + i))))
              : h;

            return (
              <div
                key={i}
                className="flex-1 flex items-center justify-center h-full pointer-events-none z-10"
              >
                <div
                  className={`w-1 rounded-full transition-all duration-100 ${
                    isPassed
                      ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                      : isPlaying
                      ? 'bg-stone-600 group-hover:bg-stone-500'
                      : 'bg-stone-700'
                  }`}
                  style={{ height: `${dynamicHeight}px` }}
                />
              </div>
            );
          })}
        </div>

        {/* Playback Controls & Time */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              id={`expanded-play-btn-${profile.id}`}
              onClick={handleTogglePlay}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:brightness-110 text-white font-bold text-xs shadow-md transition-transform active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-white" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{currentTime > 0 ? 'Resume' : 'Play Voice'}</span>
                </>
              )}
            </button>

            {isPlaying && (
              <span className="flex items-center gap-1 text-[11px] text-amber-300 animate-pulse font-medium">
                <Radio className="w-3 h-3" />
                Listening
              </span>
            )}
          </div>

          <div className="font-mono text-stone-300 font-semibold text-xs">
            <span className="text-amber-400">{formatTime(currentTime)}</span> /{' '}
            <span>{formatTime(currentDuration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
