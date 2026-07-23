const LEFT_KEYS = new Set(['ArrowLeft', 'KeyA']);
const RIGHT_KEYS = new Set(['ArrowRight', 'KeyD']);
const JUMP_KEYS = new Set(['ArrowUp', 'KeyW', 'Space']);
const CONFIRM_KEYS = new Set(['Enter', 'Space']);
const SKIP_KEYS = new Set(['Escape']);

export class InputManager {
  constructor() {
    this.axisX = 0;
    this.jumpHeld = false;
    this.jumpPressed = false;
    this.confirmPressed = false;
    this.skipPressed = false;

    this._keyLeft = false;
    this._keyRight = false;
    this._keyJump = false;
    this._touchAxisX = 0;
    this._touchJumpHeld = false;
    this._prevJumpHeld = false;
    this._pendingConfirm = false;
    this._pendingSkip = false;

    window.addEventListener('keydown', (e) => this._onKeyDown(e));
    window.addEventListener('keyup', (e) => this._onKeyUp(e));
  }

  _onKeyDown(e) {
    if (LEFT_KEYS.has(e.code)) this._keyLeft = true;
    if (RIGHT_KEYS.has(e.code)) this._keyRight = true;
    if (JUMP_KEYS.has(e.code)) this._keyJump = true;
    if (CONFIRM_KEYS.has(e.code)) this._pendingConfirm = true;
    if (SKIP_KEYS.has(e.code)) this._pendingSkip = true;
  }

  _onKeyUp(e) {
    if (LEFT_KEYS.has(e.code)) this._keyLeft = false;
    if (RIGHT_KEYS.has(e.code)) this._keyRight = false;
    if (JUMP_KEYS.has(e.code)) this._keyJump = false;
  }

  setTouchAxisX(value) {
    this._touchAxisX = value;
  }

  setTouchJump(held) {
    this._touchJumpHeld = held;
  }

  triggerConfirm() {
    this._pendingConfirm = true;
  }

  triggerSkip() {
    this._pendingSkip = true;
  }

  /** Called once per frame after gameplay reads edge-triggered flags. */
  endFrame() {
    this.jumpPressed = false;
    this.confirmPressed = false;
    this.skipPressed = false;
  }

  /** Called once per fixed update tick before gameplay reads input. */
  beginTick() {
    let keyAxis = 0;
    if (this._keyLeft) keyAxis -= 1;
    if (this._keyRight) keyAxis += 1;
    this.axisX = keyAxis !== 0 ? keyAxis : this._touchAxisX;

    const jumpHeld = this._keyJump || this._touchJumpHeld;
    this.jumpPressed = jumpHeld && !this._prevJumpHeld;
    this._prevJumpHeld = jumpHeld;
    this.jumpHeld = jumpHeld;

    if (this._pendingConfirm) {
      this.confirmPressed = true;
      this._pendingConfirm = false;
    }
    if (this._pendingSkip) {
      this.skipPressed = true;
      this._pendingSkip = false;
    }
  }
}
