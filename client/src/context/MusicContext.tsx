import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from "react";

interface MusicContextType {
  isPlaying: boolean;
  isMuted: boolean;
  hasStarted: boolean;
  play: () => void;
  pause: () => void;
  stop: () => void;
  togglePlayPause: () => void;
  toggleMute: () => void;
  setMusicUrl: (url: string) => void;
  fadeIn: () => void;
  setOnTrackEnd: (callback: (() => void) | null) => void;
}

const MusicContext = createContext<MusicContextType>({
  isPlaying: false,
  isMuted: false,
  hasStarted: false,
  play: () => {},
  pause: () => {},
  stop: () => {},
  togglePlayPause: () => {},
  toggleMute: () => {},
  setMusicUrl: () => {},
  fadeIn: () => {},
  setOnTrackEnd: () => {},
});

export function useMusic() {
  return useContext(MusicContext);
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const wasPlayingRef = useRef(false);
  const resumeTimeoutRef = useRef<number | null>(null);
  const onTrackEndRef = useRef<(() => void) | null>(null);
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("music-muted") === "true";
      } catch {
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    const audio = new Audio();
    audio.loop = false; // Disable loop to allow track end detection
    audio.volume = 0;
    audio.preload = "metadata"; // Changed from 'auto' for large files - loads on demand
    // iOS Safari compatibility
    audio.setAttribute('playsinline', 'true');
    audio.setAttribute('webkit-playsinline', 'true');
    audioRef.current = audio;

    // Debug: Log audio loading progress for large files
    audio.addEventListener('loadstart', () => console.log('[MUSIC] Audio loading started'));
    audio.addEventListener('canplay', () => console.log('[MUSIC] Audio can start playing'));
    audio.addEventListener('error', (e) => console.error('[ERROR] Audio error:', e));

    audio.addEventListener("pause", () => setIsPlaying(false));
    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      if (onTrackEndRef.current) {
        onTrackEndRef.current();
      }
    });

    // Pause music when tab/window loses visibility with safeguards against infinite loops
    const handleVisibilityChange = () => {
      // Check hasStartedRef dynamically instead of closure
      if (!audioRef.current) return;

      if (document.hidden && !audioRef.current.paused) {
        console.log('[MUSIC] Pausing music (tab hidden)');
        wasPlayingRef.current = true;
        audioRef.current.pause();
      } else if (!document.hidden && wasPlayingRef.current) {
        console.log('[MUSIC] Resuming music (tab visible)');
        // Clear any pending resume timeouts
        if (resumeTimeoutRef.current) {
          clearTimeout(resumeTimeoutRef.current);
        }
        // Debounce resume to avoid rapid fire on iPad
        resumeTimeoutRef.current = window.setTimeout(() => {
          if (audioRef.current && wasPlayingRef.current && !document.hidden) {
            audioRef.current.play().catch((e) => console.error('Resume play error:', e));
            wasPlayingRef.current = false;
          }
        }, 300); // 300ms debounce
      }
    };

    const handleBlur = () => {
      if (!audioRef.current || audioRef.current.paused) return;
      console.log('[MUSIC] Pausing music (window blur)');
      wasPlayingRef.current = true;
      audioRef.current.pause();
    };

    const handleFocus = () => {
      if (!audioRef.current || !wasPlayingRef.current) return;
      console.log('[MUSIC] Resuming music (window focus)');

      // Clear any pending resume
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
      // Debounce resume
      resumeTimeoutRef.current = window.setTimeout(() => {
        if (audioRef.current && wasPlayingRef.current) {
          audioRef.current.play().catch((e) => console.error('Focus play error:', e));
          wasPlayingRef.current = false;
        }
      }, 300);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      audio.pause();
      audio.src = "";
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []); // Only run once on mount, use refs for dynamic checks

  const setMusicUrl = useCallback((url: string) => {
    try {
      if (audioRef.current && url && audioRef.current.src !== url) {
        // Validate URL before setting
        if (!url.startsWith('http') && !url.startsWith('data:') && !url.startsWith('blob:') && !url.startsWith('/')) {
          console.warn('[WARN] Invalid music URL format:', url);
          return;
        }
        console.log('[MUSIC] Setting music URL:', url);
        audioRef.current.src = url;
        audioRef.current.load();
      }
    } catch (error) {
      console.error('[ERROR] Error setting music URL:', error);
    }
  }, []);

  const fadeIn = useCallback(() => {
    try {
      const audio = audioRef.current;
      if (!audio || !audio.src || audio.src === window.location.href) {
        console.log('[MUSIC] FadeIn skipped: no audio or src');
        return;
      }

      console.log('[MUSIC] FadeIn starting:', audio.src);
      // Reset state for fresh start
      audio.volume = 0;
      audio.muted = isMuted;
      audio.currentTime = 0;

      // iOS Safari requires play() to be called directly from user interaction
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('[OK] Music playing successfully');
          setIsPlaying(true);
          setHasStarted(true);
          let vol = 0;
          const interval = setInterval(() => {
            if (!audio || audio.paused) {
              clearInterval(interval);
              return;
            }
            vol = Math.min(vol + 0.05, 0.6);
            if (!audio.muted) audio.volume = vol;
            if (vol >= 0.6) clearInterval(interval);
          }, 100);
        }).catch((err) => {
          console.error('[ERROR] Music play failed:', err);
          // Common on mobile without user interaction
        });
      }
    } catch (error) {
      console.error('[ERROR] FadeIn error:', error);
    }
  }, [isMuted]);

  const play = useCallback(() => {
    try {
      const audio = audioRef.current;
      if (!audio || !audio.src || audio.src === window.location.href) {
        console.log('[MUSIC] Play skipped: no audio or src');
        return;
      }
      console.log('[MUSIC] Playing music:', audio.src);
      audio.volume = 0.6;
      audio.play().then(() => {
        console.log('[OK] Music playing successfully');
        setIsPlaying(true);
        setHasStarted(true);
      }).catch((err) => {
        console.error('[ERROR] Play failed:', err);
      });
    } catch (error) {
      console.error('[ERROR] Play error:', error);
    }
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 0;
    setIsPlaying(false);
    setHasStarted(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      console.log('[MUSIC] Toggle: Playing');
      audio.volume = 0.6;
      audio.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch((err) => console.error('[ERROR] Toggle play failed:', err));
    } else {
      console.log('[MUSIC] Toggle: Pausing');
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) audioRef.current.muted = next;
      try {
        localStorage.setItem("music-muted", String(next));
      } catch {
        // Ignore if localStorage is disabled
      }
      return next;
    });
  }, []);

  const setOnTrackEnd = useCallback((callback: (() => void) | null) => {
    onTrackEndRef.current = callback;
  }, []);

  return (
    <MusicContext.Provider value={{ isPlaying, isMuted, hasStarted, play, pause, stop, togglePlayPause, toggleMute, setMusicUrl, fadeIn, setOnTrackEnd }}>
      {children}
    </MusicContext.Provider>
  );
}
