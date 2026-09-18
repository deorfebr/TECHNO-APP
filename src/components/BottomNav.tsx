import React from 'react';
import { CircleDot, Activity, CalendarDays, Plus } from 'lucide-react';
import { NavScreen } from '../types';

interface BottomNavProps {
  currentScreen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
  onLaunchHabit: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  onLaunchHabit,
}) => {
  // Settings is a dedicated screen and bottom nav is hidden on Settings
  if (currentScreen === 'settings') {
    return null;
  }

  return (
    <div
      id="orbit-command-dock-wrapper"
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4 pointer-events-none"
    >
      <nav
        id="orbit-floating-command-dock"
        className="pointer-events-auto rounded-2xl sm:rounded-full px-3 py-2 flex items-center justify-between transition-all backdrop-blur-xl shadow-2xl"
        style={{
          backgroundColor: 'var(--orbit-surface)',
          border: '1px solid var(--orbit-border)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
        }}
        aria-label="Floating Command Dock"
      >
        {/* Destination: Today */}
        <button
          id="dock-nav-today"
          onClick={() => onNavigate('today')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all duration-200 active:scale-95 focus:outline-none ${
            currentScreen === 'today' ? 'font-bold' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: currentScreen === 'today' ? 'var(--orbit-indigo)' : 'var(--orbit-text-muted)',
          }}
          aria-current={currentScreen === 'today' ? 'page' : undefined}
        >
          <div
            className={`w-9 h-7 rounded-lg flex items-center justify-center transition-all ${
              currentScreen === 'today' ? 'bg-indigo-500/15' : ''
            }`}
          >
            <CircleDot
              className={`w-4 h-4 transition-transform ${
                currentScreen === 'today' ? 'scale-110' : ''
              }`}
            />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider mt-0.5">
            Today
          </span>
        </button>

        {/* Destination: Insights */}
        <button
          id="dock-nav-insights"
          onClick={() => onNavigate('insights')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all duration-200 active:scale-95 focus:outline-none ${
            currentScreen === 'insights' ? 'font-bold' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: currentScreen === 'insights' ? 'var(--orbit-indigo)' : 'var(--orbit-text-muted)',
          }}
          aria-current={currentScreen === 'insights' ? 'page' : undefined}
        >
          <div
            className={`w-9 h-7 rounded-lg flex items-center justify-center transition-all ${
              currentScreen === 'insights' ? 'bg-indigo-500/15' : ''
            }`}
          >
            <Activity
              className={`w-4 h-4 transition-transform ${
                currentScreen === 'insights' ? 'scale-110' : ''
              }`}
            />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider mt-0.5">
            Insights
          </span>
        </button>

        {/* Elevated Center Action: Launch Habit [ + ] */}
        <div className="relative flex items-center justify-center px-1">
          <button
            id="dock-launch-habit-button"
            onClick={onLaunchHabit}
            className="w-12 h-12 -mt-5 rounded-2xl flex items-center justify-center text-white transition-transform active:scale-90 hover:scale-105 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 group"
            style={{
              background: 'linear-gradient(135deg, var(--orbit-indigo) 0%, var(--orbit-cyan) 100%)',
              boxShadow: '0 4px 18px rgba(99, 102, 241, 0.45)',
              border: '2px solid var(--orbit-surface)',
            }}
            title="Launch Habit"
            aria-label="Launch Habit"
          >
            <Plus className="w-6 h-6 stroke-[2.5] transition-transform group-hover:rotate-90 duration-300" />
          </button>
        </div>

        {/* Destination: History */}
        <button
          id="dock-nav-history"
          onClick={() => onNavigate('history')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all duration-200 active:scale-95 focus:outline-none ${
            currentScreen === 'history' ? 'font-bold' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: currentScreen === 'history' ? 'var(--orbit-indigo)' : 'var(--orbit-text-muted)',
          }}
          aria-current={currentScreen === 'history' ? 'page' : undefined}
        >
          <div
            className={`w-9 h-7 rounded-lg flex items-center justify-center transition-all ${
              currentScreen === 'history' ? 'bg-indigo-500/15' : ''
            }`}
          >
            <CalendarDays
              className={`w-4 h-4 transition-transform ${
                currentScreen === 'history' ? 'scale-110' : ''
              }`}
            />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider mt-0.5">
            History
          </span>
        </button>
      </nav>
    </div>
  );
};
