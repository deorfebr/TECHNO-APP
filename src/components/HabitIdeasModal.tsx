import React from 'react';
import { X, Compass, ArrowRight } from 'lucide-react';
import { HabitCategory, CATEGORIES } from '../types';
import { IconRenderer } from './IconRenderer';

export interface HabitSuggestion {
  name: string;
  category: HabitCategory;
  icon: string;
  duration?: number;
  description: string;
}

export const SUGGESTIONS: HabitSuggestion[] = [
  {
    name: 'Drink Water',
    category: 'Health',
    icon: 'Droplets',
    description: 'Hydrate to maintain steady cognitive and metabolic rhythm.',
  },
  {
    name: 'Study 30 Minutes',
    category: 'Study',
    icon: 'BookOpen',
    duration: 30,
    description: 'Focused academic or technical deep dive session.',
  },
  {
    name: 'Move for 20 Minutes',
    category: 'Fitness',
    icon: 'Activity',
    duration: 20,
    description: 'Physical cardio, calisthenics, or endurance movement.',
  },
  {
    name: 'Meditate & Breathe',
    category: 'Mindfulness',
    icon: 'Sparkles',
    duration: 10,
    description: 'Clear cognitive buffer with centered mindfulness.',
  },
  {
    name: 'Deep Work Session',
    category: 'Study',
    icon: 'Code',
    duration: 45,
    description: 'Uninterrupted creative flow state and engineering work.',
  },
  {
    name: 'Read 15 Pages',
    category: 'Personal',
    icon: 'PenTool',
    duration: 20,
    description: 'Consistent mental compound interest through reading.',
  },
  {
    name: 'Morning Routine',
    category: 'Routine',
    icon: 'Sun',
    duration: 15,
    description: 'Structured start to set the trajectory of the day.',
  },
  {
    name: 'Night Shutdown',
    category: 'Routine',
    icon: 'Moon',
    duration: 10,
    description: 'Review the day and prepare the system for rest.',
  },
];

interface HabitIdeasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSuggestion: (suggestion: HabitSuggestion) => void;
}

export const HabitIdeasModal: React.FC<HabitIdeasModalProps> = ({
  isOpen,
  onClose,
  onSelectSuggestion,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="habit-ideas-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="habit-ideas-title"
    >
      <div
        id="habit-ideas-dialog"
        className="w-full sm:max-w-lg max-h-[90dvh] flex flex-col rounded-t-3xl sm:rounded-2xl transition-all shadow-2xl overflow-hidden animate-slideUp"
        style={{
          backgroundColor: 'var(--orbit-surface)',
          border: '1px solid var(--orbit-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: '1px solid var(--orbit-border)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: 'var(--orbit-surface-subtle)',
                color: 'var(--orbit-cyan)',
              }}
            >
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="habit-ideas-title"
                className="text-lg font-bold tracking-tight"
                style={{ color: 'var(--orbit-text)' }}
              >
                Habit Trajectories
              </h2>
              <p className="text-xs" style={{ color: 'var(--orbit-text-muted)' }}>
                Select a habit template to customize and add to your Orbit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-slate-500/15 transition-all text-xs"
            style={{ color: 'var(--orbit-text-muted)' }}
            aria-label="Close suggestions"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Suggestions */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5 no-scrollbar">
          {SUGGESTIONS.map((item) => {
            const cat = CATEGORIES[item.category];
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => onSelectSuggestion(item)}
                className="w-full text-left p-3.5 rounded-xl transition-all duration-200 flex items-center justify-between gap-3 group active:scale-98 hover:border-indigo-400"
                style={{
                  backgroundColor: 'var(--orbit-surface-subtle)',
                  border: '1px solid var(--orbit-border)',
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: cat.bgTint,
                      color: cat.color,
                      border: `1px solid ${cat.borderColor}`,
                    }}
                  >
                    <IconRenderer name={item.icon} className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate" style={{ color: 'var(--orbit-text)' }}>
                        {item.name}
                      </span>
                    </div>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--orbit-text-muted)' }}>
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: cat.bgTint,
                      color: cat.color,
                    }}
                  >
                    {cat.label}
                  </span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    style={{ color: 'var(--orbit-text-muted)' }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="p-4 text-center text-xs flex-shrink-0"
          style={{
            borderTop: '1px solid var(--orbit-border)',
            color: 'var(--orbit-text-muted)',
          }}
        >
          Selected habits will open in the editor for final confirmation before entering Orbit.
        </div>
      </div>
    </div>
  );
};
