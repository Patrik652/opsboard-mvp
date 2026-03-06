import process from "node:process";

const demoUrl = process.env.DEMO_URL ?? "https://opsboard-mvp-live.web.app";
const response = await fetch(demoUrl);
const html = await response.text();

if (!response.ok) {
  console.error(`Demo URL check failed with HTTP ${response.status}: ${demoUrl}`);
  process.exit(1);
}

const lowerHtml = html.toLowerCase();
if (lowerHtml.includes("site not found")) {
  console.error(`Demo URL points to Firebase placeholder page: ${demoUrl}`);
  process.exit(1);
}

if (!lowerHtml.includes("opsboard")) {
  console.error(`Demo URL responded but expected Opsboard marker is missing: ${demoUrl}`);
  process.exit(1);
}

console.log(`Demo URL check passed: ${demoUrl}`);
