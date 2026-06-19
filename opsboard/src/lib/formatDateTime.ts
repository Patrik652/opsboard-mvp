// Deterministic timestamp formatting for UI display.
//
// `Date#toLocaleString()` depends on the host locale and timezone, which makes
// any screen that shows a timestamp (audit log, ops snapshot) non-deterministic
// across machines and breaks visual-regression baselines. Pinning a fixed
// locale + UTC timezone keeps the rendered text stable everywhere while still
// being a real, production-safe format (not a test-only stub).
export function formatTimestamp(value: number | string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  const formatted = new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  return `${formatted} UTC`;
}
