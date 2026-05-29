// Generates missing-country / missing-timezone city entries for src/data/cities.ts.
//
// Rule (per user): at minimum one city per country, and for countries spanning
// multiple timezones, one city per distinct UTC offset. Everything in English.
//
// Sources (dev-only, build-time): `countries-and-timezones` for the country -> IANA
// timezone map, `city-timezones` for a representative (most-populated) real city per
// (country, timezone). Run with: node scripts/gen-cities.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import ct from 'countries-and-timezones';
import ctz from 'city-timezones';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const citiesFile = join(root, 'src/data/cities.ts');
const src = readFileSync(citiesFile, 'utf8');

// --- What we already cover: (countryCode, timezone) and per-country offsets. ---
const have = new Set();
const haveCC = new Set();
const haveSlug = new Set();
{
  const re = /countryCode:\s*['"]([A-Z]{2})['"][^}]*?timezone:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(src))) {
    haveCC.add(m[1]);
    have.add(`${m[1]}|${m[2]}`);
  }
  const reSlug = /\bslug:\s*['"]([^'"]+)['"]/g;
  while ((m = reSlug.exec(src))) haveSlug.add(m[1]);
  const reId = /\bid:\s*['"]([^'"]+)['"]/g;
  while ((m = reId.exec(src))) haveSlug.add(m[1]); // ids share the slug namespace for dedup
}

const coveredOffsets = new Map(); // cc -> Set(offset)
for (const key of have) {
  const [cc, tz] = key.split('|');
  const o = ct.getTimezone(tz)?.utcOffset;
  if (o === undefined) continue;
  if (!coveredOffsets.has(cc)) coveredOffsets.set(cc, new Set());
  coveredOffsets.get(cc).add(o);
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Group dataset cities by ISO2 country. The dataset carries each city's real
// IANA timezone (e.g. Africa/Accra for Ghana), which is what we want to store —
// more accurate than the canonical shared aliases (Africa/Abidjan, etc.).
const byCountry = new Map();
for (const c of ctz.cityMapping) {
  if (!c.iso2 || !c.timezone) continue;
  if (ct.getTimezone(c.timezone) === undefined) continue; // skip unknown zones
  if (!byCountry.has(c.iso2)) byCountry.set(c.iso2, []);
  byCountry.get(c.iso2).push(c);
}

const all = ct.getAllCountries();
const added = [];
const skippedNoCity = [];
const usedSlugs = new Set(haveSlug);

for (const cc of Object.keys(all)) {
  const country = all[cc];
  const have0 = coveredOffsets.get(cc) ?? new Set();
  const pool = byCountry.get(cc);

  if (!pool || pool.length === 0) {
    if (!haveCC.has(cc)) skippedNoCity.push(`${cc} ${country.name} (no city in dataset)`);
    continue;
  }

  // Distinct offsets this country actually spans, each with its most-populated city.
  const byOffset = new Map();
  for (const c of pool) {
    const offset = ct.getTimezone(c.timezone).utcOffset;
    const cur = byOffset.get(offset);
    if (!cur || (c.pop || 0) > (cur.pop || 0)) byOffset.set(offset, c);
  }

  for (const [offset, city] of byOffset) {
    if (have0.has(offset)) continue; // already covered for this country

    const name = city.city;
    let slug = slugify(name);
    if (usedSlugs.has(slug)) slug = `${slug}-${cc.toLowerCase()}`;
    if (usedSlugs.has(slug)) slug = `${slug}-${slugify(city.timezone.split('/').pop())}`;
    usedSlugs.add(slug);

    added.push({
      id: slug,
      name,
      nameEn: name,
      country: country.name,
      countryCode: cc,
      timezone: city.timezone,
      slug,
      slugEn: slug,
      population: city.pop ? Math.round(city.pop) : 0,
      lat: Number(city.lat.toFixed(4)),
      lon: Number(city.lng.toFixed(4)),
    });
    have0.add(offset);
    coveredOffsets.set(cc, have0);
  }
}

added.sort((a, b) => a.country.localeCompare(b.country) || b.population - a.population);

// --- Render the new City object literals. ---
const sq = (s) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

const lines = added.map((c) => {
  const fields = [
    `id: '${c.id}'`,
    `name: ${sq(c.name)}`,
    `nameEn: ${sq(c.nameEn)}`,
    `country: ${sq(c.country)}`,
    `countryCode: '${c.countryCode}'`,
    `timezone: '${c.timezone}'`,
    `slug: '${c.slug}'`,
    `slugEn: '${c.slugEn}'`,
    `population: ${c.population}`,
    `lat: ${c.lat}`,
    `lon: ${c.lon}`,
  ];
  return `  { ${fields.join(', ')} },`;
});

// --- Add any missing country codes to COUNTRY_EN (English name). ---
const enRe = /const COUNTRY_EN: Record<string, string> = \{([\s\S]*?)\};/;
const enBlock = src.match(enRe);
const existingEn = new Set([...enBlock[1].matchAll(/([A-Z]{2}):/g)].map((m) => m[1]));
const newCC = [...new Set(added.map((c) => c.countryCode))].filter((cc) => !existingEn.has(cc));
const newEnLines = newCC.map((cc) => `  ${cc}: ${sq(all[cc].name)},`);

// --- Splice into the file. ---
let out = src;
if (newEnLines.length) {
  out = out.replace(enRe, (full, body) => {
    const trimmed = body.replace(/\s+$/, '');
    return `const COUNTRY_EN: Record<string, string> = {${trimmed}\n${newEnLines.join('\n')}\n};`;
  });
}
out = out.replace(/\n\];\n\nexport const citiesById/, `\n\n  // --- Auto-generated: 1 city per country / distinct offset (English) ---\n${lines.join('\n')}\n];\n\nexport const citiesById`);

writeFileSync(citiesFile, out);

console.log(`Added ${added.length} cities across ${new Set(added.map((c) => c.countryCode)).size} countries.`);
console.log(`Added ${newCC.length} new country names to COUNTRY_EN.`);
if (skippedNoCity.length) {
  console.log(`\nSkipped ${skippedNoCity.length} (country/zone with no city in dataset):`);
  console.log('  ' + skippedNoCity.join('\n  '));
}
