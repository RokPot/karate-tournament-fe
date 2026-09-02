import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren, type RefObject } from "react";

const LandingScrollContext = createContext<RefObject<HTMLElement | null> | null>(null);

export const LandingScrollProvider = ({ children }: PropsWithChildren) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const [, setIsReady] = useState(false);

  useEffect(() => {
    containerRef.current = document.getElementById("scroll-container");
    setIsReady(true);
  }, []);

  return <LandingScrollContext.Provider value={containerRef}>{children}</LandingScrollContext.Provider>;
};

export const useLandingScrollContainer = () => {
  const containerRef = useContext(LandingScrollContext);

  if (!containerRef) {
    throw new Error("useLandingScrollContainer must be used within LandingScrollProvider");
  }

  return containerRef;
};
