export class SkipButton {
  constructor(input) {
    this.root = document.getElementById('skip-button');
    this.root.addEventListener('click', () => input.triggerSkip());
  }

  show() {
    this.root.classList.remove('hidden');
  }

  hide() {
    this.root.classList.add('hidden');
  }
}
