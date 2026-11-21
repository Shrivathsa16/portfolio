import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type ThemeName = 'dark' | 'light';

export const THEMES: Record<ThemeName, {
  bg: string;
  text: string;
  accent: string;
  accentSoft: string;
  panelBg: string;
  fog: string;
  floor: string;
}> = {
  dark: {
    bg: '#0f0d0d',
    text: '#f5f0ef',
    accent: '#ff3b47',
    accentSoft: 'rgba(255, 59, 71, 0.18)',
    panelBg: 'rgba(20, 16, 16, 0.86)',
    fog: '#0f0d0d',
    floor: '#1a1515',
  },
  light: {
    bg: '#faf7f5',
    text: '#161010',
    accent: '#d7192a',
    accentSoft: 'rgba(215, 25, 42, 0.12)',
    panelBg: 'rgba(255, 253, 252, 0.9)',
    fog: '#faf7f5',
    floor: '#e9e2df',
  },
};

const STORAGE_KEY = 'portfolio-theme';

interface ThemeContextValue {
  theme: ThemeName;
  toggleTheme: () => void;
  colors: typeof THEMES.dark;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): ThemeName {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(getInitialTheme);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: THEMES[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
