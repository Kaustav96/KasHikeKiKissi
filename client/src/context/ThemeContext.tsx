import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type WeddingSide = "groom" | "bride";

interface ThemeContextType {
  side: WeddingSide;
  setSide: (side: WeddingSide) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  side: "groom",
  setSide: () => {},
});

export function useWeddingTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [side, setSideState] = useState<WeddingSide>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("wedding-side") as WeddingSide) || "groom";
    }
    return "groom";
  });

  const setSide = (newSide: WeddingSide) => {
    setSideState(newSide);
    localStorage.setItem("wedding-side", newSide);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-side", side);
  }, [side]);

  return (
    <ThemeContext.Provider value={{ side, setSide }}>
      {children}
    </ThemeContext.Provider>
  );
}
