import {
  getBrowserStorage,
  readJson,
  type StorageLike,
  writeJson,
} from "../storage/jsonStorage";

const SNAPSHOT_KEY = "opsboard.recovery.latest";
const SNAPSHOT_VERSION = "2026-03-opsboard-v1";

export type RecoveryPayload = {
  environment: string;
  incidents: Array<Record<string, unknown>>;
  cards: Array<Record<string, unknown>>;
  auditEntryCount: number;
  telemetryEventCount: number;
};

export type RecoverySnapshot = {
  version: typeof SNAPSHOT_VERSION;
  createdAt: number;
  payload: RecoveryPayload;
};

type RecoveryKitOptions = {
  storage?: StorageLike | null;
  now?: () => number;
};

function isRecoveryPayload(value: unknown): value is RecoveryPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;
  return (
    typeof payload.environment === "string" &&
    Array.isArray(payload.incidents) &&
    Array.isArray(payload.cards) &&
    typeof payload.auditEntryCount === "number" &&
    typeof payload.telemetryEventCount === "number"
  );
}

function isRecoverySnapshot(value: unknown): value is RecoverySnapshot {
  if (!value || typeof value !== "object") {
    return false;
  }

  const snapshot = value as Record<string, unknown>;
  return (
    snapshot.version === SNAPSHOT_VERSION &&
    typeof snapshot.createdAt === "number" &&
    isRecoveryPayload(snapshot.payload)
  );
}

export function createRecoveryKit(options?: RecoveryKitOptions) {
  const storage = options?.storage ?? getBrowserStorage();
  const now = options?.now ?? (() => Date.now());
  let volatileSnapshot: RecoverySnapshot | null = null;

  const createSnapshot = (payload: RecoveryPayload): RecoverySnapshot => ({
    version: SNAPSHOT_VERSION,
    createdAt: now(),
    payload,
  });

  const backup = (payload: RecoveryPayload): RecoverySnapshot => {
    const snapshot = createSnapshot(payload);
    if (!storage) {
      volatileSnapshot = snapshot;
      return snapshot;
    }

    writeJson(storage, SNAPSHOT_KEY, snapshot);
    return snapshot;
  };

  const readLatest = (): RecoverySnapshot | null => {
    if (!storage) {
      return volatileSnapshot;
    }
    const loaded = readJson<unknown>(storage, SNAPSHOT_KEY, null);
    return isRecoverySnapshot(loaded) ? loaded : null;
  };

  const parse = (raw: string): RecoverySnapshot | null => {
    try {
      const parsed = JSON.parse(raw) as unknown;
      return isRecoverySnapshot(parsed) ? parsed : null;
    } catch {
      return null;
    }
  };

  return {
    backup,
    createSnapshot,
    parse,
    readLatest,
  };
}
