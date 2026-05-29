import { storage } from '../lib/storage';

type CityLite = { id: string; name: string; country: string };

type I18nPayload = {
  locale: 'es' | 'en';
  comparatorPath: string;
  delete: string;
  deleteConfirm: string;
  relMoment: string;
  cityCountTpl: string;
  updatedTpl: string;
  relMinTpl: string;
  relHrTpl: string;
  relDayTpl: string;
};

declare global {
  interface Window {
    __CITIES__: CityLite[];
    __I18N__: I18nPayload;
  }
}

const cities = window.__CITIES__;
const i18n = window.__I18N__;
const citiesById = new Map(cities.map((c) => [c.id, c]));

function tpl(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60_000);
  if (min < 1) return i18n.relMoment;
  if (min < 60) return tpl(i18n.relMinTpl, { n: min });
  const hr = Math.floor(min / 60);
  if (hr < 24) return tpl(i18n.relHrTpl, { n: hr });
  const d = Math.floor(hr / 24);
  if (d < 30) return tpl(i18n.relDayTpl, { n: d });
  return new Date(ts).toLocaleDateString(i18n.locale);
}

function render() {
  const list = document.getElementById('list')!;
  const empty = document.getElementById('empty')!;
  const items = storage.list();

  if (items.length === 0) {
    empty.classList.remove('hidden');
    list.innerHTML = '';
    return;
  }
  empty.classList.add('hidden');

  list.innerHTML = items
    .map((item) => {
      const cityNames = item.cities
        .map((id) => citiesById.get(id)?.name ?? id)
        .join(' · ');
      const href = `${i18n.comparatorPath}?cities=${item.cities.join(',')}&name=${encodeURIComponent(item.name)}`;
      return `
        <li class="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-400 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-emerald-400/40">
          <a href="${href}" class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-base font-semibold text-slate-900 group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-400">${item.name}</span>
              <span class="text-xs text-slate-500">${tpl(i18n.cityCountTpl, { n: item.cities.length })}</span>
            </div>
            <div class="mt-1 truncate text-sm text-slate-600 dark:text-slate-400">${cityNames}</div>
            <div class="mt-1 text-xs text-slate-400 dark:text-slate-600">${tpl(i18n.updatedTpl, { rel: relativeTime(item.updatedAt) })}</div>
          </a>
          <button
            data-delete="${item.id}"
            class="ml-4 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-500 transition hover:border-rose-400 hover:text-rose-600 dark:border-slate-800 dark:hover:border-rose-500/40 dark:hover:text-rose-400"
          >
            ${i18n.delete}
          </button>
        </li>`;
    })
    .join('');

  list.querySelectorAll('[data-delete]').forEach((el) => {
    el.addEventListener('click', () => {
      const id = (el as HTMLElement).dataset.delete!;
      if (confirm(i18n.deleteConfirm)) {
        storage.remove(id);
        render();
      }
    });
  });
}

render();
