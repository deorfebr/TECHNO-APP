import React, { useState, useEffect, useCallback } from 'react';
import {
  Habit,
  HabitCategory,
  NavScreen,
  Preferences,
  ThemeMode,
  UserProfile,
} from './types';
import {
  loadHabits,
  saveHabits,
  loadProfile,
  saveProfile,
  loadTheme,
  saveTheme,
  loadPreferences,
  savePreferences,
  resetOrbitData,
} from './utils/storage';
import { formatLocalDateKey } from './utils/dateUtils';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { AddEditHabitModal } from './components/AddEditHabitModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { HabitIdeasModal, HabitSuggestion } from './components/HabitIdeasModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { TodayScreen } from './screens/TodayScreen';
import { InsightsScreen } from './screens/InsightsScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { SettingsScreen } from './screens/SettingsScreen';

export default function App() {
  // 1. Persistent state from LocalStorage
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile());
  const [theme, setTheme] = useState<ThemeMode>(() => loadTheme());
  const [preferences, setPreferences] = useState<Preferences>(() => loadPreferences());

  // 2. Navigation State
  const [currentScreen, setCurrentScreen] = useState<NavScreen>('today');
  const [previousScreen, setPreviousScreen] = useState<NavScreen>('today');

  // 3. Modals & UI State
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);
  const [isIdeasOpen, setIsIdeasOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show toast utility
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    const timer = setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  // 4. Apply Theme (Light, Dark, System)
  useEffect(() => {
    const root = document.documentElement;

    const applyThemeClass = () => {
      if (theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.remove('light', 'dark');
        root.classList.add(systemPrefersDark ? 'dark' : 'light');
      } else {
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
      }
    };

    applyThemeClass();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyThemeClass();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  // Persist habits whenever updated
  const updateHabits = (newHabits: Habit[]) => {
    setHabits(newHabits);
    saveHabits(newHabits);
  };

  // Toggle habit completion on a specific local date
  const handleToggleComplete = (habitId: string, dateKey: string) => {
    const updated = habits.map((h) => {
      if (h.id === habitId) {
        const currentVal = Boolean(h.completionHistory?.[dateKey]);
        const newHistory = { ...h.completionHistory, [dateKey]: !currentVal };
        return {
          ...h,
          completionHistory: newHistory,
        };
      }
      return h;
    });

    updateHabits(updated);
  };

  // Open modal for Adding a new habit
  const handleOpenAddModal = () => {
    setEditingHabit(null);
    setIsAddEditOpen(true);
  };

  // Open modal for Editing an existing habit
  const handleOpenEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setIsAddEditOpen(true);
  };

  // Save changes from Add/Edit modal
  const handleSaveHabit = (data: {
    name: string;
    category: HabitCategory;
    icon: string;
    duration?: number;
  }) => {
    if (editingHabit) {
      // Edit existing habit: preserves ID, creation date, and completion history
      const updated = habits.map((h) => {
        if (h.id === editingHabit.id) {
          return {
            ...h,
            name: data.name,
            category: data.category,
            icon: data.icon,
            duration: data.duration,
          };
        }
        return h;
      });
      updateHabits(updated);
      showToast('Habit updated.');
    } else {
      // Add brand new habit
      const newHabit: Habit = {
        id: `orbit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: data.name,
        category: data.category,
        icon: data.icon,
        duration: data.duration,
        createdAt: formatLocalDateKey(new Date()),
        completionHistory: {},
      };
      updateHabits([...habits, newHabit]);
      showToast('Added to Orbit.');
    }
    setEditingHabit(null);
  };

  // Delete Habit confirmation
  const handleOpenDeleteModal = (habit: Habit) => {
    setDeletingHabit(habit);
  };

  const handleConfirmDelete = () => {
    if (!deletingHabit) return;
    const updated = habits.filter((h) => h.id !== deletingHabit.id);
    updateHabits(updated);
    setDeletingHabit(null);
    showToast('Habit removed.');
  };

  // Select a suggestion idea
  const handleSelectIdea = (suggestion: HabitSuggestion) => {
    setIsIdeasOpen(false);
    // Open Add Habit modal with prefilled data
    setEditingHabit({
      id: '', // temporary flag
      name: suggestion.name,
      category: suggestion.category,
      icon: suggestion.icon,
      duration: suggestion.duration,
      createdAt: formatLocalDateKey(new Date()),
      completionHistory: {},
    });
    setIsAddEditOpen(true);
  };

  // Reset Orbit
  const handleConfirmReset = () => {
    resetOrbitData();
    setHabits([]);
    setIsResetConfirmOpen(false);
    setCurrentScreen('today');
    showToast('Orbit reset to fresh state.');
  };

  // Screen Navigation handling
  const handleNavigate = (screen: NavScreen) => {
    if (screen === 'settings' && currentScreen !== 'settings') {
      setPreviousScreen(currentScreen);
    }
    setCurrentScreen(screen);
  };

  const handleBackFromSettings = () => {
    setCurrentScreen(previousScreen || 'today');
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Global Orbit Header */}
      <Header currentScreen={currentScreen} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 pt-6">
        {currentScreen === 'today' && (
          <TodayScreen
            habits={habits}
            profile={profile}
            preferences={preferences}
            onToggleComplete={handleToggleComplete}
            onOpenAddModal={handleOpenAddModal}
            onOpenEditModal={handleOpenEditModal}
            onOpenDeleteModal={handleOpenDeleteModal}
            onOpenIdeasModal={() => setIsIdeasOpen(true)}
          />
        )}

        {currentScreen === 'insights' && <InsightsScreen habits={habits} />}

        {currentScreen === 'history' && (
          <HistoryScreen
            habits={habits}
            preferences={preferences}
            onToggleComplete={handleToggleComplete}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            onBack={handleBackFromSettings}
            profile={profile}
            onUpdateProfile={(p) => {
              setProfile(p);
              saveProfile(p);
            }}
            theme={theme}
            onUpdateTheme={(t) => {
              setTheme(t);
              saveTheme(t);
            }}
            preferences={preferences}
            onUpdatePreferences={(pref) => {
              setPreferences(pref);
              savePreferences(pref);
            }}
            habits={habits}
            onTriggerResetOrbit={() => setIsResetConfirmOpen(true)}
          />
        )}
      </main>

      {/* Persistent Floating Command Dock (Hidden when on Settings screen) */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onLaunchHabit={handleOpenAddModal}
      />

      {/* Modals & Feedback Notifications */}
      <AddEditHabitModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleSaveHabit}
        initialHabit={editingHabit && editingHabit.id ? editingHabit : null}
        existingHabits={habits}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingHabit)}
        habit={deletingHabit}
        onClose={() => setDeletingHabit(null)}
        onConfirm={handleConfirmDelete}
      />

      <HabitIdeasModal
        isOpen={isIdeasOpen}
        onClose={() => setIsIdeasOpen(false)}
        onSelectSuggestion={handleSelectIdea}
      />

      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
      />

      <Toast message={toastMessage} />
    </div>
  );
}
