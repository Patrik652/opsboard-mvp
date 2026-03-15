export type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

type RuntimeEnv = NodeJS.ProcessEnv;

export const DEFAULT_PLAYWRIGHT_HOST = "127.0.0.1";
export const DEFAULT_PLAYWRIGHT_PORT = "3301";

function readEnvValue(env: RuntimeEnv, key: keyof RuntimeEnv): string {
  return env[key] ?? "";
}

function trimTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getFirebaseClientConfig(env: RuntimeEnv = process.env): FirebaseClientConfig {
  return {
    apiKey: readEnvValue(env, "NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: readEnvValue(env, "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: readEnvValue(env, "NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: readEnvValue(env, "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: readEnvValue(env, "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: readEnvValue(env, "NEXT_PUBLIC_FIREBASE_APP_ID"),
  };
}

export function isFirebaseConfigured(config: FirebaseClientConfig): boolean {
  return Object.values(config).every((value) => value.length > 0);
}

export function isAnonymousAuthEnabled(env: RuntimeEnv = process.env): boolean {
  return env.NEXT_PUBLIC_FIREBASE_ENABLE_ANON_AUTH === "true";
}

export function getDefaultPlaywrightBaseUrl(): string {
  return trimTrailingSlash(
    new URL(`http://${DEFAULT_PLAYWRIGHT_HOST}:${DEFAULT_PLAYWRIGHT_PORT}`).toString()
  );
}

export function getPlaywrightBaseUrl(env: RuntimeEnv = process.env): string {
  return trimTrailingSlash(env.PLAYWRIGHT_BASE_URL ?? getDefaultPlaywrightBaseUrl());
}
