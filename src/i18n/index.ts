import { es } from './es';
import { en } from './en';

export type Locale = 'es' | 'en';
export const LOCALES: Locale[] = ['es', 'en'];
export const DEFAULT_LOCALE: Locale = 'es';

const dictionaries = { es, en } as const;

export function t(locale: Locale): typeof es {
  return dictionaries[locale];
}

export function getLocaleFromPath(pathname: string): Locale {
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en';
  return 'es';
}

export function localizePath(path: string, locale: Locale): string {
  const stripped = path.replace(/^\/en(\/|$)/, '/');
  const clean = stripped === '' ? '/' : stripped;
  if (locale === 'es') return clean;
  return clean === '/' ? '/en' : `/en${clean}`;
}
