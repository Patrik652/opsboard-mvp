import { buildSeedWrites } from "./seedFirestore";

test("buildSeedWrites creates per-user starter workspace writes", () => {
  const writes = buildSeedWrites("user-1");
  const paths = writes.map((write) => write.path);

  expect(writes.length).toBeGreaterThan(0);
  expect(paths).toContain("users/user-1");
  expect(paths.some((path) => path.includes("/boards/"))).toBe(true);
  expect(paths.some((path) => path.includes("/cards/"))).toBe(true);
  expect(paths.some((path) => path.includes("/incidents/"))).toBe(true);
  expect(paths.some((path) => path.includes("/services/"))).toBe(true);
  expect(paths.some((path) => path.includes("/auditLogs/"))).toBe(true);
});
