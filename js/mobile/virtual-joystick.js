export class VirtualJoystick {
  constructor(input) {
    this.input = input;
    this.zone = document.getElementById('joystick-zone');
    this.base = document.getElementById('joystick-base');
    this.thumb = document.getElementById('joystick-thumb');
    this.radius = 44;
    this.active = false;
    this.pointerId = null;
    this.baseX = 0;
    this.baseY = 0;

    this.zone.addEventListener('pointerdown', (e) => this._start(e));
    window.addEventListener('pointermove', (e) => this._move(e));
    window.addEventListener('pointerup', (e) => this._end(e));
    window.addEventListener('pointercancel', (e) => this._end(e));
  }

  _start(e) {
    e.preventDefault();
    this.active = true;
    this.pointerId = e.pointerId;
    const rect = this.base.getBoundingClientRect();
    this.baseX = rect.left + rect.width / 2;
    this.baseY = rect.top + rect.height / 2;
    this._move(e);
  }

  _move(e) {
    if (!this.active || e.pointerId !== this.pointerId) return;
    let dx = e.clientX - this.baseX;
    let dy = e.clientY - this.baseY;
    const dist = Math.min(this.radius, Math.hypot(dx, dy));
    const angle = Math.atan2(dy, dx);
    dx = Math.cos(angle) * dist;
    dy = Math.sin(angle) * dist;
    this.thumb.style.transform = `translate(${dx}px, ${dy}px)`;
    this.input.setTouchAxisX(dx / this.radius);
  }

  _end(e) {
    if (e.pointerId !== this.pointerId) return;
    this.active = false;
    this.pointerId = null;
    this.thumb.style.transform = 'translate(0, 0)';
    this.input.setTouchAxisX(0);
  }
}
