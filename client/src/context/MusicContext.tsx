import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from "react";

interface MusicContextType {
  isPlaying: boolean;
  isMuted: boolean;
  play: () => void;
  pause: () => void;
  toggleMute: () => void;
  setMusicUrl: (url: string) => void;
  fadeIn: () => void;
}

const MusicContext = createContext<MusicContextType>({
  isPlaying: false,
  isMuted: false,
  play: () => {},
  pause: () => {},
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
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const setMusicUrl = useCallback((url: string) => {
    if (audioRef.current && url) {
      audioRef.current.src = url;
      audioRef.current.load();
    }
  }, []);

  const fadeIn = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    audio.volume = 0;
    audio.muted = isMuted;
    audio.play().then(() => {
      setIsPlaying(true);
      let vol = 0;
      const interval = setInterval(() => {
        vol = Math.min(vol + 0.05, 1);
        audio.volume = vol;
        if (vol >= 1) clearInterval(interval);
      }, 100);
    }).catch(() => {});
  }, [isMuted]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    audio.play().then(() => setIsPlaying(true)).catch(() => {});
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
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
    <MusicContext.Provider value={{ isPlaying, isMuted, play, pause, toggleMute, setMusicUrl, fadeIn }}>
      {children}
    </MusicContext.Provider>
  );
}
