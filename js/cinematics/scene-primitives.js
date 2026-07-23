function vignetteWindow(ctx, w, h, radius, drawInner) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = '#05070a';
  ctx.fillRect(0, 0, w, h);
  drawInner();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function blackScreen(ctx, t, w, h) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);
}

export function raindropFalling(ctx, t, w, h) {
  blackScreen(ctx, t, w, h);
  vignetteWindow(ctx, w, h, 130, () => {
    const cx = w / 2;
    const fallY = 40 + ((t * 90) % 160);
    ctx.fillStyle = 'rgba(180,210,255,0.9)';
    ctx.beginPath();
    ctx.moveTo(cx, h / 2 - 60 + fallY);
    ctx.quadraticCurveTo(cx + 5, h / 2 - 48 + fallY, cx, h / 2 - 38 + fallY);
    ctx.quadraticCurveTo(cx - 5, h / 2 - 48 + fallY, cx, h / 2 - 60 + fallY);
    ctx.fill();
    if (fallY > 150) {
      const rippleR = (fallY - 150) * 4;
      ctx.strokeStyle = `rgba(180,210,255,${Math.max(0, 0.5 - rippleR / 100)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, h / 2 + 50, rippleR, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
}

export function birdWingsFlap(ctx, t, w, h) {
  blackScreen(ctx, t, w, h);
  vignetteWindow(ctx, w, h, 130, () => {
    const cx = w / 2;
    const cy = h / 2;
    const flap = Math.sin(t * 9) * 0.7;
    ctx.fillStyle = 'rgba(230,220,200,0.85)';
    ctx.save();
    ctx.translate(cx, cy);
    ctx.save();
    ctx.rotate(flap);
    ctx.beginPath();
    ctx.ellipse(-20, 0, 34, 12, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.rotate(-flap);
    ctx.beginPath();
    ctx.ellipse(20, 0, 34, 12, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

export function leavesRustle(ctx, t, w, h) {
  blackScreen(ctx, t, w, h);
  vignetteWindow(ctx, w, h, 130, () => {
    for (let i = 0; i < 6; i++) {
      const angle = i * 1.1 + t * 0.6;
      const sway = Math.sin(t * 2 + i) * 14;
      const x = w / 2 + Math.cos(angle) * 60 + sway;
      const y = h / 2 + Math.sin(angle) * 40;
      ctx.fillStyle = `rgba(120,180,90,${0.6 + 0.3 * Math.sin(t * 3 + i)})`;
      ctx.beginPath();
      ctx.ellipse(x, y, 12, 6, angle, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

export function familySilhouette(ctx, t, w, h) {
  blackScreen(ctx, t, w, h);
  vignetteWindow(ctx, w, h, 150, () => {
    const glow = 0.5 + Math.sin(t * 1.5) * 0.15;
    ctx.fillStyle = `rgba(255,225,170,${glow})`;
    const cx = w / 2;
    const cy = h / 2 + 40;
    ctx.beginPath();
    ctx.ellipse(cx - 40, cy, 22, 55, 0, 0, Math.PI * 2);
    ctx.ellipse(cx, cy - 10, 20, 65, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 45, cy, 16, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx - 40, cy - 60, 14, 0, Math.PI * 2);
    ctx.arc(cx, cy - 78, 15, 0, Math.PI * 2);
    ctx.arc(cx + 45, cy - 45, 11, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function houseInGardenReveal(ctx, t, w, h, opts = {}) {
  const { progress = Math.min(1, t / 2.5) } = opts;
  const skyTop = lerpColor('#05070a', '#1b3350', progress);
  const skyBottom = lerpColor('#05070a', '#6a8fae', progress);
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, skyTop);
  grad.addColorStop(1, skyBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.globalAlpha = progress;
  ctx.fillStyle = '#3f6b3a';
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.quadraticCurveTo(w * 0.5, h * 0.72, w, h * 0.82);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  const houseX = w * 0.55;
  const houseY = h * 0.68;
  ctx.fillStyle = '#caa26a';
  ctx.fillRect(houseX - 90, houseY - 90, 180, 90);
  ctx.fillStyle = '#8a5a3a';
  ctx.beginPath();
  ctx.moveTo(houseX - 110, houseY - 90);
  ctx.lineTo(houseX, houseY - 150);
  ctx.lineTo(houseX + 110, houseY - 90);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,220,140,0.85)';
  ctx.fillRect(houseX - 50, houseY - 55, 30, 30);
  ctx.fillRect(houseX + 20, houseY - 55, 30, 30);
  ctx.restore();
}

export function simbaWakingBeat(sitAnimator) {
  return (ctx, t, w, h) => {
    houseInGardenReveal(ctx, 3, w, h, { progress: 1 });
    sitAnimator.update(1 / 60);
    const img = sitAnimator.currentImage();
    if (img && img.complete) {
      const drawH = 260;
      const drawW = (img.width / img.height) * drawH;
      const bob = Math.sin(t * 2) * 3;
      ctx.drawImage(img, w / 2 - drawW / 2, h * 0.62 - drawH + bob, drawW, drawH);
    }
  };
}

export function starrySkyWish(ctx, t, w, h, opts = {}) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#04060f');
  grad.addColorStop(1, '#131a30');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  for (let i = 0; i < 60; i++) {
    const sx = (i * 137) % w;
    const sy = (i * 89) % (h * 0.7);
    const tw = 0.4 + 0.4 * Math.sin(t * 2 + i);
    ctx.fillStyle = `rgba(255,255,255,${Math.max(0.1, tw)})`;
    ctx.fillRect(sx, sy, 2, 2);
  }
  const pulse = 0.6 + Math.sin(t * 3) * 0.35;
  const cx = w * 0.7;
  const cy = h * 0.28;
  const glow = ctx.createRadialGradient(cx, cy, 1, cx, cy, 40 * pulse);
  glow.addColorStop(0, 'rgba(255,250,210,0.95)');
  glow.addColorStop(1, 'rgba(255,250,210,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, 40 * pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function spiritDescent(ctx, t, w, h, opts = {}) {
  starrySkyWish(ctx, t, w, h);
  const progress = Math.min(1, t / 2.2);
  const cx = w / 2;
  const cy = h * 0.25 + (h * 0.35) * progress;
  const pulse = 0.8 + Math.sin(t * 2) * 0.15;
  const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 140 * pulse);
  grad.addColorStop(0, 'rgba(255,250,225,0.95)');
  grad.addColorStop(0.5, 'rgba(255,225,150,0.4)');
  grad.addColorStop(1, 'rgba(255,225,150,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 140 * pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.beginPath();
  ctx.ellipse(cx, cy, 26, 55, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function stormWindowScene(ctx, t, w, h, opts = {}) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#0a0d16');
  grad.addColorStop(1, '#232c3d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const flashPhase = (t % 3.2);
  const flash = flashPhase < 0.12 ? 1 - flashPhase / 0.12 : 0;
  if (flash > 0) {
    ctx.fillStyle = `rgba(255,255,255,${flash * 0.5})`;
    ctx.fillRect(0, 0, w, h);
  }

  for (let i = 0; i < 40; i++) {
    const rx = (i * 53 + t * 260) % w;
    const ry = (i * 97 + t * 500) % h;
    ctx.strokeStyle = 'rgba(190,210,255,0.4)';
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 6, ry + 20);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(40,30,20,0.9)';
  ctx.fillRect(w * 0.35, h * 0.15, 12, h * 0.65);
  ctx.fillRect(w * 0.35, h * 0.45, w * 0.3, 12);
  ctx.fillRect(w * 0.65 - 12, h * 0.15, 12, h * 0.65);
}

export function silenceToSoundRings(ctx, t, w, h, opts = {}) {
  const { pulses = [] } = opts;
  const cx = w / 2;
  const cy = h * 0.45;
  ctx.save();
  ctx.fillStyle = '#05070a';
  ctx.fillRect(0, 0, w, h);
  for (const pulse of pulses) {
    const age = t - pulse.at;
    if (age < 0 || age > 1.6) continue;
    const r = age * 220;
    const alpha = Math.max(0, 0.6 - age / 1.6);
    ctx.strokeStyle = `rgba(255,240,210,${alpha})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function familyReunionRun(runAnimator, opts = {}) {
  return (ctx, t, w, h) => {
    houseInGardenReveal(ctx, 3, w, h, { progress: 1 });
    const progress = Math.min(1, t / 2.2);
    runAnimator.update(1 / 60);
    const img = runAnimator.currentImage();
    const cx = w * 0.15 + (w * 0.55) * progress;
    if (img && img.complete) {
      const drawH = 220;
      const drawW = (img.width / img.height) * drawH;
      ctx.drawImage(img, cx - drawW / 2, h * 0.6 - drawH, drawW, drawH);
    }
    ctx.fillStyle = 'rgba(255,225,170,0.9)';
    const fx = w * 0.78;
    const fy = h * 0.62;
    ctx.beginPath();
    ctx.ellipse(fx - 30, fy, 18, 46, 0, 0, Math.PI * 2);
    ctx.ellipse(fx + 25, fy - 6, 16, 52, 0, 0, Math.PI * 2);
    ctx.fill();
  };
}

export function titleCard(ctx, t, w, h, opts = {}) {
  const { title = 'EL SILENCIO DE SIMBA', subtitle = '' } = opts;
  ctx.fillStyle = '#05070a';
  ctx.fillRect(0, 0, w, h);
  const alpha = Math.min(1, t / 1.2);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f5e6c8';
  ctx.font = '600 52px Georgia, serif';
  ctx.shadowColor = 'rgba(255,230,170,0.6)';
  ctx.shadowBlur = 24;
  ctx.fillText(title, w / 2, h / 2 - 10);
  if (subtitle) {
    ctx.font = 'italic 24px Georgia, serif';
    ctx.shadowBlur = 8;
    ctx.fillText(subtitle, w / 2, h / 2 + 40);
  }
  ctx.restore();
}

function lerpColor(a, b, t) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const r = Math.round(ca.r + (cb.r - ca.r) * t);
  const g = Math.round(ca.g + (cb.g - ca.g) * t);
  const bl = Math.round(ca.b + (cb.b - ca.b) * t);
  return `rgb(${r},${g},${bl})`;
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
