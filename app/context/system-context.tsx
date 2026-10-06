"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useContent } from "./content-context";
import { SESSION_KEYS, STORAGE_KEYS } from "../lib/constants";
import { readStorage, writeStorage } from "../lib/storage";

export type Appearance = "light" | "dark" | "auto";
export type PowerState = "booting" | "locked" | "on" | "sleeping" | "off";

interface SystemContextValue {
  appearance: Appearance;
  setAppearance: (appearance: Appearance) => void;
  isDark: boolean;
  wallpaper: string;
  setWallpaper: (id: string) => void;
  brightness: number;
  setBrightness: (value: number) => void;
  power: PowerState;
  setPower: (state: PowerState) => void;
}

const SystemContext = createContext<SystemContextValue | null>(null);

const usePrefersDark = () => {
  const [prefersDark, setPrefersDark] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    setPrefersDark(media.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return prefersDark;
};

// Safe to read storage during render: providers mount client-side, after content loads.
const usePersistentState = <T,>(key: string, fallback: T) => {
  const [value, setValue] = useState(() => readStorage(key, fallback));

  const update = useCallback(
    (next: T) => {
      setValue(next);
      writeStorage(key, next);
    },
    [key]
  );

  return [value, update] as const;
};

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { system } = useContent();
  const [appearance, setAppearance] = usePersistentState<Appearance>(
    STORAGE_KEYS.appearance,
    system.defaultAppearance
  );
  const [wallpaper, setWallpaper] = usePersistentState(
    STORAGE_KEYS.wallpaper,
    system.defaultWallpaper
  );
  const [brightness, setBrightness] = usePersistentState(
    STORAGE_KEYS.brightness,
    1
  );
  const [power, setPower] = useState<PowerState>(() =>
    readStorage(SESSION_KEYS.booted, false, "session") ? "on" : "booting"
  );
  const prefersDark = usePrefersDark();

  const isDark = appearance === "auto" ? prefersDark : appearance === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const value = useMemo(
    () => ({
      appearance,
      setAppearance,
      isDark,
      wallpaper,
      setWallpaper,
      brightness,
      setBrightness,
      power,
      setPower,
    }),
    [
      appearance,
      setAppearance,
      isDark,
      wallpaper,
      setWallpaper,
      brightness,
      setBrightness,
      power,
    ]
  );

  return (
    <SystemContext.Provider value={value}>{children}</SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error("useSystem must be used inside SystemProvider");
  return context;
};
