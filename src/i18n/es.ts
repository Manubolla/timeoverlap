export const es = {
  meta: {
    homeTitle: "TimeOverlap — Comparador de zonas horarias",
    homeDescription:
      "Compará la hora en varias ciudades a la vez. Agregá las ciudades que quieras, fijá una hora y mirá el horario local de cada una al instante.",
    savedTitle: "Mis comparaciones · TimeOverlap",
    savedDescription:
      "Tus comparaciones de horarios guardadas en este browser.",
    pairTitle: (a: string, b: string) =>
      `Horario ${a} a ${b} — Diferencia y overlap laboral`,
    pairDescription: (
      a: string,
      aCountry: string,
      b: string,
      bCountry: string,
      diff: string,
    ) =>
      `Compará el horario entre ${a} (${aCountry}) y ${b} (${bCountry}). Diferencia horaria: ${diff}. Ventana de overlap laboral y mejor hora para reuniones.`,
  },
  nav: {
    comparator: "Comparador",
    saved: "Mis comparaciones",
  },
  footer: {
    tagline: "TimeOverlap — Comparador de zonas horarias.",
    builtBy: "Hecho por",
    author: "Manuel Bolla Agrelo",
    authorUrl: "https://github.com/manubolla",
  },
  home: {
    eyebrow: "",
    h1: "Comparar horarios entre ciudades",
    subtitle:
      "Agregá ciudades y fijá una hora para ver el horario local de cada una.",
    save: "Guardar",
    copyLink: "Copiar link",
    share: "Compartir",
    mySaved: "Mis comparaciones",
    addCity: "Buscar ciudad...",
    baseLabel: "Tu ciudad",
    basePlaceholder: "Buscar tu ciudad...",
    hoursLabel: "Tu horario",
    hoursStart: "Hora de inicio",
    hoursEnd: "Hora de fin",
    hoursTo: "a",
    addLabel: "Ciudades",
    controlsTitle: "Ciudades y franja horaria",
    clear: "Limpiar",
    empty: "Agregá al menos una ciudad para empezar.",
    nomadHubs: "Ciudades populares",
    nomadHubsHint: "Tocá una ciudad para sumarla al comparador.",
    legendWork: "coincide con otra ciudad",
    legendBase: "horario laboral de cada ciudad",
    saveModalTitle: "Guardar comparación",
    saveModalHint:
      'Se guarda en este browser. Vas a poder acceder desde "Mis comparaciones".',
    saveModalPlaceholder: "Ej: Mi equipo Globant",
    cancel: "Cancelar",
    confirm: "Guardar",
    needCity: "Agregá al menos una ciudad",
    savedLocal: "Guardado en este browser",
    linkCopied: "Link copiado",
    shareTitle: "Comparación de horarios · TimeOverlap",
    alreadyAdded: (name: string) => `${name} ya está en el comparador`,
  },
  saved: {
    h1: "Mis comparaciones",
    subtitle: "Guardadas en este browser, sin login.",
    new: "Nueva comparación",
    emptyTitle: "Todavía no guardaste ninguna comparación.",
    emptyCta: "Crear la primera →",
    cityCount: (n: number) => `· ${n} ciudades`,
    updated: (rel: string) => `Actualizada ${rel}`,
    delete: "Eliminar",
    deleteConfirm: "¿Eliminar esta comparación?",
    relMoment: "hace instantes",
    relMin: (n: number) => `hace ${n} min`,
    relHr: (n: number) => `hace ${n} h`,
    relDay: (n: number) => `hace ${n} d`,
  },
  pair: {
    breadcrumbHome: "Inicio",
    intro: (a: string, b: string, diff: string, overlap: string) =>
      `${b} está ${diff} respecto a ${a}. ${overlap}`,
    overlapPositive: (h: number) =>
      `Tienen ${h} ${h === 1 ? "hora" : "horas"} de overlap laboral.`,
    overlapNone: "No hay overlap en horario laboral estándar.",
    cardDiff: "Diferencia",
    cardOverlap: "Overlap laboral",
    cardZones: "Zonas IANA",
    bestMeeting: "Mejor hora para reuniones",
    bestMeetingYes: (h: number, a: string, b: string) =>
      `La ventana de overlap entre el horario laboral 9–18 de ${a} y ${b} dura ${h} horas. Para reuniones síncronas, este es el rango ideal para evitar madrugadas y horarios extendidos.`,
    bestMeetingNo:
      "No hay overlap en horario laboral estándar entre estas ciudades. Opciones para coordinar:",
    bestMeetingOptions: [
      "Elegir un horario fuera del rango laboral de alguna de las dos.",
      "Acordar una franja fija que funcione para ambas zonas.",
      "Comunicarse de forma asincrónica cuando no haya horario en común.",
    ],
    ctaTeam: "¿Necesitás comparar más de dos ciudades?",
    ctaTeamSubtitle:
      "Agregá todas las zonas que quieras al comparador para ver el horario común.",
    faqDiffQ: (a: string, b: string) =>
      `¿Cuál es la diferencia horaria entre ${a} y ${b}?`,
    faqDiffA: (a: string, b: string, diff: string) =>
      `${b} está ${diff} respecto a ${a}.`,
    faqOverlapQ: (a: string, b: string) =>
      `¿Cuántas horas de overlap laboral hay entre ${a} y ${b}?`,
    faqOverlapA: (h: number) =>
      h > 0
        ? `Hay ${h} horas de overlap dentro del horario laboral estándar (9 a 18 hs).`
        : `No hay overlap en horario laboral estándar (9 a 18 hs). Las reuniones requieren coordinación fuera de horario o trabajo asincrónico.`,
  },
  diff: {
    same: "misma hora",
    ahead: "adelante",
    behind: "atrás",
    hour: "hora",
    hours: "horas",
    and: "y",
    min: "min",
  },
  theme: {
    light: "Claro",
    dark: "Oscuro",
    system: "Sistema",
    label: "Tema",
  },
  lang: {
    label: "Idioma",
    es: "Español",
    en: "English",
  },
} as const;
