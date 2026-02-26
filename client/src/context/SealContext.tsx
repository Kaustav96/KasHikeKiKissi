import { createContext, useContext, useState, type ReactNode } from "react";

interface SealContextType {
  sealOpened: boolean;
  setSealOpened: (v: boolean) => void;
}

const SealContext = createContext<SealContextType>({
  sealOpened: false,
  setSealOpened: () => {},
});

export function useSeal() {
  return useContext(SealContext);
}

export function SealProvider({ children }: { children: ReactNode }) {
  const [sealOpened, setSealOpened] = useState(false);

  const handleSetSealOpened = (v: boolean) => {
    setSealOpened(v);
  };

  return (
    <SealContext.Provider value={{ sealOpened, setSealOpened: handleSetSealOpened }}>
      {children}
    </SealContext.Provider>
  );
}
