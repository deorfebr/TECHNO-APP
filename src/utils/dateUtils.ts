/**
 * Date utilities operating purely in the user's local timezone.
 * Avoids UTC offset slicing issues.
 */

/**
 * Formats a Date object into a local 'YYYY-MM-DD' key
 */
export function formatLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses a 'YYYY-MM-DD' key into a Date object at local midnight
 */
export function parseLocalDateKey(dateKey: string): Date {
  const [yearStr, monthStr, dayStr] = dateKey.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);
  return new Date(year, month, day, 0, 0, 0, 0);
}

/**
 * Compares whether two dates represent the exact same local calendar day
 */
export function isSameLocalDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Adds (or subtracts) a specific number of calendar days in local time
 */
export function addDays(date: Date, amount: number): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  result.setDate(result.getDate() + amount);
  return result;
}

/**
 * Returns formatted long date string (e.g. "Friday, September 18")
 */
export function formatFullDisplayDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Returns formatted month and year (e.g. "September 2026")
 */
export function formatMonthYear(year: number, month: number): string {
  const date = new Date(year, month, 1);
  return date.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Checks if a given dateKey is in the future relative to today's local dateKey
 */
export function isFutureDate(dateKey: string, todayKey: string = formatLocalDateKey()): boolean {
  return dateKey > todayKey;
}

/**
 * Returns appropriate dynamic greeting based on local hour
 */
export function getGreeting(displayName?: string): string {
  const hour = new Date().getHours();
  let timeGreeting = 'Good evening';
  if (hour >= 5 && hour < 12) {
    timeGreeting = 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good afternoon';
  }

  if (displayName && displayName.trim()) {
    return `${timeGreeting}, ${displayName.trim()}`;
  }
  return timeGreeting;
}

/**
 * Returns number of days in a given local month (0-indexed month)
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Returns the day of the week for the 1st of the month (0 = Sunday, 1 = Monday, etc.)
 */
export function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * Returns the 7 days of the week containing anchorDate, starting from Monday
 */
export function getWeekDates(anchorDate: Date): Date[] {
  const d = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), anchorDate.getDate());
  const day = d.getDay(); // 0 is Sun, 1 is Mon, 2 is Tue...
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);

  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(monday);
    nextDay.setDate(monday.getDate() + i);
    week.push(nextDay);
  }
  return week;
}
