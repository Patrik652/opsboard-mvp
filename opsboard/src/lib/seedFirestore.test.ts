import { shouldSeed } from "./seedFirestore";

test("shouldSeed returns true when no data", () => {
  expect(shouldSeed({ boards: 0, incidents: 0 })).toBe(true);
});
