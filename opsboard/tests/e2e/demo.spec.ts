import { expect, test } from "@playwright/test";

const routes = [
  { path: "/", heading: "Command your work. Prove your reliability." },
  { path: "/boards", heading: "Opsboard" },
  { path: "/incidents", heading: "Incidents" },
  { path: "/status", heading: "Status" },
  { path: "/audit", heading: "Audit log" },
  { path: "/analytics", heading: "Reliability Pulse" },
  { path: "/ai", heading: "AI Operations Copilot" },
  { path: "/operations", heading: "Operational readiness" },
];

test("opsboard demo routes render", async ({ page }) => {
  for (const route of routes) {
    await page.goto(route.path);
    await expect(page.getByRole("heading", { name: route.heading })).toBeVisible();
  }
});
