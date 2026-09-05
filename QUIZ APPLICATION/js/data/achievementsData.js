/**
 * QuizPulse - Achievements & Badges Configuration
 * Defines unlock criteria, icons, and rewards.
 */

export const ACHIEVEMENTS = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Complete your very first quiz.',
    icon: '🚀',
    category: 'progression',
    check: (stats, lastGame) => stats.totalQuizzesCompleted >= 1
  },
  {
    id: 'flawless',
    title: 'Flawless Victory',
    description: 'Score 100% on any quiz with at least 5 questions.',
    icon: '👑',
    category: 'skill',
    check: (stats, lastGame) => lastGame && lastGame.totalQuestions >= 5 && lastGame.scorePercentage === 100
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Answer any question correctly in under 3 seconds.',
    icon: '⚡',
    category: 'speed',
    check: (stats, lastGame) => lastGame && lastGame.fastestAnswerSeconds <= 3
  },
  {
    id: 'streak-master',
    title: 'On Fire',
    description: 'Achieve a 5-question answer streak in a single quiz.',
    icon: '🔥',
    category: 'skill',
    check: (stats, lastGame) => lastGame && lastGame.maxStreak >= 5
  },
  {
    id: 'streak-god',
    title: 'Unstoppable',
    description: 'Achieve a 10-question answer streak.',
    icon: '🌟',
    category: 'skill',
    check: (stats, lastGame) => lastGame && lastGame.maxStreak >= 10
  },
  {
    id: 'polymath',
    title: 'Polymath',
    description: 'Play quizzes in all 6 default categories.',
    icon: '🎓',
    category: 'exploration',
    check: (stats) => {
      const cats = stats.categoryHistory ? Object.keys(stats.categoryHistory) : [];
      return cats.length >= 6;
    }
  },
  {
    id: 'survivor',
    title: 'Rapid Fire Survivor',
    description: 'Score at least 10 correct answers in Rapid Fire Sudden Death mode.',
    icon: '🛡️',
    category: 'mode',
    check: (stats, lastGame) => lastGame && lastGame.mode === 'rapid' && lastGame.correctAnswers >= 10
  },
  {
    id: 'lifeline-purist',
    title: 'Pure Genius',
    description: 'Score 90%+ on a Standard quiz without using any lifelines.',
    icon: '🧠',
    category: 'skill',
    check: (stats, lastGame) => lastGame && lastGame.mode === 'standard' && lastGame.lifelinesUsed === 0 && lastGame.scorePercentage >= 90
  },
  {
    id: 'deck-creator',
    title: 'Quiz Architect',
    description: 'Create and save your first custom quiz deck.',
    icon: '🛠️',
    category: 'creator',
    check: (stats) => stats.customQuizzesCreated >= 1
  },
  {
    id: 'knowledge-seeker',
    title: 'Knowledge Hoarder',
    description: 'Answer a total of 50 questions correctly across all games.',
    icon: '📚',
    category: 'progression',
    check: (stats) => stats.totalCorrectAnswers >= 50
  },
  {
    id: 'night-owl',
    title: 'Night Scholar',
    description: 'Complete a quiz between midnight and 5:00 AM.',
    icon: '🦉',
    category: 'fun',
    check: () => {
      const hour = new Date().getHours();
      return hour >= 0 && hour < 5;
    }
  },
  {
    id: 'century-club',
    title: 'Century Club',
    description: 'Answer over 100 questions in total.',
    icon: '💎',
    category: 'progression',
    check: (stats) => stats.totalQuestionsAnswered >= 100
  }
];
