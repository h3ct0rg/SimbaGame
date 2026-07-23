import { STEP } from './constants.js';

export class GameLoop {
  constructor(update, render) {
    this.update = update;
    this.render = render;
    this.accumulator = 0;
    this.lastTime = 0;
    this.running = false;
    this._frame = this._frame.bind(this);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this._frame);
  }

  stop() {
    this.running = false;
  }

  _frame(now) {
    if (!this.running) return;
    const rawDt = Math.min((now - this.lastTime) / 1000, 0.25);
    this.lastTime = now;
    this.accumulator += rawDt;

    while (this.accumulator >= STEP) {
      this.update(STEP);
      this.accumulator -= STEP;
    }

    this.render(this.accumulator / STEP);
    requestAnimationFrame(this._frame);
  }
}
