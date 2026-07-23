export const level04 = {
  id: 'level-04-jardin',
  name: 'El Jardín de los Recuerdos',
  treasureId: 'flor-amor',
  palette: {
    sky: { top: '#2a1b32', bottom: '#8a6a9a' },
    fog: '#c79fcf',
    accent: '#a878b8',
  },
  bounds: { width: 2800, height: 720 },
  spawn: { x: 90, y: 500 },
  platforms: [
    { x: 0, y: 650, w: 600, h: 70 },
    { x: 700, y: 590, w: 220, h: 30 },
    { x: 1020, y: 650, w: 500, h: 70 },
    { x: 1620, y: 580, w: 200, h: 30 },
    { x: 1920, y: 650, w: 880, h: 70 },
  ],
  hazards: [],
  npcs: [
    {
      x: 300,
      y: 590,
      kind: 'spirit',
      dialogue: ['Su llegada a casa...'],
      triggerRadius: 100,
    },
    {
      x: 1100,
      y: 590,
      kind: 'spirit',
      dialogue: ['Sus primeros juegos...'],
      triggerRadius: 100,
    },
    {
      x: 2000,
      y: 590,
      kind: 'spirit',
      dialogue: ['Cuando se quedó dormido abrazado a sus dueños.'],
      triggerRadius: 100,
    },
  ],
  collectible: { x: 2680, y: 590, treasureId: 'flor-amor', icon: 'flower' },
  spiritLine: 'El amor nunca necesita sonido.',
  background: {
    layers: ['sky-gradient', 'hills', 'clouds'],
    particles: [
      { type: 'sparkles', density: 0.6 },
      { type: 'pollen', density: 0.3 },
    ],
    weather: null,
  },
  music: { ambientProfile: 'garden' },
};
