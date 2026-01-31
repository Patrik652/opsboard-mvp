import { test } from "@playwright/test";

test("opsboard demo", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(1500);

  await page.click("text=Try demo account");
  await page.waitForTimeout(3000);

  // Boards
  await page.goto("/boards");
  await page.waitForTimeout(5000);

  // Incidents
  await page.goto("/incidents");
  await page.waitForTimeout(5000);

  // Status
  await page.goto("/status");
  await page.waitForTimeout(3000);

  // Audit
  await page.goto("/audit");
  await page.waitForTimeout(3000);

  // Analytics
  await page.goto("/analytics");
  await page.waitForTimeout(3000);

  // AI Panel
  await page.goto("/ai");
  await page.waitForTimeout(3000);
});
