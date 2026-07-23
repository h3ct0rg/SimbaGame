export class DialogueBox {
  constructor() {
    this.root = document.getElementById('dialogue-box');
    this.textEl = document.getElementById('dialogue-text');
  }

  show(lines, opts = {}) {
    this.textEl.textContent = Array.isArray(lines) ? lines.join(' ') : lines;
    this.root.classList.remove('hidden');
    this.root.classList.toggle('cinematic', !!opts.cinematic);
  }

  hide() {
    this.root.classList.add('hidden');
  }
}
