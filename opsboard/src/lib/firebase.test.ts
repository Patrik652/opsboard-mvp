import { describe, expect, test, vi } from "vitest";

describe("firebase config", () => {
  test("isFirebaseConfigured is false when env is missing", async () => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "";
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "";
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "";
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "";
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "";
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID = "";

    const mod = await import("./firebase");
    expect(mod.isFirebaseConfigured).toBe(false);
  });
});
