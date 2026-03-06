import { test, expect } from "@playwright/test";

test("boards page renders", async ({ page }) => {
  await page.goto("/boards");
  await expect(page.getByRole("heading", { name: "Site Not Found" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Opsboard" })).toBeVisible();
});
