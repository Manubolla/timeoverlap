import { DateTime } from 'luxon';
import { storage } from '../lib/storage';

type CityLite = {
  id: string;
  slug: string;
  slugEn: string;
  name: string;
  country: string;
  countryCode: string;
  timezone: string;
  nomadHub: boolean;
  pop: number;
};

type I18nPayload = {
  locale: 'es' | 'en';
  legendWork: string;
  legendBase: string;
  needCity: string;
  savedLocal: string;
  linkCopied: string;
  shareTitle: string;
  alreadyAddedTpl: string;
  maxCitiesTpl: string;
  summaryOverlapTpl: string;
  summaryNoOverlapTpl: string;
  tooltipTpl: string;
  tooltipAndr: string;
};

function tpl(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}

declare global {
  interface Window {
    __CITIES__: CityLite[];
    __I18N__: I18nPayload;
  }
}

const SLOT_COUNT = 24;
const DEFAULT_START = 9;
const DEFAULT_END = 18;
const MAX_CITIES = 5;

const cities = window.__CITIES__;
const i18n = window.__I18N__;
const cityLocale = i18n.locale === 'es' ? 'es' : 'en';
const citiesById = new Map(cities.map((c) => [c.id, c]));
const citiesBySlug = new Map(cities.map((c) => [c.slug, c]));
const citiesBySlugEn = new Map(cities.map((c) => [c.slugEn, c]));

function resolveCity(key: string): CityLite | undefined {
  return citiesById.get(key) ?? citiesBySlug.get(key) ?? citiesBySlugEn.get(key);
}

const state = {
  cities: [] as string[],
  start: DEFAULT_START,
  end: DEFAULT_END,
  name: '' as string,
};

function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

// Best-effort base from the device timezone (no permission prompt).
function detectBaseCity(): CityLite | undefined {
  let tz: string;
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
  if (!tz) return undefined;
  return cities.filter((c) => c.timezone === tz).sort((a, b) => b.pop - a.pop)[0];
}

function clampHour(raw: string | null, fallback: number): number {
  if (raw === null || raw === '') return fallback;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 && n <= 24 ? n : fallback;
}

function readState() {
  const params = new URLSearchParams(window.location.search);
  const citiesParam = params.get('cities');
  if (citiesParam) {
    state.cities = citiesParam
      .split(',')
      .map((k) => resolveCity(k)?.id)
      .filter((id): id is string => !!id)
      .filter((id, i, arr) => arr.indexOf(id) === i)
      .slice(0, MAX_CITIES);
  } else {
    const base = detectBaseCity();
    state.cities = base ? [base.id] : [];
  }
  state.start = clampHour(params.get('s'), DEFAULT_START);
  state.end = clampHour(params.get('e'), DEFAULT_END);
  state.name = params.get('name') ?? '';
}

function writeState() {
  const params = new URLSearchParams();
  if (state.cities.length) params.set('cities', state.cities.join(','));
  if (state.start !== DEFAULT_START) params.set('s', String(state.start));
  if (state.end !== DEFAULT_END) params.set('e', String(state.end));
  if (state.name) params.set('name', state.name);
  history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}

function offsetLabel(timezone: string, ref: DateTime): string {
  const offset = ref.setZone(timezone).offset / 60;
  const sign = offset >= 0 ? '+' : '-';
  const abs = Math.abs(offset);
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  return `UTC${sign}${h}${m > 0 ? ':' + String(m).padStart(2, '0') : ''}`;
}

function inRange(hour: number): boolean {
  return hour >= state.start && hour < state.end;
}

// For each UTC hour: how many cities are within their working range at that instant.
function inRangeCountByHour(utcStartOfDay: DateTime): number[] {
  const out: number[] = [];
  for (let utcH = 0; utcH < SLOT_COUNT; utcH++) {
    const slot = utcStartOfDay.plus({ hours: utcH });
    out[utcH] = state.cities.reduce((acc, id) => {
      const c = citiesById.get(id);
      return acc + (c && inRange(slot.setZone(c.timezone).hour) ? 1 : 0);
    }, 0);
  }
  return out;
}

// Each city shows its OWN working range in light green.
// Overlap with another city is marked with a ring on the cell.
function cellClass(hour: number): string {
  return inRange(hour)
    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
    : 'bg-slate-50 text-slate-400 dark:bg-slate-900 dark:text-slate-600';
}

const RING = 'ring-1 ring-inset ring-emerald-500/60 dark:ring-emerald-400/50';

function cityHeaderHtml(city: CityLite, isBase: boolean, ref: DateTime): string {
  const cityNow = ref.setZone(city.timezone).setLocale(cityLocale);
  const nameColor = isBase
    ? 'text-emerald-700 dark:text-emerald-300'
    : 'text-slate-900 dark:text-slate-100';
  return (
    `<div class="truncate text-xs font-semibold ${nameColor}">${city.name}</div>` +
    `<div class="font-mono text-base leading-tight text-emerald-600 dark:text-emerald-400 tabular-nums">${cityNow.toFormat('HH:mm')}</div>` +
    `<div class="text-[10px] text-slate-500">${cityNow.toFormat('ccc d')} · ${offsetLabel(city.timezone, ref)}</div>`
  );
}

// Desktop: one row per city, 24 hour columns.
function renderHorizontal(ref: DateTime, utcStartOfDay: DateTime, baseId: string, inRangeCount: number[]): string {
  let html = `<div class="overflow-x-auto"><div class="min-w-[800px]">`;
  for (const cityId of state.cities) {
    const city = citiesById.get(cityId);
    if (!city) continue;
    const isBase = cityId === baseId;
    const cityNow = ref.setZone(city.timezone).setLocale(cityLocale);
    const rowBg = isBase
      ? 'bg-emerald-50/60 border-l-2 border-l-emerald-500 dark:bg-emerald-400/5 dark:border-l-emerald-400'
      : 'border-l-2 border-l-transparent';
    const nameColor = isBase ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-900 dark:text-slate-100';

    html += `<div class="group grid grid-cols-[200px_repeat(24,minmax(0,1fr))_36px] border-b border-slate-200 dark:border-slate-800/60 last:border-b-0 ${rowBg}">`;
    html += `<div class="flex items-center gap-2 px-3 py-3"><div class="min-w-0 flex-1">`;
    html += `<span class="truncate text-sm font-medium ${nameColor}">${city.name}</span>`;
    html += `<div class="text-[10px] text-slate-500">${city.country} · ${offsetLabel(city.timezone, ref)}</div></div>`;
    html += `<div class="text-right"><div class="font-mono text-sm text-emerald-600 dark:text-emerald-400 tabular-nums">${cityNow.toFormat('HH:mm')}</div>`;
    html += `<div class="text-[10px] text-slate-500">${cityNow.toFormat('ccc d')}</div></div></div>`;

    for (let utcH = 0; utcH < SLOT_COUNT; utcH++) {
      const local = utcStartOfDay.plus({ hours: utcH }).setZone(city.timezone);
      const overlapsOther = inRange(local.hour) && inRangeCount[utcH] >= 2;
      html += `<div data-utc="${utcH}" data-city="${city.id}" class="grid-cell flex items-center justify-center border-l border-slate-200 dark:border-slate-800/40 py-3 text-[11px] font-mono tabular-nums transition-colors ${cellClass(local.hour)} ${overlapsOther ? RING : ''}">${String(local.hour).padStart(2, '0')}</div>`;
    }

    html += `<button data-remove="${city.id}" class="flex items-center justify-center text-slate-400 transition hover:text-rose-500 dark:text-slate-600 dark:hover:text-rose-400" title="✕">✕</button>`;
    html += `</div>`;
  }
  return html + `</div></div>`;
}

// Mobile: hours run down the rows, cities across the columns.
function renderVertical(ref: DateTime, utcStartOfDay: DateTime, baseId: string, inRangeCount: number[]): string {
  const base = citiesById.get(baseId)!;
  const cols = `style="grid-template-columns:repeat(${state.cities.length},minmax(0,1fr))"`;

  // Header row: city names + remove buttons.
  let html = `<div class="grid border-b border-slate-200 dark:border-slate-800" ${cols}>`;
  for (const cityId of state.cities) {
    const city = citiesById.get(cityId);
    if (!city) continue;
    const isBase = cityId === baseId;
    html += `<div class="relative border-l border-slate-200 px-1.5 pb-2 pt-7 dark:border-slate-800/60 ${isBase ? 'bg-emerald-50/60 dark:bg-emerald-400/5' : ''}">`;
    html += `<button data-remove="${city.id}" class="absolute right-0.5 top-0.5 flex size-6 items-center justify-center rounded-md text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 dark:text-slate-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400" aria-label="✕">✕</button>`;
    html += cityHeaderHtml(city, isBase, ref);
    html += `</div>`;
  }
  html += `</div>`;

  // One row per hour, indexed by the BASE city's local day.
  const baseStart = ref.setZone(base.timezone).startOf('day');
  for (let i = 0; i < SLOT_COUNT; i++) {
    const slot = baseStart.plus({ hours: i });
    html += `<div class="grid border-b border-slate-100 last:border-b-0 dark:border-slate-800/40" ${cols}>`;
    for (const cityId of state.cities) {
      const city = citiesById.get(cityId);
      if (!city) continue;
      const local = slot.setZone(city.timezone);
      const utcH = slot.toUTC().hour;
      const overlapsOther = inRange(local.hour) && inRangeCount[utcH] >= 2;
      html += `<div data-utc="${utcH}" data-city="${city.id}" class="grid-cell flex items-center justify-center border-l border-slate-200 py-2 text-[11px] font-mono tabular-nums transition-colors dark:border-slate-800/40 ${cellClass(local.hour)} ${overlapsOther ? RING : ''}">${local.toFormat('HH')}</div>`;
    }
    html += `</div>`;
  }
  return html;
}

function render() {
  const empty = document.getElementById('grid-empty')!;
  const content = document.getElementById('grid-content')!;
  const summary = document.getElementById('overlap-summary')!;

  if (state.cities.length === 0) {
    empty.classList.remove('hidden');
    content.innerHTML = '';
    summary.classList.add('hidden');
    return;
  }
  empty.classList.add('hidden');

  const ref = DateTime.utc();
  const utcStartOfDay = ref.startOf('day');
  const baseId = state.cities[0];
  const inRangeCount = inRangeCountByHour(utcStartOfDay);

  // Desktop: horizontal grid; mobile: vertical grid.
  let html = `<div class="hidden sm:block">${renderHorizontal(ref, utcStartOfDay, baseId, inRangeCount)}</div>`;
  html += `<div class="sm:hidden">${renderVertical(ref, utcStartOfDay, baseId, inRangeCount)}</div>`;

  // Legend
  html += `<div class="flex flex-wrap items-center gap-4 border-t border-slate-200 dark:border-slate-800 px-4 py-3 text-[11px] text-slate-500 dark:text-slate-400">`;
  html += `<span class="flex items-center gap-1.5"><span class="inline-block size-3 rounded bg-emerald-100 dark:bg-emerald-500/15"></span>${i18n.legendBase}</span>`;
  if (state.cities.length >= 2) {
    html += `<span class="flex items-center gap-1.5"><span class="inline-block size-3 rounded bg-emerald-100 ring-1 ring-inset ring-emerald-500/60 dark:bg-emerald-500/15 dark:ring-emerald-400/50"></span>${i18n.legendWork}</span>`;
  }
  html += `</div>`;

  content.innerHTML = html;

  // Overlap summary: hours where ALL cities are within range at once (2+ cities only).
  if (state.cities.length >= 2) {
    const base = citiesById.get(baseId)!;
    const hours: number[] = [];
    for (let utcH = 0; utcH < SLOT_COUNT; utcH++) {
      if (inRangeCount[utcH] === state.cities.length) hours.push(utcH);
    }
    summary.classList.remove('hidden');
    summary.innerHTML = hours.length
      ? `<strong class="text-emerald-700 dark:text-emerald-300">${tpl(i18n.summaryOverlapTpl, { h: hours.length, n: state.cities.length, range: formatRanges(hours, base.timezone, utcStartOfDay), city: base.name })}</strong>`
      : `<strong class="text-rose-600 dark:text-rose-300">${tpl(i18n.summaryNoOverlapTpl, { n: state.cities.length })}</strong>`;
  } else {
    summary.classList.add('hidden');
  }

  attachGridHandlers();
}

// Format contiguous UTC-hour spans as local-hour ranges of the base city.
// e.g. [13..20] UTC for a UTC-3 base → "10–18".
function formatRanges(utcHours: number[], baseTz: string, utcStartOfDay: DateTime): string {
  if (utcHours.length === 0) return '';
  const toLocal = (utcH: number) => utcStartOfDay.plus({ hours: utcH }).setZone(baseTz).hour;
  const ranges: string[] = [];
  let start = utcHours[0];
  let prev = utcHours[0];
  const push = (s: number, e: number) => {
    const sl = toLocal(s);
    const el = (toLocal(e) + 1) % 24; // exclusive end
    ranges.push(`${String(sl).padStart(2, '0')}–${String(el).padStart(2, '0')}`);
  };
  for (let i = 1; i < utcHours.length; i++) {
    if (utcHours[i] === prev + 1) {
      prev = utcHours[i];
    } else {
      push(start, prev);
      start = utcHours[i];
      prev = utcHours[i];
    }
  }
  push(start, prev);
  return ranges.join(', ');
}

const HIGHLIGHT = ['bg-emerald-200/70', 'dark:bg-emerald-400/25', 'ring-1', 'ring-inset', 'ring-emerald-400/40'];

function attachGridHandlers() {
  document.querySelectorAll('[data-remove]').forEach((el) => {
    el.addEventListener('click', () => {
      const id = (el as HTMLElement).dataset.remove!;
      state.cities = state.cities.filter((c) => c !== id);
      writeState();
      render();
      syncControls();
    });
  });

  attachColumnHighlight();
}

function localHour(cityId: string, utcH: number): number {
  const city = citiesById.get(cityId);
  if (!city) return 0;
  return DateTime.utc().startOf('day').plus({ hours: utcH }).setZone(city.timezone).hour;
}

function tooltipText(cityId: string, utcH: number): string {
  const hh = (h: number) => String(h).padStart(2, '0');
  const at = i18n.locale === 'es' ? 'en' : 'in';
  const others = state.cities
    .filter((id) => id !== cityId)
    .map((id) => `${hh(localHour(id, utcH))} ${at} ${citiesById.get(id)?.name ?? ''}`);
  if (others.length === 0) return '';
  const rest =
    others.length === 1
      ? others[0]
      : others.slice(0, -1).join(', ') + i18n.tooltipAndr + others[others.length - 1];
  return tpl(i18n.tooltipTpl, {
    h: hh(localHour(cityId, utcH)),
    city: citiesById.get(cityId)?.name ?? '',
    rest,
  });
}

function attachColumnHighlight() {
  const content = document.getElementById('grid-content');
  const tip = document.getElementById('hour-tooltip');
  if (!content) return;

  let pinned: string | null = null;

  const setHighlight = (utc: string | null) => {
    content.querySelectorAll<HTMLElement>('.grid-cell').forEach((cell) => {
      const on = utc !== null && cell.dataset.utc === utc;
      cell.classList[on ? 'add' : 'remove'](...HIGHLIGHT);
    });
  };

  const showTip = (cell: HTMLElement | null) => {
    if (!tip) return;
    if (!cell || cell.dataset.utc === undefined || cell.dataset.city === undefined) {
      tip.classList.add('hidden');
      return;
    }
    const text = tooltipText(cell.dataset.city, Number(cell.dataset.utc));
    if (!text) {
      tip.classList.add('hidden');
      return;
    }
    tip.textContent = text;
    tip.classList.remove('hidden');
    const r = cell.getBoundingClientRect();
    const margin = 8;
    const half = tip.offsetWidth / 2;
    const center = Math.min(
      window.innerWidth - margin - half,
      Math.max(margin + half, r.left + r.width / 2),
    );
    tip.style.left = `${center}px`;
    tip.style.top = `${r.top - 6}px`;
  };

  const apply = (cell: HTMLElement | null) => {
    const utc = cell?.dataset.utc ?? pinned;
    setHighlight(utc ?? null);
    showTip(cell ?? content.querySelector<HTMLElement>(`.grid-cell[data-utc="${pinned}"]`));
  };

  content.addEventListener('mouseover', (e) => {
    apply((e.target as HTMLElement).closest<HTMLElement>('.grid-cell'));
  });
  content.addEventListener('mouseleave', () => {
    setHighlight(pinned);
    if (pinned === null && tip) tip.classList.add('hidden');
    else apply(null);
  });
  content.addEventListener('click', (e) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>('.grid-cell');
    if (!cell) return;
    pinned = pinned === cell.dataset.utc ? null : cell.dataset.utc ?? null;
    setHighlight(pinned);
    showTip(pinned ? cell : null);
  });
}

function syncHourRange() {
  const startSel = document.getElementById('start-select') as HTMLSelectElement | null;
  const endSel = document.getElementById('end-select') as HTMLSelectElement | null;
  if (startSel) startSel.value = String(state.start);
  if (endSel) endSel.value = String(state.end);
}

function syncControls() {
  syncHourRange();
}

function setupPicker(inputId: string, listId: string) {
  const input = document.getElementById(inputId) as HTMLInputElement;
  const list = document.getElementById(listId) as HTMLUListElement;

  function pick(id: string) {
    if (!state.cities.includes(id)) {
      if (state.cities.length >= MAX_CITIES) {
        showToast(tpl(i18n.maxCitiesTpl, { n: MAX_CITIES }));
        return;
      }
      state.cities.push(id);
    }
    writeState();
    render();
    syncControls();
  }

  function renderSuggestions(q: string) {
    if (!q) {
      list.classList.add('hidden');
      return;
    }
    const nq = normalize(q);
    const results = cities
      .filter((c) => !state.cities.includes(c.id))
      .map((c) => {
        const n = normalize(c.name);
        const co = normalize(c.country);
        let s = -1;
        if (n.startsWith(nq)) s = 100 + c.pop / 1e7;
        else if (n.includes(nq)) s = 50 + c.pop / 1e7;
        else if (co.includes(nq)) s = 20;
        return { c, s };
      })
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8);

    if (results.length === 0) {
      list.classList.add('hidden');
      return;
    }
    list.innerHTML = results
      .map(
        ({ c }) => `
        <li data-add="${c.id}" class="flex cursor-pointer items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
          <span>${c.name}</span>
          <span class="text-xs text-slate-500">${c.country}</span>
        </li>`,
      )
      .join('');
    list.classList.remove('hidden');

    list.querySelectorAll('[data-add]').forEach((el) => {
      el.addEventListener('mousedown', (e) => {
        e.preventDefault();
        pick((el as HTMLElement).dataset.add!);
        input.value = '';
        list.classList.add('hidden');
        input.blur();
      });
    });
  }

  input.addEventListener('input', (e) => renderSuggestions((e.target as HTMLInputElement).value));
  input.addEventListener('focus', () => renderSuggestions(input.value));
  input.addEventListener('blur', () => setTimeout(() => list.classList.add('hidden'), 150));
}

function setupHourRange() {
  const startSel = document.getElementById('start-select') as HTMLSelectElement | null;
  const endSel = document.getElementById('end-select') as HTMLSelectElement | null;
  if (!startSel || !endSel) return;
  for (let h = 0; h <= 24; h++) {
    const label = `${String(h).padStart(2, '0')}:00`;
    if (h < 24) startSel.appendChild(new Option(label, String(h)));
    if (h > 0) endSel.appendChild(new Option(label, String(h)));
  }
  startSel.value = String(state.start);
  endSel.value = String(state.end);
  startSel.addEventListener('change', () => {
    state.start = Number(startSel.value);
    if (state.end <= state.start) state.end = Math.min(state.start + 1, 24);
    writeState();
    render();
    syncHourRange();
  });
  endSel.addEventListener('change', () => {
    state.end = Number(endSel.value);
    if (state.start >= state.end) state.start = Math.max(state.end - 1, 0);
    writeState();
    render();
    syncHourRange();
  });
}

function setupCityPicker() {
  setupPicker('city-input', 'city-suggestions');
  setupHourRange();
  syncControls();

  document.getElementById('reset-btn')!.addEventListener('click', () => {
    state.cities = [];
    state.start = DEFAULT_START;
    state.end = DEFAULT_END;
    state.name = '';
    writeState();
    render();
    updateTitle();
    syncControls();
  });
}

function showToast(msg: string) {
  const toast = document.getElementById('toast')!;
  toast.textContent = msg;
  toast.classList.remove('opacity-0');
  toast.classList.add('opacity-100');
  setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0');
  }, 2000);
}

function setupActions() {
  const saveBtn = document.getElementById('save-btn')!;
  const shareBtn = document.getElementById('share-btn')!;
  const modal = document.getElementById('save-modal')!;
  const saveName = document.getElementById('save-name') as HTMLInputElement;
  const saveCancel = document.getElementById('save-cancel')!;
  const saveConfirm = document.getElementById('save-confirm')!;

  saveBtn.addEventListener('click', () => {
    if (state.cities.length === 0) {
      showToast(i18n.needCity);
      return;
    }
    saveName.value = state.name || '';
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    saveName.focus();
  });

  saveCancel.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  });

  saveConfirm.addEventListener('click', () => {
    const name = saveName.value.trim();
    if (!name) {
      saveName.focus();
      return;
    }
    storage.save(name, state.cities);
    state.name = name;
    writeState();
    updateTitle();
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    showToast(i18n.savedLocal);
  });

  shareBtn.addEventListener('click', async () => {
    if (state.cities.length === 0) {
      showToast(i18n.needCity);
      return;
    }
    const url = window.location.href;
    const title = state.name || i18n.shareTitle;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast(i18n.linkCopied);
    } catch {
      showToast(url);
    }
  });
}

function updateTitle() {
  const titleEl = document.getElementById('team-title');
  if (!titleEl) return;
  if (state.name) titleEl.textContent = state.name;
}

function setupNomadHubs() {
  const container = document.getElementById('nomad-hubs');
  if (!container) return;
  const hubs = [...cities].sort((a, b) => b.pop - a.pop).slice(0, 12);
  container.innerHTML = hubs
    .map(
      (c) => `
      <button
        data-add-hub="${c.id}"
        class="group rounded-lg border border-slate-200 bg-white p-3 text-left transition hover:border-emerald-400 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-emerald-400/40 dark:hover:bg-slate-900"
      >
        <div class="text-sm font-medium text-slate-900 group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-400">${c.name}</div>
        <div class="mt-0.5 text-[11px] text-slate-500">${c.country}</div>
      </button>`,
    )
    .join('');
  container.querySelectorAll('[data-add-hub]').forEach((el) => {
    el.addEventListener('click', () => {
      const id = (el as HTMLElement).dataset.addHub!;
      if (state.cities.includes(id)) {
        showToast(tpl(i18n.alreadyAddedTpl, { name: citiesById.get(id)?.name ?? '' }));
      } else if (state.cities.length >= MAX_CITIES) {
        showToast(tpl(i18n.maxCitiesTpl, { n: MAX_CITIES }));
      } else {
        state.cities.push(id);
        writeState();
        render();
        syncControls();
        document.getElementById('team-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

readState();
updateTitle();
setupCityPicker();
setupActions();
setupNomadHubs();
render();

setInterval(render, 60_000);
