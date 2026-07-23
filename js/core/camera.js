import { GAME_WIDTH, GAME_HEIGHT } from './constants.js';

export class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.levelWidth = GAME_WIDTH;
    this.levelHeight = GAME_HEIGHT;
    this.shakeTime = 0;
    this.shakeMagnitude = 0;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;
  }

  setBounds(width, height) {
    this.levelWidth = width;
    this.levelHeight = height;
  }

  follow(target, dt) {
    const desiredX = target.x - GAME_WIDTH / 2;
    this.x += (desiredX - this.x) * Math.min(1, dt * 4);
    this.x = Math.max(0, Math.min(this.x, Math.max(0, this.levelWidth - GAME_WIDTH)));
    this.y = 0;

    if (this.shakeTime > 0) {
      this.shakeTime -= dt;
      const m = this.shakeMagnitude * (this.shakeTime > 0 ? 1 : 0);
      this.shakeOffsetX = (Math.random() * 2 - 1) * m;
      this.shakeOffsetY = (Math.random() * 2 - 1) * m;
    } else {
      this.shakeOffsetX = 0;
      this.shakeOffsetY = 0;
    }
  }

  shake(magnitude, duration) {
    this.shakeMagnitude = magnitude;
    this.shakeTime = duration;
  }

  get renderX() {
    return this.x + this.shakeOffsetX;
  }

  get renderY() {
    return this.y + this.shakeOffsetY;
  }
}
