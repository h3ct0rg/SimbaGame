import { SpriteAnimator } from './sprite-animator.js';
import { GRAVITY, MOVE_SPEED, JUMP_VELOCITY } from '../core/constants.js';

const SPRITE_W = 600;
const SPRITE_H = 500;
export const HITBOX_W = 110;
export const HITBOX_H = 150;
const DRAW_SCALE = 0.34;

export const SimbaState = {
  IDLE: 'idle',
  RUN: 'run',
  JUMP: 'jump',
  SIT: 'sit',
};

export class Simba {
  constructor(assets, x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.width = HITBOX_W;
    this.height = HITBOX_H;
    this.grounded = false;
    this.facing = 1;
    this.state = SimbaState.IDLE;
    this._forcedSit = false;
    this._jumpApexTime = 0;
    this._jumpTotalArc = Math.max(0.01, (-JUMP_VELOCITY) / GRAVITY) * 2;

    this.animators = {
      [SimbaState.IDLE]: new SpriteAnimator(assets.getSequence('idle'), 6, true),
      [SimbaState.RUN]: new SpriteAnimator(assets.getSequence('run'), 16, true),
      [SimbaState.JUMP]: new SpriteAnimator(assets.getSequence('jump'), 14, false),
      [SimbaState.SIT]: new SpriteAnimator(assets.getSequence('sit'), 7, true),
    };
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
  }

  forceSit(sitting) {
    this._forcedSit = sitting;
    if (sitting) {
      this.vx = 0;
      this.animators[SimbaState.SIT].reset();
    }
  }

  applyInput(input) {
    if (this._forcedSit) {
      this.vx = 0;
      return;
    }
    this.vx = input.axisX * MOVE_SPEED;
    if (input.axisX > 0.05) this.facing = 1;
    else if (input.axisX < -0.05) this.facing = -1;

    if (input.jumpPressed && this.grounded) {
      this.vy = JUMP_VELOCITY;
      this.grounded = false;
      this._jumpApexTime = 0;
      this.animators[SimbaState.JUMP].reset();
    }
  }

  applyGravity(dt) {
    this.vy += GRAVITY * dt;
  }

  updateAnimation(dt) {
    let nextState;
    if (this._forcedSit) {
      nextState = SimbaState.SIT;
    } else if (!this.grounded) {
      nextState = SimbaState.JUMP;
      this._jumpApexTime += dt;
    } else if (Math.abs(this.vx) > 5) {
      nextState = SimbaState.RUN;
    } else {
      nextState = SimbaState.IDLE;
    }

    if (nextState !== this.state) {
      this.state = nextState;
      if (nextState !== SimbaState.JUMP) this.animators[nextState].reset();
    }

    const animator = this.animators[this.state];
    if (this.state === SimbaState.JUMP) {
      animator.setProgress(this._jumpApexTime / this._jumpTotalArc);
    } else {
      animator.update(dt);
    }
  }

  render(ctx) {
    const img = this.animators[this.state].currentImage();
    if (!img || !img.complete) return;

    const drawW = SPRITE_W * DRAW_SCALE;
    const drawH = SPRITE_H * DRAW_SCALE;
    // World-space coordinates: the caller has already applied the camera
    // translation to ctx, so no camera offset is subtracted here.
    const worldX = this.x;
    const worldY = this.y + this.height;

    ctx.save();
    ctx.translate(worldX, worldY);
    ctx.scale(this.facing, 1);

    // Soft contact shadow to fake grounding depth.
    ctx.save();
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(0, -4, drawW * 0.24, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.drawImage(img, -drawW / 2, -drawH, drawW, drawH);
    ctx.restore();
  }
}
