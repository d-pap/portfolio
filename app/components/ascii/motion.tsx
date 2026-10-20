"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const MotionContext = createContext({ paused: true });

export function MotionProvider({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(true);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPaused(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  return <MotionContext.Provider value={{ paused }}>{children}</MotionContext.Provider>;
}

export const useMotion = () => useContext(MotionContext);
