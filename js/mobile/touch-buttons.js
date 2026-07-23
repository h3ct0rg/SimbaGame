export class TouchJumpButton {
  constructor(input) {
    this.input = input;
    this.button = document.getElementById('jump-button');

    this.button.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.input.setTouchJump(true);
    });
    this.button.addEventListener('pointerup', () => this.input.setTouchJump(false));
    this.button.addEventListener('pointercancel', () => this.input.setTouchJump(false));
    this.button.addEventListener('pointerleave', () => this.input.setTouchJump(false));
  }
}
