import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { useColorScheme } from 'react-native';
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type AppSettings, type ThemeMode } from './storage';

interface SettingsContextValue extends AppSettings {
  /** Effective scheme after resolving 'system'. */
  resolvedScheme: 'light' | 'dark';
  isLoaded: boolean;
  setThemeMode: (mode: ThemeMode) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadSettings().then(s => {
      setSettings(s);
      setIsLoaded(true);
    });
  }, []);

  const update = useCallback((patch: Partial<AppSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...patch };
      saveSettings(next).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({
      ...settings,
      isLoaded,
      resolvedScheme:
        settings.themeMode === 'system'
          ? systemScheme === 'dark'
            ? 'dark'
            : 'light'
          : settings.themeMode,
      setThemeMode: mode => update({ themeMode: mode }),
    }),
    [settings, isLoaded, systemScheme, update],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
}
