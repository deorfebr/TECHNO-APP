import React from 'react';
import { Check, Edit2, Flame, Trash2 } from 'lucide-react';
import { Habit, Preferences } from '../types';
import { CATEGORIES } from '../types';
import { IconRenderer } from './IconRenderer';
import { calculateHabitStreak } from '../utils/streakUtils';
import { formatLocalDateKey } from '../utils/dateUtils';

interface HabitCardProps {
  habit: Habit;
  dateKey?: string;
  preferences?: Preferences;
  onToggleComplete: (habitId: string, dateKey: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
  isLocked?: boolean; // For future dates in history
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  dateKey = formatLocalDateKey(),
  preferences = { showDurations: true, showStreaks: true },
  onToggleComplete,
  onEdit,
  onDelete,
  isLocked = false,
}) => {
  const isCompleted = Boolean(habit.completionHistory?.[dateKey]);
  const categoryDef = CATEGORIES[habit.category] || CATEGORIES.Personal;
  const { currentStreak } = calculateHabitStreak(habit, dateKey);

  return (
    <div
      id={`habit-card-${habit.id}`}
      className={`group relative rounded-2xl p-4 transition-all duration-200 flex items-center justify-between gap-3 ${
        isCompleted ? 'shadow-sm' : 'hover:border-slate-500/40'
      }`}
      style={{
        backgroundColor: isCompleted ? 'var(--orbit-surface-subtle)' : 'var(--orbit-surface)',
        border: isCompleted
          ? `1px solid ${categoryDef.borderColor}`
          : '1px solid var(--orbit-border)',
      }}
    >
      {/* Left Accent Stripe Indicator */}
      <div
        className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full transition-opacity"
        style={{
          backgroundColor: categoryDef.color,
          opacity: isCompleted ? 1 : 0.4,
        }}
      />

      {/* Main Content Area */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1 pl-1.5">
        {/* Habit Icon Container */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
          style={{
            backgroundColor: categoryDef.bgTint,
            color: categoryDef.color,
            border: `1px solid ${categoryDef.borderColor}`,
          }}
        >
          <IconRenderer name={habit.icon} className="w-5 h-5" />
        </div>

        {/* Text & Meta Information */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3
              className={`font-semibold text-base tracking-tight truncate transition-colors ${
                isCompleted ? 'opacity-90' : ''
              }`}
              style={{ color: 'var(--orbit-text)' }}
            >
              {habit.name}
            </h3>
          </div>

          {/* Subtitle / Category & Duration */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-0.5 text-xs font-medium">
            <span
              className="tracking-wider uppercase text-[10px] font-bold"
              style={{ color: categoryDef.color }}
            >
              {categoryDef.label}
            </span>

            {preferences.showDurations && habit.duration && (
              <>
                <span className="opacity-40" style={{ color: 'var(--orbit-text-muted)' }}>
                  ·
                </span>
                <span className="text-[11px] font-mono" style={{ color: 'var(--orbit-text-muted)' }}>
                  {habit.duration} MIN
                </span>
              </>
            )}

            {preferences.showStreaks && (
              <>
                <span className="opacity-40" style={{ color: 'var(--orbit-text-muted)' }}>
                  ·
                </span>
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-medium"
                  style={{
                    color: currentStreak > 0 ? 'var(--orbit-amber)' : 'var(--orbit-text-muted)',
                  }}
                >
                  <Flame className="w-3 h-3" />
                  {currentStreak} {currentStreak === 1 ? 'day' : 'days'} streak
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Side: Quick Action buttons & Completion Checkbox */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Edit Button */}
        <button
          id={`edit-habit-${habit.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(habit);
          }}
          className="w-8 h-8 rounded-lg flex items-center justify-center opacity-60 hover:opacity-100 hover:bg-slate-500/15 transition-all text-xs focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400"
          style={{ color: 'var(--orbit-text-muted)' }}
          title="Edit Habit"
          aria-label={`Edit ${habit.name}`}
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        {/* Delete Button */}
        <button
          id={`delete-habit-${habit.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(habit);
          }}
          className="w-8 h-8 rounded-lg flex items-center justify-center opacity-60 hover:opacity-100 hover:bg-rose-500/15 hover:text-rose-400 transition-all text-xs focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-400"
          style={{ color: 'var(--orbit-text-muted)' }}
          title="Delete Habit"
          aria-label={`Delete ${habit.name}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Completion Control Button */}
        <button
          id={`toggle-habit-${habit.id}`}
          onClick={() => {
            if (!isLocked) {
              onToggleComplete(habit.id, dateKey);
            }
          }}
          disabled={isLocked}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            isLocked
              ? 'opacity-40 cursor-not-allowed'
              : isCompleted
              ? 'shadow-md scale-100'
              : 'hover:border-indigo-400 active:scale-90'
          }`}
          style={{
            backgroundColor: isCompleted ? 'var(--orbit-mint)' : 'var(--orbit-surface-subtle)',
            border: isCompleted ? 'none' : '1.5px solid var(--orbit-border)',
            color: isCompleted ? '#0B1020' : 'transparent',
          }}
          title={
            isLocked
              ? 'Future date locked'
              : isCompleted
              ? 'Mark incomplete'
              : 'Mark complete'
          }
          aria-label={`Mark ${habit.name} as ${isCompleted ? 'incomplete' : 'complete'}`}
        >
          {isCompleted ? (
            <Check className="w-5 h-5 stroke-[2.5]" />
          ) : (
            <div className="w-3 h-3 rounded-full border border-slate-500/50" />
          )}
        </button>
      </div>
    </div>
  );
};
