/**
 * QuizPulse - Keyboard Navigation & Hotkeys Controller
 * Provides accessible keyboard bindings for fast quiz gameplay.
 */

class KeyboardNav {
  constructor() {
    this.handlers = {
      onOptionSelect: null,
      onNext: null,
      onLifeline: null,
      onPause: null,
      onToggleHelp: null
    };
    this.enabled = true;
    this._bindEvents();
  }

  setHandlers(handlers) {
    this.handlers = { ...this.handlers, ...handlers };
  }

  _bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (!this.enabled) return;

      // Do not trigger if typing in an input field or textarea
      const targetTag = e.target.tagName.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        if (e.key === 'Enter' && this.handlers.onEnterInput) {
          this.handlers.onEnterInput(e);
        }
        return;
      }

      const key = e.key.toLowerCase();

      // Number keys 1-4 or A-D for options
      if (['1', '2', '3', '4'].includes(key)) {
        e.preventDefault();
        const index = parseInt(key, 10) - 1;
        if (this.handlers.onOptionSelect) this.handlers.onOptionSelect(index);
      } else if (['a', 'b', 'c', 'd'].includes(key)) {
        e.preventDefault();
        const charCode = key.charCodeAt(0) - 97; // 'a' -> 0, 'b' -> 1, etc.
        if (this.handlers.onOptionSelect) this.handlers.onOptionSelect(charCode);
      }
      // Enter or Space for Next/Submit
      else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (this.handlers.onNext) this.handlers.onNext();
      }
      // Lifelines: H (Hint), F (50:50), T (Time Boost), K (Skip)
      else if (key === 'h') {
        e.preventDefault();
        if (this.handlers.onLifeline) this.handlers.onLifeline('hint');
      } else if (key === 'f') {
        e.preventDefault();
        if (this.handlers.onLifeline) this.handlers.onLifeline('fiftyFifty');
      } else if (key === 't') {
        e.preventDefault();
        if (this.handlers.onLifeline) this.handlers.onLifeline('timeFreeze');
      } else if (key === 'k') {
        e.preventDefault();
        if (this.handlers.onLifeline) this.handlers.onLifeline('skip');
      }
      // Pause: P or Escape
      else if (key === 'p' || e.key === 'Escape') {
        e.preventDefault();
        if (this.handlers.onPause) this.handlers.onPause();
      }
      // Help: '?'
      else if (e.key === '?') {
        e.preventDefault();
        if (this.handlers.onToggleHelp) this.handlers.onToggleHelp();
      }
    });
  }
}

export const keyboardNav = new KeyboardNav();
