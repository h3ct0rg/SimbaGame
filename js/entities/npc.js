const SHAPES = {
  rabbit(ctx, t) {
    const bob = Math.sin(t * 4) * 3;
    ctx.translate(0, bob);
    ctx.fillStyle = '#f5f1e8';
    roundedBody(ctx, 0, -20, 30, 26);
    ctx.beginPath();
    ctx.ellipse(-8, -46, 5, 18, -0.15, 0, Math.PI * 2);
    ctx.ellipse(8, -46, 5, 18, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2b2b2b';
    ctx.beginPath();
    ctx.arc(9, -24, 2.4, 0, Math.PI * 2);
    ctx.fill();
  },
  bird(ctx, t) {
    const flap = Math.sin(t * 8) * 0.6;
    ctx.fillStyle = '#e8b23d';
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.rotate(flap);
    ctx.fillStyle = '#d99a25';
    ctx.beginPath();
    ctx.ellipse(-6, -2, 12, 5, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#c96a1f';
    ctx.beginPath();
    ctx.moveTo(12, -1);
    ctx.lineTo(20, 1);
    ctx.lineTo(12, 3);
    ctx.fill();
  },
  squirrel(ctx, t) {
    const bob = Math.sin(t * 5) * 2;
    ctx.translate(0, bob);
    ctx.fillStyle = '#a86b3c';
    roundedBody(ctx, 0, -16, 22, 20);
    ctx.beginPath();
    ctx.ellipse(14, -30, 12, 20, 0.5, 0, Math.PI * 2);
    ctx.fill();
  },
  puppy(ctx, t) {
    const bob = Math.sin(t * 6) * 2;
    ctx.translate(0, bob);
    ctx.fillStyle = '#caa06a';
    roundedBody(ctx, 0, -18, 26, 22);
    ctx.beginPath();
    ctx.ellipse(-10, -42, 6, 14, -0.2, 0, Math.PI * 2);
    ctx.ellipse(10, -42, 6, 14, 0.2, 0, Math.PI * 2);
    ctx.fill();
  },
  spirit(ctx, t) {
    const pulse = 0.75 + Math.sin(t * 2) * 0.15;
    const grad = ctx.createRadialGradient(0, -30, 4, 0, -30, 60 * pulse);
    grad.addColorStop(0, 'rgba(255,250,225,0.95)');
    grad.addColorStop(0.5, 'rgba(255,225,150,0.45)');
    grad.addColorStop(1, 'rgba(255,225,150,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, -30, 60 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.ellipse(0, -30, 14, 26, 0, 0, Math.PI * 2);
    ctx.fill();
  },
};

function roundedBody(ctx, x, y, w, h) {
  ctx.beginPath();
  ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
  ctx.fill();
}

export class NPC {
  constructor({ x, y, kind, dialogue = [], triggerRadius = 90 }) {
    this.x = x;
    this.y = y;
    this.kind = kind;
    this.dialogue = dialogue;
    this.triggerRadius = triggerRadius;
    this.t = Math.random() * 10;
    this.triggered = false;
  }

  update(dt) {
    this.t += dt;
  }

  checkTrigger(simba) {
    if (this.triggered) return false;
    const dx = simba.x - this.x;
    const dy = simba.y - this.y;
    if (Math.sqrt(dx * dx + dy * dy) <= this.triggerRadius) {
      this.triggered = true;
      return true;
    }
    return false;
  }

  render(ctx) {
    const drawFn = SHAPES[this.kind] || SHAPES.rabbit;
    ctx.save();
    ctx.translate(this.x, this.y);
    drawFn(ctx, this.t);
    ctx.restore();
  }
}
