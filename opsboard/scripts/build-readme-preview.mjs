import { promisify } from "node:util";
import { execFile } from "node:child_process";
import path from "node:path";
import process from "node:process";

const runExecFile = promisify(execFile);
const cwd = process.cwd();
const mediaDir = path.join(cwd, "docs", "media");

const sourceVideo = path.join(mediaDir, "opsboard-demo-short.mp4");
const captionedVideo = path.join(mediaDir, "opsboard-demo-captioned.mp4");
const gifPreview = path.join(mediaDir, "opsboard-demo-short.gif");
const fontFile = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf";

const captionFilter = [
  "drawtext=fontfile=" + fontFile + ":text='01 Landing \\+ workspace':fontcolor=white:fontsize=42:box=1:boxcolor=0x000000AA:boxborderw=18:x=(w-text_w)/2:y=h-100:enable='between(t,0,3)'",
  "drawtext=fontfile=" + fontFile + ":text='02 Boards':fontcolor=white:fontsize=42:box=1:boxcolor=0x000000AA:boxborderw=18:x=(w-text_w)/2:y=h-100:enable='between(t,3,6)'",
  "drawtext=fontfile=" + fontFile + ":text='03 Incidents':fontcolor=white:fontsize=42:box=1:boxcolor=0x000000AA:boxborderw=18:x=(w-text_w)/2:y=h-100:enable='between(t,6,9)'",
  "drawtext=fontfile=" + fontFile + ":text='04 Status \\+ Audit':fontcolor=white:fontsize=42:box=1:boxcolor=0x000000AA:boxborderw=18:x=(w-text_w)/2:y=h-100:enable='between(t,9,12)'",
  "drawtext=fontfile=" + fontFile + ":text='05 Analytics':fontcolor=white:fontsize=42:box=1:boxcolor=0x000000AA:boxborderw=18:x=(w-text_w)/2:y=h-100:enable='between(t,12,15)'",
  "drawtext=fontfile=" + fontFile + ":text='06 AI agents workflow':fontcolor=white:fontsize=42:box=1:boxcolor=0x000000AA:boxborderw=18:x=(w-text_w)/2:y=h-100:enable='between(t,15,18)'",
  "drawtext=fontfile=" + fontFile + ":text='07 Operations: telemetry \\+ recovery':fontcolor=white:fontsize=42:box=1:boxcolor=0x000000AA:boxborderw=18:x=(w-text_w)/2:y=h-100:enable='between(t,18,22)'",
].join(",");

async function build() {
  await runExecFile("ffmpeg", [
    "-y",
    "-i",
    sourceVideo,
    "-vf",
    captionFilter,
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "28",
    "-an",
    captionedVideo,
  ]);

  await runExecFile("ffmpeg", [
    "-y",
    "-i",
    captionedVideo,
    "-vf",
    "fps=8,scale=900:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5",
    "-t",
    "21.5",
    gifPreview,
  ]);

  process.stdout.write(`Captioned video created: ${captionedVideo}\n`);
  process.stdout.write(`README GIF preview updated: ${gifPreview}\n`);
}

build().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
