import { expect, test } from "@playwright/test";

test("demo workspace supports board, incident, and audit workflow", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Open demo workspace/i }).click();

  await expect(page.getByRole("heading", { name: "Opsboard" })).toBeVisible();

  await page.getByRole("button", { name: /New card/i }).click();
  await page.getByPlaceholder("Card title").fill("Investigate queue lag");
  await page.getByRole("button", { name: /Add card/i }).click();
  await expect(page.getByText("Investigate queue lag", { exact: true })).toBeVisible();

  await page.goto("/incidents");
  await page.getByRole("button", { name: /New incident/i }).click();
  await page.getByPlaceholder("Incident title").fill("Queue lag detected");
  await page.getByRole("button", { name: /Create incident/i }).click();
  await expect(page.getByText("Queue lag detected")).toBeVisible();

  await page.goto("/audit");
  await expect(page.getByText(/Created incident: Queue lag detected/i)).toBeVisible();
});
