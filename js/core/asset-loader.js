function frameList(folder, prefix, count) {
  const paths = [];
  for (let i = 1; i <= count; i++) {
    const n = String(i).padStart(2, '0');
    paths.push(`resources/${folder}/without BG/${prefix}-${n}.png`);
  }
  return paths;
}

export const SPRITE_PATHS = {
  idle: frameList('Waiting', 'waiting', 4),
  run: frameList('Running', 'running', 12),
  jump: frameList('Jumping', 'jumping', 16),
  sit: frameList('Sitting', 'sitting', 8),
};

function loadImage(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.error(`Failed to load sprite: ${path}`);
      resolve(img);
    };
    img.src = encodeURI(path);
  });
}

export class AssetLoader {
  constructor() {
    this.images = new Map();
  }

  async loadAll(onProgress) {
    const allPaths = Object.values(SPRITE_PATHS).flat();
    let loaded = 0;
    await Promise.all(
      allPaths.map(async (path) => {
        const img = await loadImage(path);
        this.images.set(path, img);
        loaded++;
        if (onProgress) onProgress(loaded, allPaths.length);
      })
    );
  }

  getSequence(key) {
    return SPRITE_PATHS[key].map((path) => this.images.get(path));
  }
}
