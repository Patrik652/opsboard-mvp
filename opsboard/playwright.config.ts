import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 120_000,
  use: {
    baseURL: "https://opsboard-mvp.web.app",
    headless: true,
    video: "on",
    viewport: { width: 1920, height: 1080 },
  },
});
