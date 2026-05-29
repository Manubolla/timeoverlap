import { DateTime } from 'luxon';

type PairPayload = {
  locale: 'es' | 'en';
  fromTz: string;
  toTz: string;
  workStart: number;
  workEnd: number;
  diff: {
    same: string;
    ahead: string;
    behind: string;
    hour: string;
    hours: string;
    and: string;
    min: string;
  };
};

let pair: PairPayload;

function offsetHours(timezone: string, ref: DateTime): number {
  return ref.setZone(timezone).offset / 60;
}

function offsetLabel(timezone: string, ref: DateTime): string {
  const offset = offsetHours(timezone, ref);
  const sign = offset >= 0 ? '+' : '-';
  const abs = Math.abs(offset);
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  return `UTC${sign}${h}${m > 0 ? ':' + String(m).padStart(2, '0') : ''}`;
}

function formatDiff(diffHours: number): string {
  const d = pair.diff;
  if (diffHours === 0) return d.same;
  const abs = Math.abs(diffHours);
  const sign = diffHours > 0 ? d.ahead : d.behind;
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  const hourLabel = h === 1 ? d.hour : d.hours;
  const minLabel = m > 0 ? ` ${d.and} ${m} ${d.min}` : '';
  return `${h} ${hourLabel}${minLabel} ${sign}`;
}

function renderClocks(ref: DateTime) {
  document.querySelectorAll<HTMLElement>('[data-live-clock]').forEach((el) => {
    const tz = el.dataset.liveClock!;
    el.textContent = ref.setZone(tz).setLocale(pair.locale).toFormat('HH:mm');
  });
  document.querySelectorAll<HTMLElement>('[data-live-date]').forEach((el) => {
    const tz = el.dataset.liveDate!;
    el.textContent = ref.setZone(tz).setLocale(pair.locale).toFormat('cccc d LLL');
  });
  document.querySelectorAll<HTMLElement>('[data-live-offset]').forEach((el) => {
    const tz = el.dataset.liveOffset!;
    el.textContent = offsetLabel(tz, ref);
  });
}

function renderDiff(ref: DateTime) {
  const diffHours = offsetHours(pair.toTz, ref) - offsetHours(pair.fromTz, ref);
  const str = formatDiff(diffHours);
  document.querySelectorAll<HTMLElement>('[data-live-diff]').forEach((el) => {
    el.textContent = str;
  });
}

function renderGrids(ref: DateTime) {
  document.querySelectorAll<HTMLElement>('[data-live-grid]').forEach((grid) => {
    const tz = grid.dataset.liveGrid!;
    const otherTz = grid.dataset.liveGridOther!;
    const dayStart = ref.setZone(tz).startOf('day');
    const currentHour = ref.setZone(tz).hour;

    grid.querySelectorAll<HTMLElement>('[data-cell]').forEach((cell) => {
      const i = Number(cell.dataset.cell);
      const cellTime = dayStart.plus({ hours: i });
      const cityHour = cellTime.hour;
      const otherHour = cellTime.setZone(otherTz).hour;
      const isWork = cityHour >= pair.workStart && cityHour < pair.workEnd;
      const isOverlap = isWork && otherHour >= pair.workStart && otherHour < pair.workEnd;

      cell.classList.remove(
        'bg-emerald-500', 'dark:bg-emerald-400/80',
        'bg-slate-200', 'dark:bg-slate-700/40',
        'bg-slate-50', 'dark:bg-slate-900',
        'ring-2', 'ring-amber-500', 'dark:ring-amber-400', 'ring-inset',
      );
      if (isOverlap) cell.classList.add('bg-emerald-500', 'dark:bg-emerald-400/80');
      else if (isWork) cell.classList.add('bg-slate-200', 'dark:bg-slate-700/40');
      else cell.classList.add('bg-slate-50', 'dark:bg-slate-900');
      if (i === currentHour) cell.classList.add('ring-2', 'ring-amber-500', 'dark:ring-amber-400', 'ring-inset');
    });
  });
}

function render() {
  const ref = DateTime.utc();
  renderClocks(ref);
  renderDiff(ref);
  renderGrids(ref);
}

export function initPairLive() {
  const el = document.getElementById('pair-data');
  if (!el?.dataset.pair) return;
  pair = JSON.parse(el.dataset.pair) as PairPayload;
  render();
  setInterval(render, 60_000);
}
