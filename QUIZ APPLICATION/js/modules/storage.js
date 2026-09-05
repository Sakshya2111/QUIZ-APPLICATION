/**
 * QuizPulse - Local Storage & Data Persistence Manager
 * Handles user statistics, gameplay history, custom decks, achievements & settings.
 */

const STORAGE_KEYS = {
  STATS: 'quizpulse_stats_v1',
  HISTORY: 'quizpulse_history_v1',
  CUSTOM_DECKS: 'quizpulse_custom_decks_v1',
  ACHIEVEMENTS: 'quizpulse_achievements_v1',
  SETTINGS: 'quizpulse_settings_v1',
  HIGH_SCORES: 'quizpulse_highscores_v1'
};

const DEFAULT_SETTINGS = {
  theme: 'dark-neon',
  soundEnabled: true,
  soundVolume: 0.5,
  timerDuration: 15,
  autoAdvance: true,
  autoAdvanceDelay: 1500,
  showHints: true
};

const DEFAULT_STATS = {
  totalQuizzesCompleted: 0,
  totalQuestionsAnswered: 0,
  totalCorrectAnswers: 0,
  totalTimeSpentSeconds: 0,
  bestStreakEver: 0,
  customQuizzesCreated: 0,
  categoryStats: {},
  difficultyStats: {
    easy: { answered: 0, correct: 0 },
    medium: { answered: 0, correct: 0 },
    hard: { answered: 0, correct: 0 }
  }
};

class StorageManager {
  constructor() {
    this._initDefaults();
  }

  _isStorageAvailable() {
    try {
      return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    } catch (e) {
      return false;
    }
  }

  _getItem(key) {
    try {
      if (this._isStorageAvailable()) {
        return window.localStorage.getItem(key);
      }
      return this._memoryStore ? this._memoryStore[key] : null;
    } catch (e) {
      return null;
    }
  }

  _setItem(key, val) {
    try {
      if (this._isStorageAvailable()) {
        window.localStorage.setItem(key, val);
      } else {
        if (!this._memoryStore) this._memoryStore = {};
        this._memoryStore[key] = String(val);
      }
    } catch (e) {
      console.warn('Storage setItem failed', e);
    }
  }

  _removeItem(key) {
    try {
      if (this._isStorageAvailable()) {
        window.localStorage.removeItem(key);
      } else if (this._memoryStore) {
        delete this._memoryStore[key];
      }
    } catch (e) {}
  }

  _initDefaults() {
    if (!this._getItem(STORAGE_KEYS.STATS)) {
      this.saveStats(DEFAULT_STATS);
    }
    if (!this._getItem(STORAGE_KEYS.SETTINGS)) {
      this.saveSettings(DEFAULT_SETTINGS);
    }
    if (!this._getItem(STORAGE_KEYS.ACHIEVEMENTS)) {
      this.saveUnlockedAchievements(['first-step']); // Unlocked on first check if qualified
      this._setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify([]));
    }
    if (!this._getItem(STORAGE_KEYS.CUSTOM_DECKS)) {
      this._setItem(STORAGE_KEYS.CUSTOM_DECKS, JSON.stringify([]));
    }
    if (!this._getItem(STORAGE_KEYS.HISTORY)) {
      this._setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
    }
    if (!this._getItem(STORAGE_KEYS.HIGH_SCORES)) {
      this._setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify([]));
    }
  }

  // --- STATS ---
  getStats() {
    try {
      const data = this._getItem(STORAGE_KEYS.STATS);
      return data ? { ...DEFAULT_STATS, ...JSON.parse(data) } : { ...DEFAULT_STATS };
    } catch (e) {
      console.error('Failed reading stats from localStorage', e);
      return { ...DEFAULT_STATS };
    }
  }

  saveStats(stats) {
    try {
      this._setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed saving stats to localStorage', e);
    }
  }

  updateStatsWithGame(gameSummary) {
    const stats = this.getStats();

    stats.totalQuizzesCompleted += 1;
    stats.totalQuestionsAnswered += gameSummary.totalQuestions;
    stats.totalCorrectAnswers += gameSummary.correctAnswers;
    stats.totalTimeSpentSeconds += gameSummary.timeSpentSeconds;

    if (gameSummary.maxStreak > stats.bestStreakEver) {
      stats.bestStreakEver = gameSummary.maxStreak;
    }

    // Category breakdown
    if (!stats.categoryStats) stats.categoryStats = {};
    if (!stats.categoryHistory) stats.categoryHistory = {};

    if (gameSummary.categoryBreakdown) {
      Object.entries(gameSummary.categoryBreakdown).forEach(([catId, data]) => {
        if (!stats.categoryStats[catId]) {
          stats.categoryStats[catId] = { answered: 0, correct: 0 };
        }
        stats.categoryStats[catId].answered += data.total;
        stats.categoryStats[catId].correct += data.correct;
        stats.categoryHistory[catId] = (stats.categoryHistory[catId] || 0) + 1;
      });
    }

    // Difficulty breakdown
    if (gameSummary.difficultyBreakdown) {
      Object.entries(gameSummary.difficultyBreakdown).forEach(([diff, data]) => {
        if (!stats.difficultyStats[diff]) {
          stats.difficultyStats[diff] = { answered: 0, correct: 0 };
        }
        stats.difficultyStats[diff].answered += data.total;
        stats.difficultyStats[diff].correct += data.correct;
      });
    }

    this.saveStats(stats);
    return stats;
  }

  // --- HISTORY ---
  getHistory() {
    try {
      const data = this._getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed reading history', e);
      return [];
    }
  }

  addGameToHistory(gameSummary) {
    try {
      const history = this.getHistory();
      // Keep maximum 50 records
      const record = {
        id: 'game_' + Date.now(),
        timestamp: new Date().toISOString(),
        ...gameSummary
      };
      history.unshift(record);
      if (history.length > 50) {
        history.pop();
      }
      this._setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));

      this._updateLeaderboard(record);
      return record;
    } catch (e) {
      console.error('Failed adding game history', e);
      return null;
    }
  }

  // --- LEADERBOARD / HIGH SCORES ---
  getHighScores() {
    try {
      const data = this._getItem(STORAGE_KEYS.HIGH_SCORES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  _updateLeaderboard(record) {
    try {
      const highScores = this.getHighScores();
      highScores.push({
        id: record.id,
        date: record.timestamp,
        mode: record.mode,
        category: record.categoryName || 'Mixed',
        score: record.finalScore,
        accuracy: record.scorePercentage,
        time: record.timeSpentSeconds
      });
      // Sort by score descending, then accuracy descending
      highScores.sort((a, b) => b.score - a.score || b.accuracy - a.accuracy);
      // Keep top 20
      const top20 = highScores.slice(0, 20);
      this._setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(top20));
    } catch (e) {
      console.error('Failed updating high scores', e);
    }
  }

  // --- CUSTOM DECKS ---
  getCustomDecks() {
    try {
      const data = this._getItem(STORAGE_KEYS.CUSTOM_DECKS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed reading custom decks', e);
      return [];
    }
  }

  saveCustomDeck(deck) {
    try {
      const decks = this.getCustomDecks();
      const existingIndex = decks.findIndex(d => d.id === deck.id);
      if (existingIndex >= 0) {
        decks[existingIndex] = { ...deck, updatedAt: new Date().toISOString() };
      } else {
        decks.push({
          ...deck,
          id: deck.id || 'deck_' + Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        // increment created count in stats
        const stats = this.getStats();
        stats.customQuizzesCreated = (stats.customQuizzesCreated || 0) + 1;
        this.saveStats(stats);
      }
      this._setItem(STORAGE_KEYS.CUSTOM_DECKS, JSON.stringify(decks));
      return true;
    } catch (e) {
      console.error('Failed saving custom deck', e);
      return false;
    }
  }

  deleteCustomDeck(deckId) {
    try {
      let decks = this.getCustomDecks();
      decks = decks.filter(d => d.id !== deckId);
      this._setItem(STORAGE_KEYS.CUSTOM_DECKS, JSON.stringify(decks));
      return true;
    } catch (e) {
      return false;
    }
  }

  // --- ACHIEVEMENTS ---
  getUnlockedAchievements() {
    try {
      const data = this._getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveUnlockedAchievements(unlockedArray) {
    try {
      this._setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(unlockedArray));
    } catch (e) {
      console.error('Failed saving achievements', e);
    }
  }

  unlockAchievement(achievementId) {
    const unlocked = this.getUnlockedAchievements();
    if (!unlocked.includes(achievementId)) {
      unlocked.push(achievementId);
      this.saveUnlockedAchievements(unlocked);
      return true; // Newly unlocked!
    }
    return false;
  }

  // --- SETTINGS ---
  getSettings() {
    try {
      const data = this._getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : { ...DEFAULT_SETTINGS };
    } catch (e) {
      return { ...DEFAULT_SETTINGS };
    }
  }

  saveSettings(settings) {
    try {
      this._setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ ...DEFAULT_SETTINGS, ...settings }));
    } catch (e) {
      console.error('Failed saving settings', e);
    }
  }

  clearAllData() {
    this._removeItem(STORAGE_KEYS.STATS);
    this._removeItem(STORAGE_KEYS.HISTORY);
    this._removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    this._removeItem(STORAGE_KEYS.CUSTOM_DECKS);
    this._removeItem(STORAGE_KEYS.HIGH_SCORES);
    this._initDefaults();
  }
}

export const storage = new StorageManager();

