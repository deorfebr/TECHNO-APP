import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Habit } from '../types';
import {
  addDays,
  formatLocalDateKey,
  getWeekDates,
  isFutureDate,
  isSameLocalDate,
  parseLocalDateKey,
} from '../utils/dateUtils';
import { calculateDailyProgress } from '../utils/streakUtils';

interface DateRailProps {
  selectedDateKey: string;
  onSelectDate: (dateKey: string) => void;
  habits: Habit[];
  todayKey: string;
}

export const DateRail: React.FC<DateRailProps> = ({
  selectedDateKey,
  onSelectDate,
  habits,
  todayKey,
}) => {
  const selectedDate = parseLocalDateKey(selectedDateKey);
  const weekDates = getWeekDates(selectedDate);

  const isCurrentSelectionToday = selectedDateKey === todayKey;

  // Navigate week forward or backward
  const handlePrevWeek = () => {
    const prevWeekDate = addDays(selectedDate, -7);
    onSelectDate(formatLocalDateKey(prevWeekDate));
  };

  const handleNextWeek = () => {
    const nextWeekDate = addDays(selectedDate, 7);
    onSelectDate(formatLocalDateKey(nextWeekDate));
  };

  const handleJumpToToday = () => {
    onSelectDate(todayKey);
  };

  const dayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div
      id="horizontal-date-rail"
      className="w-full rounded-2xl p-3 sm:p-4 transition-all"
      style={{
        backgroundColor: 'var(--orbit-surface)',
        border: '1px solid var(--orbit-border)',
      }}
    >
      {/* Date Rail Header: Month/Year + Week Navigation Controls */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-mono font-bold uppercase tracking-widest"
            style={{ color: 'var(--orbit-text-muted)', letterSpacing: '0.14em' }}
          >
            NAV RAIL
          </span>
          <span className="text-xs font-mono font-semibold" style={{ color: 'var(--orbit-text)' }}>
            {selectedDate.toLocaleDateString(undefined, {
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {!isCurrentSelectionToday && (
            <button
              type="button"
              id="date-rail-today-button"
              onClick={handleJumpToToday}
              className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all active:scale-95"
              style={{
                backgroundColor: 'var(--orbit-surface-subtle)',
                border: '1px solid var(--orbit-border)',
                color: 'var(--orbit-cyan)',
              }}
              title="Return to today"
            >
              Today
            </button>
          )}

          <button
            type="button"
            id="date-rail-prev-week"
            onClick={handlePrevWeek}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90 hover:opacity-100"
            style={{
              backgroundColor: 'var(--orbit-surface-subtle)',
              border: '1px solid var(--orbit-border)',
              color: 'var(--orbit-text-muted)',
            }}
            aria-label="Previous week"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            id="date-rail-next-week"
            onClick={handleNextWeek}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90 hover:opacity-100"
            style={{
              backgroundColor: 'var(--orbit-surface-subtle)',
              border: '1px solid var(--orbit-border)',
              color: 'var(--orbit-text-muted)',
            }}
            aria-label="Next week"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 7-Day Horizontal Rail */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 select-none">
        {weekDates.map((d, index) => {
          const dateKey = formatLocalDateKey(d);
          const isSelected = dateKey === selectedDateKey;
          const isToday = dateKey === todayKey;
          const isFuture = isFutureDate(dateKey, todayKey);

          const { completedCount, totalCount, percentage } = calculateDailyProgress(
            habits,
            dateKey
          );

          // Indicator color
          let statusColor = 'var(--orbit-border)';
          if (!isFuture && totalCount > 0) {
            if (percentage === 100) statusColor = 'var(--orbit-mint)';
            else if (percentage >= 50) statusColor = 'var(--orbit-cyan)';
            else if (percentage > 0) statusColor = 'var(--orbit-indigo)';
          }

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate(dateKey)}
              className={`flex flex-col items-center justify-between py-2 px-1 rounded-xl transition-all active:scale-95 focus:outline-none ${
                isSelected
                  ? 'ring-2 font-bold shadow-sm'
                  : 'hover:bg-slate-500/10 opacity-80 hover:opacity-100'
              } ${isToday ? 'border border-indigo-500/50' : ''}`}
              style={{
                backgroundColor: isSelected
                  ? 'var(--orbit-surface-subtle)'
                  : 'transparent',
                borderColor: isSelected ? 'var(--orbit-indigo)' : undefined,
                color: isSelected
                  ? 'var(--orbit-text)'
                  : isFuture
                  ? 'var(--orbit-text-muted)'
                  : 'var(--orbit-text)',
                opacity: isFuture && !isSelected ? 0.45 : 1,
              }}
              title={`${dateKey}${isFuture ? ' (Future)' : ''}`}
              aria-label={`${dayLabels[index]} ${d.getDate()} ${
                isSelected ? 'selected' : ''
              }`}
            >
              {/* Day Label (MON, TUE...) */}
              <span
                className="text-[10px] font-mono tracking-wider"
                style={{
                  color: isSelected
                    ? 'var(--orbit-indigo)'
                    : isToday
                    ? 'var(--orbit-cyan)'
                    : 'var(--orbit-text-muted)',
                }}
              >
                {dayLabels[index]}
              </span>

              {/* Day Number (15, 16...) */}
              <span
                className={`text-sm font-mono mt-0.5 mb-1 ${
                  isSelected ? 'font-extrabold scale-105' : 'font-semibold'
                }`}
              >
                {d.getDate()}
              </span>

              {/* Status Signal Dot */}
              <div className="h-2 flex items-center justify-center">
                {isFuture ? (
                  <span className="w-1 h-1 rounded-full bg-slate-600/40" />
                ) : totalCount > 0 ? (
                  <span
                    className="w-1.5 h-1.5 rounded-full transition-all"
                    style={{
                      backgroundColor: statusColor,
                      boxShadow:
                        percentage === 100
                          ? '0 0 6px rgba(77,214,168,0.5)'
                          : percentage >= 50
                          ? '0 0 4px rgba(57,208,255,0.4)'
                          : 'none',
                    }}
                  />
                ) : (
                  <span className="w-1 h-1 rounded-full opacity-20 bg-slate-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
