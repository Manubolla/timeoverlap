// Applies Spanish translations to src/data/cities.ts:
//   - `country` field: English country name -> Spanish (COUNTRY_ES).
//   - `name` field: when it still equals `nameEn`, swap to the Spanish city
//     name if CITY_ES has a different one. `nameEn` is never touched.
// Entries already in Spanish (country not a COUNTRY_ES key) are left alone.
// Run: node scripts/apply-es.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { COUNTRY_ES, CITY_ES } from './es-names.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = join(root, 'src/data/cities.ts');
const src = readFileSync(file, 'utf8');

const sq = (s) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const lines = src.split('\n');

let cityCount = 0;
let countryCount = 0;

const out = lines.map((line) => {
  if (!/^\s*\{\s*id:/.test(line)) return line;

  const get = (key) => {
    const m = line.match(new RegExp(`\\b${key}:\\s*'((?:[^'\\\\]|\\\\.)*)'`));
    return m ? m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\') : null;
  };
  const name = get('name');
  const nameEn = get('nameEn');
  const country = get('country');

  let updated = line;

  // City name: only when not yet localized (name === nameEn) and a different ES exists.
  if (name !== null && nameEn !== null && name === nameEn) {
    const es = CITY_ES[nameEn];
    if (es && es !== nameEn) {
      updated = updated.replace(/(\bname:\s*)'(?:[^'\\]|\\.)*'/, `$1${sq(es)}`);
      cityCount++;
    }
  }

  // Country: translate English country names to Spanish.
  if (country !== null && COUNTRY_ES[country] && COUNTRY_ES[country] !== country) {
    updated = updated.replace(/(\bcountry:\s*)'(?:[^'\\]|\\.)*'/, `$1${sq(COUNTRY_ES[country])}`);
    countryCount++;
  }

  return updated;
});

writeFileSync(file, out.join('\n'));
console.log(`Localized ${cityCount} city names and ${countryCount} country names to Spanish.`);
