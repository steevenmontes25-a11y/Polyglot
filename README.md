# 🌍 Polyglot

Plataforma completa de aprendizaje de idiomas: **frontend + backend + base de datos**, sin
dependencias externas y sin claves de API. Pensada para llevar a alguien de cero a un nivel
sólido (A1–A2 con el contenido incluido; la arquitectura escala hasta C2).

15 idiomas para hispanohablantes: **inglés, francés, italiano, portugués, alemán, neerlandés,
sueco, polaco, ruso, griego, turco, japonés, coreano, chino mandarín y árabe.**

---

## Puesta en marcha (30 segundos)

Requisito: **Node.js 22.5 o superior** (usa el módulo integrado `node:sqlite`; no compila nada).

```bash
cd polyglot
npm run reset     # crea y siembra la base de datos (data/polyglot.db)
npm start         # arranca el servidor
```

Abre **http://localhost:4000** y crea una cuenta.

### Usuario de demostración

```bash
npm run demo      # regenera la BD con un usuario de ejemplo y progreso
```

- Correo: `demo@polyglot.app`
- Clave: `polyglot123`

| Comando | Qué hace |
|---|---|
| `npm start` | Arranca el servidor (puerto 4000, configurable con `PORT`). |
| `npm run dev` | Igual, con recarga automática al cambiar el código del servidor. |
| `npm run seed` | Siembra la BD **solo si está vacía**. |
| `npm run reset` | Borra y regenera la BD (pierde el progreso). |
| `npm run demo` | `reset` + usuario de demostración. |

No hace falta `npm install`: **el proyecto no tiene dependencias**.

---

## Qué incluye

### Pedagogía

- **Repetición espaciada (SRS)** con una variante del algoritmo **SM-2** (el de Anki/SuperMemo):
  fase de aprendizaje corta, factor de facilidad, recaídas, intervalos que crecen de 1 día a meses.
  Cada palabra que aprendes en una lección entra automáticamente en tu cola de repaso.
- **Árbol de habilidades por niveles MCER** (A1 → C2). 12 temas: saludos, números, familia,
  comida, casa, verbos esenciales, ciudad, compras, trabajo, viajes, salud y tiempo libre.
- **10 tipos de ejercicio**: opción múltiple, elegir traducción, comprensión oral, escribir la
  traducción (con corrección tolerante a tildes/artículos), completar huecos, ordenar palabras,
  emparejar, dictado, comprensión lectora y práctica de pronunciación.
- **Lecciones con nota de corte**: hace falta **≥ 80 %** de aciertos para superar una lección;
  por debajo no cuenta y hay que repetirla.
- **Test de nivelación exigente y distinto para cada idioma**:
  - Cada familia lingüística tiene su propio *plano* (mezcla de secciones y pesos): las lenguas
    romances insisten en producción y falsos amigos; las germánicas en artículos/género y orden
    de la frase; el ruso y el griego incluyen lectura del alfabeto; japonés, coreano, chino y
    árabe empiezan con una **sección de escritura que actúa de filtro**.
  - Cada idioma añade un **banco de ítems trampa** propios (falsos amigos, formas verbales,
    lectura de caracteres): p. ej. en portugués *«oficina»* = taller, en italiano *«burro»* =
    mantequilla, en alemán *«Gift»* = veneno.
  - **Puntuación con penalización**: acertar suma, fallar resta; *«No lo sé»* y dejar en blanco
    no penalizan. Adivinar a ciegas hunde la nota (así un hispanohablante no obtiene B2 en
    portugués sin saberlo).
  - **La producción pesa el doble que el reconocimiento** y hay **filtros**: si reconoces
    vocabulario pero no lo produces, te quedas en A1; si no lees el alfabeto, te quedas en A1.
  - El resultado explica **por qué** (desglose por destreza) y, según el nivel, **da por
    asentadas las primeras habilidades**: un alumno de A2 no empieza por «hola», arranca más
    adelante en el temario con esas palabras metidas en el repaso para confirmarlas.
- **Gramática, lecturas y diálogos** por tema, con traducción y preguntas de comprensión.
- **Síntesis de voz** integrada (Web Speech API del navegador): escucha cada palabra y frase en
  el idioma estudiado. Gratis y sin configuración; la calidad depende de las voces del sistema.

### Gamificación y seguimiento

- XP, niveles con curva progresiva, **racha diaria**, meta diaria de XP.
- 13 logros desbloqueables.
- Panel con: progreso de hoy, repasos pendientes, actividad de 14 días, dominio por tema,
  precisión de los últimos 30 días, vocabulario en aprendizaje / consolidado.
- **Diccionario personal**: todas las palabras del idioma con su estado de memoria y búsqueda.
- Perfil multi-idioma: estudia varios idiomas a la vez, cada uno con su progreso.

### Técnico

- **Backend**: Node.js puro (`node:http`), sin framework. Base de datos **SQLite** vía el módulo
  nativo `node:sqlite`. Autenticación con **JWT** (HS256) y hash de contraseñas con **scrypt**
  (`node:crypto`). Cero dependencias de terceros.
- **Frontend**: SPA en JavaScript vanilla con módulos ES, sin paso de compilación. Router de
  hash propio, tema claro/oscuro, diseño responsive.
- **Datos**: 15 idiomas · ~2.175 entradas de vocabulario · 180 habilidades · ~780 lecciones
  generadas · 47 notas de gramática · 17 lecturas · 15 diálogos.

---

## Estructura

```
polyglot/
├── server/
│   ├── index.js            # servidor HTTP + enrutado
│   ├── db.js               # conexión SQLite + esquema
│   ├── config.js           # rutas, puerto, secreto JWT
│   ├── lib/
│   │   ├── auth.js         # scrypt + JWT
│   │   ├── srs.js          # algoritmo SM-2
│   │   ├── grading.js      # corrección tolerante de texto
│   │   ├── xp.js           # niveles, rachas, logros
│   │   ├── exercises.js    # generador de ejercicios
│   │   ├── placement-bank.js  # planos por familia + bancos de trampas por idioma
│   │   ├── queries.js      # helpers de BD (matrícula, actividad, tarjetas, "head" de nivel)
│   │   └── http.js         # router + estáticos
│   ├── routes/             # auth, catalog, learn, review, placement, progress
│   └── seed/
│       ├── index.js        # script de sembrado
│       ├── languages.js    # definición de los 15 idiomas
│       ├── skills.js       # árbol de habilidades compartido
│       └── content/<código>.js   # vocabulario + gramática + textos por idioma
├── client/
│   ├── index.html
│   ├── css/styles.css
│   └── js/
│       ├── app.js          # arranque + chrome + rutas
│       ├── api.js store.js router.js ui.js tts.js
│       ├── exercises.js    # render y corrección de ejercicios
│       └── views/          # auth, languages, dashboard, course, lesson, review, placement, profile
└── data/polyglot.db        # se crea al sembrar (no se versiona)
```

---

## API (resumen)

Todas las respuestas son JSON. Las rutas marcadas con 🔒 requieren `Authorization: Bearer <token>`.

| Método y ruta | Descripción |
|---|---|
| `POST /api/auth/register` · `POST /api/auth/login` | Devuelven `{ token, user }`. |
| `GET /api/auth/me` 🔒 · `PATCH /api/auth/me` 🔒 | Perfil y ajustes (nombre, meta diaria, contraseña). |
| `GET /api/languages` | Catálogo con el progreso del usuario si hay sesión. |
| `GET /api/languages/:code/tree` | Árbol de habilidades con lecciones, dominio y bloqueo. |
| `POST /api/languages/:code/enroll` 🔒 | Matricularse en un idioma. |
| `GET /api/skills/:id` | Vocabulario, gramática, lecturas y diálogos del tema. |
| `GET /api/lessons/:id` 🔒 | Genera una lección (pasos de enseñanza + ejercicios). |
| `POST /api/lessons/:id/answer` 🔒 | Registra una respuesta y otorga XP. |
| `POST /api/lessons/:id/complete` 🔒 | Cierra la lección, crea tarjetas SRS, da bonus de XP. |
| `GET /api/review/summary?code=` 🔒 · `GET /api/review/queue?code=` 🔒 | Estado y cola de repaso (`&early=1`, `&new=N`). |
| `POST /api/review/answer` 🔒 | Envía una valoración (0–3) y reprograma la tarjeta con SM-2. |
| `GET /api/placement/:code` | Genera un test específico del idioma (secciones según su familia + banco de trampas). |
| `POST /api/placement/:code` | Corrige con penalización y filtros de producción/escritura; asigna nivel y da por sabidas las habilidades iniciales. |
| `GET /api/progress/overview?code=` 🔒 | Datos del panel. |
| `GET /api/progress/vocab?code=` 🔒 | Diccionario personal paginado. |
| `GET /api/profile` 🔒 | Resumen multi-idioma. |

---

## Sobre el contenido

El vocabulario y la gramática incluidos cubren de forma sólida los niveles **A1–A2** en los 15
idiomas (con más profundidad en inglés, francés, italiano, portugués y alemán). El objetivo del
proyecto es que el **motor** (SRS, tipos de ejercicio, estructura MCER, seguimiento) sea completo
y esté listo para producción; ampliar a B1–C2 consiste en añadir entradas en
`server/seed/content/<código>.js` y habilidades con `cefr` más alto en `server/seed/skills.js`.
El formato de contenido es compacto y está documentado en `server/seed/content/_helpers.js`.

Las palabras de idiomas con otro alfabeto (ruso, griego, japonés, coreano, chino, árabe) incluyen
transliteración. El árabe se muestra de derecha a izquierda.

---

## Notas

- Todo se guarda en `data/polyglot.db` (SQLite, un solo archivo). Haz copia de ese archivo para
  conservar el progreso.
- El secreto para firmar los JWT se genera y se guarda en `server/.secret` la primera vez; puedes
  fijarlo con la variable de entorno `POLYGLOT_SECRET`.
- La síntesis de voz depende de las voces instaladas en el sistema operativo del usuario. Si un
  idioma no suena, hay que instalar su paquete de voz (Configuración → Idioma y voz).
