export function drawGodRays(ctx, w, h, t, opts = {}) {
  const { originX = w * 0.5, originY = -50, count = 6, color = '255,240,200', spread = 0.5 } = opts;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (i - count / 2) * (spread / count) * 2;
    const alpha = 0.05 + 0.03 * Math.sin(t * 0.6 + i);
    const len = h * 1.4;
    const width = 60 + i * 6;
    ctx.save();
    ctx.translate(originX, originY);
    ctx.rotate(angle);
    const grad = ctx.createLinearGradient(0, 0, 0, len);
    grad.addColorStop(0, `rgba(${color},${alpha})`);
    grad.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(-width / 4, 0);
    ctx.lineTo(width / 4, 0);
    ctx.lineTo(width, len);
    ctx.lineTo(-width, len);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

export function drawVignette(ctx, w, h, opts = {}) {
  const { strength = 0.55 } = opts;
  const grad = ctx.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, h * 0.9);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, `rgba(0,0,0,${strength})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

export function drawColorGrade(ctx, w, h, color, opts = {}) {
  const { alpha = 0.12, blend = 'overlay' } = opts;
  ctx.save();
  ctx.globalCompositeOperation = blend;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

export function drawFlash(ctx, w, h, alpha) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.fillStyle = `rgba(255,255,255,${Math.min(1, alpha)})`;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}
