export type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

export function getBrowserStorage(): StorageLike | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage;
}

export function readJson<T>(
  storage: StorageLike | null,
  key: string,
  fallback: T
): T {
  if (!storage) {
    return fallback;
  }

  const raw = storage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(storage: StorageLike | null, key: string, value: unknown): void {
  if (!storage) {
    return;
  }
  storage.setItem(key, JSON.stringify(value));
}
