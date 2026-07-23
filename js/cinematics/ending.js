import { ScenePlayer } from './scene-player.js';
import { SpriteAnimator } from '../entities/sprite-animator.js';
import { houseInGardenReveal, simbaWakingBeat, familyReunionRun, silenceToSoundRings, titleCard } from './scene-primitives.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../core/constants.js';

function beat(draw, duration, text, audioCue) {
  return { draw, duration, text, audioCue };
}

function buildRevealBeat(audio) {
  const cues = [
    { at: 0.25, fn: () => audio.heartbeat() },
    { at: 1.4, fn: () => audio.heartbeat(0.1) },
    { at: 2.6, fn: () => audio.voiceSwell() },
    { at: 4.2, fn: () => audio.playNoiseBurst({ duration: 1, filterFreq: 2200, gain: 0.07 }) },
    { at: 5.0, fn: () => audio.playChime([660, 784, 990], 0.09) },
  ];
  const fired = new Set();
  const pulses = [];
  return (ctx, t, w, h) => {
    for (const c of cues) {
      if (t >= c.at && !fired.has(c.at)) {
        fired.add(c.at);
        c.fn();
        pulses.push({ at: c.at });
      }
    }
    silenceToSoundRings(ctx, t, w, h, { pulses });
  };
}

function buildBeats(game, sitAnimator, runAnimator) {
  const houseHeld = (ctx, t, w, h) => houseInGardenReveal(ctx, t, w, h, { progress: 1 });
  const wakeBeat = simbaWakingBeat(sitAnimator);
  const revealBeat = buildRevealBeat(game.audio);
  const reunionBeat = familyReunionRun(runAnimator);

  return [
    beat(wakeBeat, 2.4, 'Simba despierta. Está nuevamente en su habitación. Todo parece igual.'),
    beat(wakeBeat, 2.4, 'Dueña: — Buenos días, Simba.'),
    beat(houseHeld, 1.6, 'Silencio.'),
    beat(revealBeat, 6, 'Un sonido aparece. El primero en su vida: el latido de un corazón... luego, una voz.'),
    beat(houseHeld, 2.6, 'Dueño: — Simba...', 'voice'),
    beat(houseHeld, 2.8, 'El gatito comienza a llorar. Escucha, por primera vez, escucha.'),
    beat(houseHeld, 3, 'La lluvia. Los pájaros. Los pasos. Las risas. Pero sobre todo...'),
    beat(houseHeld, 2.8, 'Dueña: — Te queremos mucho, Simba.', 'voice'),
    beat(reunionBeat, 2.6, 'El gatito corre hacia ellos.'),
    beat(wakeBeat, 3.2, 'Simba está sentado junto a la ventana viendo el amanecer. Ahora puede escuchar el mundo.'),
    beat(wakeBeat, 3.2, 'Narrador: "Simba pensó que su mayor deseo era escuchar."'),
    beat(wakeBeat, 3.4, 'Narrador: "Pero durante su viaje descubrió que había algo que siempre estuvo presente: el amor de quienes lo rodeaban."'),
    beat(wakeBeat, 3.6, 'Narrador: "Porque algunas cosas no necesitan ser escuchadas para ser comprendidas."'),
    beat((ctx, t, w, h) => titleCard(ctx, t, w, h, { title: 'EL SILENCIO DE SIMBA', subtitle: 'Una aventura sobre encontrar la voz del corazón' }), 4),
    beat((ctx, t, w, h) => titleCard(ctx, t, w, h, { title: 'FIN' }), 3.4),
  ];
}

export class EndingState {
  constructor(game, nextStateName) {
    this.game = game;
    this.nextStateName = nextStateName;
  }

  enter() {
    const { assets, audio, dialogueBox } = this.game;
    this.sitAnimator = new SpriteAnimator(assets.getSequence('sit'), 6, true);
    this.runAnimator = new SpriteAnimator(assets.getSequence('run'), 16, true);
    this.scenePlayer = new ScenePlayer(audio, dialogueBox);
    this.scenePlayer.play(buildBeats(this.game, this.sitAnimator, this.runAnimator), () => {
      this.game.stateMachine.transition(this.nextStateName);
    });
    if (this.game.skipButton) this.game.skipButton.show();
  }

  update(dt) {
    this.game.input.beginTick();
    this.scenePlayer.update(dt, this.game.input);
  }

  render(ctx) {
    this.scenePlayer.render(ctx, GAME_WIDTH, GAME_HEIGHT);
  }

  exit() {
    if (this.game.skipButton) this.game.skipButton.hide();
  }
}
