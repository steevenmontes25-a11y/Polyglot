/**
 * Arbol de habilidades compartido por todos los idiomas.
 * El contenido concreto (vocabulario, gramatica, textos) vive en
 * server/seed/content/<codigo>.js y se enlaza por el "slug".
 *
 * Estructura pensada para llevar de 0 a A2 solido; ampliar a B1-C2
 * es solo anadir mas entradas aqui con cefr mas alto.
 */
export const SKILL_TREE = [
  { slug: 'saludos',      title: 'Saludos y cortesia',        cefr: 'A1', category: 'Comunicacion', icon: '👋',
    description: 'Presentarte, saludar, despedirte y ser educado.' },
  { slug: 'numeros',      title: 'Numeros y tiempo',           cefr: 'A1', category: 'Vida diaria', icon: '🔢',
    description: 'Contar, decir la hora, los dias y las fechas.' },
  { slug: 'personas',     title: 'Personas y familia',         cefr: 'A1', category: 'Vida diaria', icon: '👨‍👩‍👧',
    description: 'Hablar de tu familia, describir a la gente.' },
  { slug: 'comida',       title: 'Comida y bebida',            cefr: 'A1', category: 'Vida diaria', icon: '🍎',
    description: 'Alimentos, bebidas y pedir en un restaurante.' },
  { slug: 'casa',         title: 'Casa y objetos',             cefr: 'A1', category: 'Vida diaria', icon: '🏠',
    description: 'Las habitaciones, los muebles y los objetos cotidianos.' },
  { slug: 'verbos1',      title: 'Verbos esenciales',          cefr: 'A1', category: 'Gramatica',  icon: '⚙️',
    description: 'Ser, tener, ir, hacer, querer: los verbos que mas se usan.' },
  { slug: 'ciudad',       title: 'Ciudad y direcciones',       cefr: 'A2', category: 'Comunicacion', icon: '🧭',
    description: 'Orientarte, preguntar el camino y describir lugares.' },
  { slug: 'compras',      title: 'Compras y dinero',           cefr: 'A2', category: 'Vida diaria', icon: '🛒',
    description: 'Comprar, preguntar precios y hablar de cantidades.' },
  { slug: 'trabajo',      title: 'Trabajo y estudios',         cefr: 'A2', category: 'Comunicacion', icon: '💼',
    description: 'Profesiones, la oficina, la escuela y la rutina.' },
  { slug: 'viajes',       title: 'Viajes y transporte',        cefr: 'A2', category: 'Comunicacion', icon: '✈️',
    description: 'El aeropuerto, el hotel, los medios de transporte.' },
  { slug: 'salud',        title: 'Salud y cuerpo',             cefr: 'A2', category: 'Vida diaria', icon: '🩺',
    description: 'Las partes del cuerpo, ir al medico, sentirse bien o mal.' },
  { slug: 'tiempo_libre', title: 'Tiempo libre y naturaleza',  cefr: 'A2', category: 'Comunicacion', icon: '🌤️',
    description: 'Aficiones, el tiempo atmosferico, los animales y el paisaje.' },
];

export const SKILL_ORDER = Object.fromEntries(SKILL_TREE.map((s, i) => [s.slug, i]));
