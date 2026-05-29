export type City = {
  id: string;
  name: string;
  nameEn: string;
  country: string;
  countryCode: string;
  timezone: string;
  slug: string;
  slugEn: string;
  population: number;
  lat: number;
  lon: number;
  nomadHub?: boolean;
};

const COUNTRY_EN: Record<string, string> = {
  AR: 'Argentina', BR: 'Brazil', CL: 'Chile', PE: 'Peru', CO: 'Colombia',
  VE: 'Venezuela', EC: 'Ecuador', BO: 'Bolivia', PY: 'Paraguay', UY: 'Uruguay',
  MX: 'Mexico', CU: 'Cuba', CR: 'Costa Rica', PA: 'Panama',
  US: 'United States', CA: 'Canada',
  GB: 'United Kingdom', IE: 'Ireland', FR: 'France', ES: 'Spain', PT: 'Portugal',
  DE: 'Germany', NL: 'Netherlands', BE: 'Belgium', CH: 'Switzerland', AT: 'Austria',
  IT: 'Italy', GR: 'Greece', CZ: 'Czech Republic', PL: 'Poland', HU: 'Hungary',
  DK: 'Denmark', SE: 'Sweden', NO: 'Norway', FI: 'Finland', IS: 'Iceland',
  TR: 'Turkey', RU: 'Russia', UA: 'Ukraine',
  JP: 'Japan', KR: 'South Korea', CN: 'China', HK: 'Hong Kong', TW: 'Taiwan',
  SG: 'Singapore', TH: 'Thailand', MY: 'Malaysia', ID: 'Indonesia', VN: 'Vietnam',
  PH: 'Philippines', IN: 'India', NP: 'Nepal', LK: 'Sri Lanka',
  AE: 'United Arab Emirates', QA: 'Qatar', SA: 'Saudi Arabia', IL: 'Israel', IR: 'Iran',
  EG: 'Egypt', ZA: 'South Africa', KE: 'Kenya', NG: 'Nigeria', MA: 'Morocco',
  AU: 'Australia', NZ: 'New Zealand', FJ: 'Fiji',
};

export function countryName(city: City, locale: 'es' | 'en'): string {
  if (locale === 'es') return city.country;
  return COUNTRY_EN[city.countryCode] ?? city.country;
}

export const cities: City[] = [
  { id: 'buenos-aires', name: 'Buenos Aires', nameEn: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', timezone: 'America/Argentina/Buenos_Aires', slug: 'buenos-aires', slugEn: 'buenos-aires', population: 15000000, lat: -34.6037, lon: -58.3816 },
  { id: 'sao-paulo', name: 'São Paulo', nameEn: 'São Paulo', country: 'Brasil', countryCode: 'BR', timezone: 'America/Sao_Paulo', slug: 'sao-paulo', slugEn: 'sao-paulo', population: 22000000, lat: -23.5505, lon: -46.6333 },
  { id: 'rio-de-janeiro', name: 'Río de Janeiro', nameEn: 'Rio de Janeiro', country: 'Brasil', countryCode: 'BR', timezone: 'America/Sao_Paulo', slug: 'rio-de-janeiro', slugEn: 'rio-de-janeiro', population: 13500000, lat: -22.9068, lon: -43.1729 },
  { id: 'florianopolis', name: 'Florianópolis', nameEn: 'Florianopolis', country: 'Brasil', countryCode: 'BR', timezone: 'America/Sao_Paulo', slug: 'florianopolis', slugEn: 'florianopolis', population: 500000, lat: -27.5954, lon: -48.5480, nomadHub: true },
  { id: 'santiago', name: 'Santiago', nameEn: 'Santiago', country: 'Chile', countryCode: 'CL', timezone: 'America/Santiago', slug: 'santiago-chile', slugEn: 'santiago-chile', population: 6800000, lat: -33.4489, lon: -70.6693 },
  { id: 'lima', name: 'Lima', nameEn: 'Lima', country: 'Perú', countryCode: 'PE', timezone: 'America/Lima', slug: 'lima', slugEn: 'lima', population: 11000000, lat: -12.0464, lon: -77.0428 },
  { id: 'bogota', name: 'Bogotá', nameEn: 'Bogota', country: 'Colombia', countryCode: 'CO', timezone: 'America/Bogota', slug: 'bogota', slugEn: 'bogota', population: 11000000, lat: 4.7110, lon: -74.0721 },
  { id: 'medellin', name: 'Medellín', nameEn: 'Medellin', country: 'Colombia', countryCode: 'CO', timezone: 'America/Bogota', slug: 'medellin', slugEn: 'medellin', population: 2500000, lat: 6.2442, lon: -75.5812, nomadHub: true },
  { id: 'caracas', name: 'Caracas', nameEn: 'Caracas', country: 'Venezuela', countryCode: 'VE', timezone: 'America/Caracas', slug: 'caracas', slugEn: 'caracas', population: 3000000, lat: 10.4806, lon: -66.9036 },
  { id: 'quito', name: 'Quito', nameEn: 'Quito', country: 'Ecuador', countryCode: 'EC', timezone: 'America/Guayaquil', slug: 'quito', slugEn: 'quito', population: 2000000, lat: -0.1807, lon: -78.4678 },
  { id: 'la-paz', name: 'La Paz', nameEn: 'La Paz', country: 'Bolivia', countryCode: 'BO', timezone: 'America/La_Paz', slug: 'la-paz', slugEn: 'la-paz', population: 800000, lat: -16.4897, lon: -68.1193 },
  { id: 'asuncion', name: 'Asunción', nameEn: 'Asuncion', country: 'Paraguay', countryCode: 'PY', timezone: 'America/Asuncion', slug: 'asuncion', slugEn: 'asuncion', population: 525000, lat: -25.2637, lon: -57.5759 },
  { id: 'montevideo', name: 'Montevideo', nameEn: 'Montevideo', country: 'Uruguay', countryCode: 'UY', timezone: 'America/Montevideo', slug: 'montevideo', slugEn: 'montevideo', population: 1750000, lat: -34.9011, lon: -56.1645 },
  { id: 'mexico-city', name: 'Ciudad de México', nameEn: 'Mexico City', country: 'México', countryCode: 'MX', timezone: 'America/Mexico_City', slug: 'ciudad-de-mexico', slugEn: 'mexico-city', population: 22000000, lat: 19.4326, lon: -99.1332, nomadHub: true },
  { id: 'guadalajara', name: 'Guadalajara', nameEn: 'Guadalajara', country: 'México', countryCode: 'MX', timezone: 'America/Mexico_City', slug: 'guadalajara', slugEn: 'guadalajara', population: 5300000, lat: 20.6597, lon: -103.3496 },
  { id: 'cancun', name: 'Cancún', nameEn: 'Cancun', country: 'México', countryCode: 'MX', timezone: 'America/Cancun', slug: 'cancun', slugEn: 'cancun', population: 900000, lat: 21.1619, lon: -86.8515, nomadHub: true },
  { id: 'tulum', name: 'Tulum', nameEn: 'Tulum', country: 'México', countryCode: 'MX', timezone: 'America/Cancun', slug: 'tulum', slugEn: 'tulum', population: 50000, lat: 20.2114, lon: -87.4654, nomadHub: true },
  { id: 'havana', name: 'La Habana', nameEn: 'Havana', country: 'Cuba', countryCode: 'CU', timezone: 'America/Havana', slug: 'la-habana', slugEn: 'havana', population: 2100000, lat: 23.1136, lon: -82.3666 },
  { id: 'san-jose-cr', name: 'San José', nameEn: 'San Jose', country: 'Costa Rica', countryCode: 'CR', timezone: 'America/Costa_Rica', slug: 'san-jose-costa-rica', slugEn: 'san-jose-costa-rica', population: 1400000, lat: 9.9281, lon: -84.0907 },
  { id: 'panama-city', name: 'Ciudad de Panamá', nameEn: 'Panama City', country: 'Panamá', countryCode: 'PA', timezone: 'America/Panama', slug: 'ciudad-de-panama', slugEn: 'panama-city', population: 1500000, lat: 8.9824, lon: -79.5199 },

  { id: 'new-york', name: 'Nueva York', nameEn: 'New York', country: 'Estados Unidos', countryCode: 'US', timezone: 'America/New_York', slug: 'nueva-york', slugEn: 'new-york', population: 19000000, lat: 40.7128, lon: -74.0060 },
  { id: 'los-angeles', name: 'Los Ángeles', nameEn: 'Los Angeles', country: 'Estados Unidos', countryCode: 'US', timezone: 'America/Los_Angeles', slug: 'los-angeles', slugEn: 'los-angeles', population: 13000000, lat: 34.0522, lon: -118.2437 },
  { id: 'san-francisco', name: 'San Francisco', nameEn: 'San Francisco', country: 'Estados Unidos', countryCode: 'US', timezone: 'America/Los_Angeles', slug: 'san-francisco', slugEn: 'san-francisco', population: 4700000, lat: 37.7749, lon: -122.4194 },
  { id: 'chicago', name: 'Chicago', nameEn: 'Chicago', country: 'Estados Unidos', countryCode: 'US', timezone: 'America/Chicago', slug: 'chicago', slugEn: 'chicago', population: 9500000, lat: 41.8781, lon: -87.6298 },
  { id: 'miami', name: 'Miami', nameEn: 'Miami', country: 'Estados Unidos', countryCode: 'US', timezone: 'America/New_York', slug: 'miami', slugEn: 'miami', population: 6100000, lat: 25.7617, lon: -80.1918 },
  { id: 'austin', name: 'Austin', nameEn: 'Austin', country: 'Estados Unidos', countryCode: 'US', timezone: 'America/Chicago', slug: 'austin', slugEn: 'austin', population: 2300000, lat: 30.2672, lon: -97.7431, nomadHub: true },
  { id: 'seattle', name: 'Seattle', nameEn: 'Seattle', country: 'Estados Unidos', countryCode: 'US', timezone: 'America/Los_Angeles', slug: 'seattle', slugEn: 'seattle', population: 4000000, lat: 47.6062, lon: -122.3321 },
  { id: 'boston', name: 'Boston', nameEn: 'Boston', country: 'Estados Unidos', countryCode: 'US', timezone: 'America/New_York', slug: 'boston', slugEn: 'boston', population: 4900000, lat: 42.3601, lon: -71.0589 },
  { id: 'denver', name: 'Denver', nameEn: 'Denver', country: 'Estados Unidos', countryCode: 'US', timezone: 'America/Denver', slug: 'denver', slugEn: 'denver', population: 3000000, lat: 39.7392, lon: -104.9903 },
  { id: 'toronto', name: 'Toronto', nameEn: 'Toronto', country: 'Canadá', countryCode: 'CA', timezone: 'America/Toronto', slug: 'toronto', slugEn: 'toronto', population: 6400000, lat: 43.6532, lon: -79.3832 },
  { id: 'vancouver', name: 'Vancouver', nameEn: 'Vancouver', country: 'Canadá', countryCode: 'CA', timezone: 'America/Vancouver', slug: 'vancouver', slugEn: 'vancouver', population: 2600000, lat: 49.2827, lon: -123.1207 },
  { id: 'montreal', name: 'Montreal', nameEn: 'Montreal', country: 'Canadá', countryCode: 'CA', timezone: 'America/Toronto', slug: 'montreal', slugEn: 'montreal', population: 4300000, lat: 45.5017, lon: -73.5673 },

  { id: 'london', name: 'Londres', nameEn: 'London', country: 'Reino Unido', countryCode: 'GB', timezone: 'Europe/London', slug: 'londres', slugEn: 'london', population: 9500000, lat: 51.5074, lon: -0.1278 },
  { id: 'dublin', name: 'Dublín', nameEn: 'Dublin', country: 'Irlanda', countryCode: 'IE', timezone: 'Europe/Dublin', slug: 'dublin', slugEn: 'dublin', population: 1400000, lat: 53.3498, lon: -6.2603 },
  { id: 'paris', name: 'París', nameEn: 'Paris', country: 'Francia', countryCode: 'FR', timezone: 'Europe/Paris', slug: 'paris', slugEn: 'paris', population: 11000000, lat: 48.8566, lon: 2.3522 },
  { id: 'madrid', name: 'Madrid', nameEn: 'Madrid', country: 'España', countryCode: 'ES', timezone: 'Europe/Madrid', slug: 'madrid', slugEn: 'madrid', population: 6700000, lat: 40.4168, lon: -3.7038 },
  { id: 'barcelona', name: 'Barcelona', nameEn: 'Barcelona', country: 'España', countryCode: 'ES', timezone: 'Europe/Madrid', slug: 'barcelona', slugEn: 'barcelona', population: 5700000, lat: 41.3851, lon: 2.1734, nomadHub: true },
  { id: 'valencia', name: 'Valencia', nameEn: 'Valencia', country: 'España', countryCode: 'ES', timezone: 'Europe/Madrid', slug: 'valencia', slugEn: 'valencia', population: 1600000, lat: 39.4699, lon: -0.3763, nomadHub: true },
  { id: 'sevilla', name: 'Sevilla', nameEn: 'Seville', country: 'España', countryCode: 'ES', timezone: 'Europe/Madrid', slug: 'sevilla', slugEn: 'seville', population: 1500000, lat: 37.3891, lon: -5.9845 },
  { id: 'las-palmas', name: 'Las Palmas', nameEn: 'Las Palmas', country: 'España', countryCode: 'ES', timezone: 'Atlantic/Canary', slug: 'las-palmas-gran-canaria', slugEn: 'las-palmas', population: 380000, lat: 28.1235, lon: -15.4363, nomadHub: true },
  { id: 'lisbon', name: 'Lisboa', nameEn: 'Lisbon', country: 'Portugal', countryCode: 'PT', timezone: 'Europe/Lisbon', slug: 'lisboa', slugEn: 'lisbon', population: 2900000, lat: 38.7223, lon: -9.1393, nomadHub: true },
  { id: 'porto', name: 'Oporto', nameEn: 'Porto', country: 'Portugal', countryCode: 'PT', timezone: 'Europe/Lisbon', slug: 'oporto', slugEn: 'porto', population: 1700000, lat: 41.1579, lon: -8.6291, nomadHub: true },
  { id: 'madeira', name: 'Madeira', nameEn: 'Madeira', country: 'Portugal', countryCode: 'PT', timezone: 'Atlantic/Madeira', slug: 'madeira', slugEn: 'madeira', population: 250000, lat: 32.7607, lon: -16.9595, nomadHub: true },
  { id: 'berlin', name: 'Berlín', nameEn: 'Berlin', country: 'Alemania', countryCode: 'DE', timezone: 'Europe/Berlin', slug: 'berlin', slugEn: 'berlin', population: 3700000, lat: 52.5200, lon: 13.4050, nomadHub: true },
  { id: 'munich', name: 'Múnich', nameEn: 'Munich', country: 'Alemania', countryCode: 'DE', timezone: 'Europe/Berlin', slug: 'munich', slugEn: 'munich', population: 1500000, lat: 48.1351, lon: 11.5820 },
  { id: 'hamburg', name: 'Hamburgo', nameEn: 'Hamburg', country: 'Alemania', countryCode: 'DE', timezone: 'Europe/Berlin', slug: 'hamburgo', slugEn: 'hamburg', population: 1900000, lat: 53.5511, lon: 9.9937 },
  { id: 'amsterdam', name: 'Ámsterdam', nameEn: 'Amsterdam', country: 'Países Bajos', countryCode: 'NL', timezone: 'Europe/Amsterdam', slug: 'amsterdam', slugEn: 'amsterdam', population: 1100000, lat: 52.3676, lon: 4.9041 },
  { id: 'brussels', name: 'Bruselas', nameEn: 'Brussels', country: 'Bélgica', countryCode: 'BE', timezone: 'Europe/Brussels', slug: 'bruselas', slugEn: 'brussels', population: 2100000, lat: 50.8503, lon: 4.3517 },
  { id: 'zurich', name: 'Zúrich', nameEn: 'Zurich', country: 'Suiza', countryCode: 'CH', timezone: 'Europe/Zurich', slug: 'zurich', slugEn: 'zurich', population: 1400000, lat: 47.3769, lon: 8.5417 },
  { id: 'geneva', name: 'Ginebra', nameEn: 'Geneva', country: 'Suiza', countryCode: 'CH', timezone: 'Europe/Zurich', slug: 'ginebra', slugEn: 'geneva', population: 600000, lat: 46.2044, lon: 6.1432 },
  { id: 'vienna', name: 'Viena', nameEn: 'Vienna', country: 'Austria', countryCode: 'AT', timezone: 'Europe/Vienna', slug: 'viena', slugEn: 'vienna', population: 1900000, lat: 48.2082, lon: 16.3738 },
  { id: 'rome', name: 'Roma', nameEn: 'Rome', country: 'Italia', countryCode: 'IT', timezone: 'Europe/Rome', slug: 'roma', slugEn: 'rome', population: 4300000, lat: 41.9028, lon: 12.4964 },
  { id: 'milan', name: 'Milán', nameEn: 'Milan', country: 'Italia', countryCode: 'IT', timezone: 'Europe/Rome', slug: 'milan', slugEn: 'milan', population: 3100000, lat: 45.4642, lon: 9.1900 },
  { id: 'athens', name: 'Atenas', nameEn: 'Athens', country: 'Grecia', countryCode: 'GR', timezone: 'Europe/Athens', slug: 'atenas', slugEn: 'athens', population: 3100000, lat: 37.9838, lon: 23.7275 },
  { id: 'prague', name: 'Praga', nameEn: 'Prague', country: 'República Checa', countryCode: 'CZ', timezone: 'Europe/Prague', slug: 'praga', slugEn: 'prague', population: 1300000, lat: 50.0755, lon: 14.4378 },
  { id: 'warsaw', name: 'Varsovia', nameEn: 'Warsaw', country: 'Polonia', countryCode: 'PL', timezone: 'Europe/Warsaw', slug: 'varsovia', slugEn: 'warsaw', population: 1800000, lat: 52.2297, lon: 21.0122 },
  { id: 'budapest', name: 'Budapest', nameEn: 'Budapest', country: 'Hungría', countryCode: 'HU', timezone: 'Europe/Budapest', slug: 'budapest', slugEn: 'budapest', population: 1700000, lat: 47.4979, lon: 19.0402, nomadHub: true },
  { id: 'copenhagen', name: 'Copenhague', nameEn: 'Copenhagen', country: 'Dinamarca', countryCode: 'DK', timezone: 'Europe/Copenhagen', slug: 'copenhague', slugEn: 'copenhagen', population: 1400000, lat: 55.6761, lon: 12.5683 },
  { id: 'stockholm', name: 'Estocolmo', nameEn: 'Stockholm', country: 'Suecia', countryCode: 'SE', timezone: 'Europe/Stockholm', slug: 'estocolmo', slugEn: 'stockholm', population: 1700000, lat: 59.3293, lon: 18.0686 },
  { id: 'oslo', name: 'Oslo', nameEn: 'Oslo', country: 'Noruega', countryCode: 'NO', timezone: 'Europe/Oslo', slug: 'oslo', slugEn: 'oslo', population: 1000000, lat: 59.9139, lon: 10.7522 },
  { id: 'helsinki', name: 'Helsinki', nameEn: 'Helsinki', country: 'Finlandia', countryCode: 'FI', timezone: 'Europe/Helsinki', slug: 'helsinki', slugEn: 'helsinki', population: 1300000, lat: 60.1699, lon: 24.9384 },
  { id: 'reykjavik', name: 'Reikiavik', nameEn: 'Reykjavik', country: 'Islandia', countryCode: 'IS', timezone: 'Atlantic/Reykjavik', slug: 'reikiavik', slugEn: 'reykjavik', population: 230000, lat: 64.1466, lon: -21.9426 },
  { id: 'edinburgh', name: 'Edimburgo', nameEn: 'Edinburgh', country: 'Reino Unido', countryCode: 'GB', timezone: 'Europe/London', slug: 'edimburgo', slugEn: 'edinburgh', population: 540000, lat: 55.9533, lon: -3.1883 },
  { id: 'manchester', name: 'Manchester', nameEn: 'Manchester', country: 'Reino Unido', countryCode: 'GB', timezone: 'Europe/London', slug: 'manchester', slugEn: 'manchester', population: 2800000, lat: 53.4808, lon: -2.2426 },
  { id: 'istanbul', name: 'Estambul', nameEn: 'Istanbul', country: 'Turquía', countryCode: 'TR', timezone: 'Europe/Istanbul', slug: 'estambul', slugEn: 'istanbul', population: 15500000, lat: 41.0082, lon: 28.9784 },
  { id: 'moscow', name: 'Moscú', nameEn: 'Moscow', country: 'Rusia', countryCode: 'RU', timezone: 'Europe/Moscow', slug: 'moscu', slugEn: 'moscow', population: 12500000, lat: 55.7558, lon: 37.6173 },
  { id: 'kyiv', name: 'Kiev', nameEn: 'Kyiv', country: 'Ucrania', countryCode: 'UA', timezone: 'Europe/Kyiv', slug: 'kiev', slugEn: 'kyiv', population: 3000000, lat: 50.4501, lon: 30.5234 },

  { id: 'tokyo', name: 'Tokio', nameEn: 'Tokyo', country: 'Japón', countryCode: 'JP', timezone: 'Asia/Tokyo', slug: 'tokio', slugEn: 'tokyo', population: 37000000, lat: 35.6762, lon: 139.6503 },
  { id: 'osaka', name: 'Osaka', nameEn: 'Osaka', country: 'Japón', countryCode: 'JP', timezone: 'Asia/Tokyo', slug: 'osaka', slugEn: 'osaka', population: 19000000, lat: 34.6937, lon: 135.5023 },
  { id: 'kyoto', name: 'Kioto', nameEn: 'Kyoto', country: 'Japón', countryCode: 'JP', timezone: 'Asia/Tokyo', slug: 'kioto', slugEn: 'kyoto', population: 1500000, lat: 35.0116, lon: 135.7681 },
  { id: 'seoul', name: 'Seúl', nameEn: 'Seoul', country: 'Corea del Sur', countryCode: 'KR', timezone: 'Asia/Seoul', slug: 'seul', slugEn: 'seoul', population: 25000000, lat: 37.5665, lon: 126.9780 },
  { id: 'beijing', name: 'Pekín', nameEn: 'Beijing', country: 'China', countryCode: 'CN', timezone: 'Asia/Shanghai', slug: 'pekin', slugEn: 'beijing', population: 21500000, lat: 39.9042, lon: 116.4074 },
  { id: 'shanghai', name: 'Shanghái', nameEn: 'Shanghai', country: 'China', countryCode: 'CN', timezone: 'Asia/Shanghai', slug: 'shanghai', slugEn: 'shanghai', population: 27000000, lat: 31.2304, lon: 121.4737 },
  { id: 'hong-kong', name: 'Hong Kong', nameEn: 'Hong Kong', country: 'Hong Kong', countryCode: 'HK', timezone: 'Asia/Hong_Kong', slug: 'hong-kong', slugEn: 'hong-kong', population: 7500000, lat: 22.3193, lon: 114.1694 },
  { id: 'taipei', name: 'Taipéi', nameEn: 'Taipei', country: 'Taiwán', countryCode: 'TW', timezone: 'Asia/Taipei', slug: 'taipei', slugEn: 'taipei', population: 7000000, lat: 25.0330, lon: 121.5654, nomadHub: true },
  { id: 'singapore', name: 'Singapur', nameEn: 'Singapore', country: 'Singapur', countryCode: 'SG', timezone: 'Asia/Singapore', slug: 'singapur', slugEn: 'singapore', population: 5900000, lat: 1.3521, lon: 103.8198 },
  { id: 'bangkok', name: 'Bangkok', nameEn: 'Bangkok', country: 'Tailandia', countryCode: 'TH', timezone: 'Asia/Bangkok', slug: 'bangkok', slugEn: 'bangkok', population: 10500000, lat: 13.7563, lon: 100.5018, nomadHub: true },
  { id: 'chiang-mai', name: 'Chiang Mai', nameEn: 'Chiang Mai', country: 'Tailandia', countryCode: 'TH', timezone: 'Asia/Bangkok', slug: 'chiang-mai', slugEn: 'chiang-mai', population: 200000, lat: 18.7883, lon: 98.9853, nomadHub: true },
  { id: 'phuket', name: 'Phuket', nameEn: 'Phuket', country: 'Tailandia', countryCode: 'TH', timezone: 'Asia/Bangkok', slug: 'phuket', slugEn: 'phuket', population: 80000, lat: 7.8804, lon: 98.3923, nomadHub: true },
  { id: 'koh-phangan', name: 'Koh Phangan', nameEn: 'Koh Phangan', country: 'Tailandia', countryCode: 'TH', timezone: 'Asia/Bangkok', slug: 'koh-phangan', slugEn: 'koh-phangan', population: 15000, lat: 9.7501, lon: 100.0167, nomadHub: true },
  { id: 'kuala-lumpur', name: 'Kuala Lumpur', nameEn: 'Kuala Lumpur', country: 'Malasia', countryCode: 'MY', timezone: 'Asia/Kuala_Lumpur', slug: 'kuala-lumpur', slugEn: 'kuala-lumpur', population: 8200000, lat: 3.1390, lon: 101.6869, nomadHub: true },
  { id: 'jakarta', name: 'Yakarta', nameEn: 'Jakarta', country: 'Indonesia', countryCode: 'ID', timezone: 'Asia/Jakarta', slug: 'yakarta', slugEn: 'jakarta', population: 33000000, lat: -6.2088, lon: 106.8456 },
  { id: 'bali', name: 'Bali (Denpasar)', nameEn: 'Bali (Denpasar)', country: 'Indonesia', countryCode: 'ID', timezone: 'Asia/Makassar', slug: 'bali', slugEn: 'bali', population: 4300000, lat: -8.4095, lon: 115.1889, nomadHub: true },
  { id: 'canggu', name: 'Canggu', nameEn: 'Canggu', country: 'Indonesia', countryCode: 'ID', timezone: 'Asia/Makassar', slug: 'canggu', slugEn: 'canggu', population: 50000, lat: -8.6478, lon: 115.1385, nomadHub: true },
  { id: 'ubud', name: 'Ubud', nameEn: 'Ubud', country: 'Indonesia', countryCode: 'ID', timezone: 'Asia/Makassar', slug: 'ubud', slugEn: 'ubud', population: 75000, lat: -8.5069, lon: 115.2625, nomadHub: true },
  { id: 'ho-chi-minh', name: 'Ho Chi Minh', nameEn: 'Ho Chi Minh', country: 'Vietnam', countryCode: 'VN', timezone: 'Asia/Ho_Chi_Minh', slug: 'ho-chi-minh', slugEn: 'ho-chi-minh', population: 9000000, lat: 10.8231, lon: 106.6297, nomadHub: true },
  { id: 'hanoi', name: 'Hanói', nameEn: 'Hanoi', country: 'Vietnam', countryCode: 'VN', timezone: 'Asia/Ho_Chi_Minh', slug: 'hanoi', slugEn: 'hanoi', population: 8000000, lat: 21.0285, lon: 105.8542 },
  { id: 'da-nang', name: 'Da Nang', nameEn: 'Da Nang', country: 'Vietnam', countryCode: 'VN', timezone: 'Asia/Ho_Chi_Minh', slug: 'da-nang', slugEn: 'da-nang', population: 1200000, lat: 16.0544, lon: 108.2022, nomadHub: true },
  { id: 'manila', name: 'Manila', nameEn: 'Manila', country: 'Filipinas', countryCode: 'PH', timezone: 'Asia/Manila', slug: 'manila', slugEn: 'manila', population: 13500000, lat: 14.5995, lon: 120.9842 },
  { id: 'cebu', name: 'Cebú', nameEn: 'Cebu', country: 'Filipinas', countryCode: 'PH', timezone: 'Asia/Manila', slug: 'cebu', slugEn: 'cebu', population: 1000000, lat: 10.3157, lon: 123.8854, nomadHub: true },
  { id: 'mumbai', name: 'Bombay', nameEn: 'Mumbai', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', slug: 'bombay', slugEn: 'mumbai', population: 21000000, lat: 19.0760, lon: 72.8777 },
  { id: 'delhi', name: 'Nueva Delhi', nameEn: 'New Delhi', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', slug: 'nueva-delhi', slugEn: 'new-delhi', population: 32000000, lat: 28.7041, lon: 77.1025 },
  { id: 'bangalore', name: 'Bangalore', nameEn: 'Bangalore', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', slug: 'bangalore', slugEn: 'bangalore', population: 13000000, lat: 12.9716, lon: 77.5946 },
  { id: 'goa', name: 'Goa', nameEn: 'Goa', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', slug: 'goa', slugEn: 'goa', population: 1500000, lat: 15.2993, lon: 74.1240, nomadHub: true },
  { id: 'kathmandu', name: 'Katmandú', nameEn: 'Kathmandu', country: 'Nepal', countryCode: 'NP', timezone: 'Asia/Kathmandu', slug: 'katmandu', slugEn: 'kathmandu', population: 1500000, lat: 27.7172, lon: 85.3240 },
  { id: 'colombo', name: 'Colombo', nameEn: 'Colombo', country: 'Sri Lanka', countryCode: 'LK', timezone: 'Asia/Colombo', slug: 'colombo', slugEn: 'colombo', population: 750000, lat: 6.9271, lon: 79.8612 },
  { id: 'dubai', name: 'Dubái', nameEn: 'Dubai', country: 'Emiratos Árabes Unidos', countryCode: 'AE', timezone: 'Asia/Dubai', slug: 'dubai', slugEn: 'dubai', population: 3500000, lat: 25.2048, lon: 55.2708, nomadHub: true },
  { id: 'abu-dhabi', name: 'Abu Dabi', nameEn: 'Abu Dhabi', country: 'Emiratos Árabes Unidos', countryCode: 'AE', timezone: 'Asia/Dubai', slug: 'abu-dabi', slugEn: 'abu-dhabi', population: 1500000, lat: 24.4539, lon: 54.3773 },
  { id: 'doha', name: 'Doha', nameEn: 'Doha', country: 'Catar', countryCode: 'QA', timezone: 'Asia/Qatar', slug: 'doha', slugEn: 'doha', population: 2400000, lat: 25.2854, lon: 51.5310 },
  { id: 'riyadh', name: 'Riad', nameEn: 'Riyadh', country: 'Arabia Saudita', countryCode: 'SA', timezone: 'Asia/Riyadh', slug: 'riad', slugEn: 'riyadh', population: 7600000, lat: 24.7136, lon: 46.6753 },
  { id: 'tel-aviv', name: 'Tel Aviv', nameEn: 'Tel Aviv', country: 'Israel', countryCode: 'IL', timezone: 'Asia/Jerusalem', slug: 'tel-aviv', slugEn: 'tel-aviv', population: 4300000, lat: 32.0853, lon: 34.7818 },
  { id: 'jerusalem', name: 'Jerusalén', nameEn: 'Jerusalem', country: 'Israel', countryCode: 'IL', timezone: 'Asia/Jerusalem', slug: 'jerusalen', slugEn: 'jerusalem', population: 950000, lat: 31.7683, lon: 35.2137 },
  { id: 'tehran', name: 'Teherán', nameEn: 'Tehran', country: 'Irán', countryCode: 'IR', timezone: 'Asia/Tehran', slug: 'teheran', slugEn: 'tehran', population: 9000000, lat: 35.6892, lon: 51.3890 },

  { id: 'cairo', name: 'El Cairo', nameEn: 'Cairo', country: 'Egipto', countryCode: 'EG', timezone: 'Africa/Cairo', slug: 'el-cairo', slugEn: 'cairo', population: 21000000, lat: 30.0444, lon: 31.2357 },
  { id: 'cape-town', name: 'Ciudad del Cabo', nameEn: 'Cape Town', country: 'Sudáfrica', countryCode: 'ZA', timezone: 'Africa/Johannesburg', slug: 'ciudad-del-cabo', slugEn: 'cape-town', population: 4700000, lat: -33.9249, lon: 18.4241, nomadHub: true },
  { id: 'johannesburg', name: 'Johannesburgo', nameEn: 'Johannesburg', country: 'Sudáfrica', countryCode: 'ZA', timezone: 'Africa/Johannesburg', slug: 'johannesburgo', slugEn: 'johannesburg', population: 6000000, lat: -26.2041, lon: 28.0473 },
  { id: 'nairobi', name: 'Nairobi', nameEn: 'Nairobi', country: 'Kenia', countryCode: 'KE', timezone: 'Africa/Nairobi', slug: 'nairobi', slugEn: 'nairobi', population: 5000000, lat: -1.2921, lon: 36.8219 },
  { id: 'lagos', name: 'Lagos', nameEn: 'Lagos', country: 'Nigeria', countryCode: 'NG', timezone: 'Africa/Lagos', slug: 'lagos', slugEn: 'lagos', population: 15000000, lat: 6.5244, lon: 3.3792 },
  { id: 'marrakech', name: 'Marrakech', nameEn: 'Marrakech', country: 'Marruecos', countryCode: 'MA', timezone: 'Africa/Casablanca', slug: 'marrakech', slugEn: 'marrakech', population: 1000000, lat: 31.6295, lon: -7.9811, nomadHub: true },
  { id: 'casablanca', name: 'Casablanca', nameEn: 'Casablanca', country: 'Marruecos', countryCode: 'MA', timezone: 'Africa/Casablanca', slug: 'casablanca', slugEn: 'casablanca', population: 3700000, lat: 33.5731, lon: -7.5898 },

  { id: 'sydney', name: 'Sídney', nameEn: 'Sydney', country: 'Australia', countryCode: 'AU', timezone: 'Australia/Sydney', slug: 'sidney', slugEn: 'sydney', population: 5300000, lat: -33.8688, lon: 151.2093 },
  { id: 'melbourne', name: 'Melbourne', nameEn: 'Melbourne', country: 'Australia', countryCode: 'AU', timezone: 'Australia/Melbourne', slug: 'melbourne', slugEn: 'melbourne', population: 5100000, lat: -37.8136, lon: 144.9631 },
  { id: 'brisbane', name: 'Brisbane', nameEn: 'Brisbane', country: 'Australia', countryCode: 'AU', timezone: 'Australia/Brisbane', slug: 'brisbane', slugEn: 'brisbane', population: 2600000, lat: -27.4698, lon: 153.0251 },
  { id: 'perth', name: 'Perth', nameEn: 'Perth', country: 'Australia', countryCode: 'AU', timezone: 'Australia/Perth', slug: 'perth', slugEn: 'perth', population: 2100000, lat: -31.9505, lon: 115.8605 },
  { id: 'auckland', name: 'Auckland', nameEn: 'Auckland', country: 'Nueva Zelanda', countryCode: 'NZ', timezone: 'Pacific/Auckland', slug: 'auckland', slugEn: 'auckland', population: 1700000, lat: -36.8485, lon: 174.7633 },
  { id: 'wellington', name: 'Wellington', nameEn: 'Wellington', country: 'Nueva Zelanda', countryCode: 'NZ', timezone: 'Pacific/Auckland', slug: 'wellington', slugEn: 'wellington', population: 420000, lat: -41.2865, lon: 174.7762 },
  { id: 'honolulu', name: 'Honolulu', nameEn: 'Honolulu', country: 'Estados Unidos', countryCode: 'US', timezone: 'Pacific/Honolulu', slug: 'honolulu', slugEn: 'honolulu', population: 1000000, lat: 21.3099, lon: -157.8581 },
  { id: 'fiji', name: 'Suva (Fiyi)', nameEn: 'Suva (Fiji)', country: 'Fiyi', countryCode: 'FJ', timezone: 'Pacific/Fiji', slug: 'suva-fiyi', slugEn: 'suva-fiji', population: 90000, lat: -18.1248, lon: 178.4501 },
];

export const citiesById = new Map(cities.map((c) => [c.id, c]));
export const citiesBySlug = new Map(cities.map((c) => [c.slug, c]));
export const citiesBySlugEn = new Map(cities.map((c) => [c.slugEn, c]));

export function findCity(slugOrId: string): City | undefined {
  return citiesById.get(slugOrId) ?? citiesBySlug.get(slugOrId) ?? citiesBySlugEn.get(slugOrId);
}
