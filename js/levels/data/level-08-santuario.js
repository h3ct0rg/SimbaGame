export const level08 = {
  id: 'level-08-santuario',
  name: 'El Santuario de la Luz',
  treasureId: 'estrella-fe',
  palette: {
    sky: { top: '#3a2f10', bottom: '#f0d590' },
    fog: '#fff3cf',
    accent: '#e8c56a',
  },
  bounds: { width: 2600, height: 720 },
  spawn: { x: 90, y: 500 },
  platforms: [
    { x: 0, y: 650, w: 700, h: 70 },
    { x: 820, y: 590, w: 220, h: 30 },
    { x: 1140, y: 650, w: 500, h: 70 },
    { x: 1740, y: 580, w: 200, h: 30 },
    { x: 2020, y: 650, w: 580, h: 70 },
  ],
  hazards: [],
  npcs: [
    {
      x: 300,
      y: 590,
      kind: 'spirit',
      dialogue: ['Durante todo este viaje pensaste que buscabas escuchar...', 'Pero encontraste algo más importante.'],
      triggerRadius: 120,
    },
  ],
  collectible: { x: 2460, y: 590, treasureId: 'estrella-fe', icon: 'star' },
  spiritLine: 'Ahora estás listo.',
  background: {
    layers: ['sky-gradient', 'clouds', 'temple-glow-floor'],
    particles: [
      { type: 'ascend', density: 0.6 },
      { type: 'god-rays-motes', density: 0.5 },
      { type: 'sparkles', density: 0.4 },
    ],
    weather: null,
  },
  music: { ambientProfile: 'sanctuary' },
};
