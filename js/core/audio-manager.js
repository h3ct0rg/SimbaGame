const AMBIENT_PROFILES = {
  forest: { base: 174.6, detune: 5, filter: 1200, gain: 0.05 },
  mountain: { base: 130.8, detune: 8, filter: 700, gain: 0.045 },
  valley: { base: 196.0, detune: 4, filter: 1400, gain: 0.05 },
  garden: { base: 220.0, detune: 3, filter: 1600, gain: 0.04 },
  storm: { base: 98.0, detune: 12, filter: 500, gain: 0.06 },
  mirrors: { base: 246.9, detune: 6, filter: 1800, gain: 0.04 },
  temple: { base: 146.8, detune: 5, filter: 900, gain: 0.05 },
  sanctuary: { base: 261.6, detune: 2, filter: 2200, gain: 0.05 },
};

export class AudioManager {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.muted = false;
    this._ambientNodes = null;
    this._resumeBound = false;
  }

  init() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.8;
    this.master.connect(this.ctx.destination);
    this._armResume();
  }

  _armResume() {
    if (this._resumeBound) return;
    this._resumeBound = true;
    const resume = () => {
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    };
    window.addEventListener('pointerdown', resume, { once: true });
    window.addEventListener('keydown', resume, { once: true });
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.master) this.master.gain.value = muted ? 0 : 0.8;
  }

  toggleMuted() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  _now() {
    return this.ctx.currentTime;
  }

  playTone({ freq = 440, duration = 0.3, type = 'sine', attack = 0.01, release = 0.2, gain = 0.3, delay = 0 } = {}) {
    if (!this.ctx) return;
    const t0 = this._now() + delay;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + attack);
    g.gain.linearRampToValueAtTime(0, t0 + attack + duration + release);
    osc.connect(g);
    g.connect(this.master);
    osc.start(t0);
    osc.stop(t0 + attack + duration + release + 0.05);
  }

  playChime(freqs = [523.25, 659.25, 783.99, 1046.5], stepTime = 0.09) {
    freqs.forEach((freq, i) => {
      this.playTone({ freq, duration: 0.35, type: 'sine', attack: 0.005, release: 0.4, gain: 0.18, delay: i * stepTime });
    });
  }

  playNoiseBurst({ duration = 0.2, filterFreq = 1200, gain = 0.2, delay = 0 } = {}) {
    if (!this.ctx) return;
    const t0 = this._now() + delay;
    const bufferSize = Math.floor(this.ctx.sampleRate * (duration + 0.05));
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = filterFreq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

    src.connect(filter);
    filter.connect(g);
    g.connect(this.master);
    src.start(t0);
    src.stop(t0 + duration + 0.05);
  }

  jump() {
    this.playTone({ freq: 440, duration: 0.08, type: 'triangle', attack: 0.005, release: 0.12, gain: 0.2 });
  }

  land() {
    this.playNoiseBurst({ duration: 0.08, filterFreq: 500, gain: 0.15 });
  }

  step() {
    this.playNoiseBurst({ duration: 0.04, filterFreq: 900, gain: 0.06 });
  }

  uiClick() {
    this.playTone({ freq: 880, duration: 0.05, type: 'square', attack: 0.002, release: 0.06, gain: 0.12 });
  }

  collect() {
    this.playChime();
  }

  thunder() {
    this.playNoiseBurst({ duration: 0.6, filterFreq: 300, gain: 0.35 });
    this.playTone({ freq: 60, duration: 0.6, type: 'sine', attack: 0.01, release: 0.6, gain: 0.3 });
  }

  spiritAppear() {
    this.playChime([392.0, 523.25, 659.25, 880.0, 1046.5], 0.14);
  }

  heartbeat(delay = 0) {
    this.playTone({ freq: 55, duration: 0.12, type: 'sine', attack: 0.005, release: 0.25, gain: 0.4, delay });
    this.playTone({ freq: 55, duration: 0.12, type: 'sine', attack: 0.005, release: 0.3, gain: 0.32, delay: delay + 0.32 });
  }

  voiceSwell(delay = 0) {
    if (!this.ctx) return;
    const t0 = this._now() + delay;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t0);
    osc.frequency.linearRampToValueAtTime(220, t0 + 1.2);
    filter.type = 'bandpass';
    filter.Q.value = 4;
    filter.frequency.setValueAtTime(400, t0);
    filter.frequency.linearRampToValueAtTime(900, t0 + 1.2);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.15, t0 + 0.4);
    g.gain.linearRampToValueAtTime(0, t0 + 1.4);
    osc.connect(filter);
    filter.connect(g);
    g.connect(this.master);
    osc.start(t0);
    osc.stop(t0 + 1.5);
  }

  startAmbient(profileName) {
    this.stopAmbient();
    if (!this.ctx) return;
    const profile = AMBIENT_PROFILES[profileName] || AMBIENT_PROFILES.forest;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.value = profile.base;
    osc2.frequency.value = profile.base + profile.detune;
    filter.type = 'lowpass';
    filter.frequency.value = profile.filter;

    lfo.frequency.value = 0.08;
    lfoGain.gain.value = profile.filter * 0.25;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    g.gain.setValueAtTime(0, this._now());
    g.gain.linearRampToValueAtTime(profile.gain, this._now() + 2);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(g);
    g.connect(this.master);

    osc1.start();
    osc2.start();
    lfo.start();

    this._ambientNodes = { osc1, osc2, lfo, gain: g };
  }

  stopAmbient() {
    if (!this._ambientNodes) return;
    const { osc1, osc2, lfo, gain } = this._ambientNodes;
    const t0 = this._now();
    gain.gain.linearRampToValueAtTime(0, t0 + 0.6);
    setTimeout(() => {
      try {
        osc1.stop();
        osc2.stop();
        lfo.stop();
      } catch (e) {
        /* already stopped */
      }
    }, 700);
    this._ambientNodes = null;
  }
}
