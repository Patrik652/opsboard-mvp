import { defineConfig } from "@playwright/test";

// Dedicated config for the visual verification loop (Path A guardrail).
// Kept separate from playwright.config.ts so it does not touch the existing
// e2e suite (different viewport/scale) and only runs the visual specs.

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3302";
const isLocal = baseURL.includes("127.0.0.1") || baseURL.includes("localhost");
const port = isLocal ? new URL(baseURL).port || "3302" : "3302";

export default defineConfig({
  testDir: "./tests/visual",
  timeout: 60_000,
  // Baselines live next to the spec, committed to git, with stable names
  // (no platform/project suffix) so they are easy to review and update.
  snapshotPathTemplate: "tests/visual/__screenshots__/{arg}{ext}",
  reporter: [["list"]],
  use: {
    baseURL,
    headless: true,
    deviceScaleFactor: 1,
  },
  expect: {
    toHaveScreenshot: {
      // Fail when more than 1% of pixels differ beyond the per-pixel
      // threshold. The phase-1 token fix moved ~0.8% RMSE uniformly with a
      // per-pixel delta well under `threshold`, so legitimate token swaps
      // pass while real layout/content regressions fail.
      maxDiffPixelRatio: 0.01,
      threshold: 0.2,
      animations: "disabled",
    },
  },
  webServer: isLocal
    ? {
        command: `npm run dev -- --port ${port}`,
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      }
    : undefined,
});
