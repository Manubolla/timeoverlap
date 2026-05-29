import { DateTime } from 'luxon';
import type { City } from '../data/cities';

export type WorkHours = { start: number; end: number };

export const DEFAULT_WORK_HOURS: WorkHours = { start: 9, end: 18 };

export type OverlapResult = {
  hasOverlap: boolean;
  overlapHours: number;
  bestMeetingHourUtc: number | null;
  fromWorkUtc: { start: number; end: number };
  toWorkUtc: { start: number; end: number };
};

function workHoursToUtcRange(
  timezone: string,
  work: WorkHours,
  reference: DateTime,
): { start: number; end: number } {
  const local = reference.setZone(timezone).startOf('day');
  const startUtc = local.set({ hour: work.start }).toUTC().hour
    + local.set({ hour: work.start }).toUTC().day * 24;
  const endUtc = local.set({ hour: work.end }).toUTC().hour
    + local.set({ hour: work.end }).toUTC().day * 24;
  return { start: startUtc, end: endUtc };
}

export function computeOverlap(
  from: City,
  to: City,
  work: WorkHours = DEFAULT_WORK_HOURS,
  reference: DateTime = DateTime.utc(),
): OverlapResult {
  const fromRange = workHoursToUtcRange(from.timezone, work, reference);
  const toRange = workHoursToUtcRange(to.timezone, work, reference);

  const overlapStart = Math.max(fromRange.start, toRange.start);
  const overlapEnd = Math.min(fromRange.end, toRange.end);
  const overlapHours = Math.max(0, overlapEnd - overlapStart);

  return {
    hasOverlap: overlapHours > 0,
    overlapHours,
    bestMeetingHourUtc: overlapHours > 0 ? (overlapStart + overlapEnd) / 2 : null,
    fromWorkUtc: fromRange,
    toWorkUtc: toRange,
  };
}

export function getCurrentTime(timezone: string, reference: DateTime = DateTime.utc()): DateTime {
  return reference.setZone(timezone);
}

export function getOffsetHours(timezone: string, reference: DateTime = DateTime.utc()): number {
  return reference.setZone(timezone).offset / 60;
}

export function getOffsetLabel(timezone: string, reference: DateTime = DateTime.utc()): string {
  const offset = getOffsetHours(timezone, reference);
  const sign = offset >= 0 ? '+' : '-';
  const abs = Math.abs(offset);
  const hours = Math.floor(abs);
  const minutes = Math.round((abs - hours) * 60);
  return `UTC${sign}${hours}${minutes > 0 ? ':' + String(minutes).padStart(2, '0') : ''}`;
}

export function getTimeDifference(fromTz: string, toTz: string, reference: DateTime = DateTime.utc()): number {
  return getOffsetHours(toTz, reference) - getOffsetHours(fromTz, reference);
}

export type DiffDict = {
  same: string;
  ahead: string;
  behind: string;
  hour: string;
  hours: string;
  and: string;
  min: string;
};

export function formatTimeDifference(diffHours: number, dict: DiffDict): string {
  if (diffHours === 0) return dict.same;
  const abs = Math.abs(diffHours);
  const sign = diffHours > 0 ? dict.ahead : dict.behind;
  const hours = Math.floor(abs);
  const minutes = Math.round((abs - hours) * 60);
  const hourLabel = hours === 1 ? dict.hour : dict.hours;
  const minutesLabel = minutes > 0 ? ` ${dict.and} ${minutes} ${dict.min}` : '';
  return `${hours} ${hourLabel}${minutesLabel} ${sign}`;
}

export type HourCell = {
  hour: number;
  isWorkHour: boolean;
  isOverlap: boolean;
  label: string;
};

export function buildHourGrid(
  city: City,
  otherCity: City,
  work: WorkHours = DEFAULT_WORK_HOURS,
  reference: DateTime = DateTime.utc(),
): HourCell[] {
  const cityNow = reference.setZone(city.timezone);
  const cells: HourCell[] = [];

  for (let i = 0; i < 24; i++) {
    const cellTime = cityNow.startOf('day').plus({ hours: i });
    const cellTimeOther = cellTime.setZone(otherCity.timezone);

    const cityHour = cellTime.hour;
    const otherHour = cellTimeOther.hour;

    const isCityWork = cityHour >= work.start && cityHour < work.end;
    const isOtherWork = otherHour >= work.start && otherHour < work.end;

    cells.push({
      hour: i,
      isWorkHour: isCityWork,
      isOverlap: isCityWork && isOtherWork,
      label: String(i).padStart(2, '0'),
    });
  }

  return cells;
}
