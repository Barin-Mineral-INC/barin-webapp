"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'dark' | 'light';
export type Chain = 'ethereum' | 'polygon' | 'arbitrum' | 'optimism' | 'base';

interface ColorPalette {
  background: string;
  foreground: string;
  card: string;
  cardHover: string;
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  muted: string;
  border: string;
}

const colorPalettes: Record<Chain, ColorPalette> = {
  ethereum: {
    background: '#0a0a0a',
    foreground: '#ffffff',
    card: '#1a1a1a',
    cardHover: '#2a2a2a',
    primary: '#627eea',
    primaryHover: '#4f67d1',
    secondary: '#ffd700',
    accent: '#00ff88',
    success: '#00ff88',
    warning: '#ff8800',
    error: '#ff4444',
    muted: '#666666',
    border: '#333333',
  },
  polygon: {
    background: '#0a0a0a',
    foreground: '#ffffff',
    card: '#1a1a1a',
    cardHover: '#2a2a2a',
    primary: '#8247e5',
    primaryHover: '#6d3bc7',
    secondary: '#ffd700',
    accent: '#00ff88',
    success: '#00ff88',
    warning: '#ff8800',
    error: '#ff4444',
    muted: '#666666',
    border: '#333333',
  },
  arbitrum: {
    background: '#0a0a0a',
    foreground: '#ffffff',
    card: '#1a1a1a',
    cardHover: '#2a2a2a',
    primary: '#28a0f0',
    primaryHover: '#1e8bd6',
    secondary: '#ffd700',
    accent: '#00ff88',
    success: '#00ff88',
    warning: '#ff8800',
    error: '#ff4444',
    muted: '#666666',
    border: '#333333',
  },
  optimism: {
    background: '#0a0a0a',
    foreground: '#ffffff',
    card: '#1a1a1a',
    cardHover: '#2a2a2a',
    primary: '#ff0420',
    primaryHover: '#e6031c',
    secondary: '#ffd700',
    accent: '#00ff88',
    success: '#00ff88',
    warning: '#ff8800',
    error: '#ff4444',
    muted: '#666666',
    border: '#333333',
  },
  base: {
    background: '#0a0a0a',
    foreground: '#ffffff',
    card: '#1a1a1a',
    cardHover: '#2a2a2a',
    primary: '#0052ff',
    primaryHover: '#0041cc',
    secondary: '#ffd700',
    accent: '#00ff88',
    success: '#00ff88',
    warning: '#ff8800',
    error: '#ff4444',
    muted: '#666666',
    border: '#333333',
  },
};

const lightColorPalettes: Record<Chain, ColorPalette> = {
  ethereum: {
    background: '#ffffff',
    foreground: '#0a0a0a',
    card: '#f8f9fa',
    cardHover: '#e9ecef',
    primary: '#627eea',
    primaryHover: '#4f67d1',
    secondary: '#ffd700',
    accent: '#00ff88',
    success: '#00ff88',
    warning: '#ff8800',
    error: '#ff4444',
    muted: '#6c757d',
    border: '#dee2e6',
  },
  polygon: {
    background: '#ffffff',
    foreground: '#0a0a0a',
    card: '#f8f9fa',
    cardHover: '#e9ecef',
    primary: '#8247e5',
    primaryHover: '#6d3bc7',
    secondary: '#ffd700',
    accent: '#00ff88',
    success: '#00ff88',
    warning: '#ff8800',
    error: '#ff4444',
    muted: '#6c757d',
    border: '#dee2e6',
  },
  arbitrum: {
    background: '#ffffff',
    foreground: '#0a0a0a',
    card: '#f8f9fa',
    cardHover: '#e9ecef',
    primary: '#28a0f0',
    primaryHover: '#1e8bd6',
    secondary: '#ffd700',
    accent: '#00ff88',
    success: '#00ff88',
    warning: '#ff8800',
    error: '#ff4444',
    muted: '#6c757d',
    border: '#dee2e6',
  },
  optimism: {
    background: '#ffffff',
    foreground: '#0a0a0a',
    card: '#f8f9fa',
    cardHover: '#e9ecef',
    primary: '#ff0420',
    primaryHover: '#e6031c',
    secondary: '#ffd700',
    accent: '#00ff88',
    success: '#00ff88',
    warning: '#ff8800',
    error: '#ff4444',
    muted: '#6c757d',
    border: '#dee2e6',
  },
  base: {
    background: '#ffffff',
    foreground: '#0a0a0a',
    card: '#f8f9fa',
    cardHover: '#e9ecef',
    primary: '#0052ff',
    primaryHover: '#0041cc',
    secondary: '#ffd700',
    accent: '#00ff88',
    success: '#00ff88',
    warning: '#ff8800',
    error: '#ff4444',
    muted: '#6c757d',
    border: '#dee2e6',
  },
};

interface ThemeContextType {
  theme: Theme;
  chain: Chain;
  colors: ColorPalette;
  toggleTheme: () => void;
  setChain: (chain: Chain) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [chain, setChain] = useState<Chain>('ethereum');
  const [mounted, setMounted] = useState(false);

  const colors = theme === 'dark' ? colorPalettes[chain] : lightColorPalettes[chain];

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply theme classes to document root only after mounting
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    
    // Remove existing theme/chain classes
    root.classList.remove('dark', 'light', 'ethereum', 'polygon', 'arbitrum', 'optimism', 'base');
    
    // Add new theme and chain classes
    root.classList.add(theme, chain);
    
    // Also set CSS variables for dynamic colors
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [theme, chain, colors, mounted]);

  // Don't render children until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme, chain, colors, toggleTheme, setChain }}>
        <div style={{ 
          backgroundColor: '#0a0a0a', 
          color: '#ffffff',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '18px', opacity: 0.7 }}>Loading...</div>
        </div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, chain, colors, toggleTheme, setChain }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
