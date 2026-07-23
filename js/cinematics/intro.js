import { ScenePlayer } from './scene-player.js';
import { SpriteAnimator } from '../entities/sprite-animator.js';
import {
  raindropFalling,
  birdWingsFlap,
  leavesRustle,
  familySilhouette,
  houseInGardenReveal,
  simbaWakingBeat,
  starrySkyWish,
  spiritDescent,
  stormWindowScene,
} from './scene-primitives.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../core/constants.js';

function beat(draw, duration, text, audioCue) {
  return { draw, duration, text, audioCue };
}

function buildBeats(sitAnimator) {
  const houseHeld = (ctx, t, w, h) => houseInGardenReveal(ctx, t, w, h, { progress: 1 });
  const spiritHeld = (ctx, t, w, h) => spiritDescent(ctx, t + 5, w, h);

  return [
    beat(raindropFalling, 2.6),
    beat(birdWingsFlap, 2.4),
    beat(leavesRustle, 2.4),
    beat(familySilhouette, 2.8),
    beat(houseInGardenReveal, 3, 'Una pequeña casa aparece en medio de un hermoso jardín.'),
    beat(simbaWakingBeat(sitAnimator), 3.4, 'Buenos días, Simba.'),
    beat(houseHeld, 3, 'Aunque no escucha las palabras... siente el cariño.'),
    beat(houseHeld, 3, 'Corre por la casa. Persigue una pelota. Sus dueños ríen... pero Simba no escucha esa risa.'),
    beat(houseHeld, 3, 'Simba observa un grupo de pájaros. Todos parecen entender un mundo invisible para él.'),
    beat(stormWindowScene, 3.4, 'Esa noche comienza una tormenta.', 'thunder'),
    beat(stormWindowScene, 3.4, 'No puede escuchar la lluvia. No puede escuchar los truenos. No puede escuchar las voces de quienes ama.'),
    beat(stormWindowScene, 2.8, '¿Qué sonido tendrá la voz de mi familia? ¿Cómo será escuchar mi nombre?'),
    beat(starrySkyWish, 3, 'Si existe alguien allá arriba que pueda escucharme...'),
    beat(starrySkyWish, 2.6, 'Por favor... quiero escuchar a mi familia. Quiero saber cómo suena el amor.'),
    beat(spiritDescent, 3, null, 'spirit'),
    beat(spiritHeld, 2.6, 'Espíritu: — Simba... He escuchado tu corazón.'),
    beat(spiritHeld, 2.8, 'Espíritu: — Sé que deseas escuchar el mundo. Pero antes debes descubrir algo.'),
    beat(spiritHeld, 2.4, 'Simba: — ¿Podré escuchar algún día?'),
    beat(spiritHeld, 3.4, 'Espíritu: — Sí... pero la verdadera melodía no se encuentra con los oídos. Se encuentra con el corazón.'),
    beat(
      spiritHeld,
      4,
      'Debes encontrar: la Semilla de la Esperanza, la Piedra del Valor, el Cristal de la Amistad, la Flor del Amor,'
    ),
    beat(spiritHeld, 3.4, 'la Lágrima del Cielo, el Espejo del Alma, la Campana del Corazón y la Estrella de la Fe.'),
    beat(spiritHeld, 2.4, 'Simba: — Haré lo que sea necesario.'),
    beat(spiritHeld, 2.8, 'Espíritu: — Entonces comienza tu viaje, pequeño Simba.'),
  ];
}

export class IntroState {
  constructor(game, nextStateName) {
    this.game = game;
    this.nextStateName = nextStateName;
  }

  enter() {
    const { assets, audio, dialogueBox } = this.game;
    this.sitAnimator = new SpriteAnimator(assets.getSequence('sit'), 6, true);
    this.scenePlayer = new ScenePlayer(audio, dialogueBox);
    this.scenePlayer.play(buildBeats(this.sitAnimator), () => {
      this.game.stateMachine.transition(this.nextStateName);
    });
    audio.startAmbient('garden');
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
    this.game.audio.stopAmbient();
    if (this.game.skipButton) this.game.skipButton.hide();
  }
}
