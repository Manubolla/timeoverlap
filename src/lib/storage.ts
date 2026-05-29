export type SavedComparison = {
  id: string;
  name: string;
  cities: string[];
  createdAt: number;
  updatedAt: number;
};

const KEY = 'timeoverlap:comparisons:v1';

function read(): SavedComparison[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: SavedComparison[]): void {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export const storage = {
  list(): SavedComparison[] {
    return read().sort((a, b) => b.updatedAt - a.updatedAt);
  },
  get(id: string): SavedComparison | undefined {
    return read().find((c) => c.id === id);
  },
  save(name: string, cities: string[]): SavedComparison {
    const items = read();
    const now = Date.now();
    const existing = items.find(
      (c) => c.name.toLowerCase() === name.toLowerCase(),
    );
    if (existing) {
      existing.cities = cities;
      existing.updatedAt = now;
      write(items);
      return existing;
    }
    const created: SavedComparison = {
      id: crypto.randomUUID(),
      name,
      cities,
      createdAt: now,
      updatedAt: now,
    };
    items.push(created);
    write(items);
    return created;
  },
  remove(id: string): void {
    write(read().filter((c) => c.id !== id));
  },
};
