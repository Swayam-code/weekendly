import { useEffect } from 'react';

interface KeyboardShortcuts {
  [key: string]: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if not typing in an input/textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      const ctrlKey = event.ctrlKey || event.metaKey;
      const altKey = event.altKey;
      const shiftKey = event.shiftKey;

      // Create a key combination string
      let combination = '';
      if (ctrlKey) combination += 'ctrl+';
      if (altKey) combination += 'alt+';
      if (shiftKey) combination += 'shift+';
      combination += key;

      // Check for exact match
      if (shortcuts[combination]) {
        event.preventDefault();
        shortcuts[combination]();
        return;
      }

      // Check for simple key match
      if (shortcuts[key]) {
        event.preventDefault();
        shortcuts[key]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Export common keyboard shortcut helpers
export const createShortcuts = (actions: {
  save?: () => void;
  export?: () => void;
  newPlan?: () => void;
  focusSearch?: () => void;
  clearFilters?: () => void;
}) => {
  const shortcuts: KeyboardShortcuts = {};

  if (actions.save) shortcuts['ctrl+s'] = actions.save;
  if (actions.export) shortcuts['ctrl+e'] = actions.export;
  if (actions.newPlan) shortcuts['ctrl+n'] = actions.newPlan;
  if (actions.focusSearch) shortcuts['ctrl+f'] = actions.focusSearch;
  if (actions.clearFilters) shortcuts['ctrl+shift+c'] = actions.clearFilters;

  return shortcuts;
};
