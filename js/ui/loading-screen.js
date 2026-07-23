export class LoadingScreen {
  constructor() {
    this.root = document.getElementById('loading-screen');
    this.fill = document.getElementById('loading-bar-fill');
    this.text = document.getElementById('loading-text');
  }

  setProgress(loaded, total) {
    const pct = Math.round((loaded / total) * 100);
    this.fill.style.width = `${pct}%`;
    this.text.textContent = `Cargando... ${pct}%`;
  }

  hide() {
    this.root.classList.add('hidden');
  }
}
