export class Hazard {
  constructor({ x, y, w = 40, h = 40, kind = 'shadow', range = 120, speed = 40 }) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.kind = kind;
    this.range = range;
    this.speed = speed;
    this.originX = x;
    this.t = Math.random() * 10;
  }

  update(dt) {
    this.t += dt;
    if (this.kind === 'shadow' || this.kind === 'falling-rock') {
      this.x = this.originX + Math.sin(this.t * (this.speed / 40)) * this.range;
    }
  }

  overlaps(entity) {
    const left = entity.x - entity.width / 2;
    const right = entity.x + entity.width / 2;
    const top = entity.y;
    const bottom = entity.y + entity.height;
    return left < this.x + this.w && right > this.x && top < this.y + this.h && bottom > this.y;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.kind === 'shadow') {
      const wobble = Math.sin(this.t * 3) * 4;
      const grad = ctx.createRadialGradient(this.w / 2, this.h / 2, 2, this.w / 2, this.h / 2, this.w);
      grad.addColorStop(0, 'rgba(40,20,60,0.9)');
      grad.addColorStop(1, 'rgba(20,10,30,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(this.w / 2 + wobble, this.h / 2, this.w * 0.6, this.h * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffdf6b';
      ctx.beginPath();
      ctx.arc(this.w / 2 - 8, this.h / 2 - 4, 2.5, 0, Math.PI * 2);
      ctx.arc(this.w / 2 + 8, this.h / 2 - 4, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.kind === 'lightning') {
      ctx.strokeStyle = 'rgba(255,255,230,0.9)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(this.w / 2, 0);
      ctx.lineTo(this.w / 2 - 10, this.h * 0.4);
      ctx.lineTo(this.w / 2 + 8, this.h * 0.5);
      ctx.lineTo(this.w / 2 - 6, this.h);
      ctx.stroke();
    } else if (this.kind === 'falling-rock') {
      ctx.fillStyle = '#5b5148';
      ctx.beginPath();
      ctx.moveTo(this.w * 0.1, this.h);
      ctx.lineTo(0, this.h * 0.4);
      ctx.lineTo(this.w * 0.4, 0);
      ctx.lineTo(this.w, this.h * 0.3);
      ctx.lineTo(this.w * 0.8, this.h);
      ctx.closePath();
      ctx.fill();
    } else if (this.kind === 'mirror-shard') {
      const shimmer = 0.5 + Math.sin(this.t * 2) * 0.3;
      const grad = ctx.createLinearGradient(0, 0, this.w, this.h);
      grad.addColorStop(0, `rgba(190,200,230,${shimmer})`);
      grad.addColorStop(1, 'rgba(120,130,170,0.3)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.w, this.h);
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.strokeRect(0, 0, this.w, this.h);
    }

    ctx.restore();
  }
}
