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
});

export function useMusic() {
  return useContext(MusicContext);
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("music-muted") === "true";
    }
    return false;
  });

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "auto";
    audioRef.current = audio;

    audio.addEventListener("pause", () => setIsPlaying(false));
    audio.addEventListener("play", () => setIsPlaying(true));

    return () => {
      audio.pause();
      audio.src = "";
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
    audio.volume = 0;
    audio.muted = isMuted;
    audio.play().then(() => {
      setIsPlaying(true);
      setHasStarted(true);
      let vol = 0;
      const interval = setInterval(() => {
        vol = Math.min(vol + 0.05, 0.6);
        if (!audio.muted) audio.volume = vol;
        if (vol >= 0.6) clearInterval(interval);
      }, 100);
    }).catch(() => {});
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

  return (
    <MusicContext.Provider value={{ isPlaying, isMuted, hasStarted, play, pause, stop, togglePlayPause, toggleMute, setMusicUrl, fadeIn }}>
      {children}
    </MusicContext.Provider>
  );
}
