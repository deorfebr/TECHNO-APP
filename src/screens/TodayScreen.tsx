import React, { useState } from 'react';
import { Plus, Compass, Sparkles, Layers, SlidersHorizontal } from 'lucide-react';
import { Habit, Preferences, UserProfile } from '../types';
import { formatLocalDateKey, isFutureDate, parseLocalDateKey } from '../utils/dateUtils';
import { calculateDailyProgress } from '../utils/streakUtils';
import { OrbitProgress } from '../components/OrbitProgress';
import { DateRail } from '../components/DateRail';
import { HabitCapsule } from '../components/HabitCapsule';

interface TodayScreenProps {
  habits: Habit[];
  profile: UserProfile;
  preferences: Preferences;
  onToggleComplete: (habitId: string, dateKey: string) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (habit: Habit) => void;
  onOpenDeleteModal: (habit: Habit) => void;
  onOpenIdeasModal: () => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  habits,
  profile,
  preferences,
  onToggleComplete,
  onOpenAddModal,
  onOpenEditModal,
  onOpenDeleteModal,
  onOpenIdeasModal,
}) => {
  const todayKey = formatLocalDateKey(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string>(todayKey);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  const isLocked = isFutureDate(selectedDateKey, todayKey);

  // Available habits for selected date (must have been created on or before selected date)
  const availableHabits = habits.filter((h) => h.createdAt <= selectedDateKey);
  const { completedCount, totalCount, percentage } = calculateDailyProgress(
    habits,
    selectedDateKey
  );

  // Sort habits: incomplete first, then completed
  const sortedHabits = [...availableHabits].sort((a, b) => {
    const aDone = Boolean(a.completionHistory?.[selectedDateKey]);
    const bDone = Boolean(b.completionHistory?.[selectedDateKey]);
    if (aDone === bDone) return 0;
    return aDone ? 1 : -1;
  });

  return (
    <div id="screen-today" className="space-y-4 pb-32 animate-fadeIn">
      {/* 1. COMPACT HORIZONTAL DATE RAIL (Navigation & Day Switching) */}
      <DateRail
        selectedDateKey={selectedDateKey}
        onSelectDate={(key) => {
          setSelectedDateKey(key);
        }}
        habits={habits}
        todayKey={todayKey}
      />

      {/* 2. DOMINANT VISUAL ELEMENT: TODAY'S ORBIT (Prominently near top) */}
      <div
        className="w-full rounded-2xl p-4 sm:p-6 transition-all"
        style={{
          backgroundColor: 'var(--orbit-surface)',
          border: '1px solid var(--orbit-border)',
        }}
      >
        <OrbitProgress
          habits={habits}
          dateKey={selectedDateKey}
          percentage={percentage}
          completedCount={completedCount}
          totalCount={totalCount}
          selectedHabitId={selectedHabitId}
          onSelectHabitId={(id) => setSelectedHabitId(id)}
          onToggleComplete={onToggleComplete}
          onEditHabit={onOpenEditModal}
          onDeleteHabit={onOpenDeleteModal}
          preferences={preferences}
          isLocked={isLocked}
        />
      </div>

      {/* 3. "UP NEXT" COMPACT ORBIT CAPSULES SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span
              className="text-[11px] font-mono font-bold uppercase tracking-widest"
              style={{ color: 'var(--orbit-text-muted)', letterSpacing: '0.14em' }}
            >
              UP NEXT
            </span>

            {totalCount > 0 && (
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold"
                style={{
                  backgroundColor: 'var(--orbit-surface-subtle)',
                  color: 'var(--orbit-text-muted)',
                  border: '1px solid var(--orbit-border)',
                }}
              >
                {sortedHabits.filter((h) => !h.completionHistory?.[selectedDateKey]).length} PENDING
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="launch-habit-today-header-btn"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all active:scale-95 shadow-sm"
              style={{
                backgroundColor: 'var(--orbit-surface-subtle)',
                border: '1px solid var(--orbit-border)',
                color: 'var(--orbit-cyan)',
              }}
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Launch Habit</span>
            </button>
          </div>
        </div>

        {/* Empty State vs Compact Orbit Capsules */}
        {availableHabits.length === 0 ? (
          <div
            id="orbit-empty-state"
            className="rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-center transition-all border border-dashed"
            style={{
              backgroundColor: 'var(--orbit-surface)',
              borderColor: 'var(--orbit-border)',
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform"
              style={{
                backgroundColor: 'var(--orbit-surface-subtle)',
                border: '1px solid var(--orbit-border)',
                color: 'var(--orbit-indigo)',
              }}
            >
              <Sparkles className="w-6 h-6" />
            </div>

            <h3
              className="text-base font-mono font-bold tracking-tight mb-1 uppercase"
              style={{ color: 'var(--orbit-text)' }}
            >
              Orbit Initializing
            </h3>

            <p
              className="text-xs font-medium max-w-xs mx-auto mb-4"
              style={{ color: 'var(--orbit-text-muted)' }}
            >
              No active habits in orbit for this date. Launch your first signal to begin telemetry.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full max-w-xs">
              <button
                id="add-first-habit-button"
                onClick={onOpenAddModal}
                className="w-full h-11 rounded-xl text-xs font-mono font-bold text-white transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--orbit-indigo)',
                }}
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Launch New Habit</span>
              </button>

              <button
                id="explore-ideas-button"
                onClick={onOpenIdeasModal}
                className="w-full h-11 rounded-xl text-xs font-mono font-semibold transition-all active:scale-95 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--orbit-surface-subtle)',
                  border: '1px solid var(--orbit-border)',
                  color: 'var(--orbit-text)',
                }}
              >
                <Compass className="w-4 h-4" />
                <span>Signal Presets</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sortedHabits.map((habit) => (
              <HabitCapsule
                key={habit.id}
                habit={habit}
                dateKey={selectedDateKey}
                preferences={preferences}
                isSelected={selectedHabitId === habit.id}
                onSelect={(h) => setSelectedHabitId(h.id)}
                onToggleComplete={onToggleComplete}
                isLocked={isLocked}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
