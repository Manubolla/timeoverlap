import type { es } from "./es";

type Widen<T> = T extends string
  ? string
  : T extends (...args: any[]) => any
    ? T
    : { [K in keyof T]: Widen<T[K]> };

export const en: Widen<typeof es> = {
  meta: {
    homeTitle: "TimeOverlap — Time zone comparator",
    homeDescription:
      "Compare the time across several cities at once. Add any cities, pin a time, and instantly see each local hour.",
    savedTitle: "My comparisons · TimeOverlap",
    savedDescription: "Your timezone comparisons saved in this browser.",
    pairTitle: (a, b) => `Time in ${a} to ${b} — Difference and work overlap`,
    pairDescription: (a, aCountry, b, bCountry, diff) =>
      `Compare time between ${a} (${aCountry}) and ${b} (${bCountry}). Time difference: ${diff}. Work overlap window and best meeting times.`,
  },
  nav: {
    comparator: "Comparator",
    saved: "My comparisons",
  },
  footer: {
    tagline: "TimeOverlap — Time zone comparator.",
    builtBy: "Built by",
    author: "Manuel Bolla Agrelo",
    authorUrl: "https://github.com/manubolla",
  },
  home: {
    eyebrow: "",
    h1: "Compare time across cities",
    subtitle: "Add cities and pin a time to see each local hour.",
    save: "Save",
    copyLink: "Copy link",
    share: "Share",
    mySaved: "My comparisons",
    addCity: "Search a city...",
    baseLabel: "Your city",
    basePlaceholder: "Search your city...",
    hoursLabel: "Your hours",
    hoursStart: "Start hour",
    hoursEnd: "End hour",
    hoursTo: "to",
    addLabel: "Cities",
    controlsTitle: "Cities & time range",
    clear: "Clear",
    empty: "Add at least one city to get started.",
    nomadHubs: "Popular cities",
    nomadHubsHint: "Tap a city to add it to the comparator.",
    legendWork: "overlaps another city",
    legendBase: "each city's work hours",
    saveModalTitle: "Save comparison",
    saveModalHint:
      'Stored in this browser. You can access it from "My comparisons".',
    saveModalPlaceholder: "e.g. My Globant team",
    cancel: "Cancel",
    confirm: "Save",
    needCity: "Add at least one city",
    savedLocal: "Saved in this browser",
    linkCopied: "Link copied",
    shareTitle: "Time comparison · TimeOverlap",
    alreadyAdded: (name) => `${name} is already in the comparator`,
  },
  saved: {
    h1: "My comparisons",
    subtitle: "Stored in this browser, no login required.",
    new: "New comparison",
    emptyTitle: "You haven't saved any comparison yet.",
    emptyCta: "Create the first one →",
    cityCount: (n) => `· ${n} cities`,
    updated: (rel) => `Updated ${rel}`,
    delete: "Delete",
    deleteConfirm: "Delete this comparison?",
    relMoment: "just now",
    relMin: (n) => `${n} min ago`,
    relHr: (n) => `${n} h ago`,
    relDay: (n) => `${n} d ago`,
  },
  pair: {
    breadcrumbHome: "Home",
    intro: (a, b, diff, overlap) =>
      `${b} is ${diff} compared to ${a}. ${overlap}`,
    overlapPositive: (h) =>
      `You have ${h} ${h === 1 ? "hour" : "hours"} of work overlap.`,
    overlapNone: "No overlap during standard work hours.",
    cardDiff: "Difference",
    cardOverlap: "Work overlap",
    cardZones: "IANA zones",
    bestMeeting: "Best meeting time",
    bestMeetingYes: (h, a, b) =>
      `The overlap window between the 9–18 work hours of ${a} and ${b} lasts ${h} hours. For sync meetings, this is the ideal range to avoid early mornings and late nights.`,
    bestMeetingNo:
      "No overlap during standard work hours between these cities. Options to coordinate:",
    bestMeetingOptions: [
      "Pick a time outside the work hours of one of the cities.",
      "Agree on a fixed slot that works for both zones.",
      "Communicate asynchronously when there is no shared hour.",
    ],
    ctaTeam: "Need to compare more than two cities?",
    ctaTeamSubtitle:
      "Add as many zones as you want to the comparator to see the shared time.",
    faqDiffQ: (a, b) => `What's the time difference between ${a} and ${b}?`,
    faqDiffA: (a, b, diff) => `${b} is ${diff} compared to ${a}.`,
    faqOverlapQ: (a, b) =>
      `How many hours of work overlap are there between ${a} and ${b}?`,
    faqOverlapA: (h) =>
      h > 0
        ? `There are ${h} hours of overlap during standard work hours (9 AM to 6 PM).`
        : `No overlap during standard work hours (9 AM to 6 PM). Meetings require coordination outside work hours or asynchronous work.`,
  },
  diff: {
    same: "same time",
    ahead: "ahead",
    behind: "behind",
    hour: "hour",
    hours: "hours",
    and: "and",
    min: "min",
  },
  theme: {
    light: "Light",
    dark: "Dark",
    system: "System",
    label: "Theme",
  },
  lang: {
    label: "Language",
    es: "Español",
    en: "English",
  },
};
