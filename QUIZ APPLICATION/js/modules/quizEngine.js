/**
 * QuizPulse - Core Quiz Gameplay Engine & State Machine
 * Manages game modes, question pacing, scoring algorithm, lifelines, and timer loops.
 */

import { audio } from './audioManager.js';

export class QuizEngine {
  constructor(config = {}) {
    this.mode = config.mode || 'standard'; // 'standard' | 'rapid' | 'practice' | 'custom'
    this.questions = config.questions || [];
    this.categoryName = config.categoryName || 'General Mix';
    this.timerDuration = config.timerDuration || 15;
    this.customDeckId = config.customDeckId || null;

    // Callbacks
    this.onQuestionChange = config.onQuestionChange || (() => {});
    this.onTimerTick = config.onTimerTick || (() => {});
    this.onAnswerResult = config.onAnswerResult || (() => {});
    this.onStreakChange = config.onStreakChange || (() => {});
    this.onLifelineUpdate = config.onLifelineUpdate || (() => {});
    this.onGameEnd = config.onGameEnd || (() => {});

    // State
    this.currentIndex = 0;
    this.currentQuestion = null;
    this.score = 0;
    this.currentStreak = 0;
    this.maxStreak = 0;
    this.lives = this.mode === 'rapid' ? 3 : null;
    this.isPaused = false;
    this.isAnswered = false;
    this.startTime = null;
    this.questionStartTime = null;
    this.timerInterval = null;
    this.secondsLeft = this.timerDuration;
    this.userAnswers = []; // Record of every question answer details
    this.lifelinesUsedCount = 0;

    // Lifeline availability (1 use each per quiz in standard/custom mode)
    this.lifelines = {
      fiftyFifty: { available: this.mode !== 'rapid', used: false },
      hint: { available: true, used: false },
      timeFreeze: { available: this.mode !== 'practice', used: false },
      skip: { available: this.mode !== 'rapid', used: false }
    };
  }

  start() {
    this.currentIndex = 0;
    this.score = 0;
    this.currentStreak = 0;
    this.maxStreak = 0;
    this.userAnswers = [];
    this.lifelinesUsedCount = 0;
    this.startTime = Date.now();
    this.loadQuestion(0);
  }

  loadQuestion(index) {
    if (index >= this.questions.length) {
      this.finishGame();
      return;
    }

    this.currentIndex = index;
    this.currentQuestion = this.questions[index];
    this.isAnswered = false;
    this.secondsLeft = this.mode === 'rapid' ? 10 : this.timerDuration;
    this.questionStartTime = Date.now();

    // Prepare question clone with randomized options if single/multiple
    this.activeQuestionData = this._prepareQuestion(this.currentQuestion);

    this.onQuestionChange({
      index: this.currentIndex,
      total: this.questions.length,
      question: this.activeQuestionData,
      mode: this.mode,
      lives: this.lives,
      score: this.score,
      streak: this.currentStreak,
      lifelines: this.lifelines
    });

    if (this.mode !== 'practice') {
      this._startTimer();
    }
  }

  _prepareQuestion(q) {
    const cloned = JSON.parse(JSON.stringify(q));
    // For single or multiple choice questions, preserve original answer mappings
    if ((cloned.type === 'single' || cloned.type === 'multiple') && cloned.options) {
      const indexedOptions = cloned.options.map((text, originalIdx) => ({ text, originalIdx }));
      // Shuffle options for variation
      for (let i = indexedOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexedOptions[i], indexedOptions[j]] = [indexedOptions[j], indexedOptions[i]];
      }
      cloned.displayOptions = indexedOptions;
    }
    return cloned;
  }

  _startTimer() {
    this._stopTimer();
    this.onTimerTick(this.secondsLeft, 100);

    this.timerInterval = setInterval(() => {
      if (this.isPaused || this.isAnswered) return;

      this.secondsLeft -= 1;
      const pct = Math.max(0, (this.secondsLeft / (this.mode === 'rapid' ? 10 : this.timerDuration)) * 100);
      this.onTimerTick(this.secondsLeft, pct);

      if (this.secondsLeft <= 4 && this.secondsLeft > 0) {
        audio.playUrgentTick();
      } else if (this.secondsLeft > 4) {
        audio.playTick();
      }

      if (this.secondsLeft <= 0) {
        this._stopTimer();
        this.handleTimeout();
      }
    }, 1000);
  }

  _stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  handleTimeout() {
    if (this.isAnswered) return;
    this.isAnswered = true;
    audio.playWrong();

    this.currentStreak = 0;
    this.onStreakChange(0);

    if (this.mode === 'rapid') {
      this.lives -= 1;
    }

    const timeSpent = (Date.now() - this.questionStartTime) / 1000;

    const answerRecord = {
      questionId: this.currentQuestion.id,
      questionText: this.currentQuestion.question,
      category: this.currentQuestion.category,
      difficulty: this.currentQuestion.difficulty || 'medium',
      type: this.currentQuestion.type,
      userAnswer: null,
      correctAnswer: this.currentQuestion.answer,
      isCorrect: false,
      isTimeout: true,
      timeSpent: timeSpent,
      pointsEarned: 0,
      explanation: this.currentQuestion.explanation || ''
    };

    this.userAnswers.push(answerRecord);

    this.onAnswerResult({
      isCorrect: false,
      isTimeout: true,
      correctAnswer: this.currentQuestion.answer,
      selectedAnswer: null,
      explanation: this.currentQuestion.explanation,
      pointsEarned: 0,
      lives: this.lives,
      streak: 0,
      score: this.score
    });

    if (this.mode === 'rapid' && this.lives <= 0) {
      setTimeout(() => this.finishGame(), 1200);
    }
  }

  /**
   * Evaluates user's answer submission
   * @param {*} rawAnswer - index (single/boolean), array of indexes (multiple), or string (text)
   */
  submitAnswer(rawAnswer) {
    if (this.isAnswered) return null;
    this.isAnswered = true;
    this._stopTimer();

    const timeSpent = Math.max(0.1, (Date.now() - this.questionStartTime) / 1000);
    let isCorrect = false;
    let mappedAnswer = rawAnswer;

    const q = this.currentQuestion;
    const activeQ = this.activeQuestionData;

    if (q.type === 'single') {
      // Map display index back to original index
      const chosenOption = activeQ.displayOptions ? activeQ.displayOptions[rawAnswer] : null;
      mappedAnswer = chosenOption ? chosenOption.originalIdx : rawAnswer;
      isCorrect = mappedAnswer === q.answer;
    } else if (q.type === 'boolean') {
      mappedAnswer = Number(rawAnswer);
      isCorrect = mappedAnswer === Number(q.answer);
    } else if (q.type === 'multiple') {
      // rawAnswer is array of display indexes
      const chosenOriginalIndices = (rawAnswer || []).map(idx =>
        activeQ.displayOptions ? activeQ.displayOptions[idx].originalIdx : idx
      ).sort();
      mappedAnswer = chosenOriginalIndices;
      const expected = [...q.answer].sort();
      isCorrect = JSON.stringify(chosenOriginalIndices) === JSON.stringify(expected);
    } else if (q.type === 'text') {
      const cleanUser = String(rawAnswer || '').trim().toLowerCase();
      const acceptable = (q.acceptableAnswers || []).map(a => String(a).trim().toLowerCase());
      isCorrect = acceptable.includes(cleanUser);
      mappedAnswer = rawAnswer;
    }

    // Points calculation
    let pointsEarned = 0;
    if (isCorrect) {
      this.currentStreak += 1;
      if (this.currentStreak > this.maxStreak) {
        this.maxStreak = this.currentStreak;
      }

      // Base points
      const basePoints = q.difficulty === 'hard' ? 300 : (q.difficulty === 'easy' ? 100 : 200);

      // Speed bonus: up to +50 points for fast answering
      const maxTime = this.mode === 'rapid' ? 10 : this.timerDuration;
      const speedRatio = Math.max(0, (maxTime - timeSpent) / maxTime);
      const speedBonus = Math.round(speedRatio * 50);

      // Streak multiplier
      let streakMultiplier = 1.0;
      if (this.currentStreak >= 8) streakMultiplier = 2.0;
      else if (this.currentStreak >= 5) streakMultiplier = 1.5;
      else if (this.currentStreak >= 3) streakMultiplier = 1.25;

      pointsEarned = Math.round((basePoints + speedBonus) * streakMultiplier);
      this.score += pointsEarned;

      audio.playCorrect();
      if (this.currentStreak >= 3) {
        audio.playStreak(this.currentStreak);
      }
    } else {
      this.currentStreak = 0;
      audio.playWrong();
      if (this.mode === 'rapid') {
        this.lives -= 1;
      }
    }

    this.onStreakChange(this.currentStreak);

    const answerRecord = {
      questionId: q.id,
      questionText: q.question,
      category: q.category,
      difficulty: q.difficulty || 'medium',
      type: q.type,
      userAnswer: mappedAnswer,
      rawDisplayAnswer: rawAnswer,
      correctAnswer: q.answer,
      acceptableAnswers: q.acceptableAnswers,
      isCorrect,
      isTimeout: false,
      timeSpent,
      pointsEarned,
      explanation: q.explanation || ''
    };

    this.userAnswers.push(answerRecord);

    const resultPayload = {
      isCorrect,
      isTimeout: false,
      correctAnswer: q.answer,
      selectedAnswer: mappedAnswer,
      explanation: q.explanation,
      pointsEarned,
      lives: this.lives,
      streak: this.currentStreak,
      score: this.score,
      timeSpent
    };

    this.onAnswerResult(resultPayload);

    if (this.mode === 'rapid' && this.lives <= 0) {
      setTimeout(() => this.finishGame(), 1200);
    }

    return resultPayload;
  }

  // --- LIFELINES ---

  useFiftyFifty() {
    if (!this.lifelines.fiftyFifty.available || this.lifelines.fiftyFifty.used || this.isAnswered) return null;
    const q = this.currentQuestion;
    const activeQ = this.activeQuestionData;

    if (q.type !== 'single' || !activeQ.displayOptions || activeQ.displayOptions.length <= 2) {
      return null;
    }

    // Find wrong options to disable
    const wrongDisplayIndices = [];
    activeQ.displayOptions.forEach((opt, displayIdx) => {
      if (opt.originalIdx !== q.answer) {
        wrongDisplayIndices.push(displayIdx);
      }
    });

    // Shuffle and pick 2 wrong options to eliminate
    for (let i = wrongDisplayIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wrongDisplayIndices[i], wrongDisplayIndices[j]] = [wrongDisplayIndices[j], wrongDisplayIndices[i]];
    }

    const disabledIndices = wrongDisplayIndices.slice(0, 2);

    this.lifelines.fiftyFifty.used = true;
    this.lifelinesUsedCount += 1;
    audio.playLifeline();

    this.onLifelineUpdate('fiftyFifty', { disabledIndices });
    return disabledIndices;
  }

  useHint() {
    if (!this.lifelines.hint.available || this.isAnswered) return null;
    const hintText = this.currentQuestion.hint || 'Carefully analyze the key terms in the question.';
    this.lifelines.hint.used = true;
    this.lifelinesUsedCount += 1;
    audio.playLifeline();

    this.onLifelineUpdate('hint', { hint: hintText });
    return hintText;
  }

  useTimeFreeze() {
    if (!this.lifelines.timeFreeze.available || this.lifelines.timeFreeze.used || this.isAnswered) return null;
    this.secondsLeft += 15;
    this.lifelines.timeFreeze.used = true;
    this.lifelinesUsedCount += 1;
    audio.playLifeline();

    const maxTime = (this.mode === 'rapid' ? 10 : this.timerDuration) + 15;
    const pct = Math.min(100, (this.secondsLeft / maxTime) * 100);
    this.onTimerTick(this.secondsLeft, pct);
    this.onLifelineUpdate('timeFreeze', { secondsAdded: 15 });
    return true;
  }

  useSkip() {
    if (!this.lifelines.skip.available || this.lifelines.skip.used || this.isAnswered) return null;
    this.lifelines.skip.used = true;
    this.lifelinesUsedCount += 1;
    this._stopTimer();
    audio.playLifeline();

    this.onLifelineUpdate('skip', {});
    this.nextQuestion();
    return true;
  }

  nextQuestion() {
    this._stopTimer();
    if (this.currentIndex + 1 < this.questions.length && !(this.mode === 'rapid' && this.lives <= 0)) {
      this.loadQuestion(this.currentIndex + 1);
    } else {
      this.finishGame();
    }
  }

  finishGame() {
    this._stopTimer();
    const totalTime = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));
    const correctCount = this.userAnswers.filter(a => a.isCorrect).length;
    const totalQuestions = this.userAnswers.length;
    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // Fastest correct answer
    const correctAnswers = this.userAnswers.filter(a => a.isCorrect);
    const fastestSeconds = correctAnswers.length > 0
      ? Math.min(...correctAnswers.map(a => a.timeSpent))
      : 999;

    // Category breakdown
    const categoryBreakdown = {};
    this.userAnswers.forEach(a => {
      if (!categoryBreakdown[a.category]) {
        categoryBreakdown[a.category] = { total: 0, correct: 0 };
      }
      categoryBreakdown[a.category].total += 1;
      if (a.isCorrect) categoryBreakdown[a.category].correct += 1;
    });

    // Difficulty breakdown
    const difficultyBreakdown = {
      easy: { total: 0, correct: 0 },
      medium: { total: 0, correct: 0 },
      hard: { total: 0, correct: 0 }
    };
    this.userAnswers.forEach(a => {
      const diff = a.difficulty || 'medium';
      if (difficultyBreakdown[diff]) {
        difficultyBreakdown[diff].total += 1;
        if (a.isCorrect) difficultyBreakdown[diff].correct += 1;
      }
    });

    const summary = {
      mode: this.mode,
      categoryName: this.categoryName,
      customDeckId: this.customDeckId,
      finalScore: this.score,
      totalQuestions,
      correctAnswers: correctCount,
      scorePercentage,
      maxStreak: this.maxStreak,
      timeSpentSeconds: totalTime,
      fastestAnswerSeconds: fastestSeconds,
      lifelinesUsed: this.lifelinesUsedCount,
      categoryBreakdown,
      difficultyBreakdown,
      answers: this.userAnswers,
      completedAt: new Date().toISOString()
    };

    if (scorePercentage >= 70) {
      audio.playFanfare();
    } else {
      audio.playGameOver();
    }

    this.onGameEnd(summary);
    return summary;
  }

  destroy() {
    this._stopTimer();
  }
}
