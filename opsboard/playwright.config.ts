import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 120_000,
  use: {
    baseURL: "https://opsboard-mvp.web.app",
    headless: true,
    video: { mode: "on", size: { width: 2560, height: 1440 } },
    viewport: { width: 2560, height: 1440 },
    deviceScaleFactor: 2,
  },
});
