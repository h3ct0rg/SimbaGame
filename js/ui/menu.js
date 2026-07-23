export class Menu {
  constructor({ onStart, onContinue }) {
    this.root = document.getElementById('menu-screen');
    this.continueBtn = document.getElementById('btn-continue');
    document.getElementById('btn-start').addEventListener('click', onStart);
    this.continueBtn.addEventListener('click', onContinue);
  }

  show(hasCheckpoint) {
    this.continueBtn.classList.toggle('hidden', !hasCheckpoint);
    this.root.classList.remove('hidden');
  }

  hide() {
    this.root.classList.add('hidden');
  }
}
