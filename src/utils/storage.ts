import { Habit, Preferences, ThemeMode, UserProfile } from '../types';

const STORAGE_KEYS = {
  HABITS: 'orbit-habits',
  PROFILE: 'orbit-profile',
  THEME: 'orbit-theme',
  PREFERENCES: 'orbit-preferences',
};

const DEFAULT_PROFILE: UserProfile = {
  displayName: '',
};

const DEFAULT_PREFERENCES: Preferences = {
  showDurations: true,
  showStreaks: true,
};

export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to load habits from localStorage:', err);
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  } catch (err) {
    console.error('Failed to save habits to localStorage:', err);
  }
}

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to load profile from localStorage:', err);
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile to localStorage:', err);
  }
}

export function loadTheme(): ThemeMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.THEME);
    if (raw === 'light' || raw === 'dark' || raw === 'system') {
      return raw;
    }
    return 'dark'; // Dark is Orbit's signature appearance default
  } catch {
    return 'dark';
  }
}

export function saveTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (err) {
    console.error('Failed to save theme to localStorage:', err);
  }
}

export function loadPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to load preferences from localStorage:', err);
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: Preferences): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch (err) {
    console.error('Failed to save preferences to localStorage:', err);
  }
}

export function exportOrbitData(habits: Habit[], profile: UserProfile, preferences: Preferences): void {
  const data = {
    version: 1,
    exportTimestamp: new Date().toISOString(),
    appName: 'Orbit',
    habits,
    profile,
    preferences,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `orbit-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function resetOrbitData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.HABITS);
    // Remove completions if stored separately
    localStorage.removeItem('orbit-completions');
  } catch (err) {
    console.error('Failed to reset Orbit data:', err);
  }
}
