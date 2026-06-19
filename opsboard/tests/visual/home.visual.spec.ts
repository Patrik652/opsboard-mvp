import { test, expect } from "@playwright/test";

// Visual verification loop for the design-to-code workflow (Path A).
// Source of truth = code + design tokens (src/app/globals.css).
// Each edit (human or AI) is checked against committed baselines so token
// changes are intentional and layout/content regressions fail the build.
//
//   npm run verify:visual          -> compare against baselines (fails on diff)
//   npm run verify:visual:update   -> regenerate baselines from current UI
//
// Baselines: tests/visual/__screenshots__/home-<viewport>.png

const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
} as const;

for (const [name, viewport] of Object.entries(viewports)) {
  test(`home @ ${name} (${viewport.width}x${viewport.height})`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot(`home-${name}.png`, {
      fullPage: true,
      stylePath: "tests/visual/screenshot.css",
    });
  });
}
