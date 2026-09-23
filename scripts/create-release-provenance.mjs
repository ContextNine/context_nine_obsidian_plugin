import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const files = ["main.js", "manifest.json", "styles.css"];
const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const sourceCommit = process.env.GITHUB_SHA ?? execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
if (!/^[0-9a-f]{40}$/.test(sourceCommit)) throw new Error("source commit must be a full SHA");

const outputDirectory = process.env.RELEASE_OUTPUT_DIR ?? "dist-release";
mkdirSync(outputDirectory, { recursive: true });

const artifacts = files.map((path) => ({
  path,
  sha256: createHash("sha256").update(readFileSync(path)).digest("hex"),
}));
const basename = `context-nine-${manifest.version}`;
writeFileSync(
  join(outputDirectory, `${basename}.release.json`),
  `${JSON.stringify({ schema_version: 1, repository: "ContextNine/context_nine_obsidian_plugin", version: manifest.version, source_commit: sourceCommit, artifacts }, null, 2)}\n`,
);
writeFileSync(
  join(outputDirectory, `${basename}.sha256`),
  `${artifacts.map(({ path, sha256 }) => `${sha256}  ${path}`).join("\n")}\n`,
);
