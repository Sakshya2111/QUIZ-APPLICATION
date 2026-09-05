/**
 * QuizPulse - Custom Quiz Studio & Deck Builder
 * Allows users to create, preview, edit, import, and export custom quiz decks.
 */

import { storage } from './storage.js';

export class QuizCreator {
  constructor() {
    this.currentDeck = {
      id: null,
      title: '',
      description: '',
      category: 'custom',
      questions: []
    };
  }

  reset() {
    this.currentDeck = {
      id: 'deck_' + Date.now(),
      title: '',
      description: '',
      category: 'custom',
      questions: []
    };
  }

  loadDeck(deckId) {
    const decks = storage.getCustomDecks();
    const deck = decks.find(d => d.id === deckId);
    if (deck) {
      this.currentDeck = JSON.parse(JSON.stringify(deck));
      return this.currentDeck;
    }
    return null;
  }

  addQuestion(questionObj) {
    const q = {
      id: 'cq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      category: 'custom',
      difficulty: questionObj.difficulty || 'medium',
      type: questionObj.type || 'single',
      question: questionObj.question.trim(),
      options: questionObj.options || [],
      answer: questionObj.answer,
      acceptableAnswers: questionObj.acceptableAnswers || [],
      hint: questionObj.hint ? questionObj.hint.trim() : '',
      explanation: questionObj.explanation ? questionObj.explanation.trim() : ''
    };

    this.currentDeck.questions.push(q);
    return q;
  }

  updateQuestion(questionId, updatedObj) {
    const idx = this.currentDeck.questions.findIndex(q => q.id === questionId);
    if (idx >= 0) {
      this.currentDeck.questions[idx] = {
        ...this.currentDeck.questions[idx],
        ...updatedObj
      };
      return true;
    }
    return false;
  }

  deleteQuestion(questionId) {
    this.currentDeck.questions = this.currentDeck.questions.filter(q => q.id !== questionId);
  }

  validateDeck() {
    const errors = [];
    if (!this.currentDeck.title || this.currentDeck.title.trim().length === 0) {
      errors.push('Quiz title is required.');
    }
    if (!this.currentDeck.questions || this.currentDeck.questions.length === 0) {
      errors.push('The quiz must have at least 1 question.');
    }

    this.currentDeck.questions.forEach((q, idx) => {
      const qNum = idx + 1;
      if (!q.question || q.question.trim().length === 0) {
        errors.push(`Question #${qNum} is missing text.`);
      }
      if (q.type === 'single' || q.type === 'multiple') {
        if (!q.options || q.options.length < 2) {
          errors.push(`Question #${qNum} must have at least 2 options.`);
        }
        if (q.type === 'single' && (q.answer === undefined || q.answer === null || q.answer < 0 || q.answer >= q.options.length)) {
          errors.push(`Question #${qNum} does not have a valid correct option selected.`);
        }
        if (q.type === 'multiple' && (!Array.isArray(q.answer) || q.answer.length === 0)) {
          errors.push(`Question #${qNum} must have at least one correct option selected.`);
        }
      } else if (q.type === 'text') {
        if (!q.acceptableAnswers || q.acceptableAnswers.length === 0) {
          errors.push(`Question #${qNum} must specify at least one acceptable answer.`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  save() {
    const validation = this.validateDeck();
    if (!validation.isValid) {
      return validation;
    }

    if (!this.currentDeck.id) {
      this.currentDeck.id = 'deck_' + Date.now();
    }

    storage.saveCustomDeck(this.currentDeck);
    return { isValid: true, deck: this.currentDeck };
  }

  exportDeckJSON() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.currentDeck, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const fileName = (this.currentDeck.title ? this.currentDeck.title.toLowerCase().replace(/[^a-z0-9]/gi, '_') : 'quizpulse_deck') + '.json';
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  /**
   * Imports a deck from JSON string
   */
  importDeckFromJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('Invalid format: JSON must contain a "questions" array.');
      }

      const importedDeck = {
        id: 'deck_' + Date.now(),
        title: parsed.title || 'Imported Quiz Deck',
        description: parsed.description || 'Imported from JSON file',
        category: 'custom',
        questions: parsed.questions.map((q, i) => ({
          id: 'imp_' + Date.now() + '_' + i,
          category: 'custom',
          difficulty: q.difficulty || 'medium',
          type: q.type || 'single',
          question: q.question || 'Untitled Question',
          options: q.options || (q.type === 'boolean' ? ['True', 'False'] : []),
          answer: q.answer !== undefined ? q.answer : 0,
          acceptableAnswers: q.acceptableAnswers || [],
          hint: q.hint || '',
          explanation: q.explanation || ''
        }))
      };

      this.currentDeck = importedDeck;
      return { success: true, deck: importedDeck };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

export const quizCreator = new QuizCreator();
