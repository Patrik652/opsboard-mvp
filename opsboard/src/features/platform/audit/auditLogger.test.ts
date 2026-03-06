import { createAuditLogger } from "./auditLogger";

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

test("stores audit entries in chronological order", () => {
  let time = 10;
  const logger = createAuditLogger({
    storage: createMemoryStorage(),
    now: () => ++time,
  });

  logger.log({
    actor: "ai-copilot",
    action: "incident-workflow-run",
    details: "Executed workflow for incident inc-44",
  });
  logger.log({
    actor: "ops-user",
    action: "recovery-snapshot-created",
    details: "Created local backup",
  });

  const entries = logger.list();
  expect(entries).toHaveLength(2);
  expect(entries[0].action).toBe("incident-workflow-run");
  expect(entries[1].action).toBe("recovery-snapshot-created");
  expect(entries[1].createdAt).toBeGreaterThan(entries[0].createdAt);
});
