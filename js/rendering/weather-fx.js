export class WeatherFX {
  constructor(type) {
    this.type = type;
    this.flashAlpha = 0;
    this.nextFlash = type === 'storm' ? 2 + Math.random() * 3 : Infinity;
    this.t = 0;
  }

  update(dt, camera) {
    this.t += dt;
    if (this.type !== 'storm') return;
    this.nextFlash -= dt;
    if (this.nextFlash <= 0) {
      this.flashAlpha = 0.85;
      this.nextFlash = 3 + Math.random() * 4;
      if (camera && camera.shake) camera.shake(10, 0.3);
      this._onThunder && this._onThunder();
    }
    this.flashAlpha = Math.max(0, this.flashAlpha - dt * 2.2);
  }

  onThunder(callback) {
    this._onThunder = callback;
  }

  renderFlash(ctx, w, h) {
    if (this.flashAlpha <= 0) return;
    ctx.save();
    ctx.fillStyle = `rgba(255,255,240,${this.flashAlpha})`;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
}
