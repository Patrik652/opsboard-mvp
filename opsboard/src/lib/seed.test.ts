import { buildSeedData } from "./seed";
import { vi } from "vitest";

test("buildSeedData creates boards and incidents", () => {
  const seed = buildSeedData("user-1");
  expect(seed.boards.length).toBeGreaterThan(0);
  expect(seed.incidents.length).toBeGreaterThan(0);
});

test("buildSeedData uses deterministic audit timestamp", () => {
  vi.useFakeTimers();

  vi.setSystemTime(new Date("2026-03-01T10:00:00.000Z"));
  const first = buildSeedData("user-1");

  vi.setSystemTime(new Date("2026-03-01T10:00:05.000Z"));
  const second = buildSeedData("user-1");

  expect(first.auditLogs[0]?.createdAt).toBe(second.auditLogs[0]?.createdAt);

  vi.useRealTimers();
});
