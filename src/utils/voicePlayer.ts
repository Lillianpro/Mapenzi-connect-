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

  private speakGreeting(transcript?: string, gender?: 'man' | 'woman' | 'other') {
    if (!transcript || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      this.cancelSpeech();
      const utterance = new SpeechSynthesisUtterance(transcript);
      utterance.rate = 0.95;
      utterance.pitch = gender === 'woman' ? 1.2 : 0.95;

      // Select natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith('sw') ||
          v.lang.includes('KE') ||
          v.lang.includes('UG') ||
          v.lang.includes('ZA') ||
          v.lang.includes('GB') ||
          v.lang.includes('en')
      );
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
  }) {
    const { profileId, audioUrl, duration = 12, transcript, gender } = options;

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

    // Also speak native voice greeting
    this.speakGreeting(transcript, gender);

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
