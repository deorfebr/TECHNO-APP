import React from 'react';
import { Check, Flame, Clock } from 'lucide-react';
import { Habit, Preferences } from '../types';
import { CATEGORIES } from '../types';
import { IconRenderer } from './IconRenderer';
import { calculateHabitStreak } from '../utils/streakUtils';

interface HabitCapsuleProps {
  habit: Habit;
  dateKey: string;
  preferences: Preferences;
  isSelected?: boolean;
  onSelect: (habit: Habit) => void;
  onToggleComplete: (habitId: string, dateKey: string) => void;
  isLocked?: boolean;
}

export const HabitCapsule: React.FC<HabitCapsuleProps> = ({
  habit,
  dateKey,
  preferences,
  isSelected = false,
  onSelect,
  onToggleComplete,
  isLocked = false,
}) => {
  const isCompleted = Boolean(habit.completionHistory?.[dateKey]);
  const cat = CATEGORIES[habit.category] || CATEGORIES.Personal;
  const { currentStreak } = calculateHabitStreak(habit, dateKey);

  return (
    <div
      id={`habit-capsule-${habit.id}`}
      onClick={() => onSelect(habit)}
      className={`group relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 active:scale-[0.98] select-none ${
        isSelected
          ? 'ring-2 ring-indigo-500 shadow-md'
          : 'hover:border-slate-500/40'
      }`}
      style={{
        backgroundColor: isSelected
          ? 'var(--orbit-surface-subtle)'
          : 'var(--orbit-surface)',
        border: '1px solid var(--orbit-border)',
      }}
      role="button"
      tabIndex={0}
      aria-label={`${habit.name}: ${isCompleted ? 'Completed' : 'Pending'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(habit);
        }
      }}
    >
      {/* Precision Left Edge Accent (minimal line) */}
      <div
        className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full transition-all"
        style={{
          backgroundColor: cat.color,
          opacity: isCompleted ? 1 : 0.4,
        }}
      />

      {/* Main Metadata row */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1 pl-1">
        {/* Compact Icon */}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: cat.bgTint,
            color: cat.color,
            border: `1px solid ${cat.borderColor}`,
          }}
        >
          <IconRenderer name={habit.icon} className="w-3.5 h-3.5" />
        </div>

        {/* Name and specs */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs font-semibold truncate transition-colors ${
                isCompleted ? 'line-through opacity-60' : ''
              }`}
              style={{ color: 'var(--orbit-text)' }}
            >
              {habit.name}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono mt-0.5" style={{ color: 'var(--orbit-text-muted)' }}>
            <span className="uppercase font-bold" style={{ color: cat.color }}>
              {cat.label}
            </span>

            {preferences.showDurations && habit.duration && (
              <span className="flex items-center gap-0.5 opacity-80">
                <Clock className="w-2.5 h-2.5" />
                {habit.duration}m
              </span>
            )}

            {preferences.showStreaks && currentStreak > 0 && (
              <span className="flex items-center gap-0.5" style={{ color: 'var(--orbit-amber)' }}>
                <Flame className="w-2.5 h-2.5" />
                {currentStreak}d
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Status Toggle Indicator */}
      <div className="flex items-center ml-2 flex-shrink-0">
        <button
          type="button"
          disabled={isLocked}
          onClick={(e) => {
            e.stopPropagation();
            if (!isLocked) {
              onToggleComplete(habit.id, dateKey);
            }
          }}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
            isLocked
              ? 'opacity-30 cursor-not-allowed'
              : isCompleted
              ? 'bg-[#4DD6A8] text-slate-950 shadow-sm'
              : 'hover:border-indigo-400 active:scale-90'
          }`}
          style={{
            border: isCompleted ? 'none' : '1px solid var(--orbit-border)',
            backgroundColor: isCompleted ? 'var(--orbit-mint)' : 'var(--orbit-surface-subtle)',
          }}
          aria-label={`Toggle ${habit.name}`}
          title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
        >
          {isCompleted ? (
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500/50" />
          )}
        </button>
      </div>
    </div>
  );
};
