import { Habit } from '../types';
import { addDays, formatLocalDateKey, parseLocalDateKey } from './dateUtils';

export interface StreakInfo {
  currentStreak: number;
  bestStreak: number;
}

export interface DailyProgressInfo {
  completedCount: number;
  totalCount: number;
  percentage: number;
}

/**
 * Calculates current streak and all-time best streak for a single habit.
 * Handles streak ending today, streak ending yesterday, broken streak, and 0 streak.
 */
export function calculateHabitStreak(habit: Habit, todayKey: string = formatLocalDateKey()): StreakInfo {
  const history = habit.completionHistory || {};
  const today = parseLocalDateKey(todayKey);

  // 1. Calculate current streak
  let currentStreak = 0;
  const isCompletedToday = Boolean(history[todayKey]);

  let checkDate = today;
  if (!isCompletedToday) {
    // If not completed today, check if yesterday was completed
    checkDate = addDays(today, -1);
  }

  // Count backwards consecutively as long as history is true
  while (true) {
    const key = formatLocalDateKey(checkDate);
    // Don't count before habit was created
    if (key < habit.createdAt) {
      break;
    }
    if (history[key]) {
      currentStreak++;
      checkDate = addDays(checkDate, -1);
    } else {
      break;
    }
  }

  // 2. Calculate best streak (longest consecutive run in history)
  const completedDates = Object.keys(history)
    .filter((k) => history[k])
    .sort();

  let bestStreak = 0;
  if (completedDates.length > 0) {
    let tempStreak = 1;
    bestStreak = 1;

    for (let i = 1; i < completedDates.length; i++) {
      const prevDate = parseLocalDateKey(completedDates[i - 1]);
      const currDate = parseLocalDateKey(completedDates[i]);
      const expectedNext = addDays(prevDate, 1);

      if (formatLocalDateKey(expectedNext) === formatLocalDateKey(currDate)) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }

      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }
    }
  }

  // Best streak must be at least the current streak
  bestStreak = Math.max(bestStreak, currentStreak);

  return {
    currentStreak,
    bestStreak,
  };
}

/**
 * Calculates overall streak stats across all habits.
 */
export function calculateOverallStreaks(habits: Habit[], todayKey: string = formatLocalDateKey()) {
  if (habits.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  let maxCurrent = 0;
  let maxBest = 0;

  for (const habit of habits) {
    const { currentStreak, bestStreak } = calculateHabitStreak(habit, todayKey);
    if (currentStreak > maxCurrent) maxCurrent = currentStreak;
    if (bestStreak > maxBest) maxBest = bestStreak;
  }

  return {
    currentStreak: maxCurrent,
    bestStreak: maxBest,
  };
}

/**
 * Calculates daily progress for a given dateKey.
 * ONLY includes habits that already existed on that date (createdAt <= dateKey).
 */
export function calculateDailyProgress(habits: Habit[], dateKey: string): DailyProgressInfo {
  // Habits available on that date
  const availableHabits = habits.filter((h) => h.createdAt <= dateKey);

  if (availableHabits.length === 0) {
    return {
      completedCount: 0,
      totalCount: 0,
      percentage: 0,
    };
  }

  const completedCount = availableHabits.filter((h) => h.completionHistory?.[dateKey]).length;
  const percentage = Math.round((completedCount / availableHabits.length) * 100);

  return {
    completedCount,
    totalCount: availableHabits.length,
    percentage,
  };
}

export interface DayMomentum {
  dateKey: string;
  dayLetter: string; // M, T, W, etc.
  dateNumber: number;
  percentage: number;
  completedCount: number;
  totalCount: number;
  isToday: boolean;
}

/**
 * Returns 7-day momentum data ending on the given local date (default today).
 */
export function get7DayMomentum(habits: Habit[], baseDate: Date = new Date()): DayMomentum[] {
  const result: DayMomentum[] = [];
  const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Sunday = 0
  const todayKey = formatLocalDateKey(new Date());

  for (let i = 6; i >= 0; i--) {
    const d = addDays(baseDate, -i);
    const dateKey = formatLocalDateKey(d);
    const progress = calculateDailyProgress(habits, dateKey);
    const dayLetter = dayLetters[d.getDay()];

    result.push({
      dateKey,
      dayLetter,
      dateNumber: d.getDate(),
      percentage: progress.percentage,
      completedCount: progress.completedCount,
      totalCount: progress.totalCount,
      isToday: dateKey === todayKey,
    });
  }

  return result;
}

export interface HeatmapDay {
  dateKey: string;
  date: Date;
  percentage: number;
  completedCount: number;
  totalCount: number;
  level: 0 | 1 | 2 | 3 | 4; // 0=0%, 1=1-39%, 2=40-69%, 3=70-99%, 4=100%
  isToday: boolean;
}

/**
 * Returns past 30 days heatmap activity grid.
 */
export function get30DayHeatmap(habits: Habit[], baseDate: Date = new Date()): HeatmapDay[] {
  const result: HeatmapDay[] = [];
  const todayKey = formatLocalDateKey(new Date());

  for (let i = 29; i >= 0; i--) {
    const d = addDays(baseDate, -i);
    const dateKey = formatLocalDateKey(d);
    const progress = calculateDailyProgress(habits, dateKey);

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (progress.totalCount > 0) {
      if (progress.percentage === 100) level = 4;
      else if (progress.percentage >= 70) level = 3;
      else if (progress.percentage >= 40) level = 2;
      else if (progress.percentage > 0) level = 1;
    }

    result.push({
      dateKey,
      date: d,
      percentage: progress.percentage,
      completedCount: progress.completedCount,
      totalCount: progress.totalCount,
      level,
      isToday: dateKey === todayKey,
    });
  }

  return result;
}
