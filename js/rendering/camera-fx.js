export class FadeTransition {
  constructor() {
    this.alpha = 0;
    this.direction = 0; // -1 fading in (to clear), 1 fading out (to black), 0 idle
    this.speed = 1.4;
    this._onMid = null;
    this._firedMid = false;
  }

  fadeOutThenIn(duration, onMid) {
    this.speed = 1 / (duration / 2);
    this.direction = 1;
    this._onMid = onMid;
    this._firedMid = false;
  }

  update(dt) {
    if (this.direction === 1) {
      this.alpha = Math.min(1, this.alpha + this.speed * dt);
      if (this.alpha >= 1 && !this._firedMid) {
        this._firedMid = true;
        if (this._onMid) this._onMid();
        this.direction = -1;
      }
    } else if (this.direction === -1) {
      this.alpha = Math.max(0, this.alpha - this.speed * dt);
      if (this.alpha <= 0) this.direction = 0;
    }
  }

  render(ctx, w, h) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.fillStyle = `rgba(0,0,0,${this.alpha})`;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
}

export function drawLetterbox(ctx, w, h, amount) {
  if (amount <= 0) return;
  const barH = h * 0.12 * amount;
  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, barH);
  ctx.fillRect(0, h - barH, w, barH);
  ctx.restore();
}
