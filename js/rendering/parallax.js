export class ParallaxLayer {
  constructor(drawFn, scrollFactor, opts = {}) {
    this.drawFn = drawFn;
    this.scrollFactor = scrollFactor;
    this.opts = opts;
  }

  render(ctx, cameraX, w, h) {
    this.drawFn(ctx, cameraX * this.scrollFactor, w, h, this.opts);
  }
}

export class ParallaxStack {
  constructor(layers) {
    this.layers = layers;
  }

  render(ctx, cameraX, w, h) {
    for (const layer of this.layers) layer.render(ctx, cameraX, w, h);
  }
}
