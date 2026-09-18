import React, { useState } from 'react';
import {
  ChevronDown,
  ArrowLeft,
  User,
  Palette,
  Sliders,
  Database,
  Info,
  Download,
  RotateCcw,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { Habit, Preferences, ThemeMode, UserProfile } from '../types';
import { exportOrbitData } from '../utils/storage';

interface SettingsScreenProps {
  onBack: () => void;
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  theme: ThemeMode;
  onUpdateTheme: (theme: ThemeMode) => void;
  preferences: Preferences;
  onUpdatePreferences: (preferences: Preferences) => void;
  habits: Habit[];
  onTriggerResetOrbit: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  profile,
  onUpdateProfile,
  theme,
  onUpdateTheme,
  preferences,
  onUpdatePreferences,
  habits,
  onTriggerResetOrbit,
}) => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const toggleGroup = (groupId: string) => {
    setOpenGroup((current) => (current === groupId ? null : groupId));
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateProfile({ ...profile, displayName: e.target.value });
  };

  const handleExport = () => {
    exportOrbitData(habits, profile, preferences);
  };

  return (
    <div id="screen-settings" className="space-y-5 pb-32 animate-fadeIn">
      {/* Settings Top Header */}
      <div className="flex items-center gap-3 px-1">
        <button
          id="settings-back-button"
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 hover:opacity-90"
          style={{
            backgroundColor: 'var(--orbit-surface)',
            border: '1px solid var(--orbit-border)',
            color: 'var(--orbit-text)',
          }}
          aria-label="Back to Orbit"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1
            className="text-2xl sm:text-3xl font-black font-mono tracking-tight uppercase"
            style={{ color: 'var(--orbit-text)' }}
          >
            SETTINGS
          </h1>
          <p className="text-xs font-mono tracking-wide" style={{ color: 'var(--orbit-text-muted)' }}>
            System configuration & telemetry parameters
          </p>
        </div>
      </div>

      {/* Accordion Groups Container */}
      <div className="space-y-2.5 font-mono">
        {/* Group 1: 01 IDENTITY */}
        <div
          className="rounded-2xl overflow-hidden transition-all"
          style={{
            backgroundColor: 'var(--orbit-surface)',
            border: '1px solid var(--orbit-border)',
          }}
        >
          <button
            type="button"
            onClick={() => toggleGroup('profile')}
            className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors hover:bg-slate-500/5 focus:outline-none"
            aria-expanded={openGroup === 'profile'}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400">
                01
              </span>
              <span className="font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--orbit-text)' }}>
                IDENTITY
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openGroup === 'profile' ? 'rotate-180' : ''
              }`}
              style={{ color: 'var(--orbit-text-muted)' }}
            />
          </button>

          {openGroup === 'profile' && (
            <div
              className="px-5 pb-5 pt-1 space-y-3 border-t animate-fadeIn"
              style={{ borderColor: 'var(--orbit-border)' }}
            >
              <div>
                <label
                  htmlFor="display-name-input"
                  className="block text-xs font-mono font-bold uppercase tracking-wider mb-2"
                  style={{ color: 'var(--orbit-text-muted)' }}
                >
                  Callsign / Display Name
                </label>
                <input
                  id="display-name-input"
                  type="text"
                  value={profile.displayName}
                  onChange={handleDisplayNameChange}
                  placeholder="e.g. Commander, Pathfinder"
                  className="w-full h-11 px-4 rounded-xl text-sm font-sans transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{
                    backgroundColor: 'var(--orbit-surface-subtle)',
                    border: '1px solid var(--orbit-border)',
                    color: 'var(--orbit-text)',
                  }}
                />
                <p className="text-[11px] mt-1.5" style={{ color: 'var(--orbit-text-muted)' }}>
                  Assigned operator callsign for daily system telemetry.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Group 2: 02 APPEARANCE */}
        <div
          className="rounded-2xl overflow-hidden transition-all"
          style={{
            backgroundColor: 'var(--orbit-surface)',
            border: '1px solid var(--orbit-border)',
          }}
        >
          <button
            type="button"
            onClick={() => toggleGroup('appearance')}
            className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors hover:bg-slate-500/5 focus:outline-none"
            aria-expanded={openGroup === 'appearance'}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400">
                02
              </span>
              <span className="font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--orbit-text)' }}>
                APPEARANCE
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openGroup === 'appearance' ? 'rotate-180' : ''
              }`}
              style={{ color: 'var(--orbit-text-muted)' }}
            />
          </button>

          {openGroup === 'appearance' && (
            <div
              className="px-5 pb-5 pt-1 space-y-3 border-t animate-fadeIn"
              style={{ borderColor: 'var(--orbit-border)' }}
            >
              <p className="text-xs" style={{ color: 'var(--orbit-text-muted)' }}>
                Select display matrix profile. Deep space dark is Orbit's signature theme.
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { mode: 'dark' as ThemeMode, label: 'DARK', icon: Moon },
                  { mode: 'light' as ThemeMode, label: 'LIGHT', icon: Sun },
                  { mode: 'system' as ThemeMode, label: 'SYSTEM', icon: Laptop },
                ].map((item) => {
                  const isSelected = theme === item.mode;
                  const IconComp = item.icon;

                  return (
                    <button
                      key={item.mode}
                      type="button"
                      onClick={() => onUpdateTheme(item.mode)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all active:scale-95 ${
                        isSelected
                          ? 'ring-2 ring-indigo-500 font-bold'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? 'var(--orbit-surface-subtle)'
                          : 'transparent',
                        border: '1px solid var(--orbit-border)',
                        color: isSelected ? 'var(--orbit-indigo)' : 'var(--orbit-text)',
                      }}
                    >
                      <IconComp className="w-4 h-4 mb-1.5" />
                      <span className="text-xs font-mono">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Group 3: 03 TELEMETRY PREFERENCES */}
        <div
          className="rounded-2xl overflow-hidden transition-all"
          style={{
            backgroundColor: 'var(--orbit-surface)',
            border: '1px solid var(--orbit-border)',
          }}
        >
          <button
            type="button"
            onClick={() => toggleGroup('preferences')}
            className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors hover:bg-slate-500/5 focus:outline-none"
            aria-expanded={openGroup === 'preferences'}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-400">
                03
              </span>
              <span className="font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--orbit-text)' }}>
                TELEMETRY PREFERENCES
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openGroup === 'preferences' ? 'rotate-180' : ''
              }`}
              style={{ color: 'var(--orbit-text-muted)' }}
            />
          </button>

          {openGroup === 'preferences' && (
            <div
              className="px-5 pb-5 pt-1 space-y-4 border-t animate-fadeIn"
              style={{ borderColor: 'var(--orbit-border)' }}
            >
              {/* Show Durations */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <span className="text-xs font-mono font-bold block uppercase" style={{ color: 'var(--orbit-text)' }}>
                    Show Durations
                  </span>
                  <span className="text-[11px]" style={{ color: 'var(--orbit-text-muted)' }}>
                    Display duration metrics on habit capsules
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdatePreferences({
                      ...preferences,
                      showDurations: !preferences.showDurations,
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    preferences.showDurations ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                  aria-pressed={preferences.showDurations}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                      preferences.showDurations ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Show Streaks */}
              <div className="flex items-center justify-between py-1 border-t" style={{ borderColor: 'var(--orbit-border)' }}>
                <div>
                  <span className="text-xs font-mono font-bold block uppercase" style={{ color: 'var(--orbit-text)' }}>
                    Show Streaks
                  </span>
                  <span className="text-[11px]" style={{ color: 'var(--orbit-text-muted)' }}>
                    Display consecutive day velocity counters
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdatePreferences({
                      ...preferences,
                      showStreaks: !preferences.showStreaks,
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    preferences.showStreaks ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                  aria-pressed={preferences.showStreaks}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                      preferences.showStreaks ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Group 4: 04 DATA SYSTEM */}
        <div
          className="rounded-2xl overflow-hidden transition-all"
          style={{
            backgroundColor: 'var(--orbit-surface)',
            border: '1px solid var(--orbit-border)',
          }}
        >
          <button
            type="button"
            onClick={() => toggleGroup('data')}
            className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors hover:bg-slate-500/5 focus:outline-none"
            aria-expanded={openGroup === 'data'}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
                04
              </span>
              <span className="font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--orbit-text)' }}>
                DATA SYSTEM
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openGroup === 'data' ? 'rotate-180' : ''
              }`}
              style={{ color: 'var(--orbit-text-muted)' }}
            />
          </button>

          {openGroup === 'data' && (
            <div
              className="px-5 pb-5 pt-1 space-y-3 border-t animate-fadeIn"
              style={{ borderColor: 'var(--orbit-border)' }}
            >
              <p className="text-xs" style={{ color: 'var(--orbit-text-muted)' }}>
                All orbital trajectories and completion records persist strictly within local client storage.
              </p>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleExport}
                  className="w-full h-11 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
                  style={{
                    backgroundColor: 'var(--orbit-surface-subtle)',
                    border: '1px solid var(--orbit-border)',
                    color: 'var(--orbit-text)',
                  }}
                >
                  <Download className="w-4 h-4" />
                  <span>Export Telemetry Backup (JSON)</span>
                </button>

                <button
                  type="button"
                  id="reset-orbit-button"
                  onClick={onTriggerResetOrbit}
                  className="w-full h-11 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 text-rose-400 hover:bg-rose-500/10 border border-rose-500/20"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Purge Orbit Telemetry (Reset)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Group 5: 05 ABOUT ORBIT */}
        <div
          className="rounded-2xl overflow-hidden transition-all"
          style={{
            backgroundColor: 'var(--orbit-surface)',
            border: '1px solid var(--orbit-border)',
          }}
        >
          <button
            type="button"
            onClick={() => toggleGroup('about')}
            className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors hover:bg-slate-500/5 focus:outline-none"
            aria-expanded={openGroup === 'about'}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-500/15 text-slate-400">
                05
              </span>
              <span className="font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--orbit-text)' }}>
                ABOUT ORBIT
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openGroup === 'about' ? 'rotate-180' : ''
              }`}
              style={{ color: 'var(--orbit-text-muted)' }}
            />
          </button>

          {openGroup === 'about' && (
            <div
              className="px-5 pb-5 pt-3 space-y-2 border-t text-xs leading-relaxed animate-fadeIn"
              style={{ borderColor: 'var(--orbit-border)' }}
            >
              <div className="flex items-center gap-2 font-mono">
                <span className="font-black tracking-widest text-base" style={{ color: 'var(--orbit-text)' }}>
                  ORBIT
                </span>
                <span className="font-semibold" style={{ color: 'var(--orbit-cyan)' }}>
                  · KEEP MOVING.
                </span>
              </div>
              <p style={{ color: 'var(--orbit-text-muted)' }}>
                Mission Control for Daily Habits. Habits represent active objects in the user's daily orbit. Completed signals sustain angular momentum and accelerate daily trajectory.
              </p>
              <div className="pt-2 text-[10px] font-mono" style={{ color: 'var(--orbit-text-muted)' }}>
                BUILD RELEASE 2.0 · PRECISION MISSION-CONTROL ARCHITECTURE
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
