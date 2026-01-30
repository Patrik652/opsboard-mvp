import { buildSeedData } from "./seed";

test("buildSeedData creates boards and incidents", () => {
  const seed = buildSeedData("user-1");
  expect(seed.boards.length).toBeGreaterThan(0);
  expect(seed.incidents.length).toBeGreaterThan(0);
});
