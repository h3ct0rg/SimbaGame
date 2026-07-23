import { Simba } from '../entities/simba.js';
import { NPC } from '../entities/npc.js';
import { Hazard } from '../entities/hazard.js';
import { Collectible } from '../entities/collectible.js';
import { ParticleSystem } from '../entities/particle-system.js';
import { ParallaxLayer, ParallaxStack } from '../rendering/parallax.js';
import * as bg from '../rendering/background-painter.js';
import { drawGodRays, drawVignette, drawColorGrade, drawFlash } from '../rendering/lighting.js';
import { WeatherFX } from '../rendering/weather-fx.js';
import { FadeTransition } from '../rendering/camera-fx.js';
import { resolveCollisions } from './physics.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../core/constants.js';

const LAYER_BUILDERS = {
  'sky-gradient': (p) => new ParallaxLayer(bg.skyGradient, 0.05, { top: p.sky.top, bottom: p.sky.bottom }),
  clouds: (p) => new ParallaxLayer(bg.cloudLayer, 0.1, { color: '255,255,255', alpha: 0.35 }),
  'far-mountains': (p) => new ParallaxLayer(bg.mountainRange, 0.18, { color: p.accent, baseY: GAME_HEIGHT * 0.6, amplitude: 130 }),
  'far-mountains-back': (p) => new ParallaxLayer(bg.mountainRange, 0.08, { color: p.fog, baseY: GAME_HEIGHT * 0.55, amplitude: 160, tileWidth: 520 }),
  hills: (p) => new ParallaxLayer(bg.hillsRange, 0.3, { color: p.accent, baseY: GAME_HEIGHT * 0.7 }),
  'hills-back': (p) => new ParallaxLayer(bg.hillsRange, 0.14, { color: p.fog, baseY: GAME_HEIGHT * 0.62, amplitude: 40, tileWidth: 460 }),
  'mid-forest': (p) => new ParallaxLayer(bg.treeSilhouette, 0.45, { color: p.fog, baseY: GAME_HEIGHT * 0.78 }),
  'foreground-brush': (p) => new ParallaxLayer(bg.treeSilhouette, 0.95, { color: p.accent, baseY: GAME_HEIGHT * 0.9, spacing: 90, canopyR: 30, trunkH: 40 }),
  pillars: (p) => new ParallaxLayer(bg.pillarRow, 0.35, { color: p.accent, baseY: GAME_HEIGHT * 0.85 }),
  'pillars-back': (p) => new ParallaxLayer(bg.pillarRow, 0.15, { color: p.fog, baseY: GAME_HEIGHT * 0.78, spacing: 300, pillarW: 36, pillarH: 220 }),
  'mirror-panels': (p) => new ParallaxLayer(bg.mirrorPanels, 0.4, { baseY: GAME_HEIGHT * 0.82, t: 0 }),
  'mirror-panels-back': (p) => new ParallaxLayer(bg.mirrorPanels, 0.2, { baseY: GAME_HEIGHT * 0.7, spacing: 260, panelW: 70, panelH: 220, t: 0 }),
  'temple-glow-floor': (p) => new ParallaxLayer(bg.templeGlowFloor, 1, { baseY: GAME_HEIGHT * 0.85, t: 0 }),
  'water-reflection': (p) => new ParallaxLayer(bg.waterReflection, 0.9, { baseY: GAME_HEIGHT * 0.8, color: '90,110,140' }),
  'storm-skyline': (p) => new ParallaxLayer(bg.mountainRange, 0.2, { color: p.accent, baseY: GAME_HEIGHT * 0.62, amplitude: 90 }),
  'storm-skyline-back': (p) => new ParallaxLayer(bg.mountainRange, 0.08, { color: p.fog, baseY: GAME_HEIGHT * 0.58, amplitude: 120, tileWidth: 500 }),
};

export class LevelState {
  constructor(game, data, nextStateName) {
    this.game = game;
    this.data = data;
    this.nextStateName = nextStateName;
    this.time = 0;
  }

  enter() {
    const { assets, input, audio, camera, hud, dialogueBox } = this.game;
    this.input = input;
    this.audio = audio;
    this.camera = camera;
    this.hud = hud;
    this.dialogueBox = dialogueBox;

    this.simba = new Simba(assets, this.data.spawn.x, this.data.spawn.y);
    this.lastSafe = { x: this.data.spawn.x, y: this.data.spawn.y };
    this.platforms = this.data.platforms.map((p) => ({ ...p }));
    this.hazards = (this.data.hazards || []).map((h) => new Hazard(h));
    this.npcs = (this.data.npcs || []).map((n) => new NPC(n));
    this.collectible = new Collectible(this.data.collectible);
    this.done = false;

    this.camera.setBounds(this.data.bounds.width, this.data.bounds.height);
    this.camera.x = 0;

    const palette = this.data.palette;
    const layers = (this.data.background.layers || []).map((key) => {
      const builder = LAYER_BUILDERS[key];
      return builder ? builder(palette) : null;
    }).filter(Boolean);
    this.parallax = new ParallaxStack(layers);

    this.particleSystems = (this.data.background.particles || []).map(
      (cfg) => new ParticleSystem(cfg.type, cfg.density, { w: this.data.bounds.width, h: GAME_HEIGHT })
    );

    this.weather = this.data.background.weather ? new WeatherFX(this.data.background.weather) : null;
    if (this.weather) {
      this.weather.onThunder(() => this.audio.thunder());
    }

    this.fade = new FadeTransition();

    if (this.data.music) this.audio.startAmbient(this.data.music.ambientProfile);
    if (this.hud) this.hud.showLevel(this.data.name);
    if (this.dialogueBox) this.dialogueBox.hide();
    this._activeDialogueNpc = null;
    this._dialogueTimer = 0;
  }

  _respawn() {
    this.simba.setPosition(this.lastSafe.x, this.lastSafe.y);
    this.camera.shake(8, 0.25);
    this.audio.land();
  }

  update(dt) {
    if (this.done) {
      this.fade.update(dt);
      return;
    }

    this.time += dt;
    this.input.beginTick();
    this.simba.applyInput(this.input);
    this.simba.applyGravity(dt);
    resolveCollisions(this.simba, this.platforms, dt);
    this.simba.updateAnimation(dt);

    if (this.simba.grounded) {
      this.lastSafe = { x: this.simba.x, y: this.simba.y };
    }

    if (this.simba.y > GAME_HEIGHT + 200) {
      this._respawn();
    }

    for (const hazard of this.hazards) {
      hazard.update(dt);
      if (hazard.overlaps(this.simba)) this._respawn();
    }

    for (const npc of this.npcs) {
      npc.update(dt);
      if (npc.checkTrigger(this.simba) && this.dialogueBox) {
        this._activeDialogueNpc = npc;
        this._dialogueTimer = Math.max(2.4, npc.dialogue.length * 2.2);
        this.dialogueBox.show(npc.dialogue);
      }
    }
    if (this._activeDialogueNpc) {
      this._dialogueTimer -= dt;
      if (this._dialogueTimer <= 0) {
        this.dialogueBox.hide();
        this._activeDialogueNpc = null;
      }
    }

    this.collectible.update(dt);
    if (this.collectible.checkPickup(this.simba)) {
      this.audio.collect();
      this.simba.forceSit(true);
      this.done = true;
      if (this.hud) this.hud.hide();
      if (this.dialogueBox) this.dialogueBox.hide();
      this.fade.fadeOutThenIn(0.9, () => {
        this.game.stateMachine.transition(this.nextStateName, {
          treasureId: this.data.treasureId,
          spiritLine: this.data.spiritLine,
        });
      });
    }

    for (const ps of this.particleSystems) ps.update(dt);
    if (this.weather) this.weather.update(dt, this.camera);

    this.camera.follow(this.simba, dt);
  }

  render(ctx) {
    const cx = this.camera.renderX;
    const cy = this.camera.renderY;
    const palette = this.data.palette;

    this.parallax.render(ctx, cx, GAME_WIDTH, GAME_HEIGHT);

    ctx.save();
    ctx.translate(-cx, -cy);
    for (const p of this.platforms) {
      const grad = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
      grad.addColorStop(0, palette.accent);
      grad.addColorStop(1, 'rgba(0,0,0,0.35)');
      ctx.fillStyle = grad;
      ctx.fillRect(p.x, p.y, p.w, p.h);
    }
    for (const hazard of this.hazards) hazard.render(ctx);
    this.collectible.render(ctx);
    for (const npc of this.npcs) npc.render(ctx);
    this.simba.render(ctx);
    ctx.restore();

    for (const ps of this.particleSystems) ps.render(ctx, cx);

    drawGodRays(ctx, GAME_WIDTH, GAME_HEIGHT, this.time, { color: '255,240,210' });
    if (this.weather) this.weather.renderFlash(ctx, GAME_WIDTH, GAME_HEIGHT);
    drawColorGrade(ctx, GAME_WIDTH, GAME_HEIGHT, palette.fog, { alpha: 0.1 });
    drawVignette(ctx, GAME_WIDTH, GAME_HEIGHT, { strength: 0.5 });
    this.fade.render(ctx, GAME_WIDTH, GAME_HEIGHT);
  }

  exit() {
    this.audio.stopAmbient();
  }
}
