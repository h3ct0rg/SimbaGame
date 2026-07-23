export const level07 = {
  id: 'level-07-templo',
  name: 'El Templo Antiguo',
  treasureId: 'campana-corazon',
  palette: {
    sky: { top: '#241a0c', bottom: '#8a6a3a' },
    fog: '#c9a35a',
    accent: '#8a7350',
  },
  bounds: { width: 3200, height: 720 },
  spawn: { x: 90, y: 500 },
  platforms: [
    { x: 0, y: 650, w: 700, h: 70 },
    { x: 820, y: 590, w: 220, h: 30 },
    { x: 1140, y: 650, w: 500, h: 70 },
    { x: 1740, y: 570, w: 200, h: 30 },
    { x: 2040, y: 650, w: 400, h: 70 },
    { x: 2540, y: 590, w: 200, h: 30 },
    { x: 2840, y: 650, w: 360, h: 70 },
  ],
  hazards: [],
  npcs: [
    {
      x: 2950,
      y: 590,
      kind: 'spirit',
      dialogue: ['El espíritu se desvanece... necesita energía.', 'Simba decide ayudar antes que tomar el tesoro.'],
      triggerRadius: 110,
    },
  ],
  collectible: { x: 3060, y: 590, treasureId: 'campana-corazon', icon: 'bell' },
  spiritLine: 'El amor verdadero siempre piensa en otros antes que en uno mismo.',
  background: {
    layers: ['sky-gradient', 'pillars-back', 'pillars', 'temple-glow-floor'],
    particles: [
      { type: 'dust', density: 0.4 },
      { type: 'embers', density: 0.2 },
    ],
    weather: null,
  },
  music: { ambientProfile: 'temple' },
};
