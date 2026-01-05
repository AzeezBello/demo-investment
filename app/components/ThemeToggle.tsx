'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-[color:var(--border,#e2e8f0)] bg-[color:var(--surface,#ffffff)] px-3 py-2 text-sm font-semibold text-[color:var(--foreground,#0f172a)] shadow-md backdrop-blur hover:shadow-lg transition"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span className="hidden sm:inline">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  );
}
