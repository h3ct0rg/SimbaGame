import { starrySkyWish } from '../cinematics/scene-primitives.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../core/constants.js';
import { SaveManager } from '../core/save-manager.js';

export class MenuState {
  constructor(game) {
    this.game = game;
    this.t = 0;
  }

  enter() {
    this.t = 0;
    this.game.menu.show(!!SaveManager.getCheckpoint());
    this.game.hud.hide();
    this.game.dialogueBox.hide();
    this.game.audio.startAmbient('sanctuary');
  }

  update(dt) {
    this.game.input.beginTick();
    this.t += dt;
  }

  render(ctx) {
    starrySkyWish(ctx, this.t, GAME_WIDTH, GAME_HEIGHT);
  }

  exit() {
    this.game.menu.hide();
    this.game.audio.stopAmbient();
  }
}
