export class StateMachine {
  constructor() {
    this.states = new Map();
    this.current = null;
    this.currentName = null;
    this.onTransition = null;
  }

  register(name, state) {
    this.states.set(name, state);
  }

  transition(name, payload) {
    if (this.current && typeof this.current.exit === 'function') {
      this.current.exit();
    }
    const next = this.states.get(name);
    if (!next) {
      throw new Error(`Unknown state: ${name}`);
    }
    this.current = next;
    this.currentName = name;
    if (typeof next.enter === 'function') {
      next.enter(payload);
    }
    if (this.onTransition) this.onTransition(name, payload);
  }

  update(dt) {
    if (this.current && typeof this.current.update === 'function') {
      this.current.update(dt);
    }
  }

  render(ctx, alpha) {
    if (this.current && typeof this.current.render === 'function') {
      this.current.render(ctx, alpha);
    }
  }
}
