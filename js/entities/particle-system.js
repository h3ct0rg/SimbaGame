const PRESETS = {
  fireflies: { color: '255,240,150', minR: 1.5, maxR: 3, speed: 12, life: [4, 8], glow: true },
  leaves: { color: '150,190,90', minR: 3, maxR: 6, speed: 25, life: [5, 9], drift: true },
  fog: { color: '220,225,235', minR: 40, maxR: 90, speed: 6, life: [10, 16], soft: true },
  dust: { color: '210,190,150', minR: 1, maxR: 2.5, speed: 8, life: [3, 6] },
  rain: { color: '200,220,255', minR: 0.6, maxR: 1.2, speed: 620, life: [0.6, 1.1], rain: true },
  sparkles: { color: '255,255,255', minR: 1, maxR: 2.5, speed: 10, life: [1.5, 3], glow: true },
  pollen: { color: '250,230,140', minR: 1.5, maxR: 3, speed: 10, life: [4, 7], drift: true },
  embers: { color: '255,150,60', minR: 1.5, maxR: 3, speed: 30, life: [2, 4], glow: true },
  'god-rays-motes': { color: '255,250,220', minR: 1, maxR: 2, speed: 6, life: [5, 9], glow: true },
  ascend: { color: '255,245,200', minR: 1.5, maxR: 3.5, speed: 40, life: [2.5, 4.5], glow: true, upward: true },
};

export class ParticleSystem {
  constructor(type, density = 0.5, bounds = { w: 1280, h: 720 }) {
    this.preset = PRESETS[type] || PRESETS.dust;
    this.density = density;
    this.bounds = bounds;
    this.particles = [];
    const count = Math.round(20 * density);
    for (let i = 0; i < count; i++) this.particles.push(this._spawn(true));
  }

  setBounds(bounds) {
    this.bounds = bounds;
  }

  _spawn(randomLife) {
    const p = this.preset;
    const [minLife, maxLife] = p.life;
    return {
      x: Math.random() * this.bounds.w,
      y: Math.random() * this.bounds.h,
      r: p.minR + Math.random() * (p.maxR - p.minR),
      vx: (Math.random() * 2 - 1) * (p.rain ? 40 : p.speed * 0.4),
      vy: p.rain ? p.speed : p.upward ? -p.speed * (0.5 + Math.random()) : (Math.random() * 2 - 1) * p.speed * 0.4,
      life: randomLife ? Math.random() * maxLife : minLife + Math.random() * (maxLife - minLife),
      maxLife: maxLife,
      phase: Math.random() * Math.PI * 2,
    };
  }

  update(dt) {
    const p = this.preset;
    for (const particle of this.particles) {
      particle.life -= dt;
      particle.phase += dt;
      if (p.drift) particle.x += Math.sin(particle.phase) * 6 * dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;

      if (particle.life <= 0 || particle.y > this.bounds.h + 20 || particle.y < -100) {
        Object.assign(particle, this._spawn(false));
        if (p.rain) particle.y = -10;
        else if (p.upward) particle.y = this.bounds.h + 10;
      }
      if (particle.x < -40) particle.x = this.bounds.w + 40;
      if (particle.x > this.bounds.w + 40) particle.x = -40;
    }
  }

  render(ctx, parallaxOffsetX = 0) {
    const p = this.preset;
    ctx.save();
    for (const particle of this.particles) {
      const alpha = Math.max(0, Math.min(1, particle.life / particle.maxLife));
      const x = particle.x - parallaxOffsetX;

      if (p.rain) {
        ctx.strokeStyle = `rgba(${p.color},${0.5 * alpha})`;
        ctx.lineWidth = particle.r;
        ctx.beginPath();
        ctx.moveTo(x, particle.y);
        ctx.lineTo(x - 4, particle.y + 18);
        ctx.stroke();
        continue;
      }

      if (p.soft) {
        const grad = ctx.createRadialGradient(x, particle.y, 0, x, particle.y, particle.r);
        grad.addColorStop(0, `rgba(${p.color},${0.18 * alpha})`);
        grad.addColorStop(1, `rgba(${p.color},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }

      if (p.glow) {
        ctx.shadowColor = `rgba(${p.color},${alpha})`;
        ctx.shadowBlur = 8;
      }
      ctx.fillStyle = `rgba(${p.color},${alpha})`;
      ctx.beginPath();
      ctx.arc(x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  }
}
