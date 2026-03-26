/**
 * useSEOKeyboardShortcuts
 * 
 * Extracted keyboard shortcut handlers from SEORightPanel.
 * Handles Cmd+S save and Cmd+1-7 tab switching.
 * 
 * Gap A2: SEORightPanel refactoring
 */

import { useEffect, useCallback } from 'react';

interface TabConfig {
  id: string;
  label: string;
}

interface UseSEOKeyboardShortcutsOptions {
  tabs: TabConfig[];
  onSave: () => void;
  onTabChange: (tabId: string) => void;
}

export function useSEOKeyboardShortcuts({
  tabs,
  onSave,
  onTabChange,
}: UseSEOKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const isMod = e.metaKey || e.ctrlKey;
    
    // Cmd/Ctrl + S = Save
    if (isMod && e.key === 's') {
      e.preventDefault();
      onSave();
      return;
    }
    
    // Cmd/Ctrl + 1-9 = Switch tabs
    if (isMod && e.key >= '1' && e.key <= '9') {
      e.preventDefault();
      const tabIndex = parseInt(e.key) - 1;
      if (tabs[tabIndex]) {
        onTabChange(tabs[tabIndex].id);
      }
    }
  }, [tabs, onSave, onTabChange]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
