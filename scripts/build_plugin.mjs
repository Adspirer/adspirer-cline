#!/usr/bin/env node
// Builds plugins/adspirer/skills from skills/ for the cline/plugins collection.
// That repository's validator rejects em dashes and markdown bold markers,
// so the bundled copy is normalised here. Run with --check in CI.
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const source = join(root, "skills");
const target = join(root, "plugins", "adspirer", "skills");
const check = process.argv.includes("--check");

function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

function normalise(text, isMarkdown) {
  let out = text.replace(/\s*—\s*/g, " - ");
  if (isMarkdown) {
    out = out.replace(/\*\*([^*\n][\s\S]*?)\*\*/g, "$1");
  }
  return out;
}

function build(dest) {
  rmSync(dest, { recursive: true, force: true });
  cpSync(source, dest, { recursive: true });
  for (const path of files(dest)) {
    const text = readFileSync(path, "utf8");
    writeFileSync(path, normalise(text, path.endsWith(".md")));
  }
}

if (!check) {
  build(target);
  console.log(`Built ${relative(root, target)} (${files(target).length} files).`);
} else {
  const temp = join(mkdtempSync(join(tmpdir(), "adspirer-plugin-")), "skills");
  build(temp);
  const want = files(temp).map((p) => relative(temp, p)).sort();
  const have = existsSync(target) ? files(target).map((p) => relative(target, p)).sort() : [];
  const stale = JSON.stringify(want) !== JSON.stringify(have) ||
    want.some((p) => readFileSync(join(temp, p), "utf8") !== readFileSync(join(target, p), "utf8"));
  rmSync(temp, { recursive: true, force: true });
  if (stale) {
    console.error("plugins/adspirer/skills is out of date. Run: node scripts/build_plugin.mjs");
    process.exit(1);
  }
  console.log("plugins/adspirer/skills is up to date.");
}
