import {
  getBrowserStorage,
  readJson,
  type StorageLike,
  writeJson,
} from "../storage/jsonStorage";

const AUDIT_KEY = "opsboard.audit.entries";

export type AuditEntry = {
  id: string;
  actor: string;
  action: string;
  details: string;
  createdAt: number;
};

type AuditLoggerOptions = {
  storage?: StorageLike | null;
  now?: () => number;
  maxEntries?: number;
};

export function createAuditLogger(options?: AuditLoggerOptions) {
  const storage = options?.storage ?? getBrowserStorage();
  const now = options?.now ?? (() => Date.now());
  const maxEntries = options?.maxEntries ?? 300;
  let volatileEntries: AuditEntry[] = [];

  const readEntries = (): AuditEntry[] => {
    if (!storage) {
      return volatileEntries;
    }
    return readJson<AuditEntry[]>(storage, AUDIT_KEY, []);
  };

  const writeEntries = (entries: AuditEntry[]) => {
    if (!storage) {
      volatileEntries = entries;
      return;
    }
    writeJson(storage, AUDIT_KEY, entries);
  };

  const log = (input: Omit<AuditEntry, "id" | "createdAt">): AuditEntry => {
    const createdAt = now();
    const entry: AuditEntry = {
      id: `audit-${createdAt}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt,
      ...input,
    };

    const nextEntries = [...readEntries(), entry].slice(-maxEntries);
    writeEntries(nextEntries);
    return entry;
  };

  const list = (): AuditEntry[] => readEntries();

  return { log, list };
}
