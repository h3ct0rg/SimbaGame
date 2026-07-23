export const level01 = {
  id: 'level-01-bosque',
  name: 'El Bosque Susurrante',
  treasureId: 'semilla-esperanza',
  palette: {
    sky: { top: '#0f2b1e', bottom: '#3d6b47' },
    fog: '#274d34',
    accent: '#3f6b3a',
  },
  bounds: { width: 3400, height: 720 },
  spawn: { x: 90, y: 500 },
  platforms: [
    { x: 0, y: 650, w: 900, h: 70 },
    { x: 980, y: 590, w: 220, h: 30 },
    { x: 1280, y: 650, w: 500, h: 70 },
    { x: 1860, y: 560, w: 200, h: 30 },
    { x: 2140, y: 650, w: 300, h: 70 },
    { x: 2520, y: 580, w: 180, h: 30 },
    { x: 2780, y: 650, w: 620, h: 70 },
  ],
  hazards: [],
  npcs: [
    {
      x: 420,
      y: 590,
      kind: 'rabbit',
      dialogue: ['¿Estás perdido?', 'No puedes escucharme... pero puedes entenderme.'],
      triggerRadius: 100,
    },
  ],
  collectible: { x: 3220, y: 590, treasureId: 'semilla-esperanza', icon: 'seed' },
  spiritLine: 'La esperanza aparece cuando seguimos caminando aunque no sepamos dónde termina el camino.',
  background: {
    layers: ['sky-gradient', 'far-mountains', 'mid-forest', 'foreground-brush'],
    particles: [
      { type: 'fireflies', density: 0.5 },
      { type: 'leaves', density: 0.6 },
    ],
    weather: null,
  },
  music: { ambientProfile: 'forest' },
};
