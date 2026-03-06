import { cp, mkdir } from "node:fs/promises";
import { promisify } from "node:util";
import { execFile } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "@playwright/test";

const baseURL = process.env.DEMO_URL ?? "https://opsboard-mvp-live.web.app";
const rootDir = process.cwd();
const recordDir = path.join(rootDir, "tmp", "demo-video");
const rawOutputPath = path.join(rootDir, "tmp", "demo-video", "opsboard-demo-short.webm");
const outputPath = path.join(rootDir, "docs", "media", "opsboard-demo-short.mp4");
const runExecFile = promisify(execFile);

async function transcodeToMp4(sourcePath, destinationPath) {
  await runExecFile("ffmpeg", [
    "-y",
    "-i",
    sourcePath,
    "-vf",
    "fps=24",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "28",
    "-an",
    destinationPath,
  ]);
}

async function run() {
  await mkdir(recordDir, { recursive: true });
  await mkdir(path.dirname(outputPath), { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: recordDir,
      size: { width: 1440, height: 900 },
    },
  });

  const page = await context.newPage();
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  await page.getByRole("link", { name: /Open workspace without login/i }).click();
  await page.waitForTimeout(1600);

  const routes = ["/incidents", "/status", "/audit", "/analytics", "/ai", "/operations"];
  for (const route of routes) {
    await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1300);

    if (route === "/ai") {
      await page.getByRole("button", { name: /Run workflow/i }).click();
      await page.waitForTimeout(1800);
    }

    if (route === "/operations") {
      await page.getByRole("button", { name: /Record synthetic alert/i }).click();
      await page.waitForTimeout(1000);
      await page.getByRole("button", { name: /Create recovery snapshot/i }).click();
      await page.waitForTimeout(1800);
    }
  }

  const video = page.video();
  if (!video) {
    throw new Error("Playwright did not attach video recording.");
  }

  await context.close();
  await browser.close();

  const sourceVideoPath = await video.path();
  await cp(sourceVideoPath, rawOutputPath, { force: true });
  await transcodeToMp4(rawOutputPath, outputPath);
  process.stdout.write(`Demo video created: ${outputPath}\n`);
}

run().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
