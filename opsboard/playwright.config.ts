import { defineConfig } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3301";
const isLocalBaseUrl =
  baseURL.includes("127.0.0.1") || baseURL.includes("localhost");
const localPort = isLocalBaseUrl ? new URL(baseURL).port || "3301" : "3301";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 45_000,
  use: {
    baseURL,
    headless: true,
    video: { mode: "retain-on-failure", size: { width: 1920, height: 1080 } },
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
  },
  webServer: isLocalBaseUrl
    ? {
        command: `npm run dev -- --port ${localPort}`,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000,
      }
    : undefined,
});
