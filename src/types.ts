export type HabitCategory =
  | 'Study'
  | 'Health'
  | 'Fitness'
  | 'Mindfulness'
  | 'Routine'
  | 'Personal';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  icon: string;
  createdAt: string; // YYYY-MM-DD local format
  duration?: number; // in minutes (positive)
  color?: string; // hex or accent token
  completionHistory: Record<string, boolean>; // local date key "YYYY-MM-DD" -> boolean
}

export interface UserProfile {
  displayName: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Preferences {
  showDurations: boolean;
  showStreaks: boolean;
}

export type NavScreen = 'today' | 'insights' | 'history' | 'settings';

export interface CategoryDefinition {
  name: HabitCategory;
  color: string; // hex
  bgTint: string;
  borderColor: string;
  label: string;
  defaultIcon: string;
}

export const CATEGORIES: Record<HabitCategory, CategoryDefinition> = {
  Study: {
    name: 'Study',
    color: '#7C83FF', // Primary Indigo
    bgTint: 'rgba(124, 131, 255, 0.12)',
    borderColor: 'rgba(124, 131, 255, 0.3)',
    label: 'Study',
    defaultIcon: 'BookOpen',
  },
  Health: {
    name: 'Health',
    color: '#39D0FF', // Cyan accent
    bgTint: 'rgba(57, 208, 255, 0.12)',
    borderColor: 'rgba(57, 208, 255, 0.3)',
    label: 'Health',
    defaultIcon: 'Droplets',
  },
  Fitness: {
    name: 'Fitness',
    color: '#4DD6A8', // Success mint
    bgTint: 'rgba(77, 214, 168, 0.12)',
    borderColor: 'rgba(77, 214, 168, 0.3)',
    label: 'Fitness',
    defaultIcon: 'Activity',
  },
  Mindfulness: {
    name: 'Mindfulness',
    color: '#A76BFF', // Violet accent
    bgTint: 'rgba(167, 107, 255, 0.12)',
    borderColor: 'rgba(167, 107, 255, 0.3)',
    label: 'Mindfulness',
    defaultIcon: 'Sparkles',
  },
  Routine: {
    name: 'Routine',
    color: '#F59E0B', // Amber
    bgTint: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    label: 'Routine',
    defaultIcon: 'Sun',
  },
  Personal: {
    name: 'Personal',
    color: '#3B82F6', // Blue
    bgTint: 'rgba(59, 130, 246, 0.12)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    label: 'Personal',
    defaultIcon: 'Compass',
  },
};
