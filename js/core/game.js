import { GAME_WIDTH, GAME_HEIGHT } from './constants.js';
import { StateMachine } from './state-machine.js';
import { GameLoop } from './loop.js';
import { InputManager } from './input.js';
import { AssetLoader } from './asset-loader.js';
import { AudioManager } from './audio-manager.js';
import { Camera } from './camera.js';
import { SaveManager } from './save-manager.js';

import { Hud } from '../ui/hud.js';
import { DialogueBox } from '../ui/dialogue-box.js';
import { Menu } from '../ui/menu.js';
import { LoadingScreen } from '../ui/loading-screen.js';
import { SkipButton } from '../ui/skip-button.js';
import { MenuState } from '../ui/menu-state.js';

import { VirtualJoystick } from '../mobile/virtual-joystick.js';
import { TouchJumpButton } from '../mobile/touch-buttons.js';
import { watchMobileLayout } from '../mobile/touch-detect.js';

import { IntroState } from '../cinematics/intro.js';
import { TreasureGetState } from '../cinematics/treasure-get.js';
import { EndingState } from '../cinematics/ending.js';
import { LevelState } from '../levels/level-engine.js';

import { level01 } from '../levels/data/level-01-bosque.js';
import { level02 } from '../levels/data/level-02-montana.js';
import { level03 } from '../levels/data/level-03-valle.js';
import { level04 } from '../levels/data/level-04-jardin.js';
import { level05 } from '../levels/data/level-05-tormentas.js';
import { level06 } from '../levels/data/level-06-espejos.js';
import { level07 } from '../levels/data/level-07-templo.js';
import { level08 } from '../levels/data/level-08-santuario.js';

const LEVELS = [level01, level02, level03, level04, level05, level06, level07, level08];

function pad(n) {
  return String(n).padStart(2, '0');
}

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.input = new InputManager();
    this.assets = new AssetLoader();
    this.audio = new AudioManager();
    this.camera = new Camera();
    this.hud = new Hud();
    this.dialogueBox = new DialogueBox();
    this.loadingScreen = new LoadingScreen();
    this.skipButton = new SkipButton(this.input);
    this.stateMachine = new StateMachine();
    this.loop = new GameLoop(
      (dt) => this._update(dt),
      (alpha) => this._render(alpha)
    );

    this.stateMachine.onTransition = (name) => {
      if (name.startsWith('level-')) SaveManager.setCheckpoint(name);
    };

    new VirtualJoystick(this.input);
    new TouchJumpButton(this.input);
    watchMobileLayout(() => {});

    const muteButton = document.getElementById('mute-button');
    muteButton.addEventListener('click', () => {
      const muted = this.audio.toggleMuted();
      SaveManager.setMuted(muted);
      muteButton.textContent = muted ? '🔇' : '🔊';
      this.audio.uiClick();
    });
    this.audio.setMuted(SaveManager.getMuted());
    muteButton.textContent = this.audio.muted ? '🔇' : '🔊';
  }

  async boot() {
    this.audio.init();
    await this.assets.loadAll((loaded, total) => this.loadingScreen.setProgress(loaded, total));
    this.loadingScreen.hide();

    this.menu = new Menu({
      onStart: () => this._startNewGame(),
      onContinue: () => this._continueGame(),
    });

    this._registerStates();
    this.stateMachine.transition('menu');
    this.loop.start();
  }

  _startNewGame() {
    SaveManager.clearCheckpoint();
    this.audio.uiClick();
    this.stateMachine.transition('intro');
  }

  _continueGame() {
    this.audio.uiClick();
    const checkpoint = SaveManager.getCheckpoint() || 'level-01';
    this.stateMachine.transition(checkpoint);
  }

  _registerStates() {
    this.stateMachine.register('menu', new MenuState(this));
    this.stateMachine.register('intro', new IntroState(this, 'level-01'));

    LEVELS.forEach((data, i) => {
      const n = i + 1;
      const levelName = `level-${pad(n)}`;
      const treasureName = `treasure-${pad(n)}`;
      const nextStateName = n < LEVELS.length ? `level-${pad(n + 1)}` : 'ending';
      this.stateMachine.register(levelName, new LevelState(this, data, treasureName));
      this.stateMachine.register(treasureName, new TreasureGetState(this, nextStateName));
    });

    this.stateMachine.register('ending', new EndingState(this, 'menu'));
  }

  _update(dt) {
    this.stateMachine.update(dt);
  }

  _render() {
    this.ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.stateMachine.render(this.ctx);
    this.input.endFrame();
  }
}
