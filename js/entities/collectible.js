const ICONS = {
  seed(ctx, glow) {
    ctx.fillStyle = `rgba(150,220,110,${0.6 + glow * 0.4})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 14, 0, 0, Math.PI * 2);
    ctx.fill();
  },
  stone(ctx, glow) {
    ctx.fillStyle = `rgba(230,190,90,${0.6 + glow * 0.4})`;
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fill();
  },
  crystal(ctx, glow) {
    ctx.fillStyle = `rgba(140,220,230,${0.6 + glow * 0.4})`;
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.lineTo(10, 0);
    ctx.lineTo(0, 16);
    ctx.lineTo(-10, 0);
    ctx.closePath();
    ctx.fill();
  },
  flower(ctx, glow) {
    ctx.fillStyle = `rgba(240,150,190,${0.6 + glow * 0.4})`;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * 8, Math.sin(a) * 8, 6, 4, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = `rgba(255,220,90,${0.7 + glow * 0.3})`;
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
  },
  tear(ctx, glow) {
    ctx.fillStyle = `rgba(160,200,255,${0.6 + glow * 0.4})`;
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.quadraticCurveTo(10, 4, 0, 16);
    ctx.quadraticCurveTo(-10, 4, 0, -16);
    ctx.fill();
  },
  mirror(ctx, glow) {
    ctx.fillStyle = `rgba(210,210,235,${0.6 + glow * 0.4})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  },
  bell(ctx, glow) {
    ctx.fillStyle = `rgba(235,190,110,${0.6 + glow * 0.4})`;
    ctx.beginPath();
    ctx.moveTo(-10, 10);
    ctx.quadraticCurveTo(-12, -14, 0, -16);
    ctx.quadraticCurveTo(12, -14, 10, 10);
    ctx.closePath();
    ctx.fill();
  },
  star(ctx, glow) {
    ctx.fillStyle = `rgba(255,240,180,${0.7 + glow * 0.3})`;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const a2 = a + Math.PI / 5;
      ctx.lineTo(Math.cos(a) * 14, Math.sin(a) * 14);
      ctx.lineTo(Math.cos(a2) * 6, Math.sin(a2) * 6);
    }
    ctx.closePath();
    ctx.fill();
  },
};

export function drawTreasureIcon(ctx, iconKey, glow = 1) {
  const fn = ICONS[iconKey] || ICONS.star;
  fn(ctx, glow);
}

export class Collectible {
  constructor({ x, y, treasureId, icon }) {
    this.x = x;
    this.y = y;
    this.treasureId = treasureId;
    this.icon = icon;
    this.t = 0;
    this.collected = false;
  }

  update(dt) {
    this.t += dt;
  }

  checkPickup(simba) {
    if (this.collected) return false;
    const dx = simba.x - this.x;
    const dy = simba.y + simba.height / 2 - this.y;
    if (Math.sqrt(dx * dx + dy * dy) <= 42) {
      this.collected = true;
      return true;
    }
    return false;
  }

  render(ctx) {
    if (this.collected) return;
    const float = Math.sin(this.t * 2) * 6;
    const glow = 0.6 + Math.sin(this.t * 3) * 0.4;

    ctx.save();
    ctx.translate(this.x, this.y + float);
    const halo = ctx.createRadialGradient(0, 0, 2, 0, 0, 30);
    halo.addColorStop(0, `rgba(255,255,220,${0.35 * glow})`);
    halo.addColorStop(1, 'rgba(255,255,220,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.fill();

    drawTreasureIcon(ctx, this.icon, glow);
    ctx.restore();
  }
}
