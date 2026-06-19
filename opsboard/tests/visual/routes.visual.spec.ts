import { test, expect, type Page } from "@playwright/test";

// Visual verification loop for the design-to-code workflow (Path A).
// Source of truth = code + design tokens (src/app/globals.css).
// Each edit (human or AI) is checked against committed baselines so token
// changes are intentional and layout/content regressions fail the build.
//
//   npm run verify:visual          -> compare against baselines (fails on diff)
//   npm run verify:visual:update   -> regenerate baselines from current UI
//
// Baselines: tests/visual/__screenshots__/<route>-<viewport>.png
//
// Routes are guest/demo-renderable: the (app) layout's RequireWorkspace
// renders children in demo mode, and the demo workspace is seeded from the
// fully static buildSeedData() (fixed ids/titles/state, no Date.now/random,
// no displayed timestamps) — so /boards and /incidents are deterministic.
// /audit, /status, /analytics etc. are intentionally NOT covered yet (see
// docs/plans/2026-06-19-ai-design-workflow-poc.md, Phase 3A).

type Route = { name: string; path: string; heading: string };

const routes: Route[] = [
  { name: "home", path: "/", heading: "Command your work. Prove your reliability." },
  { name: "boards", path: "/boards", heading: "Opsboard" },
  { name: "incidents", path: "/incidents", heading: "Incidents" },
];

const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
} as const;

// Browser errors that are known-harmless dev-server noise. Kept explicit and
// empty by default so any addition is a deliberate, reviewed decision — never
// a silent loosening to make a test pass.
const IGNORED_ERROR_PATTERNS: RegExp[] = [];

function attachErrorGuard(page: Page): { assertClean: () => void } {
  const errors: string[] = [];

  page.on("pageerror", (err) => {
    errors.push(`pageerror: ${err.message}`);
  });
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (IGNORED_ERROR_PATTERNS.some((re) => re.test(text))) return;
    errors.push(`console.error: ${text}`);
  });

  return {
    assertClean: () =>
      expect(
        errors,
        `unexpected browser errors:\n${errors.join("\n")}`
      ).toEqual([]),
  };
}

for (const route of routes) {
  for (const [vpName, viewport] of Object.entries(viewports)) {
    test(`${route.name} @ ${vpName} (${viewport.width}x${viewport.height})`, async ({
      page,
    }) => {
      const guard = attachErrorGuard(page);

      await page.setViewportSize(viewport);
      await page.goto(route.path);
      await page.waitForLoadState("networkidle");
      // Wait for real content (not the loading state) before snapshotting.
      await expect(
        page.getByRole("heading", { name: route.heading }).first()
      ).toBeVisible();

      await expect(page).toHaveScreenshot(`${route.name}-${vpName}.png`, {
        fullPage: true,
        stylePath: "tests/visual/screenshot.css",
      });

      guard.assertClean();
    });
  }
}
