import { access } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const requiredFiles = [
  "out/index.html",
  "out/boards.html",
  "out/incidents.html",
  "out/status.html",
  "out/audit.html",
  "out/analytics.html",
  "out/ai.html",
  "out/operations.html",
];

const missing = [];

for (const relativeFile of requiredFiles) {
  const absolutePath = path.join(projectRoot, relativeFile);
  try {
    await access(absolutePath);
  } catch {
    missing.push(relativeFile);
  }
}

if (missing.length > 0) {
  console.error("Static export verification failed. Missing files:");
  missing.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

console.log("Static export verification passed.");
