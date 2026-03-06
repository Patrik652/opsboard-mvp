import {
  getBrowserStorage,
  readJson,
  type StorageLike,
  writeJson,
} from "../storage/jsonStorage";

const TELEMETRY_KEY = "opsboard.telemetry.events";

export type TelemetryLevel = "info" | "warn" | "error";

export type TelemetryEvent = {
  id: string;
  name: string;
  level: TelemetryLevel;
  createdAt: number;
  metadata?: Record<string, unknown>;
};

type TelemetrySummary = {
  total: number;
  byLevel: Record<TelemetryLevel, number>;
  lastEvent: TelemetryEvent | null;
};

type TelemetryClientOptions = {
  storage?: StorageLike | null;
  now?: () => number;
  maxEvents?: number;
};

function createId(now: number): string {
  return `telemetry-${now}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createTelemetryClient(options?: TelemetryClientOptions) {
  const storage = options?.storage ?? getBrowserStorage();
  const now = options?.now ?? (() => Date.now());
  const maxEvents = options?.maxEvents ?? 200;
  let volatileEvents: TelemetryEvent[] = [];

  const readEvents = (): TelemetryEvent[] => {
    if (!storage) {
      return volatileEvents;
    }
    return readJson<TelemetryEvent[]>(storage, TELEMETRY_KEY, []);
  };

  const writeEvents = (events: TelemetryEvent[]) => {
    if (!storage) {
      volatileEvents = events;
      return;
    }
    writeJson(storage, TELEMETRY_KEY, events);
  };

  const list = (): TelemetryEvent[] => readEvents();

  const record = (input: {
    name: string;
    level?: TelemetryLevel;
    metadata?: Record<string, unknown>;
  }): TelemetryEvent => {
    const nextEvent: TelemetryEvent = {
      id: createId(now()),
      name: input.name,
      level: input.level ?? "info",
      createdAt: now(),
      metadata: input.metadata,
    };

    const nextEvents = [...readEvents(), nextEvent].slice(-maxEvents);
    writeEvents(nextEvents);
    return nextEvent;
  };

  const getSummary = (): TelemetrySummary => {
    const events = readEvents();
    const byLevel: Record<TelemetryLevel, number> = {
      info: 0,
      warn: 0,
      error: 0,
    };

    events.forEach((event) => {
      byLevel[event.level] += 1;
    });

    return {
      total: events.length,
      byLevel,
      lastEvent: events.length > 0 ? events[events.length - 1] : null,
    };
  };

  return { list, record, getSummary };
}
