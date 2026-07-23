export class Hud {
  constructor() {
    this.root = document.getElementById('hud');
    this.levelName = document.getElementById('hud-level-name');
  }

  showLevel(name) {
    this.levelName.textContent = name;
    this.root.classList.remove('hidden');
  }

  hide() {
    this.root.classList.add('hidden');
  }
}
