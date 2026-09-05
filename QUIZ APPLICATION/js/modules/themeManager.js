/**
 * QuizPulse - Theme Manager
 * Supports 4 rich curated themes: Dark Neon, Midnight Ocean, Cyberpunk, and Light Minimal.
 */

import { storage } from './storage.js';

export const THEMES = [
  { id: 'dark-neon', name: 'Dark Neon', icon: '🌌', preview: '#1e1e2f' },
  { id: 'midnight-ocean', name: 'Midnight Ocean', icon: '🌊', preview: '#0a192f' },
  { id: 'cyberpunk', name: 'Cyberpunk 2077', icon: '⚡', preview: '#0d0221' },
  { id: 'light-minimal', name: 'Clean Light', icon: '☀️', preview: '#f8fafc' }
];

class ThemeManager {
  constructor() {
    this.currentTheme = 'dark-neon';
  }

  init() {
    const settings = storage.getSettings();
    const savedTheme = settings.theme || 'dark-neon';
    this.setTheme(savedTheme, false);
  }

  setTheme(themeId, save = true) {
    if (!THEMES.some(t => t.id === themeId)) {
      themeId = 'dark-neon';
    }
    this.currentTheme = themeId;
    document.documentElement.setAttribute('data-theme', themeId);

    if (save) {
      const settings = storage.getSettings();
      settings.theme = themeId;
      storage.saveSettings(settings);
    }

    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeId } }));
  }

  getTheme() {
    return this.currentTheme;
  }
}

export const themeManager = new ThemeManager();
