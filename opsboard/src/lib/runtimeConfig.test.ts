import { describe, expect, test } from "vitest";
import {
  getDefaultPlaywrightBaseUrl,
  getFirebaseClientConfig,
  getPlaywrightBaseUrl,
  isAnonymousAuthEnabled,
  isFirebaseConfigured,
} from "./runtimeConfig";

describe("runtimeConfig", () => {
  test("builds a configured Firebase client shape from env", () => {
    const env = {
      NEXT_PUBLIC_FIREBASE_API_KEY: "api-key",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "demo.firebaseapp.com",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: "demo-project",
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "demo.appspot.com",
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "123456",
      NEXT_PUBLIC_FIREBASE_APP_ID: "app-id",
    } satisfies NodeJS.ProcessEnv;

    const config = getFirebaseClientConfig(env);

    expect(config).toEqual({
      apiKey: "api-key",
      authDomain: "demo.firebaseapp.com",
      projectId: "demo-project",
      storageBucket: "demo.appspot.com",
      messagingSenderId: "123456",
      appId: "app-id",
    });
    expect(isFirebaseConfigured(config)).toBe(true);
  });

  test("marks Firebase as unconfigured when required env is missing", () => {
    expect(isFirebaseConfigured(getFirebaseClientConfig({}))).toBe(false);
  });

  test("enables anonymous auth only for an explicit true value", () => {
    expect(
      isAnonymousAuthEnabled({
        NEXT_PUBLIC_FIREBASE_ENABLE_ANON_AUTH: "true",
      } satisfies NodeJS.ProcessEnv)
    ).toBe(true);
    expect(isAnonymousAuthEnabled({})).toBe(false);
  });

  test("uses the configured Playwright base URL when present", () => {
    expect(
      getPlaywrightBaseUrl({
        PLAYWRIGHT_BASE_URL: "https://opsboard.example.test/app/",
      } satisfies NodeJS.ProcessEnv)
    ).toBe("https://opsboard.example.test/app");
  });

  test("falls back to the local Playwright base URL when env is missing", () => {
    expect(getDefaultPlaywrightBaseUrl()).toBe("http://127.0.0.1:3301");
    expect(getPlaywrightBaseUrl({})).toBe("http://127.0.0.1:3301");
  });
});
