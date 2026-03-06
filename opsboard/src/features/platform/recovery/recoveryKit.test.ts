import { createRecoveryKit } from "./recoveryKit";

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

test("creates, stores, and reloads the latest recovery snapshot", () => {
  const recovery = createRecoveryKit({
    storage: createMemoryStorage(),
    now: () => 1_737_000_000_000,
  });

  const snapshot = recovery.backup({
    environment: "demo",
    incidents: [{ id: "inc-1", severity: "high" }],
    cards: [{ id: "card-1", priority: "high" }],
    auditEntryCount: 14,
    telemetryEventCount: 8,
  });

  expect(snapshot.version).toBe("2026-03-opsboard-v1");
  expect(snapshot.createdAt).toBe(1_737_000_000_000);

  const loaded = recovery.readLatest();
  expect(loaded).not.toBeNull();
  expect(loaded?.payload.environment).toBe("demo");
  expect(loaded?.payload.auditEntryCount).toBe(14);
});

test("returns null for invalid snapshot payload", () => {
  const recovery = createRecoveryKit({ storage: createMemoryStorage() });
  expect(recovery.parse("{\"hello\":\"world\"}")).toBeNull();
});
