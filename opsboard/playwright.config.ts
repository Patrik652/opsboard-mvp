import { defineConfig } from "@playwright/test";
import { DEFAULT_PLAYWRIGHT_PORT, getPlaywrightBaseUrl } from "./src/lib/runtimeConfig";

const baseURL = getPlaywrightBaseUrl();
const parsedBaseUrl = new URL(baseURL);
const isLocalBaseUrl =
  parsedBaseUrl.hostname === "127.0.0.1" || parsedBaseUrl.hostname === "localhost";
const localPort = isLocalBaseUrl ? parsedBaseUrl.port || DEFAULT_PLAYWRIGHT_PORT : DEFAULT_PLAYWRIGHT_PORT;

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
