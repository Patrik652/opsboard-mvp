import { createTelemetryClient } from "./telemetry";

function createMemoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem(key: string) {
      return map.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    },
    removeItem(key: string) {
      map.delete(key);
    },
  };
}

test("records telemetry and returns summary counts", () => {
  const client = createTelemetryClient({
    storage: createMemoryStorage(),
    now: () => 1_737_000_000_000,
    maxEvents: 10,
  });

  client.record({ name: "ai.workflow.executed", level: "info" });
  client.record({ name: "firestore.write.retry", level: "warn" });
  const summary = client.getSummary();

  expect(summary.total).toBe(2);
  expect(summary.byLevel.info).toBe(1);
  expect(summary.byLevel.warn).toBe(1);
  expect(summary.lastEvent?.name).toBe("firestore.write.retry");
});

test("keeps only the most recent events according to maxEvents", () => {
  let time = 100;
  const client = createTelemetryClient({
    storage: createMemoryStorage(),
    now: () => ++time,
    maxEvents: 2,
  });

  client.record({ name: "first", level: "info" });
  client.record({ name: "second", level: "info" });
  client.record({ name: "third", level: "error" });
  const events = client.list();

  expect(events).toHaveLength(2);
  expect(events.map((event) => event.name)).toEqual(["second", "third"]);
});
