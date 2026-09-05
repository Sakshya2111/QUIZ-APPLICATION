/**
 * QuizPulse - Analytics & Certificate Generator
 * Processes user statistics, achievement unlock checks, and generates high-res completion certificates.
 */

import { ACHIEVEMENTS } from '../data/achievementsData.js';
import { storage } from './storage.js';

export class AnalyticsManager {
  /**
   * Evaluates if any new achievements are unlocked
   * @param {Object} lastGameSummary
   * @returns {Array} Array of newly unlocked achievement objects
   */
  checkAchievements(lastGameSummary = null) {
    const stats = storage.getStats();
    const unlockedIds = storage.getUnlockedAchievements();
    const newlyUnlocked = [];

    ACHIEVEMENTS.forEach(ach => {
      if (!unlockedIds.includes(ach.id)) {
        try {
          if (ach.check(stats, lastGameSummary)) {
            storage.unlockAchievement(ach.id);
            newlyUnlocked.push(ach);
          }
        } catch (e) {
          console.error(`Error checking achievement ${ach.id}`, e);
        }
      }
    });

    return newlyUnlocked;
  }

  /**
   * Generates a high-resolution Canvas Certificate of Achievement
   * @param {Object} options - { playerName, quizTitle, scorePercentage, correctCount, totalCount, date }
   * @returns {string} Data URL (image/png)
   */
  generateCertificate(options = {}) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    const name = (options.playerName || 'Quiz Master').toUpperCase();
    const quizTitle = options.quizTitle || 'Comprehensive Knowledge Exam';
    const scorePct = options.scorePercentage ?? 100;
    const dateStr = options.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // 1. Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.5, '#1e1b4b');
    bgGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 800);

    // 2. Decorative Gold Borders & Corner Accents
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, 1120, 720);

    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.strokeRect(55, 55, 1090, 690);

    // Corner flourishes
    const corners = [
      [55, 55], [1145, 55], [55, 745], [1145, 745]
    ];
    ctx.fillStyle = '#fbbf24';
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Header Branding
    ctx.textAlign = 'center';
    ctx.fillStyle = '#818cf8';
    ctx.font = '600 22px system-ui, sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('QUIZPULSE ACADEMY OF EXCELLENCE', 600, 120);

    // 4. Certificate Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px "Georgia", serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('CERTIFICATE OF ACHIEVEMENT', 600, 190);

    // Subtle divider
    const divGrad = ctx.createLinearGradient(350, 0, 850, 0);
    divGrad.addColorStop(0, 'transparent');
    divGrad.addColorStop(0.5, '#f59e0b');
    divGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = divGrad;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(350, 220);
    ctx.lineTo(850, 220);
    ctx.stroke();

    // 5. Body Text
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px system-ui, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('THIS IS PROUDLY PRESENTED TO', 600, 270);

    // 6. Player Name
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 44px system-ui, sans-serif';
    ctx.fillText(name, 600, 340);

    // Underline for name
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(400, 360);
    ctx.lineTo(800, 360);
    ctx.stroke();

    // 7. Achievement Statement
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '22px system-ui, sans-serif';
    ctx.fillText(`For demonstrating stellar mastery in the evaluation:`, 600, 420);

    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 28px system-ui, sans-serif';
    ctx.fillText(`"${quizTitle}"`, 600, 465);

    // 8. Score Badge Pill
    ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
    ctx.beginPath();
    ctx.roundRect(460, 505, 280, 55, [28]);
    ctx.fill();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px system-ui, sans-serif';
    ctx.fillText(`SCORE: ${scorePct}% GRADE A+`, 600, 542);

    // 9. Seal Graphic
    ctx.save();
    ctx.translate(220, 640);
    ctx.beginPath();
    ctx.arc(0, 0, 55, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText('VERIFIED', 0, -8);
    ctx.fillText('EXCELLENCE', 0, 12);
    ctx.font = '22px system-ui';
    ctx.fillText('★ ★ ★', 0, 32);
    ctx.restore();

    // 10. Date & Signature
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText(`Date Issued: ${dateStr}`, 600, 680);

    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'italic 24px "Brush Script MT", cursive, sans-serif';
    ctx.fillText('QuizPulse Verification Engine', 960, 645);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(850, 655);
    ctx.lineTo(1070, 655);
    ctx.stroke();
    ctx.fillStyle = '#64748b';
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText('Authorized Signature', 960, 675);

    return canvas.toDataURL('image/png');
  }

  /**
   * Generates a text summary for social sharing
   */
  generateShareText(gameSummary) {
    const stars = gameSummary.scorePercentage >= 90 ? '⭐⭐⭐' : (gameSummary.scorePercentage >= 70 ? '⭐⭐' : '⭐');
    return `⚡ Just completed "${gameSummary.categoryName || 'Quiz'}" on QuizPulse!\n` +
      `🏆 Score: ${gameSummary.finalScore} pts (${gameSummary.scorePercentage}%)\n` +
      `🔥 Max Streak: ${gameSummary.maxStreak}x | ⏱️ Time: ${gameSummary.timeSpentSeconds}s\n` +
      `Rating: ${stars}\n` +
      `Can you beat my high score? Play QuizPulse!`;
  }
}

export const analytics = new AnalyticsManager();
