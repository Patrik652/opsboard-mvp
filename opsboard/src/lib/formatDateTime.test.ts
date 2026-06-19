import { describe, expect, it } from "vitest";
import { formatTimestamp } from "./formatDateTime";

describe("formatTimestamp", () => {
  const fixed = Date.UTC(2026, 2, 1, 9, 0, 0); // 2026-03-01 09:00 UTC

  it("formats epoch ms deterministically in UTC", () => {
    expect(formatTimestamp(fixed)).toMatch(/01 Mar 2026.*09:00 UTC/);
  });

  it("is stable regardless of input type (ms, Date, ISO string)", () => {
    const fromMs = formatTimestamp(fixed);
    const fromDate = formatTimestamp(new Date(fixed));
    const fromIso = formatTimestamp("2026-03-01T09:00:00.000Z");
    expect(fromDate).toBe(fromMs);
    expect(fromIso).toBe(fromMs);
  });
});
