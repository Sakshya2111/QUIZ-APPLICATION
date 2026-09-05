/**
 * QuizPulse - Canvas Particle Confetti Celebration Engine
 * High-performance, zero-dependency visual particle burst system.
 */

class ConfettiEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animId = null;
    this.isActive = false;
  }

  _initCanvas() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'confetti-canvas';
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100vw';
      this.canvas.style.height = '100vh';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '99999';
      document.body.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      this._resize();
      window.addEventListener('resize', () => this._resize());
    }
  }

  _resize() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth * window.devicePixelRatio;
      this.canvas.height = window.innerHeight * window.devicePixelRatio;
      if (this.ctx) {
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    }
  }

  /**
   * Fires a festive confetti burst
   * @param {Object} options - { count: 120, origin: { x: 0.5, y: 0.6 } }
   */
  fire(options = {}) {
    this._initCanvas();
    const count = options.count || 120;
    const originX = (options.origin?.x ?? 0.5) * window.innerWidth;
    const originY = (options.origin?.y ?? 0.6) * window.innerHeight;

    const colors = [
      '#6366f1', '#ec4899', '#3b82f6', '#10b981', '#f59e0b',
      '#8b5cf6', '#06b6d4', '#ef4444', '#ffd700', '#00f2fe'
    ];

    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const velocity = 8 + Math.random() * 18;
      const size = 6 + Math.random() * 8;

      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 6, // Initial upward kick
        size: size,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        wobble: Math.random() * 10,
        wobbleSpeed: 0.1 + Math.random() * 0.1,
        shape: Math.random() > 0.4 ? 'rect' : (Math.random() > 0.5 ? 'circle' : 'star'),
        opacity: 1,
        decay: 0.008 + Math.random() * 0.008,
        gravity: 0.35 + Math.random() * 0.15,
        drag: 0.96
      });
    }

    if (!this.isActive) {
      this.isActive = true;
      this._loop();
    }
  }

  _loop() {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Physics update
      p.vx *= p.drag;
      p.vy = (p.vy * p.drag) + p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed;
      p.opacity -= p.decay;

      if (p.opacity <= 0 || p.y > window.innerHeight + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      // Draw particle
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.fillStyle = p.color;

      const scaleX = Math.cos(p.wobble);

      if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.size / 2, (p.size / 2) * Math.abs(scaleX), 0, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, (-p.size * scaleX) / 2, p.size, p.size * scaleX);
      } else {
        // Star particle
        this._drawStar(this.ctx, 0, 0, 5, p.size, p.size / 2);
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this._loop());
    } else {
      this.isActive = false;
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  _drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }

  stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
    }
    this.particles = [];
    this.isActive = false;
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }
}

export const confetti = new ConfettiEngine();
