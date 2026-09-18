import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, Check } from 'lucide-react';
import { Habit, Preferences } from '../types';
import { CATEGORIES } from '../types';
import {
  formatLocalDateKey,
  formatMonthYear,
  getDaysInMonth,
  getFirstDayOfWeek,
  isFutureDate,
  parseLocalDateKey,
} from '../utils/dateUtils';
import { calculateDailyProgress } from '../utils/streakUtils';

interface HistoryScreenProps {
  habits: Habit[];
  preferences: Preferences;
  onToggleComplete: (habitId: string, dateKey: string) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  habits,
  preferences,
  onToggleComplete,
}) => {
  const today = new Date();
  const todayKey = formatLocalDateKey(today);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);

  const isSelectedToday = selectedDateKey === todayKey;
  const isSelectedFuture = isFutureDate(selectedDateKey, todayKey);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDateKey(todayKey);
  };

  const daysInCurrentMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOffset = getFirstDayOfWeek(viewYear, viewMonth);

  const selectedDateObj = parseLocalDateKey(selectedDateKey);
  const selectedMonthShort = selectedDateObj.toLocaleDateString(undefined, { month: 'short' }).toUpperCase();
  const selectedDayNum = selectedDateObj.getDate();

  const { completedCount, totalCount, percentage } = calculateDailyProgress(
    habits,
    selectedDateKey
  );

  const availableHabitsOnDate = habits.filter((h) => h.createdAt <= selectedDateKey);

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div id="screen-flight-log" className="space-y-5 pb-32 animate-fadeIn">
      {/* SCREEN TITLE: FLIGHT LOG */}
      <div className="px-1">
        <h1
          className="text-2xl sm:text-3xl font-black font-mono tracking-tight uppercase"
          style={{ color: 'var(--orbit-text)' }}
        >
          FLIGHT LOG
        </h1>
        <p
          className="text-xs font-mono tracking-wide mt-1"
          style={{ color: 'var(--orbit-text-muted)' }}
        >
          Orbital log of daily signals.
        </p>
      </div>

      {/* MONTHLY CALENDAR CARD */}
      <div
        id="flight-log-calendar-card"
        className="rounded-2xl p-4 sm:p-5 transition-all"
        style={{
          backgroundColor: 'var(--orbit-surface)',
          border: '1px solid var(--orbit-border)',
        }}
      >
        {/* Month Header & Controls */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h2
            className="text-sm sm:text-base font-mono font-bold tracking-tight uppercase"
            style={{ color: 'var(--orbit-text)' }}
          >
            {formatMonthYear(viewYear, viewMonth)}
          </h2>

          <div className="flex items-center gap-1.5">
            <button
              id="calendar-prev-month"
              onClick={handlePrevMonth}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90"
              style={{
                backgroundColor: 'var(--orbit-surface-subtle)',
                border: '1px solid var(--orbit-border)',
                color: 'var(--orbit-text)',
              }}
              aria-label="Previous month"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              id="calendar-today-button"
              onClick={handleJumpToToday}
              disabled={isSelectedToday}
              className={`px-2.5 h-7 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-all ${
                isSelectedToday
                  ? 'opacity-40 cursor-default'
                  : 'opacity-100 active:scale-95'
              }`}
              style={{
                backgroundColor: 'var(--orbit-surface-subtle)',
                border: '1px solid var(--orbit-border)',
                color: isSelectedToday ? 'var(--orbit-text-muted)' : 'var(--orbit-cyan)',
              }}
              aria-label="Jump to Today"
            >
              Today
            </button>

            <button
              id="calendar-next-month"
              onClick={handleNextMonth}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90"
              style={{
                backgroundColor: 'var(--orbit-surface-subtle)',
                border: '1px solid var(--orbit-border)',
                color: 'var(--orbit-text)',
              }}
              aria-label="Next month"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Day Name Labels */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {dayNames.map((d, idx) => (
            <span
              key={idx}
              className="text-[11px] font-mono font-bold py-1 select-none"
              style={{ color: 'var(--orbit-text-muted)' }}
            >
              {d}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 select-none">
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`spacer-${i}`} className="aspect-square" />
          ))}

          {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(
              dayNum
            ).padStart(2, '0')}`;
            const isToday = dateStr === todayKey;
            const isSelected = dateStr === selectedDateKey;
            const isFuture = isFutureDate(dateStr, todayKey);

            const dayProgress = calculateDailyProgress(habits, dateStr);

            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => setSelectedDateKey(dateStr)}
                className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-mono transition-all active:scale-95 ${
                  isSelected
                    ? 'ring-2 ring-indigo-500 font-bold shadow-sm'
                    : 'hover:bg-slate-500/10'
                } ${isToday ? 'border border-indigo-400' : ''}`}
                style={{
                  backgroundColor: isSelected
                    ? 'var(--orbit-surface-subtle)'
                    : 'transparent',
                  color: isFuture
                    ? 'var(--orbit-text-muted)'
                    : 'var(--orbit-text)',
                  opacity: isFuture ? 0.45 : 1,
                }}
              >
                <span>{dayNum}</span>

                {!isFuture && dayProgress.totalCount > 0 && (
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-0.5"
                    style={{
                      backgroundColor:
                        dayProgress.percentage === 100
                          ? 'var(--orbit-mint)'
                          : dayProgress.percentage >= 50
                          ? 'var(--orbit-cyan)'
                          : dayProgress.percentage > 0
                          ? 'var(--orbit-indigo)'
                          : 'var(--orbit-border)',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* FLIGHT LOG ENTRIES FOR SELECTED DATE: [ SEP 18 · 67% ] */}
      <div
        id="flight-log-entries-card"
        className="rounded-2xl p-4 sm:p-5 transition-all space-y-3"
        style={{
          backgroundColor: 'var(--orbit-surface)',
          border: '1px solid var(--orbit-border)',
        }}
      >
        {/* Entry Telemetry Bar: e.g. "SEP 18 · 67%" and "3 signals completed" */}
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--orbit-border)' }}>
          <div className="flex items-center gap-2 font-mono">
            <span
              className="text-sm font-extrabold tracking-wider"
              style={{ color: 'var(--orbit-text)' }}
            >
              {selectedMonthShort} {selectedDayNum} · {percentage}%
            </span>
          </div>

          <div className="text-xs font-mono font-semibold" style={{ color: 'var(--orbit-cyan)' }}>
            {isSelectedFuture ? (
              <span className="flex items-center gap-1 text-amber-400">
                <Lock className="w-3 h-3" />
                LOCKED
              </span>
            ) : totalCount > 0 ? (
              <span>
                {completedCount} {completedCount === 1 ? 'signal' : 'signals'} completed
              </span>
            ) : (
              <span style={{ color: 'var(--orbit-text-muted)' }}>0 signals</span>
            )}
          </div>
        </div>

        {/* Compact Status Rows */}
        {availableHabitsOnDate.length === 0 ? (
          <div
            className="p-6 rounded-xl text-center text-xs font-mono border border-dashed"
            style={{
              borderColor: 'var(--orbit-border)',
              color: 'var(--orbit-text-muted)',
            }}
          >
            NO FLIGHT SIGNALS REGISTERED ON THIS DATE
          </div>
        ) : (
          <div className="space-y-1.5 font-mono">
            {availableHabitsOnDate.map((habit) => {
              const isCompleted = Boolean(habit.completionHistory?.[selectedDateKey]);
              const cat = CATEGORIES[habit.category];

              return (
                <div
                  key={habit.id}
                  onClick={() => {
                    if (!isSelectedFuture) {
                      onToggleComplete(habit.id, selectedDateKey);
                    }
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl transition-all select-none ${
                    isSelectedFuture
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer hover:bg-slate-500/10 active:scale-[0.99]'
                  }`}
                  style={{
                    backgroundColor: 'var(--orbit-surface-subtle)',
                    border: '1px solid var(--orbit-border)',
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${habit.name}: ${isCompleted ? 'Completed' : 'Pending'}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Status marker dot: ● (completed) or ○ (incomplete) */}
                    <span
                      className="text-base leading-none select-none"
                      style={{
                        color: isCompleted ? 'var(--orbit-mint)' : 'var(--orbit-text-muted)',
                      }}
                    >
                      {isCompleted ? '●' : '○'}
                    </span>

                    <span
                      className={`text-xs font-semibold truncate ${
                        isCompleted ? 'opacity-90' : 'opacity-70'
                      }`}
                      style={{ color: 'var(--orbit-text)' }}
                    >
                      {habit.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] flex-shrink-0">
                    <span
                      className="uppercase font-bold tracking-wider"
                      style={{ color: cat.color }}
                    >
                      {cat.label}
                    </span>

                    {preferences.showDurations && habit.duration && (
                      <span style={{ color: 'var(--orbit-text-muted)' }}>
                        {habit.duration}m
                      </span>
                    )}

                    {isCompleted && (
                      <span
                        className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: 'rgba(77, 214, 168, 0.15)',
                          color: 'var(--orbit-mint)',
                        }}
                      >
                        OK
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
