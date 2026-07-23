export class SpriteAnimator {
  constructor(images, fps, loop = true) {
    this.images = images;
    this.fps = fps;
    this.loop = loop;
    this.t = 0;
    this.frameIndex = 0;
    this.finished = false;
  }

  reset() {
    this.t = 0;
    this.frameIndex = 0;
    this.finished = false;
  }

  update(dt) {
    this.t += dt;
    const rawIndex = Math.floor(this.t * this.fps);
    const count = this.images.length;
    if (this.loop) {
      this.frameIndex = ((rawIndex % count) + count) % count;
    } else if (rawIndex >= count - 1) {
      this.frameIndex = count - 1;
      this.finished = true;
    } else {
      this.frameIndex = rawIndex;
    }
  }

  /** Force the frame index directly, e.g. to sync with physics progress (0..1). */
  setProgress(progress) {
    const count = this.images.length;
    const clamped = Math.max(0, Math.min(1, progress));
    this.frameIndex = Math.min(count - 1, Math.floor(clamped * count));
  }

  currentImage() {
    return this.images[this.frameIndex];
  }
}
