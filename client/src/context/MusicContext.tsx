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
  const wasPlayingRef = useRef(false); // Track if music was playing before pause
  const onTrackEndRef = useRef<(() => void) | null>(null);
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("music-muted") === "true";
    }
    return false;
  });

  useEffect(() => {
    const audio = new Audio();
    audio.loop = false; // Disable loop to allow track end detection
    audio.volume = 0;
    audio.preload = "auto";
    // iOS Safari compatibility
    audio.setAttribute('playsinline', 'true');
    audio.setAttribute('webkit-playsinline', 'true');
    audioRef.current = audio;

    audio.addEventListener("pause", () => setIsPlaying(false));
    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      if (onTrackEndRef.current) {
        onTrackEndRef.current();
      }
    });

    // Pause music when tab/window loses focus or visibility
    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current && !audioRef.current.paused) {
        wasPlayingRef.current = true; // Remember we were playing
        audioRef.current.pause();
      } else if (!document.hidden && wasPlayingRef.current && audioRef.current) {
        // Resume when tab becomes visible again
        audioRef.current.play().catch(() => {});
        wasPlayingRef.current = false;
      }
    };

    const handleBlur = () => {
      if (audioRef.current && !audioRef.current.paused) {
        wasPlayingRef.current = true; // Remember we were playing
        audioRef.current.pause();
      }
    };

    const handleFocus = () => {
      if (wasPlayingRef.current && audioRef.current) {
        // Resume when window gets focus back
        audioRef.current.play().catch(() => {});
        wasPlayingRef.current = false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      audio.pause();
      audio.src = "";
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const setMusicUrl = useCallback((url: string) => {
    if (audioRef.current && url && audioRef.current.src !== url) {
      audioRef.current.src = url;
      audioRef.current.load();
    }
  }, []);

  const fadeIn = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src || audio.src === window.location.href) return;

    // Reset state for fresh start
    audio.volume = 0;
    audio.muted = isMuted;
    audio.currentTime = 0;

    // iOS Safari requires play() to be called directly from user interaction
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsPlaying(true);
        setHasStarted(true);
        let vol = 0;
        const interval = setInterval(() => {
          vol = Math.min(vol + 0.05, 0.6);
          if (!audio.muted) audio.volume = vol;
          if (vol >= 0.6) clearInterval(interval);
        }, 100);
      }).catch((error) => {
        console.log('Audio playback failed:', error);
        // On iOS, this might fail if not from direct user interaction
      });
    }
  }, [isMuted]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src || audio.src === window.location.href) return;
    audio.volume = 0.6;
    audio.play().then(() => {
      setIsPlaying(true);
      setHasStarted(true);
    }).catch(() => {});
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
      audio.volume = 0.6;
      audio.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) audioRef.current.muted = next;
      localStorage.setItem("music-muted", String(next));
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
