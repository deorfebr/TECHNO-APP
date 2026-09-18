import React, { useState } from 'react';
import { Habit } from '../types';
import { formatLocalDateKey } from '../utils/dateUtils';
import {
  calculateDailyProgress,
  calculateOverallStreaks,
  get7DayMomentum,
  get30DayHeatmap,
  HeatmapDay,
} from '../utils/streakUtils';

interface InsightsScreenProps {
  habits: Habit[];
}

export const InsightsScreen: React.FC<InsightsScreenProps> = ({ habits }) => {
  const today = new Date();
  const todayKey = formatLocalDateKey(today);
  const todayProgress = calculateDailyProgress(habits, todayKey);
  const { currentStreak, bestStreak } = calculateOverallStreaks(habits, todayKey);
  const sevenDayData = get7DayMomentum(habits, today);
  const thirtyDayData = get30DayHeatmap(habits, today);

  const [selectedHeatmapDay, setSelectedHeatmapDay] = useState<HeatmapDay | null>(null);

  // Render weekly signal marker
  const renderSignalSymbol = (percentage: number, total: number) => {
    if (total === 0) {
      return (
        <span className="text-sm font-mono opacity-25" style={{ color: 'var(--orbit-text-muted)' }}>
          ○
        </span>
      );
    }
    if (percentage === 100) {
      return (
        <span className="text-base font-mono" style={{ color: 'var(--orbit-mint)' }}>
          ●
        </span>
      );
    }
    if (percentage >= 66) {
      return (
        <span className="text-base font-mono" style={{ color: 'var(--orbit-cyan)' }}>
          ◉
        </span>
      );
    }
    if (percentage >= 33) {
      return (
        <span className="text-base font-mono" style={{ color: 'var(--orbit-indigo)' }}>
          ◐
        </span>
      );
    }
    return (
      <span className="text-base font-mono opacity-50" style={{ color: 'var(--orbit-text-muted)' }}>
        ○
      </span>
    );
  };

  // Color mapping for 30-day field levels
  const getFieldCellColor = (level: 0 | 1 | 2 | 3 | 4) => {
    switch (level) {
      case 4:
        return 'bg-[#4DD6A8] text-slate-950 shadow-[0_0_8px_rgba(77,214,168,0.4)]'; // 100% Mint
      case 3:
        return 'bg-[#39D0FF] text-slate-950 shadow-[0_0_6px_rgba(57,208,255,0.3)]'; // 70-99% Cyan
      case 2:
        return 'bg-[#7C83FF] text-white'; // 40-69% Indigo
      case 1:
        return 'bg-[#7C83FF]/40 text-white'; // 1-39% Subtle indigo
      case 0:
      default:
        return 'bg-slate-800/40 border border-slate-700/30 text-slate-400';
    }
  };

  return (
    <div id="screen-insights" className="space-y-5 pb-32 animate-fadeIn">
      {/* 1. HEADER */}
      <div className="px-1">
        <h1
          className="text-2xl sm:text-3xl font-black font-mono tracking-tight uppercase"
          style={{ color: 'var(--orbit-text)' }}
        >
          INSIGHTS
        </h1>
        <p
          className="text-xs font-mono tracking-wide mt-1"
          style={{ color: 'var(--orbit-text-muted)' }}
        >
          Your momentum at a glance.
        </p>
      </div>

      {/* 2. TOP METRIC: MOMENTUM (Large precision telemetry display) */}
      <div
        id="telemetry-momentum-hero"
        className="rounded-2xl p-5 sm:p-6 transition-all"
        style={{
          backgroundColor: 'var(--orbit-surface)',
          border: '1px solid var(--orbit-border)',
        }}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-[11px] font-mono font-bold uppercase tracking-widest"
            style={{ color: 'var(--orbit-text-muted)', letterSpacing: '0.14em' }}
          >
            MOMENTUM
          </span>
          <span
            className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: 'var(--orbit-surface-subtle)',
              color: todayProgress.percentage === 100 ? 'var(--orbit-mint)' : 'var(--orbit-cyan)',
              border: '1px solid var(--orbit-border)',
            }}
          >
            {todayProgress.completedCount} / {todayProgress.totalCount} SIGNALS
          </span>
        </div>

        <div className="mt-2 flex items-baseline gap-3">
          <span
            className="text-5xl sm:text-6xl font-black font-mono tracking-tight leading-none"
            style={{
              color: todayProgress.percentage === 100 ? 'var(--orbit-mint)' : 'var(--orbit-text)',
              textShadow:
                todayProgress.percentage === 100
                  ? '0 0 20px rgba(77, 214, 168, 0.4)'
                  : 'none',
            }}
          >
            {todayProgress.percentage}%
          </span>
        </div>

        <div className="mt-3 w-full bg-slate-800/40 rounded-full h-1.5 overflow-hidden border border-slate-700/30">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${todayProgress.percentage}%`,
              background:
                todayProgress.percentage === 100
                  ? 'var(--orbit-mint)'
                  : 'linear-gradient(90deg, var(--orbit-indigo), var(--orbit-cyan))',
            }}
          />
        </div>
      </div>

      {/* 3. COMPACT METRIC MODULES: CURRENT & LONGEST */}
      <div className="grid grid-cols-2 gap-3">
        {/* CURRENT */}
        <div
          id="metric-current-streak"
          className="rounded-2xl p-4 sm:p-5 transition-all"
          style={{
            backgroundColor: 'var(--orbit-surface)',
            border: '1px solid var(--orbit-border)',
          }}
        >
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-widest block mb-2"
            style={{ color: 'var(--orbit-text-muted)', letterSpacing: '0.14em' }}
          >
            CURRENT
          </span>
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-3xl sm:text-4xl font-black font-mono tracking-tight leading-none"
              style={{ color: 'var(--orbit-text)' }}
            >
              {currentStreak}
            </span>
            <span
              className="text-xs font-mono font-bold uppercase"
              style={{ color: 'var(--orbit-amber)' }}
            >
              {currentStreak === 1 ? 'DAY' : 'DAYS'}
            </span>
          </div>
          <span
            className="text-[10px] font-mono tracking-wider block mt-2 opacity-70"
            style={{ color: 'var(--orbit-text-muted)' }}
          >
            ACTIVE SEQUENCE
          </span>
        </div>

        {/* LONGEST */}
        <div
          id="metric-longest-streak"
          className="rounded-2xl p-4 sm:p-5 transition-all"
          style={{
            backgroundColor: 'var(--orbit-surface)',
            border: '1px solid var(--orbit-border)',
          }}
        >
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-widest block mb-2"
            style={{ color: 'var(--orbit-text-muted)', letterSpacing: '0.14em' }}
          >
            LONGEST
          </span>
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-3xl sm:text-4xl font-black font-mono tracking-tight leading-none"
              style={{ color: 'var(--orbit-text)' }}
            >
              {bestStreak}
            </span>
            <span
              className="text-xs font-mono font-bold uppercase"
              style={{ color: 'var(--orbit-indigo)' }}
            >
              {bestStreak === 1 ? 'DAY' : 'DAYS'}
            </span>
          </div>
          <span
            className="text-[10px] font-mono tracking-wider block mt-2 opacity-70"
            style={{ color: 'var(--orbit-text-muted)' }}
          >
            PEAK VELOCITY
          </span>
        </div>
      </div>

      {/* 4. WEEKLY SIGNAL (M T W T F S S / ● ● ● ◉ ◐ ○ ○) */}
      <div
        id="section-weekly-signal"
        className="rounded-2xl p-4 sm:p-5 transition-all"
        style={{
          backgroundColor: 'var(--orbit-surface)',
          border: '1px solid var(--orbit-border)',
        }}
      >
        <div className="flex items-center justify-between mb-3 px-1">
          <span
            className="text-[11px] font-mono font-bold uppercase tracking-widest"
            style={{ color: 'var(--orbit-text-muted)', letterSpacing: '0.14em' }}
          >
            WEEKLY SIGNAL
          </span>
          <span className="text-[10px] font-mono opacity-70" style={{ color: 'var(--orbit-text-muted)' }}>
            TRAILING 7 DAYS
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center select-none py-2">
          {sevenDayData.map((day) => (
            <div
              key={day.dateKey}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                day.isToday
                  ? 'bg-indigo-500/10 border border-indigo-500/40'
                  : 'hover:bg-slate-500/5'
              }`}
            >
              {/* Day Letter */}
              <span
                className={`text-xs font-mono font-bold ${
                  day.isToday ? 'text-indigo-400 font-extrabold' : ''
                }`}
                style={{ color: day.isToday ? 'var(--orbit-indigo)' : 'var(--orbit-text-muted)' }}
              >
                {day.dayLetter}
              </span>

              {/* Date Number */}
              <span
                className="text-[10px] font-mono opacity-60 mb-2 mt-0.5"
                style={{ color: 'var(--orbit-text-muted)' }}
              >
                {day.dateNumber}
              </span>

              {/* Symbol indicator */}
              <div className="h-6 flex items-center justify-center">
                {renderSignalSymbol(day.percentage, day.totalCount)}
              </div>

              {/* Numeric Percentage */}
              <span
                className="text-[10px] font-mono font-semibold mt-1"
                style={{
                  color:
                    day.totalCount === 0
                      ? 'var(--orbit-text-muted)'
                      : day.percentage === 100
                      ? 'var(--orbit-mint)'
                      : day.percentage >= 50
                      ? 'var(--orbit-indigo)'
                      : 'var(--orbit-text-muted)',
                }}
              >
                {day.totalCount > 0 ? `${day.percentage}%` : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. 30-DAY FIELD (Activity Heatmap) */}
      <div
        id="section-30day-field"
        className="rounded-2xl p-4 sm:p-5 transition-all"
        style={{
          backgroundColor: 'var(--orbit-surface)',
          border: '1px solid var(--orbit-border)',
        }}
      >
        <div className="flex items-center justify-between mb-3 px-1">
          <span
            className="text-[11px] font-mono font-bold uppercase tracking-widest"
            style={{ color: 'var(--orbit-text-muted)', letterSpacing: '0.14em' }}
          >
            30-DAY FIELD
          </span>
          <span className="text-[10px] font-mono opacity-70" style={{ color: 'var(--orbit-text-muted)' }}>
            ACTIVITY MATRIX
          </span>
        </div>

        {/* Heatmap Matrix */}
        <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 select-none my-2">
          {thirtyDayData.map((item) => {
            const isSelected = selectedHeatmapDay?.dateKey === item.dateKey;
            return (
              <button
                key={item.dateKey}
                type="button"
                onClick={() => setSelectedHeatmapDay(item)}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] font-mono transition-all active:scale-90 ${getFieldCellColor(
                  item.level
                )} ${
                  isSelected
                    ? 'ring-2 ring-white scale-105 z-10'
                    : 'hover:scale-105 hover:opacity-90'
                } ${item.isToday ? 'border-2 border-indigo-400' : ''}`}
                title={`${item.dateKey}: ${item.percentage}% (${item.completedCount}/${item.totalCount})`}
                aria-label={`${item.dateKey}: ${item.percentage}% complete`}
              >
                <span>{item.date.getDate()}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Field Detail */}
        <div
          className="mt-3 p-3 rounded-xl flex items-center justify-between text-xs font-mono transition-all"
          style={{
            backgroundColor: 'var(--orbit-surface-subtle)',
            border: '1px solid var(--orbit-border)',
          }}
        >
          {selectedHeatmapDay ? (
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold" style={{ color: 'var(--orbit-text)' }}>
                {selectedHeatmapDay.date.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }).toUpperCase()}
              </span>
              <span className="font-bold" style={{ color: 'var(--orbit-cyan)' }}>
                {selectedHeatmapDay.totalCount === 0
                  ? 'NO SIGNALS TRACKED'
                  : `${selectedHeatmapDay.completedCount} OF ${selectedHeatmapDay.totalCount} COMPLETED (${selectedHeatmapDay.percentage}%)`}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full opacity-60">
              <span style={{ color: 'var(--orbit-text-muted)' }}>
                TAP ANY CELL TO INSPECT FIELD TELEMETRY
              </span>
              <span style={{ color: 'var(--orbit-text-muted)' }}>30 DAYS</span>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] font-mono">
          <span style={{ color: 'var(--orbit-text-muted)' }}>QUIET</span>
          <span className="w-2.5 h-2.5 rounded bg-slate-800/60 border border-slate-700/40" />
          <span className="w-2.5 h-2.5 rounded bg-[#7C83FF]/40" />
          <span className="w-2.5 h-2.5 rounded bg-[#7C83FF]" />
          <span className="w-2.5 h-2.5 rounded bg-[#39D0FF]" />
          <span className="w-2.5 h-2.5 rounded bg-[#4DD6A8]" />
          <span style={{ color: 'var(--orbit-text-muted)' }}>SYNCHRONIZED</span>
        </div>
      </div>
    </div>
  );
};
