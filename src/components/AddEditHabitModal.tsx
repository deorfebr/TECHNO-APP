import React, { useState, useEffect } from 'react';
import { X, Rocket, Sparkles } from 'lucide-react';
import { Habit, HabitCategory, CATEGORIES } from '../types';
import { AVAILABLE_ICON_NAMES, IconRenderer } from './IconRenderer';

interface AddEditHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habitData: {
    name: string;
    category: HabitCategory;
    icon: string;
    duration?: number;
  }) => void;
  initialHabit?: Habit | null; // If present, edit mode
  existingHabits: Habit[];
}

export const AddEditHabitModal: React.FC<AddEditHabitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialHabit,
  existingHabits,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitCategory>('Study');
  const [icon, setIcon] = useState('BookOpen');
  const [duration, setDuration] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Sync state when modal opens or initialHabit changes
  useEffect(() => {
    if (isOpen) {
      if (initialHabit) {
        setName(initialHabit.name);
        setCategory(initialHabit.category);
        setIcon(initialHabit.icon);
        setDuration(initialHabit.duration ? String(initialHabit.duration) : '');
      } else {
        setName('');
        setCategory('Study');
        setIcon('BookOpen');
        setDuration('');
      }
      setError(null);
    }
  }, [isOpen, initialHabit]);

  // When category changes in Add mode, default to category icon
  const handleCategoryChange = (newCat: HabitCategory) => {
    setCategory(newCat);
    if (!initialHabit) {
      setIcon(CATEGORIES[newCat]?.defaultIcon || 'Sparkles');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Habit name is required to initialize trajectory.');
      return;
    }

    // Duplicate check
    const normalizedNew = trimmedName.toLowerCase();
    const isDuplicate = existingHabits.some(
      (h) =>
        (!initialHabit || h.id !== initialHabit.id) &&
        h.name.trim().toLowerCase() === normalizedNew
    );

    if (isDuplicate) {
      setError('A habit with this designation already exists in your Orbit.');
      return;
    }

    // Validate duration
    let durationNumber: number | undefined = undefined;
    if (duration.trim()) {
      const parsed = parseInt(duration.trim(), 10);
      if (isNaN(parsed) || parsed <= 0) {
        setError('Duration must be a positive number of minutes.');
        return;
      }
      durationNumber = parsed;
    }

    onSave({
      name: trimmedName,
      category,
      icon,
      duration: durationNumber,
    });
    onClose();
  };

  const isEdit = Boolean(initialHabit);

  return (
    <div
      id="habit-modal-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="launch-sequence-title"
    >
      <div
        id="habit-modal-dialog"
        className="w-full sm:max-w-lg max-h-[90dvh] flex flex-col rounded-t-3xl sm:rounded-2xl transition-all shadow-2xl overflow-hidden animate-slideUp"
        style={{
          backgroundColor: 'var(--orbit-surface)',
          border: '1px solid var(--orbit-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Launch Sequence Header */}
        <div
          className="px-6 py-4 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: '1px solid var(--orbit-border)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{
                background: 'linear-gradient(135deg, var(--orbit-indigo), var(--orbit-cyan))',
              }}
            >
              <Rocket className="w-4 h-4" />
            </div>

            <div>
              <h2
                id="launch-sequence-title"
                className="text-sm font-mono font-extrabold uppercase tracking-widest leading-tight"
                style={{ color: 'var(--orbit-text)' }}
              >
                {isEdit ? 'RECONFIGURE HABIT' : 'LAUNCH NEW HABIT'}
              </h2>
              <p className="text-[10px] font-mono tracking-wider" style={{ color: 'var(--orbit-text-muted)' }}>
                {isEdit ? 'UPDATE ORBITAL PARAMETERS' : 'SEQUENCE 01-04 · SYSTEM READY'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center opacity-60 hover:opacity-100 hover:bg-slate-500/15 transition-all text-xs"
            style={{ color: 'var(--orbit-text-muted)' }}
            aria-label="Abort launch"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form: Numbered Sequence 01 to 04 */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar"
        >
          {error && (
            <div
              className="p-3 rounded-xl text-xs font-mono font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400"
              role="alert"
            >
              [ERROR] {error}
            </div>
          )}

          {/* 01 HABIT */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400">
                01
              </span>
              <label
                htmlFor="habit-name-input"
                className="text-xs font-mono font-bold uppercase tracking-wider"
                style={{ color: 'var(--orbit-text)' }}
              >
                HABIT
              </label>
            </div>

            <input
              id="habit-name-input"
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Study Electronics, Deep Breathing, Hydrate"
              className="w-full h-12 px-4 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{
                backgroundColor: 'var(--orbit-surface-subtle)',
                border: '1px solid var(--orbit-border)',
                color: 'var(--orbit-text)',
              }}
              autoFocus
            />
          </div>

          {/* 02 CLASS */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400">
                02
              </span>
              <label
                className="text-xs font-mono font-bold uppercase tracking-wider"
                style={{ color: 'var(--orbit-text)' }}
              >
                CLASS
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(CATEGORIES) as HabitCategory[]).map((catKey) => {
                const cat = CATEGORIES[catKey];
                const isSelected = category === catKey;

                return (
                  <button
                    type="button"
                    key={catKey}
                    onClick={() => handleCategoryChange(catKey)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-left text-xs font-mono transition-all active:scale-95 focus:outline-none ${
                      isSelected
                        ? 'ring-2 ring-indigo-500 font-bold shadow-sm'
                        : 'hover:opacity-90'
                    }`}
                    style={{
                      backgroundColor: isSelected ? cat.bgTint : 'var(--orbit-surface-subtle)',
                      border: isSelected ? `1px solid ${cat.color}` : '1px solid var(--orbit-border)',
                      color: isSelected ? cat.color : 'var(--orbit-text)',
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="truncate uppercase font-bold text-[11px]">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 03 SIGNAL */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400">
                03
              </span>
              <label
                className="text-xs font-mono font-bold uppercase tracking-wider"
                style={{ color: 'var(--orbit-text)' }}
              >
                SIGNAL
              </label>
            </div>

            <div
              className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-36 overflow-y-auto p-2 rounded-xl no-scrollbar"
              style={{
                backgroundColor: 'var(--orbit-surface-subtle)',
                border: '1px solid var(--orbit-border)',
              }}
            >
              {AVAILABLE_ICON_NAMES.map((iconName) => {
                const isSelected = icon === iconName;
                return (
                  <button
                    type="button"
                    key={iconName}
                    onClick={() => setIcon(iconName)}
                    className={`h-9 rounded-lg flex items-center justify-center transition-all active:scale-90 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'opacity-70 hover:opacity-100 hover:bg-slate-500/10'
                    }`}
                    style={{
                      color: isSelected ? '#FFFFFF' : 'var(--orbit-text)',
                    }}
                    title={iconName}
                  >
                    <IconRenderer name={iconName} className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 04 DURATION */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400">
                  04
                </span>
                <label
                  htmlFor="habit-duration-input"
                  className="text-xs font-mono font-bold uppercase tracking-wider"
                  style={{ color: 'var(--orbit-text)' }}
                >
                  DURATION
                </label>
              </div>
              <span className="text-[10px] font-mono" style={{ color: 'var(--orbit-text-muted)' }}>
                OPTIONAL MINUTES
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="habit-duration-input"
                type="number"
                min="1"
                max="1440"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 30"
                className="w-full h-11 px-4 rounded-xl text-sm font-mono transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                style={{
                  backgroundColor: 'var(--orbit-surface-subtle)',
                  border: '1px solid var(--orbit-border)',
                  color: 'var(--orbit-text)',
                }}
              />
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    type="button"
                    key={mins}
                    onClick={() => setDuration(String(mins))}
                    className="px-2.5 h-10 rounded-lg text-xs font-mono font-semibold transition-all opacity-80 hover:opacity-100 active:scale-95"
                    style={{
                      backgroundColor: 'var(--orbit-surface-subtle)',
                      border: '1px solid var(--orbit-border)',
                      color: 'var(--orbit-text)',
                    }}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Actions: Cancel & Launch */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all active:scale-95"
              style={{
                backgroundColor: 'var(--orbit-surface-subtle)',
                border: '1px solid var(--orbit-border)',
                color: 'var(--orbit-text)',
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              id="save-habit-button"
              className="flex-1 h-12 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, var(--orbit-indigo), var(--orbit-cyan))',
                boxShadow: '0 4px 18px rgba(99, 102, 241, 0.4)',
              }}
            >
              <Rocket className="w-4 h-4" />
              <span>{isEdit ? 'Save Changes' : 'Launch'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
