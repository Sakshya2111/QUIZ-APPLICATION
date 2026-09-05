/**
 * QuizPulse - Main Application Orchestrator
 * Integrates state machine, UI views, event routing, modals, audio, and keyboard shortcuts.
 */

import { CATEGORIES, DEFAULT_QUESTIONS } from './data/defaultQuestions.js';
import { ACHIEVEMENTS } from './data/achievementsData.js';
import { storage } from './modules/storage.js';
import { audio } from './modules/audioManager.js';
import { confetti } from './modules/confetti.js';
import { themeManager, THEMES } from './modules/themeManager.js';
import { QuizEngine } from './modules/quizEngine.js';
import { quizCreator } from './modules/quizCreator.js';
import { analytics } from './modules/analytics.js';
import { keyboardNav } from './modules/keyboardNav.js';

class App {
  constructor() {
    this.currentView = 'home';
    this.activeQuiz = null;
    this.lastGameSummary = null;

    // Quick setup parameters
    this.selectedCategory = 'all';
    this.selectedDifficulty = 'all';
    this.selectedQuestionCount = 10;
    this.selectedMode = 'standard';

    // Multi-select temporary selection
    this.multiSelectedIndices = [];

    // DOM Elements Cache
    this.dom = {};
  }

  init() {
    this._cacheDOM();
    themeManager.init();
    this._renderCategoriesGrid();
    this._initEventListeners();
    this._initKeyboardNavigation();
    this._updateAudioButtonState();
    this.switchView('home');

    // Check initial achievements
    this._checkAndNotifyAchievements();
  }

  _cacheDOM() {
    this.dom = {
      // Views
      views: {
        home: document.getElementById('view-home'),
        quiz: document.getElementById('view-quiz'),
        results: document.getElementById('view-results'),
        creator: document.getElementById('view-creator'),
        analytics: document.getElementById('view-analytics'),
        achievements: document.getElementById('view-achievements')
      },
      navButtons: document.querySelectorAll('.nav-btn'),

      // Header Actions
      btnThemeToggle: document.getElementById('btn-theme-toggle'),
      btnAudioToggle: document.getElementById('btn-audio-toggle'),
      btnSettings: document.getElementById('btn-settings-open'),
      btnHelp: document.getElementById('btn-help-open'),

      // Home View
      categoriesGrid: document.getElementById('categories-grid'),
      filterCategoryPills: document.getElementById('filter-category-pills'),
      filterDifficultyPills: document.getElementById('filter-difficulty-pills'),
      filterCountPills: document.getElementById('filter-count-pills'),
      btnQuickStart: document.getElementById('btn-quick-start'),
      customDecksPreview: document.getElementById('custom-decks-home-list'),

      // Quiz Arena
      arenaCategoryPill: document.getElementById('arena-category-pill'),
      arenaProgressPill: document.getElementById('arena-progress-pill'),
      arenaScoreVal: document.getElementById('arena-score-val'),
      arenaStreakBadge: document.getElementById('arena-streak-badge'),
      arenaStreakVal: document.getElementById('arena-streak-val'),
      arenaLivesContainer: document.getElementById('arena-lives-container'),
      arenaProgressBar: document.getElementById('arena-progress-bar'),
      timerSvgCircle: document.getElementById('timer-svg-circle'),
      timerSecondsText: document.getElementById('timer-seconds-text'),
      timerBox: document.getElementById('timer-box'),
      questionTypeBadge: document.getElementById('question-type-badge'),
      questionDifficultyBadge: document.getElementById('question-difficulty-badge'),
      questionTitle: document.getElementById('question-title'),
      questionCodeArea: document.getElementById('question-code-area'),
      optionsContainer: document.getElementById('options-container'),
      textAnswerContainer: document.getElementById('text-answer-container'),
      textAnswerInput: document.getElementById('text-answer-input'),
      btnSubmitText: document.getElementById('btn-submit-text'),
      btnSubmitMulti: document.getElementById('btn-submit-multi'),
      explanationDrawer: document.getElementById('explanation-drawer'),
      explanationText: document.getElementById('explanation-text'),
      btnNextQuestion: document.getElementById('btn-next-question'),
      btnPauseQuiz: document.getElementById('btn-pause-quiz'),

      // Lifelines
      lifelineFiftyFifty: document.getElementById('lifeline-fifty-fifty'),
      lifelineHint: document.getElementById('lifeline-hint'),
      lifelineTimeFreeze: document.getElementById('lifeline-time-freeze'),
      lifelineSkip: document.getElementById('lifeline-skip'),

      // Results View
      resultsTrophy: document.getElementById('results-trophy'),
      resultsHeadline: document.getElementById('results-headline'),
      resultsSubhead: document.getElementById('results-subhead'),
      resultsScoreVal: document.getElementById('results-score-val'),
      resultsAccuracyVal: document.getElementById('results-accuracy-val'),
      resultsStreakVal: document.getElementById('results-streak-val'),
      resultsTimeVal: document.getElementById('results-time-val'),
      resultsReviewList: document.getElementById('results-review-list'),
      btnPlayAgain: document.getElementById('btn-play-again'),
      btnCertificateOpen: document.getElementById('btn-certificate-open'),
      btnShareScore: document.getElementById('btn-share-score'),
      btnResultsLobby: document.getElementById('btn-results-lobby'),

      // Creator View
      creatorDeckTitle: document.getElementById('creator-deck-title'),
      creatorDeckDesc: document.getElementById('creator-deck-desc'),
      creatorQuestionsList: document.getElementById('creator-questions-list'),
      creatorFormQuestion: document.getElementById('creator-form-question'),
      creatorFormType: document.getElementById('creator-form-type'),
      creatorFormDifficulty: document.getElementById('creator-form-difficulty'),
      creatorOptionsGroup: document.getElementById('creator-options-group'),
      creatorOptionsList: document.getElementById('creator-options-list'),
      creatorAddOptionBtn: document.getElementById('creator-add-option-btn'),
      creatorTextAnswerGroup: document.getElementById('creator-text-answer-group'),
      creatorAcceptableAnswers: document.getElementById('creator-acceptable-answers'),
      creatorFormHint: document.getElementById('creator-form-hint'),
      creatorFormExplanation: document.getElementById('creator-form-explanation'),
      btnSaveQuestion: document.getElementById('btn-save-question'),
      btnNewQuestion: document.getElementById('btn-new-question'),
      btnSaveDeck: document.getElementById('btn-save-deck'),
      btnExportDeckJson: document.getElementById('btn-export-deck-json'),
      btnImportJsonInput: document.getElementById('btn-import-json-input'),
      jsonFileInput: document.getElementById('json-file-input'),
      btnPlayThisDeck: document.getElementById('btn-play-this-deck'),
      creatorSavedDecksList: document.getElementById('creator-saved-decks-list'),

      // Analytics View
      analyticsTotalQuizzes: document.getElementById('analytics-total-quizzes'),
      analyticsTotalAnswered: document.getElementById('analytics-total-answered'),
      analyticsAccuracyPct: document.getElementById('analytics-accuracy-pct'),
      analyticsBestStreak: document.getElementById('analytics-best-streak'),
      analyticsTimeSpent: document.getElementById('analytics-time-spent'),
      analyticsCategoryBars: document.getElementById('analytics-category-bars'),
      analyticsHistoryTableBody: document.getElementById('analytics-history-tbody'),
      analyticsLeaderboardTbody: document.getElementById('analytics-leaderboard-tbody'),
      btnClearAllData: document.getElementById('btn-clear-all-data'),

      // Achievements View
      achievementsGrid: document.getElementById('achievements-grid'),
      achievementsProgressText: document.getElementById('achievements-progress-text'),
      achievementsProgressBar: document.getElementById('achievements-progress-bar'),

      // Modals
      modalSettings: document.getElementById('modal-settings'),
      modalHelp: document.getElementById('modal-help'),
      modalPause: document.getElementById('modal-pause'),
      modalCertificate: document.getElementById('modal-certificate'),
      modalThemes: document.getElementById('modal-themes'),

      // Certificate Modal Specifics
      certPlayerNameInput: document.getElementById('cert-player-name-input'),
      btnGenerateCert: document.getElementById('btn-generate-cert'),
      certImagePreview: document.getElementById('cert-image-preview'),
      btnDownloadCert: document.getElementById('btn-download-cert'),

      // Settings Modal Controls
      settingVolumeSlider: document.getElementById('setting-volume-slider'),
      settingTimerInput: document.getElementById('setting-timer-input'),
      settingAutoAdvance: document.getElementById('setting-auto-advance'),
      settingSoundToggle: document.getElementById('setting-sound-toggle'),

      // Toasts Container
      toastContainer: document.getElementById('toast-container')
    };
  }

  // --- VIEW ROUTING ---
  switchView(viewName) {
    Object.entries(this.dom.views).forEach(([key, element]) => {
      if (element) {
        if (key === viewName) {
          element.classList.add('active-view');
        } else {
          element.classList.remove('active-view');
        }
      }
    });

    this.dom.navButtons.forEach(btn => {
      if (btn.dataset.view === viewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    this.currentView = viewName;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Render specialized view data
    if (viewName === 'analytics') {
      this._renderAnalytics();
    } else if (viewName === 'achievements') {
      this._renderAchievements();
    } else if (viewName === 'creator') {
      this._renderCreatorSavedDecks();
    } else if (viewName === 'home') {
      this._renderHomeCustomDecks();
    }
  }

  // --- HOME VIEW CONTROLLER ---
  _renderCategoriesGrid() {
    if (!this.dom.categoriesGrid) return;
    this.dom.categoriesGrid.innerHTML = CATEGORIES.map(cat => `
      <div class="glass-card interactive-card category-card" data-cat-id="${cat.id}">
        <div class="cat-icon-wrap" style="color: ${cat.color};">
          ${cat.icon}
        </div>
        <div class="cat-info">
          <div class="cat-name">${cat.name}</div>
          <div class="cat-desc">${cat.description}</div>
        </div>
        <button class="btn btn-sm btn-secondary" style="border-color: ${cat.color}40; color: ${cat.color};">Play →</button>
      </div>
    `).join('');

    // Category click listener
    this.dom.categoriesGrid.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        audio.playClick();
        const catId = card.dataset.catId;
        this.selectedCategory = catId;
        this.startQuizGame({ category: catId });
      });
    });
  }

  _renderHomeCustomDecks() {
    if (!this.dom.customDecksPreview) return;
    const decks = storage.getCustomDecks();
    if (decks.length === 0) {
      this.dom.customDecksPreview.innerHTML = `
        <div class="glass-card" style="text-align: center; padding: 2rem;">
          <p style="color: var(--text-muted); margin-bottom: 1rem;">No custom quizzes created yet. Design your own with custom questions, hints, and explanations!</p>
          <button class="btn btn-secondary btn-sm" id="btn-create-first-deck">✨ Create Custom Quiz</button>
        </div>
      `;
      const btn = document.getElementById('btn-create-first-deck');
      if (btn) btn.addEventListener('click', () => this.switchView('creator'));
      return;
    }

    this.dom.customDecksPreview.innerHTML = `
      <div class="modes-grid" style="margin-bottom: 1rem;">
        ${decks.map(deck => `
          <div class="glass-card interactive-card mode-card mode-custom custom-deck-card" data-deck-id="${deck.id}">
            <div class="mode-icon">🎴</div>
            <div class="mode-title">${this._escapeHtml(deck.title)}</div>
            <div class="mode-desc">${this._escapeHtml(deck.description || 'Custom user deck')} (${deck.questions.length} questions)</div>
            <button class="btn btn-primary btn-sm btn-block">Play Deck ▶</button>
          </div>
        `).join('')}
      </div>
    `;

    this.dom.customDecksPreview.querySelectorAll('.custom-deck-card').forEach(card => {
      card.addEventListener('click', () => {
        audio.playClick();
        const deckId = card.dataset.deckId;
        this.startCustomQuiz(deckId);
      });
    });
  }

  // --- QUIZ START ORCHESTRATION ---
  startQuizGame(options = {}) {
    const mode = options.mode || this.selectedMode;
    const category = options.category || this.selectedCategory;
    const difficulty = options.difficulty || this.selectedDifficulty;
    const count = options.count || this.selectedQuestionCount;

    let pool = [...DEFAULT_QUESTIONS];

    // Category Filter
    if (category !== 'all') {
      pool = pool.filter(q => q.category === category);
    }

    // Difficulty Filter
    if (difficulty !== 'all') {
      pool = pool.filter(q => q.difficulty === difficulty);
    }

    // Shuffle pool
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    // Select question count
    const questions = mode === 'rapid' ? pool : pool.slice(0, Math.min(count, pool.length));

    if (questions.length === 0) {
      this.showToast('No questions found for selected criteria. Try broader filters.', '⚠️');
      return;
    }

    const catObj = CATEGORIES.find(c => c.id === category);
    const categoryTitle = catObj ? catObj.name : 'Mixed Trivia';

    const settings = storage.getSettings();

    this.activeQuiz = new QuizEngine({
      mode,
      questions,
      categoryName: categoryTitle,
      timerDuration: settings.timerDuration || 15,
      onQuestionChange: (data) => this._onQuizQuestionChange(data),
      onTimerTick: (sec, pct) => this._onQuizTimerTick(sec, pct),
      onAnswerResult: (res) => this._onQuizAnswerResult(res),
      onStreakChange: (streak) => this._onQuizStreakChange(streak),
      onLifelineUpdate: (type, details) => this._onQuizLifelineUpdate(type, details),
      onGameEnd: (summary) => this._onQuizGameEnd(summary)
    });

    this.switchView('quiz');
    this.activeQuiz.start();
  }

  startCustomQuiz(deckId) {
    const decks = storage.getCustomDecks();
    const deck = decks.find(d => d.id === deckId);
    if (!deck || !deck.questions || deck.questions.length === 0) {
      this.showToast('Deck is empty or not found.', '⚠️');
      return;
    }

    const settings = storage.getSettings();

    this.activeQuiz = new QuizEngine({
      mode: 'custom',
      questions: [...deck.questions],
      categoryName: deck.title,
      customDeckId: deck.id,
      timerDuration: settings.timerDuration || 15,
      onQuestionChange: (data) => this._onQuizQuestionChange(data),
      onTimerTick: (sec, pct) => this._onQuizTimerTick(sec, pct),
      onAnswerResult: (res) => this._onQuizAnswerResult(res),
      onStreakChange: (streak) => this._onQuizStreakChange(streak),
      onLifelineUpdate: (type, details) => this._onQuizLifelineUpdate(type, details),
      onGameEnd: (summary) => this._onQuizGameEnd(summary)
    });

    this.switchView('quiz');
    this.activeQuiz.start();
  }

  // --- QUIZ GAMEPLAY CALLBACKS ---
  _onQuizQuestionChange(data) {
    const q = data.question;
    this.multiSelectedIndices = [];

    // Header info
    if (this.dom.arenaCategoryPill) this.dom.arenaCategoryPill.textContent = this.activeQuiz.categoryName;
    if (this.dom.arenaProgressPill) this.dom.arenaProgressPill.textContent = `Q ${data.index + 1} / ${data.total}`;
    if (this.dom.arenaScoreVal) this.dom.arenaScoreVal.textContent = data.score;

    // Progress bar
    if (this.dom.arenaProgressBar) {
      const pct = ((data.index) / data.total) * 100;
      this.dom.arenaProgressBar.style.width = `${pct}%`;
    }

    // Lives for Rapid Fire
    if (this.dom.arenaLivesContainer) {
      if (data.mode === 'rapid') {
        this.dom.arenaLivesContainer.style.display = 'flex';
        this.dom.arenaLivesContainer.innerHTML = Array(3).fill(0).map((_, i) =>
          `<span style="color: ${i < data.lives ? '#ef4444' : '#475569'};">❤️</span>`
        ).join('');
      } else {
        this.dom.arenaLivesContainer.style.display = 'none';
      }
    }

    // Streak
    this._onQuizStreakChange(data.streak);

    // Lifeline buttons state
    this._updateLifelineButtons(data.lifelines);

    // Question Details
    if (this.dom.questionTypeBadge) {
      const typeLabels = { single: 'Single Choice', multiple: 'Multi-Select', boolean: 'True / False', text: 'Type Answer' };
      this.dom.questionTypeBadge.textContent = typeLabels[q.type] || 'Trivia';
    }

    if (this.dom.questionDifficultyBadge) {
      const diff = q.difficulty || 'medium';
      this.dom.questionDifficultyBadge.className = `badge badge-${diff}`;
      this.dom.questionDifficultyBadge.textContent = diff;
    }

    if (this.dom.questionTitle) {
      this.dom.questionTitle.textContent = q.question;
    }

    // Reset explanation drawer & next button
    if (this.dom.explanationDrawer) this.dom.explanationDrawer.classList.remove('visible');
    if (this.dom.btnNextQuestion) this.dom.btnNextQuestion.style.display = 'none';

    // Render Options / Inputs based on question type
    if (q.type === 'single' || q.type === 'boolean' || q.type === 'multiple') {
      if (this.dom.textAnswerContainer) this.dom.textAnswerContainer.style.display = 'none';
      if (this.dom.optionsContainer) {
        this.dom.optionsContainer.style.display = 'grid';
        this._renderOptions(q);
      }
      if (this.dom.btnSubmitMulti) {
        this.dom.btnSubmitMulti.style.display = q.type === 'multiple' ? 'inline-flex' : 'none';
        this.dom.btnSubmitMulti.disabled = true;
      }
    } else if (q.type === 'text') {
      if (this.dom.optionsContainer) this.dom.optionsContainer.style.display = 'none';
      if (this.dom.btnSubmitMulti) this.dom.btnSubmitMulti.style.display = 'none';
      if (this.dom.textAnswerContainer) {
        this.dom.textAnswerContainer.style.display = 'flex';
        if (this.dom.textAnswerInput) {
          this.dom.textAnswerInput.value = '';
          this.dom.textAnswerInput.disabled = false;
          this.dom.textAnswerInput.focus();
        }
        if (this.dom.btnSubmitText) this.dom.btnSubmitText.disabled = false;
      }
    }
  }

  _renderOptions(q) {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const options = q.displayOptions
      ? q.displayOptions.map(o => o.text)
      : (q.type === 'boolean' ? ['True', 'False'] : q.options);

    this.dom.optionsContainer.innerHTML = options.map((optText, idx) => `
      <button class="option-btn anim-pop" data-opt-idx="${idx}" id="option-btn-${idx}">
        <div class="option-key-badge">${idx + 1}</div>
        <div class="option-text">${this._escapeHtml(optText)}</div>
        <div class="option-status-icon">✓</div>
      </button>
    `).join('');

    this.dom.optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.optIdx, 10);
        this.handleOptionClick(idx);
      });
    });
  }

  handleOptionClick(displayIdx) {
    if (!this.activeQuiz || this.activeQuiz.isAnswered) return;

    const q = this.activeQuiz.activeQuestionData;

    if (q.type === 'single' || q.type === 'boolean') {
      audio.playClick();
      this.activeQuiz.submitAnswer(displayIdx);
    } else if (q.type === 'multiple') {
      audio.playClick();
      const btn = document.getElementById(`option-btn-${displayIdx}`);
      if (this.multiSelectedIndices.includes(displayIdx)) {
        this.multiSelectedIndices = this.multiSelectedIndices.filter(i => i !== displayIdx);
        if (btn) btn.classList.remove('selected');
      } else {
        this.multiSelectedIndices.push(displayIdx);
        if (btn) btn.classList.add('selected');
      }
      if (this.dom.btnSubmitMulti) {
        this.dom.btnSubmitMulti.disabled = this.multiSelectedIndices.length === 0;
      }
    }
  }

  _onQuizTimerTick(secondsLeft, percentage) {
    if (this.dom.timerSecondsText) {
      this.dom.timerSecondsText.textContent = secondsLeft;
    }

    if (this.dom.timerSvgCircle) {
      // Circumference = 2 * PI * 30 = ~188.5
      const offset = 188.5 - (188.5 * (percentage / 100));
      this.dom.timerSvgCircle.style.strokeDashoffset = offset;
    }

    if (this.dom.timerBox) {
      if (secondsLeft <= 4) {
        this.dom.timerBox.classList.add('timer-urgent');
      } else {
        this.dom.timerBox.classList.remove('timer-urgent');
      }
    }
  }

  _onQuizAnswerResult(result) {
    // Disable all options
    if (this.dom.optionsContainer) {
      const q = this.activeQuiz.activeQuestionData;
      const allBtns = this.dom.optionsContainer.querySelectorAll('.option-btn');

      allBtns.forEach(btn => {
        btn.disabled = true;
        const displayIdx = parseInt(btn.dataset.optIdx, 10);

        if (q.type === 'single') {
          const originalIdx = q.displayOptions ? q.displayOptions[displayIdx].originalIdx : displayIdx;
          if (originalIdx === result.correctAnswer) {
            btn.classList.add('correct');
          } else if (displayIdx === result.selectedAnswer || originalIdx === result.selectedAnswer) {
            btn.classList.add('wrong');
          }
        } else if (q.type === 'boolean') {
          if (displayIdx === result.correctAnswer) {
            btn.classList.add('correct');
          } else if (displayIdx === result.selectedAnswer) {
            btn.classList.add('wrong');
          }
        } else if (q.type === 'multiple') {
          const originalIdx = q.displayOptions ? q.displayOptions[displayIdx].originalIdx : displayIdx;
          const isExpected = result.correctAnswer.includes(originalIdx);
          const wasChosen = this.multiSelectedIndices.includes(displayIdx);

          if (isExpected) {
            btn.classList.add('correct');
          } else if (wasChosen && !isExpected) {
            btn.classList.add('wrong');
          }
        }
      });
    }

    // Text input lock
    if (this.dom.textAnswerInput) {
      this.dom.textAnswerInput.disabled = true;
      if (this.dom.btnSubmitText) this.dom.btnSubmitText.disabled = true;
    }

    // Update Score
    if (this.dom.arenaScoreVal) {
      this.dom.arenaScoreVal.textContent = result.score;
    }

    // Update Lives for Rapid Fire
    if (this.dom.arenaLivesContainer && this.activeQuiz.mode === 'rapid') {
      this.dom.arenaLivesContainer.innerHTML = Array(3).fill(0).map((_, i) =>
        `<span style="color: ${i < result.lives ? '#ef4444' : '#475569'};">❤️</span>`
      ).join('');
    }

    // Show Explanation
    if (result.explanation && this.dom.explanationDrawer && this.dom.explanationText) {
      this.dom.explanationText.textContent = result.explanation;
      this.dom.explanationDrawer.classList.add('visible');
    }

    // Show Next Question button
    if (this.dom.btnNextQuestion) {
      this.dom.btnNextQuestion.style.display = 'inline-flex';
    }

    // Auto Advance if enabled in practice/standard mode
    const settings = storage.getSettings();
    if (settings.autoAdvance && this.activeQuiz.mode !== 'practice') {
      const delay = result.isCorrect ? (settings.autoAdvanceDelay || 1400) : (settings.autoAdvanceDelay || 1800) + 400;
      setTimeout(() => {
        if (this.activeQuiz && this.activeQuiz.isAnswered && this.currentView === 'quiz') {
          this.activeQuiz.nextQuestion();
        }
      }, delay);
    }
  }

  _onQuizStreakChange(streak) {
    if (!this.dom.arenaStreakBadge || !this.dom.arenaStreakVal) return;
    this.dom.arenaStreakVal.textContent = streak;
    if (streak >= 3) {
      this.dom.arenaStreakBadge.classList.add('streak-active');
    } else {
      this.dom.arenaStreakBadge.classList.remove('streak-active');
    }
  }

  _updateLifelineButtons(lifelines) {
    if (this.dom.lifelineFiftyFifty) {
      this.dom.lifelineFiftyFifty.disabled = !lifelines.fiftyFifty.available || lifelines.fiftyFifty.used;
    }
    if (this.dom.lifelineHint) {
      this.dom.lifelineHint.disabled = !lifelines.hint.available || lifelines.hint.used;
    }
    if (this.dom.lifelineTimeFreeze) {
      this.dom.lifelineTimeFreeze.disabled = !lifelines.timeFreeze.available || lifelines.timeFreeze.used;
    }
    if (this.dom.lifelineSkip) {
      this.dom.lifelineSkip.disabled = !lifelines.skip.available || lifelines.skip.used;
    }
  }

  _onQuizLifelineUpdate(type, details) {
    if (type === 'fiftyFifty') {
      (details.disabledIndices || []).forEach(idx => {
        const btn = document.getElementById(`option-btn-${idx}`);
        if (btn) btn.classList.add('disabled-5050');
      });
      this.showToast('50:50 Activated: 2 incorrect options eliminated!', '✨');
    } else if (type === 'hint') {
      this.showToast(`Hint: ${details.hint}`, '💡');
    } else if (type === 'timeFreeze') {
      this.showToast('+15 Seconds added to the countdown timer!', '⏱️');
    } else if (type === 'skip') {
      this.showToast('Question skipped safely!', '⏭️');
    }
    if (this.activeQuiz) {
      this._updateLifelineButtons(this.activeQuiz.lifelines);
    }
  }

  // --- QUIZ COMPLETION / RESULTS ---
  _onQuizGameEnd(summary) {
    this.lastGameSummary = summary;

    // 1. Update stats & history in LocalStorage
    storage.updateStatsWithGame(summary);
    storage.addGameToHistory(summary);

    // 2. Check for newly unlocked achievements
    this._checkAndNotifyAchievements(summary);

    // 3. Render Results View
    this._renderResultsView(summary);

    // 4. Switch view
    this.switchView('results');

    // 5. Celebration Confetti if high score
    if (summary.scorePercentage >= 70) {
      confetti.fire({ count: 140, origin: { x: 0.5, y: 0.5 } });
      setTimeout(() => confetti.fire({ count: 90, origin: { x: 0.3, y: 0.4 } }), 500);
      setTimeout(() => confetti.fire({ count: 90, origin: { x: 0.7, y: 0.4 } }), 800);
    }
  }

  _renderResultsView(summary) {
    const isWin = summary.scorePercentage >= 70;
    const isFlawless = summary.scorePercentage === 100;

    if (this.dom.resultsTrophy) {
      this.dom.resultsTrophy.textContent = isFlawless ? '👑' : (isWin ? '🏆' : '🎯');
    }
    if (this.dom.resultsHeadline) {
      this.dom.resultsHeadline.textContent = isFlawless ? 'Flawless Victory!' : (isWin ? 'Outstanding Performance!' : 'Quiz Completed!');
    }
    if (this.dom.resultsSubhead) {
      this.dom.resultsSubhead.textContent = `You completed "${summary.categoryName}" with an accuracy of ${summary.scorePercentage}%.`;
    }

    if (this.dom.resultsScoreVal) this.dom.resultsScoreVal.textContent = summary.finalScore;
    if (this.dom.resultsAccuracyVal) this.dom.resultsAccuracyVal.textContent = `${summary.scorePercentage}%`;
    if (this.dom.resultsStreakVal) this.dom.resultsStreakVal.textContent = `${summary.maxStreak}x`;
    if (this.dom.resultsTimeVal) this.dom.resultsTimeVal.textContent = `${summary.timeSpentSeconds}s`;

    // Detailed Review List
    if (this.dom.resultsReviewList) {
      this.dom.resultsReviewList.innerHTML = summary.answers.map((ans, idx) => `
        <div class="glass-card review-item ${ans.isCorrect ? 'correct' : 'wrong'}">
          <div class="review-item-header">
            <span class="badge ${ans.isCorrect ? 'badge-easy' : 'badge-hard'}">
              ${ans.isCorrect ? '✓ Correct' : (ans.isTimeout ? '⌛ Timeout' : '✗ Incorrect')}
            </span>
            <span class="badge badge-pill">Q${idx + 1} (${ans.difficulty || 'medium'})</span>
          </div>
          <div class="review-q-text">${this._escapeHtml(ans.questionText)}</div>
          <div class="review-answers-grid">
            <div>
              <strong style="color: var(--text-muted);">Your Answer:</strong><br>
              <span style="color: ${ans.isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'}; font-weight: 600;">
                ${this._formatUserAnswer(ans)}
              </span>
            </div>
            <div>
              <strong style="color: var(--text-muted);">Correct Answer:</strong><br>
              <span style="color: var(--accent-cyan); font-weight: 600;">
                ${this._formatCorrectAnswer(ans)}
              </span>
            </div>
          </div>
          ${ans.explanation ? `
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem; background: var(--bg-glass); padding: 0.6rem; border-radius: 6px;">
              💡 <strong>Explanation:</strong> ${this._escapeHtml(ans.explanation)}
            </div>
          ` : ''}
        </div>
      `).join('');
    }
  }

  _formatUserAnswer(ans) {
    if (ans.isTimeout || ans.userAnswer === null || ans.userAnswer === undefined) return 'No answer (Timed out)';
    if (ans.type === 'text') return String(ans.userAnswer);
    if (ans.type === 'boolean') return ans.userAnswer === 0 ? 'True' : 'False';
    if (ans.type === 'single') {
      const q = DEFAULT_QUESTIONS.find(item => item.id === ans.questionId);
      if (q && q.options && q.options[ans.userAnswer]) return q.options[ans.userAnswer];
      return `Option ${ans.userAnswer + 1}`;
    }
    if (ans.type === 'multiple') {
      const q = DEFAULT_QUESTIONS.find(item => item.id === ans.questionId);
      if (q && q.options && Array.isArray(ans.userAnswer)) {
        return ans.userAnswer.map(i => q.options[i] || `Option ${i + 1}`).join(', ');
      }
      return Array.isArray(ans.userAnswer) ? ans.userAnswer.join(', ') : String(ans.userAnswer);
    }
    return String(ans.userAnswer);
  }

  _formatCorrectAnswer(ans) {
    if (ans.type === 'text') return (ans.acceptableAnswers || ['Any valid answer']).join(' / ');
    if (ans.type === 'boolean') return ans.correctAnswer === 0 ? 'True' : 'False';
    if (ans.type === 'single') {
      const q = DEFAULT_QUESTIONS.find(item => item.id === ans.questionId);
      if (q && q.options && q.options[ans.correctAnswer]) return q.options[ans.correctAnswer];
      return `Option ${ans.correctAnswer + 1}`;
    }
    if (ans.type === 'multiple') {
      const q = DEFAULT_QUESTIONS.find(item => item.id === ans.questionId);
      if (q && q.options && Array.isArray(ans.correctAnswer)) {
        return ans.correctAnswer.map(i => q.options[i] || `Option ${i + 1}`).join(', ');
      }
      return Array.isArray(ans.correctAnswer) ? ans.correctAnswer.join(', ') : String(ans.correctAnswer);
    }
    return String(ans.correctAnswer);
  }

  // --- CERTIFICATE GENERATOR MODAL ---
  openCertificateModal() {
    if (!this.lastGameSummary) {
      this.showToast('Complete a quiz first to generate a certificate.', 'ℹ️');
      return;
    }
    this.dom.modalCertificate.classList.add('active');
    this._renderCertificatePreview();
  }

  _renderCertificatePreview() {
    const name = this.dom.certPlayerNameInput.value.trim() || 'Quiz Master';
    const summary = this.lastGameSummary || { categoryName: 'General Trivia', scorePercentage: 100 };

    const dataUrl = analytics.generateCertificate({
      playerName: name,
      quizTitle: summary.categoryName,
      scorePercentage: summary.scorePercentage,
      correctCount: summary.correctAnswers,
      totalCount: summary.totalQuestions
    });

    if (this.dom.certImagePreview) {
      this.dom.certImagePreview.src = dataUrl;
    }
    if (this.dom.btnDownloadCert) {
      this.dom.btnDownloadCert.onclick = () => {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `quizpulse_certificate_${name.toLowerCase().replace(/\s+/g, '_')}.png`;
        a.click();
      };
    }
  }

  // --- ANALYTICS DASHBOARD VIEW ---
  _renderAnalytics() {
    const stats = storage.getStats();
    const history = storage.getHistory();
    const highScores = storage.getHighScores();

    if (this.dom.analyticsTotalQuizzes) this.dom.analyticsTotalQuizzes.textContent = stats.totalQuizzesCompleted;
    if (this.dom.analyticsTotalAnswered) this.dom.analyticsTotalAnswered.textContent = stats.totalQuestionsAnswered;

    const accuracy = stats.totalQuestionsAnswered > 0
      ? Math.round((stats.totalCorrectAnswers / stats.totalQuestionsAnswered) * 100)
      : 0;
    if (this.dom.analyticsAccuracyPct) this.dom.analyticsAccuracyPct.textContent = `${accuracy}%`;

    if (this.dom.analyticsBestStreak) this.dom.analyticsBestStreak.textContent = `${stats.bestStreakEver}x`;

    const mins = Math.floor(stats.totalTimeSpentSeconds / 60);
    const secs = stats.totalTimeSpentSeconds % 60;
    if (this.dom.analyticsTimeSpent) this.dom.analyticsTimeSpent.textContent = `${mins}m ${secs}s`;

    // Category Mastery Progress Bars
    if (this.dom.analyticsCategoryBars) {
      this.dom.analyticsCategoryBars.innerHTML = CATEGORIES.map(cat => {
        const catData = stats.categoryStats ? stats.categoryStats[cat.id] : null;
        const total = catData ? catData.answered : 0;
        const correct = catData ? catData.correct : 0;
        const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

        return `
          <div class="cat-bar-item">
            <div class="cat-bar-header">
              <span>${cat.icon} ${cat.name}</span>
              <span style="color: var(--accent-cyan); font-weight: 700;">${pct}% (${correct}/${total})</span>
            </div>
            <div class="cat-bar-track">
              <div class="cat-bar-fill" style="width: ${pct}%; background: ${cat.color};"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // History Table
    if (this.dom.analyticsHistoryTableBody) {
      if (history.length === 0) {
        this.dom.analyticsHistoryTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No games recorded yet.</td></tr>`;
      } else {
        this.dom.analyticsHistoryTableBody.innerHTML = history.slice(0, 10).map(rec => {
          const d = new Date(rec.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
          return `
            <tr>
              <td><strong>${this._escapeHtml(rec.categoryName || 'Mixed')}</strong></td>
              <td><span class="badge badge-pill">${rec.mode}</span></td>
              <td><strong style="color: var(--accent-cyan);">${rec.finalScore} pts</strong></td>
              <td>${rec.scorePercentage}%</td>
              <td>${d}</td>
            </tr>
          `;
        }).join('');
      }
    }

    // High Scores Leaderboard Table
    if (this.dom.analyticsLeaderboardTbody) {
      if (highScores.length === 0) {
        this.dom.analyticsLeaderboardTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No high scores registered yet.</td></tr>`;
      } else {
        this.dom.analyticsLeaderboardTbody.innerHTML = highScores.slice(0, 10).map((h, rank) => {
          const medal = rank === 0 ? '🥇' : (rank === 1 ? '🥈' : (rank === 2 ? '🥉' : `#${rank + 1}`));
          return `
            <tr>
              <td><strong>${medal}</strong></td>
              <td>${this._escapeHtml(h.category)}</td>
              <td><strong style="color: var(--accent-amber); font-size: 1.05rem;">${h.score}</strong></td>
              <td>${h.accuracy}%</td>
              <td>${h.time}s</td>
            </tr>
          `;
        }).join('');
      }
    }
  }

  // --- ACHIEVEMENTS GALLERY VIEW ---
  _renderAchievements() {
    const unlockedIds = storage.getUnlockedAchievements();
    const stats = storage.getStats();

    if (this.dom.achievementsProgressText) {
      this.dom.achievementsProgressText.textContent = `${unlockedIds.length} / ${ACHIEVEMENTS.length} Unlocked`;
    }
    if (this.dom.achievementsProgressBar) {
      const pct = Math.round((unlockedIds.length / ACHIEVEMENTS.length) * 100);
      this.dom.achievementsProgressBar.style.width = `${pct}%`;
    }

    if (this.dom.achievementsGrid) {
      this.dom.achievementsGrid.innerHTML = ACHIEVEMENTS.map(ach => {
        const isUnlocked = unlockedIds.includes(ach.id);
        return `
          <div class="glass-card achievement-card ${isUnlocked ? 'unlocked anim-glow' : 'locked'}">
            <div class="achievement-icon">${ach.icon}</div>
            <div class="achievement-title">${this._escapeHtml(ach.title)}</div>
            <div class="achievement-desc">${this._escapeHtml(ach.description)}</div>
            <div class="achievement-status-badge">
              <span class="badge ${isUnlocked ? 'badge-easy' : 'badge-pill'}">
                ${isUnlocked ? '✓ Unlocked' : '🔒 Locked'}
              </span>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  _checkAndNotifyAchievements(lastGame = null) {
    const newlyUnlocked = analytics.checkAchievements(lastGame);
    newlyUnlocked.forEach(ach => {
      this.showToast(`Achievement Unlocked: "${ach.title}" ${ach.icon}`, '🏆');
      audio.playFanfare();
    });
  }

  // --- CUSTOM QUIZ CREATOR VIEW ---
  _renderCreatorSavedDecks() {
    const decks = storage.getCustomDecks();
    if (!this.dom.creatorSavedDecksList) return;

    if (decks.length === 0) {
      this.dom.creatorSavedDecksList.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">No saved decks yet.</p>`;
      return;
    }

    this.dom.creatorSavedDecksList.innerHTML = decks.map(deck => `
      <div class="q-list-item">
        <div>
          <strong>${this._escapeHtml(deck.title)}</strong><br>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${deck.questions.length} questions</span>
        </div>
        <div style="display: flex; gap: 0.4rem;">
          <button class="btn btn-sm btn-secondary btn-edit-deck" data-deck-id="${deck.id}">Load</button>
          <button class="btn btn-sm btn-danger btn-delete-deck" data-deck-id="${deck.id}">🗑️</button>
        </div>
      </div>
    `).join('');

    this.dom.creatorSavedDecksList.querySelectorAll('.btn-edit-deck').forEach(btn => {
      btn.addEventListener('click', () => {
        const deck = quizCreator.loadDeck(btn.dataset.deckId);
        if (deck) {
          this._loadDeckIntoCreator(deck);
          this.showToast(`Loaded deck "${deck.title}"`, '📂');
        }
      });
    });

    this.dom.creatorSavedDecksList.querySelectorAll('.btn-delete-deck').forEach(btn => {
      btn.addEventListener('click', () => {
        const deckId = btn.dataset.deckId;
        if (confirm('Are you sure you want to delete this custom quiz?')) {
          storage.deleteCustomDeck(deckId);
          this._renderCreatorSavedDecks();
          this.showToast('Custom deck deleted.', '🗑️');
        }
      });
    });
  }

  _loadDeckIntoCreator(deck) {
    if (this.dom.creatorDeckTitle) this.dom.creatorDeckTitle.value = deck.title || '';
    if (this.dom.creatorDeckDesc) this.dom.creatorDeckDesc.value = deck.description || '';
    this._renderCreatorQuestionsList();
  }

  _renderCreatorQuestionsList() {
    if (!this.dom.creatorQuestionsList) return;
    const questions = quizCreator.currentDeck.questions;

    if (questions.length === 0) {
      this.dom.creatorQuestionsList.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; padding: 1rem 0;">No questions added yet.</p>`;
      return;
    }

    this.dom.creatorQuestionsList.innerHTML = questions.map((q, idx) => `
      <div class="q-list-item" data-q-id="${q.id}">
        <span style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">
          ${idx + 1}. ${this._escapeHtml(q.question)}
        </span>
        <button class="btn btn-sm btn-danger btn-delete-q" data-q-id="${q.id}">✕</button>
      </div>
    `).join('');

    this.dom.creatorQuestionsList.querySelectorAll('.btn-delete-q').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        quizCreator.deleteQuestion(btn.dataset.qId);
        this._renderCreatorQuestionsList();
      });
    });
  }

  _saveCurrentCreatorQuestion() {
    const text = this.dom.creatorFormQuestion.value.trim();
    const type = this.dom.creatorFormType.value;
    const difficulty = this.dom.creatorFormDifficulty.value;
    const hint = this.dom.creatorFormHint.value.trim();
    const explanation = this.dom.creatorFormExplanation.value.trim();

    if (!text) {
      this.showToast('Question text cannot be empty.', '⚠️');
      return;
    }

    let options = [];
    let answer = 0;
    let acceptableAnswers = [];

    if (type === 'single' || type === 'multiple') {
      const optInputs = this.dom.creatorOptionsList.querySelectorAll('.creator-option-input');
      options = Array.from(optInputs).map(inp => inp.value.trim()).filter(v => v.length > 0);

      if (options.length < 2) {
        this.showToast('Provide at least 2 non-empty options.', '⚠️');
        return;
      }

      if (type === 'single') {
        const checkedRadio = this.dom.creatorOptionsList.querySelector('input[type="radio"]:checked');
        answer = checkedRadio ? parseInt(checkedRadio.value, 10) : 0;
      } else {
        const checkedBoxes = this.dom.creatorOptionsList.querySelectorAll('input[type="checkbox"]:checked');
        answer = Array.from(checkedBoxes).map(cb => parseInt(cb.value, 10));
        if (answer.length === 0) {
          this.showToast('Check at least one correct option.', '⚠️');
          return;
        }
      }
    } else if (type === 'boolean') {
      options = ['True', 'False'];
      const checked = this.dom.creatorOptionsList.querySelector('input[type="radio"]:checked');
      answer = checked ? parseInt(checked.value, 10) : 0;
    } else if (type === 'text') {
      acceptableAnswers = this.dom.creatorAcceptableAnswers.value.split(',').map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
      if (acceptableAnswers.length === 0) {
        this.showToast('Provide at least one valid answer.', '⚠️');
        return;
      }
    }

    quizCreator.addQuestion({
      question: text,
      type,
      difficulty,
      options,
      answer,
      acceptableAnswers,
      hint,
      explanation
    });

    this._renderCreatorQuestionsList();
    this._resetQuestionForm();
    this.showToast('Question added to deck!', '✓');
    this._checkAndNotifyAchievements();
  }

  _resetQuestionForm() {
    if (this.dom.creatorFormQuestion) this.dom.creatorFormQuestion.value = '';
    if (this.dom.creatorFormHint) this.dom.creatorFormHint.value = '';
    if (this.dom.creatorFormExplanation) this.dom.creatorFormExplanation.value = '';
    if (this.dom.creatorAcceptableAnswers) this.dom.creatorAcceptableAnswers.value = '';
    this._updateCreatorOptionInputs('single');
  }

  _updateCreatorOptionInputs(type) {
    if (!this.dom.creatorOptionsGroup || !this.dom.creatorTextAnswerGroup || !this.dom.creatorOptionsList) return;

    if (type === 'text') {
      this.dom.creatorOptionsGroup.style.display = 'none';
      this.dom.creatorTextAnswerGroup.style.display = 'block';
    } else if (type === 'boolean') {
      this.dom.creatorOptionsGroup.style.display = 'block';
      this.dom.creatorTextAnswerGroup.style.display = 'none';
      this.dom.creatorOptionsList.innerHTML = `
        <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
          <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
            <input type="radio" name="creator_correct_bool" value="0" checked> True
          </label>
          <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
            <input type="radio" name="creator_correct_bool" value="1"> False
          </label>
        </div>
      `;
      if (this.dom.creatorAddOptionBtn) this.dom.creatorAddOptionBtn.style.display = 'none';
    } else {
      // single or multiple
      this.dom.creatorOptionsGroup.style.display = 'block';
      this.dom.creatorTextAnswerGroup.style.display = 'none';
      if (this.dom.creatorAddOptionBtn) this.dom.creatorAddOptionBtn.style.display = 'inline-flex';

      const inputType = type === 'single' ? 'radio' : 'checkbox';
      const inputName = type === 'single' ? 'creator_correct_radio' : 'creator_correct_check';

      this.dom.creatorOptionsList.innerHTML = [0, 1, 2, 3].map(i => `
        <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem;">
          <input type="${inputType}" name="${inputName}" value="${i}" ${i === 0 ? 'checked' : ''}>
          <input type="text" class="form-input creator-option-input" placeholder="Option ${i + 1}" value="">
        </div>
      `).join('');
    }
  }

  // --- GLOBAL EVENT LISTENERS & WIRING ---
  _initEventListeners() {
    // Navigation routing
    this.dom.navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        audio.playClick();
        const targetView = btn.dataset.view;
        this.switchView(targetView);
      });
    });

    // Header buttons
    if (this.dom.btnAudioToggle) {
      this.dom.btnAudioToggle.addEventListener('click', () => {
        audio.enabled = !audio.enabled;
        this._updateAudioButtonState();
        this.showToast(audio.enabled ? 'Sound FX Enabled' : 'Sound FX Muted', audio.enabled ? '🔊' : '🔇');
      });
    }

    if (this.dom.btnThemeToggle) {
      this.dom.btnThemeToggle.addEventListener('click', () => {
        this.dom.modalThemes.classList.add('active');
      });
    }

    if (this.dom.btnSettings) {
      this.dom.btnSettings.addEventListener('click', () => {
        this._syncSettingsModal();
        this.dom.modalSettings.classList.add('active');
      });
    }

    if (this.dom.btnHelp) {
      this.dom.btnHelp.addEventListener('click', () => {
        this.dom.modalHelp.classList.add('active');
      });
    }

    // Modal Close buttons
    document.querySelectorAll('.modal-close-btn, .btn-modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      });
    });

    // Home View: Filter pills
    this._initFilterPills();

    // Home View: Mode selection cards
    document.querySelectorAll('.mode-card[data-mode]').forEach(card => {
      card.addEventListener('click', () => {
        audio.playClick();
        const mode = card.dataset.mode;
        if (mode === 'custom') {
          this.switchView('creator');
        } else {
          this.selectedMode = mode;
          this.startQuizGame({ mode });
        }
      });
    });

    // Home View: Quick Start Button
    if (this.dom.btnQuickStart) {
      this.dom.btnQuickStart.addEventListener('click', () => {
        audio.playClick();
        this.startQuizGame();
      });
    }

    // Quiz Arena: Submit Text Input
    if (this.dom.btnSubmitText && this.dom.textAnswerInput) {
      const submitText = () => {
        if (!this.activeQuiz || this.activeQuiz.isAnswered) return;
        const val = this.dom.textAnswerInput.value.trim();
        if (val.length === 0) return;
        this.activeQuiz.submitAnswer(val);
      };
      this.dom.btnSubmitText.addEventListener('click', submitText);
      this.dom.textAnswerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submitText();
      });
    }

    // Quiz Arena: Submit Multi-Select
    if (this.dom.btnSubmitMulti) {
      this.dom.btnSubmitMulti.addEventListener('click', () => {
        if (!this.activeQuiz || this.activeQuiz.isAnswered) return;
        this.activeQuiz.submitAnswer(this.multiSelectedIndices);
      });
    }

    // Quiz Arena: Next Question
    if (this.dom.btnNextQuestion) {
      this.dom.btnNextQuestion.addEventListener('click', () => {
        audio.playClick();
        if (this.activeQuiz) this.activeQuiz.nextQuestion();
      });
    }

    // Quiz Arena: Pause
    if (this.dom.btnPauseQuiz) {
      this.dom.btnPauseQuiz.addEventListener('click', () => {
        if (this.activeQuiz) {
          this.activeQuiz.pause();
          this.dom.modalPause.classList.add('active');
        }
      });
    }

    const btnResume = document.getElementById('btn-resume-quiz');
    if (btnResume) {
      btnResume.addEventListener('click', () => {
        if (this.activeQuiz) this.activeQuiz.resume();
        this.dom.modalPause.classList.remove('active');
      });
    }

    const btnQuitQuiz = document.getElementById('btn-quit-quiz');
    if (btnQuitQuiz) {
      btnQuitQuiz.addEventListener('click', () => {
        if (this.activeQuiz) this.activeQuiz.destroy();
        this.dom.modalPause.classList.remove('active');
        this.switchView('home');
      });
    }

    // Quiz Arena: Lifelines
    if (this.dom.lifelineFiftyFifty) {
      this.dom.lifelineFiftyFifty.addEventListener('click', () => {
        if (this.activeQuiz) this.activeQuiz.useFiftyFifty();
      });
    }
    if (this.dom.lifelineHint) {
      this.dom.lifelineHint.addEventListener('click', () => {
        if (this.activeQuiz) this.activeQuiz.useHint();
      });
    }
    if (this.dom.lifelineTimeFreeze) {
      this.dom.lifelineTimeFreeze.addEventListener('click', () => {
        if (this.activeQuiz) this.activeQuiz.useTimeFreeze();
      });
    }
    if (this.dom.lifelineSkip) {
      this.dom.lifelineSkip.addEventListener('click', () => {
        if (this.activeQuiz) this.activeQuiz.useSkip();
      });
    }

    // Results Actions
    if (this.dom.btnPlayAgain) {
      this.dom.btnPlayAgain.addEventListener('click', () => {
        audio.playClick();
        if (this.lastGameSummary) {
          if (this.lastGameSummary.customDeckId) {
            this.startCustomQuiz(this.lastGameSummary.customDeckId);
          } else {
            this.startQuizGame({ mode: this.lastGameSummary.mode });
          }
        } else {
          this.startQuizGame();
        }
      });
    }

    if (this.dom.btnResultsLobby) {
      this.dom.btnResultsLobby.addEventListener('click', () => {
        audio.playClick();
        this.switchView('home');
      });
    }

    if (this.dom.btnCertificateOpen) {
      this.dom.btnCertificateOpen.addEventListener('click', () => {
        this.openCertificateModal();
      });
    }

    if (this.dom.btnGenerateCert) {
      this.dom.btnGenerateCert.addEventListener('click', () => {
        this._renderCertificatePreview();
      });
    }

    if (this.dom.btnShareScore) {
      this.dom.btnShareScore.addEventListener('click', () => {
        if (!this.lastGameSummary) return;
        const text = analytics.generateShareText(this.lastGameSummary);
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            this.showToast('Scorecard copied to clipboard! Share anywhere.', '📋');
          });
        } else {
          alert(text);
        }
      });
    }

    // Custom Quiz Creator: Form wiring
    if (this.dom.creatorFormType) {
      this.dom.creatorFormType.addEventListener('change', () => {
        this._updateCreatorOptionInputs(this.dom.creatorFormType.value);
      });
    }

    if (this.dom.btnSaveQuestion) {
      this.dom.btnSaveQuestion.addEventListener('click', () => {
        this._saveCurrentCreatorQuestion();
      });
    }

    if (this.dom.btnNewQuestion) {
      this.dom.btnNewQuestion.addEventListener('click', () => {
        this._resetQuestionForm();
      });
    }

    if (this.dom.btnSaveDeck) {
      this.dom.btnSaveDeck.addEventListener('click', () => {
        quizCreator.currentDeck.title = this.dom.creatorDeckTitle.value.trim();
        quizCreator.currentDeck.description = this.dom.creatorDeckDesc.value.trim();

        const res = quizCreator.save();
        if (res.isValid) {
          this.showToast(`Quiz deck "${res.deck.title}" saved successfully!`, '💾');
          this._renderCreatorSavedDecks();
          this._checkAndNotifyAchievements();
        } else {
          this.showToast(res.errors[0] || 'Please complete the quiz requirements.', '⚠️');
        }
      });
    }

    if (this.dom.btnExportDeckJson) {
      this.dom.btnExportDeckJson.addEventListener('click', () => {
        quizCreator.currentDeck.title = this.dom.creatorDeckTitle.value.trim() || 'Custom Quiz';
        quizCreator.exportDeckJSON();
        this.showToast('Quiz exported as JSON file.', '📥');
      });
    }

    if (this.dom.btnImportJsonInput && this.dom.jsonFileInput) {
      this.dom.btnImportJsonInput.addEventListener('click', () => {
        this.dom.jsonFileInput.click();
      });

      this.dom.jsonFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const res = quizCreator.importDeckFromJSON(event.target.result);
          if (res.success) {
            this._loadDeckIntoCreator(res.deck);
            this.showToast(`Successfully imported "${res.deck.title}"!`, '🎉');
          } else {
            this.showToast(`Import error: ${res.error}`, '❌');
          }
        };
        reader.readAsText(file);
      });
    }

    if (this.dom.btnPlayThisDeck) {
      this.dom.btnPlayThisDeck.addEventListener('click', () => {
        quizCreator.currentDeck.title = this.dom.creatorDeckTitle.value.trim() || 'My Custom Quiz';
        const res = quizCreator.save();
        if (res.isValid) {
          this.startCustomQuiz(res.deck.id);
        } else {
          this.showToast(res.errors[0] || 'Complete the deck before playing.', '⚠️');
        }
      });
    }

    // Theme selector cards inside modal
    document.querySelectorAll('.theme-choice-card').forEach(card => {
      card.addEventListener('click', () => {
        const themeId = card.dataset.themeId;
        themeManager.setTheme(themeId);
        this.showToast(`Switched theme to ${themeId}`, '🎨');
      });
    });

    // Analytics: Clear all data
    if (this.dom.btnClearAllData) {
      this.dom.btnClearAllData.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all quiz stats, history, and custom decks?')) {
          storage.clearAllData();
          this._renderAnalytics();
          this._renderAchievements();
          this.showToast('All local application data reset.', '🧹');
        }
      });
    }

    // Settings Modal Save
    const btnSaveSettings = document.getElementById('btn-save-settings');
    if (btnSaveSettings) {
      btnSaveSettings.addEventListener('click', () => {
        const settings = storage.getSettings();
        settings.soundVolume = parseFloat(this.dom.settingVolumeSlider.value);
        settings.timerDuration = parseInt(this.dom.settingTimerInput.value, 10) || 15;
        settings.autoAdvance = this.dom.settingAutoAdvance.checked;
        settings.soundEnabled = this.dom.settingSoundToggle.checked;

        storage.saveSettings(settings);
        audio.volume = settings.soundVolume;
        audio.enabled = settings.soundEnabled;
        this._updateAudioButtonState();

        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        this.showToast('Settings saved successfully.', '⚙️');
      });
    }
  }

  _initFilterPills() {
    // Category pills
    if (this.dom.filterCategoryPills) {
      this.dom.filterCategoryPills.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          this.dom.filterCategoryPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.selectedCategory = pill.dataset.cat;
        });
      });
    }

    // Difficulty pills
    if (this.dom.filterDifficultyPills) {
      this.dom.filterDifficultyPills.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          this.dom.filterDifficultyPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.selectedDifficulty = pill.dataset.diff;
        });
      });
    }

    // Count pills
    if (this.dom.filterCountPills) {
      this.dom.filterCountPills.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          this.dom.filterCountPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.selectedQuestionCount = parseInt(pill.dataset.count, 10);
        });
      });
    }
  }

  _initKeyboardNavigation() {
    keyboardNav.setHandlers({
      onOptionSelect: (index) => {
        if (this.currentView === 'quiz') {
          this.handleOptionClick(index);
        }
      },
      onNext: () => {
        if (this.currentView === 'quiz' && this.activeQuiz && this.activeQuiz.isAnswered) {
          this.activeQuiz.nextQuestion();
        }
      },
      onLifeline: (type) => {
        if (this.currentView === 'quiz' && this.activeQuiz) {
          if (type === 'hint') this.activeQuiz.useHint();
          else if (type === 'fiftyFifty') this.activeQuiz.useFiftyFifty();
          else if (type === 'timeFreeze') this.activeQuiz.useTimeFreeze();
          else if (type === 'skip') this.activeQuiz.useSkip();
        }
      },
      onPause: () => {
        if (this.currentView === 'quiz' && this.activeQuiz) {
          this.activeQuiz.pause();
          this.dom.modalPause.classList.add('active');
        } else {
          document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        }
      },
      onToggleHelp: () => {
        this.dom.modalHelp.classList.toggle('active');
      }
    });
  }

  _syncSettingsModal() {
    const settings = storage.getSettings();
    if (this.dom.settingVolumeSlider) this.dom.settingVolumeSlider.value = settings.soundVolume ?? 0.5;
    if (this.dom.settingTimerInput) this.dom.settingTimerInput.value = settings.timerDuration ?? 15;
    if (this.dom.settingAutoAdvance) this.dom.settingAutoAdvance.checked = settings.autoAdvance !== false;
    if (this.dom.settingSoundToggle) this.dom.settingSoundToggle.checked = settings.soundEnabled !== false;
  }

  _updateAudioButtonState() {
    if (this.dom.btnAudioToggle) {
      this.dom.btnAudioToggle.textContent = audio.enabled ? '🔊' : '🔇';
    }
  }

  // --- TOAST ALERTS ---
  showToast(message, icon = '🔔') {
    if (!this.dom.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-body">
        <div class="toast-title">QuizPulse</div>
        <div style="font-size: 0.85rem; color: var(--text-secondary);">${this._escapeHtml(message)}</div>
      </div>
    `;
    this.dom.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  _escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Bootstrap on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.app.init();
});
