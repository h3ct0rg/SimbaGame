export function skyGradient(ctx, offsetX, w, h, opts = {}) {
  const { top = '#1b2a4a', bottom = '#4a6a8a' } = opts;
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, top);
  grad.addColorStop(1, bottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

function tiledShape(ctx, offsetX, w, h, tileWidth, drawTile) {
  const startTile = Math.floor(-offsetX / tileWidth) - 1;
  const endTile = Math.ceil((w - offsetX) / tileWidth) + 1;
  for (let i = startTile; i <= endTile; i++) {
    drawTile(i * tileWidth + offsetX, i);
  }
}

export function mountainRange(ctx, offsetX, w, h, opts = {}) {
  const { color = '#2c3a52', baseY = h * 0.65, amplitude = 120, tileWidth = 420 } = opts;
  ctx.fillStyle = color;
  tiledShape(ctx, offsetX, w, h, tileWidth, (x, i) => {
    const peakH = amplitude * (0.7 + 0.3 * Math.sin(i * 1.7));
    ctx.beginPath();
    ctx.moveTo(x, h);
    ctx.lineTo(x, baseY);
    ctx.lineTo(x + tileWidth * 0.5, baseY - peakH);
    ctx.lineTo(x + tileWidth, baseY);
    ctx.lineTo(x + tileWidth, h);
    ctx.closePath();
    ctx.fill();
  });
}

export function hillsRange(ctx, offsetX, w, h, opts = {}) {
  const { color = '#3f6b3a', baseY = h * 0.72, amplitude = 60, tileWidth = 360 } = opts;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, h);
  tiledShape(ctx, offsetX, w, h, tileWidth, (x) => {
    ctx.quadraticCurveTo(x + tileWidth * 0.25, baseY - amplitude, x + tileWidth * 0.5, baseY);
    ctx.quadraticCurveTo(x + tileWidth * 0.75, baseY + amplitude * 0.4, x + tileWidth, baseY);
  });
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();
}

export function treeSilhouette(ctx, offsetX, w, h, opts = {}) {
  const { color = '#1f3320', baseY = h * 0.78, spacing = 140, trunkH = 90, canopyR = 55 } = opts;
  ctx.fillStyle = color;
  tiledShape(ctx, offsetX, w, h, spacing, (x) => {
    ctx.fillRect(x - 6, baseY - trunkH, 12, trunkH);
    ctx.beginPath();
    ctx.arc(x, baseY - trunkH, canopyR, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function pillarRow(ctx, offsetX, w, h, opts = {}) {
  const { color = '#8a7350', baseY = h * 0.85, spacing = 220, pillarW = 46, pillarH = 300 } = opts;
  ctx.fillStyle = color;
  tiledShape(ctx, offsetX, w, h, spacing, (x) => {
    ctx.fillRect(x - pillarW / 2, baseY - pillarH, pillarW, pillarH);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    for (let line = 1; line < 4; line++) {
      ctx.fillRect(x - pillarW / 2, baseY - pillarH + line * (pillarH / 4), pillarW, 4);
    }
    ctx.fillStyle = color;
  });
}

export function mirrorPanels(ctx, offsetX, w, h, opts = {}) {
  const { baseY = h * 0.82, spacing = 200, panelW = 90, panelH = 340, t = 0 } = opts;
  tiledShape(ctx, offsetX, w, h, spacing, (x) => {
    const grad = ctx.createLinearGradient(x - panelW / 2, baseY - panelH, x + panelW / 2, baseY);
    const shimmer = 0.3 + 0.2 * Math.sin(t + x * 0.01);
    grad.addColorStop(0, `rgba(180,190,220,${0.5 + shimmer})`);
    grad.addColorStop(0.5, `rgba(230,235,250,${0.3 + shimmer})`);
    grad.addColorStop(1, `rgba(150,160,200,${0.4})`);
    ctx.fillStyle = grad;
    ctx.fillRect(x - panelW / 2, baseY - panelH, panelW, panelH);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.strokeRect(x - panelW / 2, baseY - panelH, panelW, panelH);
  });
}

export function cloudLayer(ctx, offsetX, w, h, opts = {}) {
  const { color = '255,255,255', baseY = h * 0.4, spacing = 300, alpha = 0.5 } = opts;
  tiledShape(ctx, offsetX, w, h, spacing, (x) => {
    ctx.fillStyle = `rgba(${color},${alpha})`;
    ctx.beginPath();
    ctx.ellipse(x, baseY, 70, 22, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 40, baseY + 8, 45, 16, 0, 0, Math.PI * 2);
    ctx.ellipse(x - 40, baseY + 6, 45, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function templeGlowFloor(ctx, offsetX, w, h, opts = {}) {
  const { baseY = h * 0.85, t = 0 } = opts;
  const grad = ctx.createLinearGradient(0, baseY, 0, h);
  const pulse = 0.4 + Math.sin(t * 1.5) * 0.1;
  grad.addColorStop(0, `rgba(255,230,170,${pulse})`);
  grad.addColorStop(1, 'rgba(255,230,170,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, baseY - 40, w, h - baseY + 40);
}

export function waterReflection(ctx, offsetX, w, h, opts = {}) {
  const { baseY = h * 0.8, color = '90,110,140', alpha = 0.25 } = opts;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = `rgb(${color})`;
  ctx.fillRect(0, baseY, w, h - baseY);
  ctx.restore();
}
