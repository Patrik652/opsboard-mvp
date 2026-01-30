import { buildSeedWrites } from "./seedFirestore";

test("buildSeedWrites creates writes for multiple collections", () => {
  const writes = buildSeedWrites("user-1");
  const collections = new Set(writes.map((write) => write.collection));

  expect(writes.length).toBeGreaterThan(0);
  expect(collections.has("boards")).toBe(true);
  expect(collections.has("cards")).toBe(true);
  expect(collections.has("incidents")).toBe(true);
  expect(collections.has("auditLogs")).toBe(true);
});
