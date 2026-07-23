export const TREASURES = [
  {
    id: 'semilla-esperanza',
    name: 'La Semilla de la Esperanza',
    icon: 'seed',
    level: 1,
    spiritLine: 'La esperanza aparece cuando seguimos caminando aunque no sepamos dónde termina el camino.',
  },
  {
    id: 'piedra-valor',
    name: 'La Piedra del Valor',
    icon: 'stone',
    level: 2,
    spiritLine: 'El valor no es no sentir miedo. El valor es seguir adelante cuando el miedo aparece.',
  },
  {
    id: 'cristal-amistad',
    name: 'El Cristal de la Amistad',
    icon: 'crystal',
    level: 3,
    spiritLine: 'Las palabras pueden unir personas... pero la amistad verdadera une corazones.',
  },
  {
    id: 'flor-amor',
    name: 'La Flor del Amor',
    icon: 'flower',
    level: 4,
    spiritLine: 'El amor nunca necesita sonido.',
  },
  {
    id: 'lagrima-cielo',
    name: 'La Lágrima del Cielo',
    icon: 'tear',
    level: 5,
    spiritLine: 'Las dificultades no muestran quién eres. Muestran quién decides ser.',
  },
  {
    id: 'espejo-alma',
    name: 'El Espejo del Alma',
    icon: 'mirror',
    level: 6,
    spiritLine: 'No eres aquello que falta. Eres todo aquello que existe dentro de ti.',
  },
  {
    id: 'campana-corazon',
    name: 'La Campana del Corazón',
    icon: 'bell',
    level: 7,
    spiritLine: 'El amor verdadero siempre piensa en otros antes que en uno mismo.',
  },
  {
    id: 'estrella-fe',
    name: 'La Estrella de la Fe',
    icon: 'star',
    level: 8,
    spiritLine: 'Ahora estás listo.',
  },
];

export function getTreasure(id) {
  return TREASURES.find((t) => t.id === id);
}
