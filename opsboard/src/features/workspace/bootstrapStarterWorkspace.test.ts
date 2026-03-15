import { bootstrapStarterWorkspace } from "./bootstrapStarterWorkspace";

test("bootstrapStarterWorkspace skips writes when workspace already exists", async () => {
  const writes: string[] = [];

  await bootstrapStarterWorkspace({
    userId: "user-1",
    hasExistingWorkspace: async () => true,
    hasRecord: async () => false,
    writeRecord: async (path) => {
      writes.push(path);
    },
  });

  expect(writes).toEqual([]);
});

test("bootstrapStarterWorkspace writes only missing records for partial starter data", async () => {
  const writes: string[] = [];
  const existingPaths = new Set<string>(["users/user-1"]);

  await bootstrapStarterWorkspace({
    userId: "user-1",
    hasExistingWorkspace: async () => false,
    hasRecord: async (path) => existingPaths.has(path),
    writeRecord: async (path) => {
      writes.push(path);
    },
  });

  expect(writes.length).toBeGreaterThan(0);
  expect(writes).not.toContain("users/user-1");
  expect(writes.some((path) => path.endsWith("/incidents/i1"))).toBe(true);
});
