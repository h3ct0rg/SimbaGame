export class ScenePlayer {
  constructor(audio, dialogueBox) {
    this.audio = audio;
    this.dialogueBox = dialogueBox;
    this.beats = [];
    this.index = 0;
    this.t = 0;
    this.onComplete = null;
    this.active = false;
  }

  play(beats, onComplete) {
    this.beats = beats;
    this.index = 0;
    this.onComplete = onComplete;
    this.active = true;
    this._enterBeat();
  }

  _enterBeat() {
    this.t = 0;
    const beat = this.beats[this.index];
    if (!beat) {
      this._finish();
      return;
    }
    if (this.dialogueBox) {
      if (beat.text) this.dialogueBox.show([beat.text], { cinematic: true });
      else this.dialogueBox.hide();
    }
    if (beat.audioCue) this._fireAudioCue(beat.audioCue, beat.audioDelay || 0);
  }

  _fireAudioCue(cue, delay) {
    switch (cue) {
      case 'heartbeat':
        this.audio.heartbeat(delay);
        break;
      case 'voice':
        this.audio.voiceSwell(delay);
        break;
      case 'chime':
        this.audio.collect();
        break;
      case 'spirit':
        this.audio.spiritAppear();
        break;
      case 'thunder':
        this.audio.thunder();
        break;
      default:
        break;
    }
  }

  _finish() {
    this.active = false;
    if (this.dialogueBox) this.dialogueBox.hide();
    if (this.onComplete) this.onComplete();
  }

  update(dt, input) {
    if (!this.active) return;
    if (input.skipPressed) {
      this._finish();
      return;
    }
    this.t += dt;
    const beat = this.beats[this.index];
    if (!beat) {
      this._finish();
      return;
    }
    if (this.t >= beat.duration || input.confirmPressed) {
      this.index++;
      this._enterBeat();
    }
  }

  render(ctx, w, h) {
    const beat = this.beats[this.index];
    if (beat && beat.draw) beat.draw(ctx, this.t, w, h);
  }
}
