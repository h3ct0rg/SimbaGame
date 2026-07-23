import { ScenePlayer } from './scene-player.js';
import { drawTreasureIcon } from '../entities/collectible.js';
import { getTreasure } from '../../data/treasures.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../core/constants.js';

function beat(draw, duration, text, audioCue) {
  return { draw, duration, text, audioCue };
}

function drawTreasureBeat(iconKey) {
  return (ctx, t, w, h) => {
    ctx.fillStyle = '#05070a';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2 - 40;
    const pulse = 0.7 + Math.sin(t * 2.4) * 0.25;
    const glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 120 * pulse);
    glow.addColorStop(0, 'rgba(255,245,210,0.9)');
    glow.addColorStop(1, 'rgba(255,245,210,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, 120 * pulse, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 10; i++) {
      const a = t * 0.8 + (i / 10) * Math.PI * 2;
      const r = 60 + Math.sin(t * 2 + i) * 10;
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(3.2, 3.2);
    drawTreasureIcon(ctx, iconKey, 1);
    ctx.restore();
  };
}

export class TreasureGetState {
  constructor(game, nextStateName) {
    this.game = game;
    this.nextStateName = nextStateName;
  }

  enter(payload) {
    const treasure = getTreasure(payload.treasureId);
    const draw = drawTreasureBeat(treasure.icon);
    this.scenePlayer = new ScenePlayer(this.game.audio, this.game.dialogueBox);
    this.scenePlayer.play(
      [
        beat(draw, 1.4, null, 'chime'),
        beat(draw, 2.2, treasure.name),
        beat(draw, 3, payload.spiritLine || treasure.spiritLine, 'spirit'),
      ],
      () => this.game.stateMachine.transition(this.nextStateName)
    );
  }

  update(dt) {
    this.game.input.beginTick();
    this.scenePlayer.update(dt, this.game.input);
  }

  render(ctx) {
    this.scenePlayer.render(ctx, GAME_WIDTH, GAME_HEIGHT);
  }
}
