"use client";

import { useTheme, useChain, useThemeStore } from "@/stores";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  const theme = useTheme();
  const chain = useChain();
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const setChain = useThemeStore((state) => state.setChain);

  return (
    <header 
      className="border-b px-4 lg:px-6 py-3 lg:py-4 transition-colors"
      style={{ 
        backgroundColor: 'var(--color-card)', 
        borderColor: 'var(--color-border)' 
      }}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2 lg:space-x-3">
          <img 
            src="https://avatars.githubusercontent.com/u/213843539"
            alt="Barin Logo"
            className="w-8 h-8 rounded"
            style={{ 
              border: '2px solid var(--color-border)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
          <span 
            className="text-xl lg:text-2xl font-bold"
            style={{ color: 'var(--color-foreground)' }}
          >
            Barin
          </span>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Chain selector - Desktop only */}
          <select
            value={chain}
            onChange={(e) => setChain(e.target.value as 'ethereum' | 'polygon' | 'arbitrum' | 'optimism' | 'base')}
            className="hidden lg:block px-3 py-2 rounded-lg border transition-colors"
            style={{
              backgroundColor: 'var(--color-card)',
              color: 'var(--color-foreground)',
              borderColor: 'var(--color-border)',
            }}
          >
            <option value="ethereum">Ethereum</option>
            <option value="polygon">Polygon</option>
            <option value="arbitrum">Arbitrum</option>
            <option value="optimism">Optimism</option>
            <option value="base">Base</option>
          </select>

          {/* Settings icon */}
          <button 
            className="p-2 rounded-lg transition-colors hover:bg-opacity-10"
            style={{ 
              color: 'var(--color-foreground)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-cardHover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* Theme toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors hover:bg-opacity-10"
            style={{ 
              color: 'var(--color-foreground)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-cardHover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Wallet connection */}
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
