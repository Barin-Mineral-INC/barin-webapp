import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light';
export type Chain = 'ethereum' | 'polygon' | 'arbitrum' | 'optimism' | 'base';

export interface ColorPalette {
  background: string;
  foreground: string;
  card: string;
  cardHover: string;
  border: string;
  muted: string;
  accent: string;
  accentHover: string;
  destructive: string;
  destructiveHover: string;
  success: string;
  warning: string;
  info: string;
}

// Color palettes for different chains
const colorPalettes: Record<Chain, ColorPalette> = {
  ethereum: {
    background: '#0a0a0a',
    foreground: '#ffffff',
    card: '#1a1a1a',
    cardHover: '#2a2a2a',
    border: '#404040',
    muted: '#666666',
    accent: '#627eea',
    accentHover: '#4f67d1',
    destructive: '#ff4444',
    destructiveHover: '#ff6666',
    success: '#00ff88',
    warning: '#ffaa00',
    info: '#00aaff',
  },
  polygon: {
    background: '#0a0a0a',
    foreground: '#ffffff',
    card: '#1a1a1a',
    cardHover: '#2a2a2a',
    border: '#404040',
    muted: '#666666',
    accent: '#8247e5',
    accentHover: '#6b3bb8',
    destructive: '#ff4444',
    destructiveHover: '#ff6666',
    success: '#00ff88',
    warning: '#ffaa00',
    info: '#00aaff',
  },
  arbitrum: {
    background: '#0a0a0a',
    foreground: '#ffffff',
    card: '#1a1a1a',
    cardHover: '#2a2a2a',
    border: '#404040',
    muted: '#666666',
    accent: '#28a0f0',
    accentHover: '#1e8bc4',
    destructive: '#ff4444',
    destructiveHover: '#ff6666',
    success: '#00ff88',
    warning: '#ffaa00',
    info: '#00aaff',
  },
  optimism: {
    background: '#0a0a0a',
    foreground: '#ffffff',
    card: '#1a1a1a',
    cardHover: '#2a2a2a',
    border: '#404040',
    muted: '#666666',
    accent: '#ff0420',
    accentHover: '#e6031c',
    destructive: '#ff4444',
    destructiveHover: '#ff6666',
    success: '#00ff88',
    warning: '#ffaa00',
    info: '#00aaff',
  },
  base: {
    background: '#0a0a0a',
    foreground: '#ffffff',
    card: '#1a1a1a',
    cardHover: '#2a2a2a',
    border: '#404040',
    muted: '#666666',
    accent: '#0052ff',
    accentHover: '#0041cc',
    destructive: '#ff4444',
    destructiveHover: '#ff6666',
    success: '#00ff88',
    warning: '#ffaa00',
    info: '#00aaff',
  },
};

const lightColorPalettes: Record<Chain, ColorPalette> = {
  ethereum: {
    background: '#ffffff',
    foreground: '#000000',
    card: '#f8f9fa',
    cardHover: '#e9ecef',
    border: '#dee2e6',
    muted: '#6c757d',
    accent: '#627eea',
    accentHover: '#4f67d1',
    destructive: '#dc3545',
    destructiveHover: '#c82333',
    success: '#28a745',
    warning: '#ffc107',
    info: '#17a2b8',
  },
  polygon: {
    background: '#ffffff',
    foreground: '#000000',
    card: '#f8f9fa',
    cardHover: '#e9ecef',
    border: '#dee2e6',
    muted: '#6c757d',
    accent: '#8247e5',
    accentHover: '#6b3bb8',
    destructive: '#dc3545',
    destructiveHover: '#c82333',
    success: '#28a745',
    warning: '#ffc107',
    info: '#17a2b8',
  },
  arbitrum: {
    background: '#ffffff',
    foreground: '#000000',
    card: '#f8f9fa',
    cardHover: '#e9ecef',
    border: '#dee2e6',
    muted: '#6c757d',
    accent: '#28a0f0',
    accentHover: '#1e8bc4',
    destructive: '#dc3545',
    destructiveHover: '#c82333',
    success: '#28a745',
    warning: '#ffc107',
    info: '#17a2b8',
  },
  optimism: {
    background: '#ffffff',
    foreground: '#000000',
    card: '#f8f9fa',
    cardHover: '#e9ecef',
    border: '#dee2e6',
    muted: '#6c757d',
    accent: '#ff0420',
    accentHover: '#e6031c',
    destructive: '#dc3545',
    destructiveHover: '#c82333',
    success: '#28a745',
    warning: '#ffc107',
    info: '#17a2b8',
  },
  base: {
    background: '#ffffff',
    foreground: '#000000',
    card: '#f8f9fa',
    cardHover: '#e9ecef',
    border: '#dee2e6',
    muted: '#6c757d',
    accent: '#0052ff',
    accentHover: '#0041cc',
    destructive: '#dc3545',
    destructiveHover: '#c82333',
    success: '#28a745',
    warning: '#ffc107',
    info: '#17a2b8',
  },
};

interface ThemeState {
  theme: Theme;
  chain: Chain;
  colors: ColorPalette;
  mounted: boolean;
  
  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setChain: (chain: Chain) => void;
  setMounted: (mounted: boolean) => void;
  
  // Computed
  isDark: boolean;
  isLight: boolean;
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set, get) => ({
        theme: 'dark',
        chain: 'polygon',
        colors: colorPalettes.polygon,
        mounted: false,

        setTheme: (theme) => {
          const state = get();
          const colors = theme === 'dark' 
            ? colorPalettes[state.chain] 
            : lightColorPalettes[state.chain];
          
          set({ theme, colors });
          
          // Apply theme to document
          if (typeof window !== 'undefined') {
            const root = document.documentElement;
            root.classList.remove('dark', 'light');
            root.classList.add(theme);
            
            // Apply color variables
            Object.entries(colors).forEach(([key, value]) => {
              root.style.setProperty(`--color-${key}`, value);
            });
          }
        },

        toggleTheme: () => {
          const currentTheme = get().theme;
          const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
          get().setTheme(newTheme);
        },

        setChain: (chain) => {
          const state = get();
          const colors = state.theme === 'dark' 
            ? colorPalettes[chain] 
            : lightColorPalettes[chain];
          
          set({ chain, colors });
          
          // Apply chain to document
          if (typeof window !== 'undefined') {
            const root = document.documentElement;
            root.classList.remove('ethereum', 'polygon', 'arbitrum', 'optimism', 'base');
            root.classList.add(chain);
            
            // Apply color variables
            Object.entries(colors).forEach(([key, value]) => {
              root.style.setProperty(`--color-${key}`, value);
            });
          }
        },

        setMounted: (mounted) => {
          set({ mounted });
        },

        get isDark() {
          return get().theme === 'dark';
        },

        get isLight() {
          return get().theme === 'light';
        },
      }),
      {
        name: 'theme-store',
        partialize: (state) => ({
          theme: state.theme,
          chain: state.chain,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Reapply theme and chain on rehydration
            state.setMounted(true);
            state.setTheme(state.theme);
            state.setChain(state.chain);
          }
        },
      }
    ),
    {
      name: 'theme-store',
    }
  )
);

// Selectors for better performance
export const useTheme = () => useThemeStore((state) => state.theme);
export const useChain = () => useThemeStore((state) => state.chain);
export const useColors = () => useThemeStore((state) => state.colors);
export const useIsDark = () => useThemeStore((state) => state.isDark);
export const useIsLight = () => useThemeStore((state) => state.isLight);
export const useMounted = () => useThemeStore((state) => state.mounted);

// Action selectors
export const useSetTheme = () => useThemeStore((state) => state.setTheme);
export const useToggleTheme = () => useThemeStore((state) => state.toggleTheme);
export const useSetChain = () => useThemeStore((state) => state.setChain);
