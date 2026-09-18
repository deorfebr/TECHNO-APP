import React from 'react';
import { Settings } from 'lucide-react';
import { NavScreen } from '../types';
import { formatLocalDateKey } from '../utils/dateUtils';

interface HeaderProps {
  currentScreen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate }) => {
  const today = new Date();
  const dateStr = today.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  }).toUpperCase();

  return (
    <header
      id="orbit-header"
      className="sticky top-0 z-30 w-full backdrop-blur-md transition-colors"
      style={{
        backgroundColor: 'var(--orbit-bg)',
        borderBottom: '1px solid var(--orbit-border)',
      }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Left Side: Orbit Logo + System Code */}
        <button
          id="orbit-logo-button"
          onClick={() => onNavigate('today')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg p-1 -ml-1 transition-transform active:scale-95"
          aria-label="Return to Today's Orbit"
        >
          {/* Futuristic Orbit Logo Glyphs */}
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all shadow-sm group-hover:scale-105"
            style={{
              backgroundColor: 'var(--orbit-surface-subtle)',
              border: '1px solid var(--orbit-border)',
            }}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="2.75" fill="var(--orbit-indigo)" />
              <ellipse
                cx="12"
                cy="12"
                rx="8"
                ry="3.8"
                transform="rotate(-28 12 12)"
                stroke="var(--orbit-cyan)"
                strokeWidth="1.4"
                strokeDasharray="1.5 2"
                opacity="0.85"
              />
              <circle cx="18.2" cy="9.4" r="1.6" fill="var(--orbit-mint)" />
            </svg>
          </div>

          <div className="flex items-baseline gap-2">
            <span
              className="font-extrabold tracking-widest text-base sm:text-lg leading-none font-mono"
              style={{ color: 'var(--orbit-text)', letterSpacing: '0.18em' }}
            >
              ORBIT
            </span>
            <span
              className="hidden sm:inline-block text-[10px] font-mono tracking-wider font-semibold opacity-60 uppercase"
              style={{ color: 'var(--orbit-text-muted)' }}
            >
              SYS.01
            </span>
          </div>
        </button>

        {/* Center/Right: Compact Current Date Control + Settings */}
        <div className="flex items-center gap-2.5">
          {/* Compact Current Date Control */}
          <button
            type="button"
            onClick={() => onNavigate('today')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all active:scale-95 hover:border-indigo-400/50"
            style={{
              backgroundColor: 'var(--orbit-surface)',
              border: '1px solid var(--orbit-border)',
              color: 'var(--orbit-text)',
            }}
            title="System date: Today"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-wider">{dateStr}</span>
          </button>

          {/* Settings Button */}
          <button
            id="orbit-settings-button"
            onClick={() => onNavigate('settings')}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
              currentScreen === 'settings'
                ? 'ring-2 ring-indigo-500/50'
                : 'hover:opacity-90'
            }`}
            style={{
              backgroundColor: 'var(--orbit-surface)',
              border: '1px solid var(--orbit-border)',
              color: currentScreen === 'settings' ? 'var(--orbit-indigo)' : 'var(--orbit-text)',
            }}
            aria-label="Open Settings"
          >
            <Settings className="w-4 h-4 transition-transform group-hover:rotate-45" />
          </button>
        </div>
      </div>
    </header>
  );
};
