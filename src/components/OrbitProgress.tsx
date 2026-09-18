import React, { useEffect, useState } from 'react';
import { Check, Flame, Clock, Edit2, Trash2, Crosshair, Sparkles } from 'lucide-react';
import { Habit, Preferences } from '../types';
import { CATEGORIES } from '../types';
import { calculateHabitStreak } from '../utils/streakUtils';
import { IconRenderer } from './IconRenderer';

interface OrbitProgressProps {
  habits: Habit[];
  dateKey: string;
  percentage: number;
  completedCount: number;
  totalCount: number;
  selectedHabitId: string | null;
  onSelectHabitId: (habitId: string) => void;
  onToggleComplete: (habitId: string, dateKey: string) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habit: Habit) => void;
  preferences: Preferences;
  isLocked?: boolean;
}

export const OrbitProgress: React.FC<OrbitProgressProps> = ({
  habits,
  dateKey,
  percentage,
  completedCount,
  totalCount,
  selectedHabitId,
  onSelectHabitId,
  onToggleComplete,
  onEditHabit,
  onDeleteHabit,
  preferences,
  isLocked = false,
}) => {
  const [celebrateComplete, setCelebrateComplete] = useState(false);

  // Subtle celebration when 100% is reached
  useEffect(() => {
    if (percentage === 100 && totalCount > 0) {
      setCelebrateComplete(true);
      const timer = setTimeout(() => setCelebrateComplete(false), 1600);
      return () => clearTimeout(timer);
    } else {
      setCelebrateComplete(false);
    }
  }, [percentage, totalCount]);

  // Orbit visualization metrics
  const size = 260;
  const center = size / 2;
  const orbitRadius = 96;
  const circumference = 2 * Math.PI * orbitRadius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Filter habits available on selected date
  const availableHabits = habits.filter((h) => h.createdAt <= dateKey);

  // Limit visual nodes to 12 max to prevent crowding
  const maxNodes = 12;
  const displayHabits = availableHabits.slice(0, maxNodes);

  // Currently selected habit for the detail panel
  const activeHabit =
    availableHabits.find((h) => h.id === selectedHabitId) ||
    availableHabits.find((h) => !h.completionHistory?.[dateKey]) ||
    availableHabits[0] ||
    null;

  const isHabitCompleted = activeHabit ? Boolean(activeHabit.completionHistory?.[dateKey]) : false;
  const activeCategory = activeHabit ? (CATEGORIES[activeHabit.category] || CATEGORIES.Personal) : null;
  const activeStreak = activeHabit ? calculateHabitStreak(activeHabit, dateKey).currentStreak : 0;

  return (
    <div
      id="mission-orbit-stage"
      className="w-full flex flex-col items-center justify-center transition-all duration-300"
    >
      {/* Visual Header telemetry label */}
      <div className="w-full flex items-center justify-between px-1 mb-1 text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span
            className="font-bold uppercase tracking-widest"
            style={{ color: 'var(--orbit-text-muted)', letterSpacing: '0.14em' }}
          >
            TODAY'S ORBIT
          </span>
        </div>

        <span
          className="font-semibold uppercase tracking-wider"
          style={{
            color:
              percentage === 100
                ? 'var(--orbit-mint)'
                : percentage >= 50
                ? 'var(--orbit-cyan)'
                : 'var(--orbit-text-muted)',
          }}
        >
          {percentage === 100 ? 'ORBIT SYNCHRONIZED' : `${completedCount}/${totalCount} SIGNALS`}
        </span>
      </div>

      {/* Orbit Visualization Ring Stage */}
      <div className="relative my-2 flex items-center justify-center select-none">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
          aria-label={`Orbital telemetry: ${percentage}% momentum`}
          role="img"
        >
          <defs>
            <linearGradient id="missionOrbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--orbit-indigo)" />
              <stop offset="60%" stopColor="var(--orbit-cyan)" />
              <stop offset="100%" stopColor="var(--orbit-mint)" />
            </linearGradient>

            <filter id="telemetryGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Inner concentric telemetry guide ring */}
          <circle
            cx={center}
            cy={center}
            r={orbitRadius - 28}
            fill="none"
            stroke="var(--orbit-border)"
            strokeWidth="1"
            strokeDasharray="2 4"
            opacity="0.35"
          />

          {/* Outer concentric telemetry guide ring */}
          <circle
            cx={center}
            cy={center}
            r={orbitRadius + 22}
            fill="none"
            stroke="var(--orbit-border)"
            strokeWidth="1"
            strokeDasharray="3 5"
            opacity="0.25"
          />

          {/* Precision Cardinal Crosshair Ticks */}
          {[0, 90, 180, 270].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = center + (orbitRadius - 8) * Math.cos(rad);
            const y1 = center + (orbitRadius - 8) * Math.sin(rad);
            const x2 = center + (orbitRadius + 8) * Math.cos(rad);
            const y2 = center + (orbitRadius + 8) * Math.sin(rad);
            return (
              <line
                key={deg}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="var(--orbit-border)"
                strokeWidth="1.5"
                opacity="0.4"
              />
            );
          })}

          {/* Base Orbit Track */}
          <circle
            cx={center}
            cy={center}
            r={orbitRadius}
            fill="none"
            stroke="var(--orbit-surface-subtle)"
            strokeWidth="4"
            opacity="0.8"
          />

          {/* Active Progress Arc */}
          {totalCount > 0 && percentage > 0 && (
            <circle
              cx={center}
              cy={center}
              r={orbitRadius}
              fill="none"
              stroke="url(#missionOrbitGradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${center} ${center})`}
              className="transition-all duration-700 ease-out"
              style={{
                filter:
                  percentage === 100
                    ? 'drop-shadow(0 0 10px rgba(77,214,168,0.6))'
                    : 'drop-shadow(0 0 6px rgba(124,131,255,0.4))',
              }}
            />
          )}

          {/* Interactive Orbit Nodes */}
          {displayHabits.map((habit, index) => {
            const angle = (index / displayHabits.length) * 2 * Math.PI - Math.PI / 2;
            const nodeX = center + orbitRadius * Math.cos(angle);
            const nodeY = center + orbitRadius * Math.sin(angle);
            const isCompleted = Boolean(habit.completionHistory?.[dateKey]);
            const isSelected = activeHabit?.id === habit.id;
            const catDef = CATEGORIES[habit.category] || CATEGORIES.Personal;

            return (
              <g
                key={habit.id}
                id={`orbit-node-${habit.id}`}
                className="cursor-pointer transition-all focus:outline-none"
                onClick={() => onSelectHabitId(habit.id)}
                role="button"
                tabIndex={0}
                aria-label={`${habit.name}: ${isCompleted ? 'Completed' : 'Incomplete'}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectHabitId(habit.id);
                  }
                }}
              >
                {/* Target / Selected Reticle Indicator */}
                {isSelected && (
                  <circle
                    cx={nodeX}
                    cy={nodeY}
                    r={16}
                    fill="none"
                    stroke={catDef.color}
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    className="animate-spin"
                    style={{ animationDuration: '6s' }}
                  />
                )}

                {/* Node Outer Halo */}
                {isCompleted && (
                  <circle
                    cx={nodeX}
                    cy={nodeY}
                    r={12}
                    fill={catDef.color}
                    opacity="0.25"
                  />
                )}

                {/* Main Node Body */}
                <circle
                  cx={nodeX}
                  cy={nodeY}
                  r={isCompleted ? 8.5 : 7}
                  fill={isCompleted ? catDef.color : 'var(--orbit-surface)'}
                  stroke={isSelected ? '#FFFFFF' : isCompleted ? '#FFFFFF' : catDef.color}
                  strokeWidth={isSelected ? 2 : 1.75}
                  className="transition-all duration-200"
                  style={{
                    filter: isCompleted
                      ? 'drop-shadow(0 0 5px rgba(77,214,168,0.7))'
                      : 'none',
                  }}
                />

                {/* Incomplete node center dot */}
                {!isCompleted && (
                  <circle
                    cx={nodeX}
                    cy={nodeY}
                    r={2}
                    fill={catDef.color}
                    opacity="0.8"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Central Display: Percentage + Completed/Total + MOMENTUM */}
        <div
          className={`absolute flex flex-col items-center justify-center text-center pointer-events-none transition-transform duration-500 ${
            celebrateComplete ? 'scale-110' : 'scale-100'
          }`}
          style={{ width: 140, height: 140 }}
        >
          {totalCount === 0 ? (
            <div className="flex flex-col items-center">
              <span
                className="text-3xl font-black tracking-tight font-mono"
                style={{ color: 'var(--orbit-text)' }}
              >
                0%
              </span>
              <span
                className="text-[11px] font-mono tracking-wider mt-1"
                style={{ color: 'var(--orbit-text-muted)' }}
              >
                0 / 0
              </span>
              <span
                className="text-[10px] font-bold tracking-widest uppercase mt-0.5"
                style={{ color: 'var(--orbit-text-muted)', letterSpacing: '0.14em' }}
              >
                MOMENTUM
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span
                className="text-4xl font-black tracking-tight font-mono leading-none"
                style={{
                  color: percentage === 100 ? 'var(--orbit-mint)' : 'var(--orbit-text)',
                  textShadow:
                    percentage === 100 ? '0 0 16px rgba(77, 214, 168, 0.45)' : 'none',
                }}
              >
                {percentage}%
              </span>

              <span
                className="text-xs font-mono font-semibold tracking-wide mt-1.5"
                style={{ color: 'var(--orbit-text)' }}
              >
                {completedCount} / {totalCount}
              </span>

              <span
                className="text-[10px] font-mono font-extrabold uppercase tracking-widest mt-1"
                style={{
                  color:
                    percentage === 100
                      ? 'var(--orbit-mint)'
                      : percentage >= 50
                      ? 'var(--orbit-cyan)'
                      : 'var(--orbit-text-muted)',
                  letterSpacing: '0.16em',
                }}
              >
                MOMENTUM
              </span>
            </div>
          )}
        </div>
      </div>

      {/* COMPACT HABIT-DETAIL PANEL BENEATH ORBIT (Interactive node target inspection) */}
      {activeHabit ? (
        <div
          id="orbit-telemetry-detail"
          className="w-full mt-3 rounded-2xl p-4 transition-all duration-200"
          style={{
            backgroundColor: 'var(--orbit-surface)',
            border: '1px solid var(--orbit-border)',
          }}
        >
          {/* Header Row: Category · Duration & Streak & Quick Actions */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span
                className="font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: activeCategory?.bgTint,
                  color: activeCategory?.color,
                  border: `1px solid ${activeCategory?.borderColor}`,
                }}
              >
                {activeCategory?.label}
              </span>

              {preferences.showDurations && activeHabit.duration && (
                <span className="flex items-center gap-1 font-semibold" style={{ color: 'var(--orbit-text-muted)' }}>
                  <Clock className="w-3 h-3" />
                  {activeHabit.duration}m
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {preferences.showStreaks && (
                <div
                  className="flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md mr-1"
                  style={{
                    backgroundColor: 'var(--orbit-surface-subtle)',
                    color: activeStreak > 0 ? 'var(--orbit-amber)' : 'var(--orbit-text-muted)',
                  }}
                >
                  <Flame className="w-3 h-3" />
                  <span>{activeStreak} {activeStreak === 1 ? 'day' : 'days'}</span>
                </div>
              )}

              {/* Quick Edit button */}
              <button
                type="button"
                id="orbit-detail-edit-button"
                onClick={() => onEditHabit(activeHabit)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all opacity-60 hover:opacity-100 hover:bg-slate-500/10"
                style={{ color: 'var(--orbit-text-muted)' }}
                title="Edit Habit"
                aria-label={`Edit ${activeHabit.name}`}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              {/* Quick Delete button */}
              <button
                type="button"
                id="orbit-detail-delete-button"
                onClick={() => onDeleteHabit(activeHabit)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all opacity-60 hover:opacity-100 hover:bg-rose-500/10 hover:text-rose-400"
                style={{ color: 'var(--orbit-text-muted)' }}
                title="Delete Habit"
                aria-label={`Delete ${activeHabit.name}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Habit Name Title */}
          <div className="flex items-center gap-2.5 my-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: activeCategory?.bgTint,
                color: activeCategory?.color,
                border: `1px solid ${activeCategory?.borderColor}`,
              }}
            >
              <IconRenderer name={activeHabit.icon} className="w-4 h-4" />
            </div>

            <h3
              className="text-base sm:text-lg font-black tracking-tight truncate flex-1 uppercase"
              style={{ color: 'var(--orbit-text)' }}
            >
              {activeHabit.name}
            </h3>
          </div>

          {/* Primary Action Button: [ Mark Complete ] or [ Completed ] */}
          <div className="mt-3">
            <button
              type="button"
              id="orbit-detail-toggle-button"
              disabled={isLocked}
              onClick={() => {
                if (!isLocked) {
                  onToggleComplete(activeHabit.id, dateKey);
                }
              }}
              className={`w-full h-11 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] ${
                isLocked
                  ? 'opacity-40 cursor-not-allowed border border-dashed border-slate-600'
                  : isHabitCompleted
                  ? 'shadow-md text-slate-950 font-black'
                  : 'hover:border-indigo-400'
              }`}
              style={{
                backgroundColor: isLocked
                  ? 'transparent'
                  : isHabitCompleted
                  ? 'var(--orbit-mint)'
                  : 'var(--orbit-surface-subtle)',
                color: isLocked
                  ? 'var(--orbit-text-muted)'
                  : isHabitCompleted
                  ? '#0B1020'
                  : 'var(--orbit-cyan)',
                border: isHabitCompleted ? 'none' : '1px solid var(--orbit-border)',
              }}
            >
              {isLocked ? (
                <span>TELEMETRY LOCKED · FUTURE DATE</span>
              ) : isHabitCompleted ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>COMPLETED · TAP TO UNCOMPLETE</span>
                </>
              ) : (
                <>
                  <Crosshair className="w-4 h-4" />
                  <span>MARK COMPLETE</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
