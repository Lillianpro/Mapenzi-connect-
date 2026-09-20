// Audio & Voice Intro Player utility for Mapenzi Connect
// Plays real audio files (.mp3) + synchronized native voice narration & waveforms

export interface VoicePlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progressPercent: number;
  activeProfileId: string | null;
}

type Listener = (state: VoicePlaybackState) => void;

class GlobalVoicePlayer {
  private audio: HTMLAudioElement | null = null;
  private currentProfileId: string | null = null;
  private listeners: Set<Listener> = new Set();
  private animFrameId: number | null = null;
  private speechUtterance: SpeechSynthesisUtterance | null = null;

  public state: VoicePlaybackState = {
    isPlaying: false,
    currentTime: 0,
    duration: 12,
    progressPercent: 0,
    activeProfileId: null,
  };

  constructor() {
    // Client-side initialization
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.setupAudioListeners();
    }
  }

  private setupAudioListeners() {
    if (!this.audio) return;

    this.audio.addEventListener('play', () => {
      this.state.isPlaying = true;
      this.startTracking();
      this.notify();
    });

    this.audio.addEventListener('pause', () => {
      this.state.isPlaying = false;
      this.stopTracking();
      this.notify();
    });

    this.audio.addEventListener('ended', () => {
      this.state.isPlaying = false;
      this.state.currentTime = this.state.duration;
      this.state.progressPercent = 100;
      this.stopTracking();
      this.cancelSpeech();
      this.notify();
    });

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio) {
        this.updateTime(this.audio.currentTime, this.audio.duration || this.state.duration);
      }
    });

    this.audio.addEventListener('loadedmetadata', () => {
      if (this.audio && Number.isFinite(this.audio.duration) && this.audio.duration > 0) {
        this.state.duration = Math.round(this.audio.duration);
        this.notify();
      }
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('Audio playback error, falling back to speech synthesis:', e);
      // If audio file doesn't load or play, the speech narration or visualizer continues
    });
  }

  private updateTime(curr: number, dur: number) {
    const validDur = Number.isFinite(dur) && dur > 0 ? dur : this.state.duration || 12;
    this.state.currentTime = Math.min(curr, validDur);
    this.state.duration = validDur;
    this.state.progressPercent = Math.min(100, Math.max(0, (curr / validDur) * 100));
    this.notify();
  }

  private startTracking() {
    const tick = () => {
      if (!this.state.isPlaying) return;

      if (this.audio && !this.audio.paused) {
        this.updateTime(this.audio.currentTime, this.audio.duration || this.state.duration);
      } else if (this.state.isPlaying) {
        // Fallback progress tick if audio is not moving
        const nextTime = Math.min(this.state.duration, this.state.currentTime + 0.1);
        this.updateTime(nextTime, this.state.duration);
        if (nextTime >= this.state.duration) {
          this.stop();
          return;
        }
      }
      this.animFrameId = requestAnimationFrame(tick);
    };
    this.stopTracking();
    this.animFrameId = requestAnimationFrame(tick);
  }

  private stopTracking() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private cancelSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {
        // benign
      }
    }
  }

  private speakGreeting(options: {
    transcript?: string;
    gender?: 'man' | 'woman' | 'other';
    lang?: string;
    rate?: number;
    pitch?: number;
  }) {
    const { transcript, gender, lang, rate = 0.95, pitch } = options;
    if (!transcript || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      this.cancelSpeech();
      const utterance = new SpeechSynthesisUtterance(transcript);
      utterance.rate = rate;
      utterance.pitch = pitch !== undefined ? pitch : (gender === 'woman' ? 1.15 : 0.95);

      // Select voice based on requested language
      const voices = window.speechSynthesis.getVoices();
      let preferred: SpeechSynthesisVoice | undefined;

      if (lang === 'sw') {
        preferred = voices.find((v) => v.lang.startsWith('sw') || v.lang.includes('KE') || v.lang.includes('TZ'));
      } else if (lang === 'rw' || lang === 'lg') {
        preferred = voices.find((v) => v.lang.includes('UG') || v.lang.includes('RW') || v.lang.includes('ZA') || v.lang.startsWith('sw'));
      }

      if (!preferred) {
        preferred = voices.find(
          (v) =>
            v.lang.includes('KE') ||
            v.lang.includes('UG') ||
            v.lang.includes('ZA') ||
            v.lang.includes('GB') ||
            v.lang.startsWith('en')
        );
      }

      if (preferred) {
        utterance.voice = preferred;
      }

      utterance.onend = () => {
        // Speech ended
      };

      window.speechSynthesis.speak(utterance);
      this.speechUtterance = utterance;
    } catch (err) {
      console.warn('SpeechSynthesis error:', err);
    }
  }

  public play(options: {
    profileId: string;
    audioUrl?: string;
    duration?: number;
    transcript?: string;
    gender?: 'man' | 'woman' | 'other';
    lang?: string;
    rate?: number;
    pitch?: number;
  }) {
    const { profileId, audioUrl, duration = 12, transcript, gender, lang, rate, pitch } = options;

    // If same profile is playing, pause it
    if (this.currentProfileId === profileId && this.state.isPlaying) {
      this.pause();
      return;
    }

    // Stop current
    this.stop();

    this.currentProfileId = profileId;
    this.state.activeProfileId = profileId;
    this.state.duration = duration;
    this.state.currentTime = 0;
    this.state.progressPercent = 0;
    this.state.isPlaying = true;

    // Play real audio file if provided
    if (this.audio) {
      const srcToPlay = audioUrl || `/audio/intro-${profileId}.mp3`;
      if (this.audio.src !== srcToPlay) {
        this.audio.src = srcToPlay;
        this.audio.load();
      }

      this.audio.currentTime = 0;
      this.audio.volume = 0.85;

      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Audio autoplay prevented or missing, using speech narration:', err);
          // Auto play was prevented or failed - we continue with timer & speech narration
        });
      }
    }

    // Also speak native/translated voice greeting
    this.speakGreeting({ transcript, gender, lang, rate, pitch });

    this.startTracking();
    this.notify();
  }

  public pause() {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
    this.cancelSpeech();
    this.state.isPlaying = false;
    this.stopTracking();
    this.notify();
  }

  public stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.cancelSpeech();
    this.state.isPlaying = false;
    this.state.currentTime = 0;
    this.state.progressPercent = 0;
    this.state.activeProfileId = null;
    this.currentProfileId = null;
    this.stopTracking();
    this.notify();
  }

  public seek(seconds: number) {
    if (this.audio && Number.isFinite(seconds)) {
      this.audio.currentTime = Math.max(0, Math.min(seconds, this.state.duration));
      this.updateTime(this.audio.currentTime, this.state.duration);
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const snap = { ...this.state };
    this.listeners.forEach((l) => l(snap));
  }
}

export const globalVoicePlayer = new GlobalVoicePlayer();

/**
 * Generates a lightweight, valid 16-bit mono PCM WAV audio Data URI
 * producing warm, gentle harmonic voice-simulated audio tones
 */
export function generatePlayableWavDataUrl(durationSeconds: number = 8, baseFreq: number = 220): string {
  const sampleRate = 16000;
  const numSamples = Math.floor(sampleRate * Math.max(2, Math.min(durationSeconds, 20)));
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // Helper to write ASCII strings into DataView
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // RIFF identifier
  writeString(0, 'RIFF');
  // RIFF chunk length
  view.setUint32(4, 36 + numSamples * 2, true);
  // RIFF type
  writeString(8, 'WAVE');
  // format chunk identifier
  writeString(12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (raw PCM)
  view.setUint16(20, 1, true);
  // channel count (1 = mono)
  view.setUint16(22, 1, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sampleRate * 2 bytes)
  view.setUint32(28, sampleRate * 2, true);
  // block align
  view.setUint16(32, 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  writeString(36, 'data');
  // data chunk length
  view.setUint32(40, numSamples * 2, true);

  // Write PCM samples: Harmonic gentle voice carrier with natural cadence envelope
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Cadence amplitude envelope: rises gently, subtle rhythmic breaths
    const envelope = Math.min(1, t * 4) * Math.min(1, (durationSeconds - t) * 4) * (0.7 + 0.3 * Math.sin(2 * Math.PI * 1.8 * t));
    // Soft harmonic overtone resembling human vocal warmth
    const fund = Math.sin(2 * Math.PI * baseFreq * t);
    const harmonic1 = 0.4 * Math.sin(2 * Math.PI * (baseFreq * 2) * t);
    const harmonic2 = 0.2 * Math.sin(2 * Math.PI * (baseFreq * 3) * t);
    const sample = Math.max(-1, Math.min(1, (fund + harmonic1 + harmonic2) * 0.35 * envelope));
    view.setInt16(44 + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }

  // Convert buffer to base64
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:audio/wav;base64,${btoa(binary)}`;
}
