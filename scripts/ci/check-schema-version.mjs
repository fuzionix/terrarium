#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import semver from "semver";

const BASE_REF = process.argv[2] ?? "origin/main";

const CONTRACT_DIRS = ["proto/environment-contract", "proto/review-protocol"];

function git(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

/** List files changed under `dir` between BASE_REF and HEAD. */
function changedFilesUnder(dir) {
  const output = git(["diff", "--name-only", `${BASE_REF}...HEAD`, "--", dir]);
  return output ? output.split("\n").filter(Boolean) : [];
}

/** Read a file's content at BASE_REF (empty string if it did not exist). */
function readAtBaseRef(path) {
  return git(["show", `${BASE_REF}:${path}`]);
}

/** Read a file's content at HEAD (working tree), or null if missing. */
function readAtHead(path) {
  if (!existsSync(path)) return null;
  return readFileSync(path, "utf8").trim();
}

/**
 * Whether any commit touching `dir` in the diff range declares a breaking
 * change for this contract, via a conventional "BREAKING CHANGE:" footer.
 */
function hasBreakingChangeMarker(dir) {
  const log = git([
    "log",
    `${BASE_REF}..HEAD`,
    "--pretty=format:%B",
    "--",
    dir,
  ]);
  return /BREAKING CHANGE:/i.test(log);
}

let failed = false;
const summary = [];

for (const dir of CONTRACT_DIRS) {
  const versionPath = join(dir, "VERSION");
  const changed = changedFilesUnder(dir);

  if (changed.length === 0) {
    continue;
  }

  const nonVersionChanges = changed.filter((f) => f !== versionPath);
  const versionFileChanged = changed.includes(versionPath);

  if (nonVersionChanges.length === 0) {
    continue;
  }

  if (!versionFileChanged) {
    console.error(`ERROR: ${dir} has schema changes but ${versionPath} was not updated:\n` + nonVersionChanges.map((f) => `  - ${f}`).join("\n"));
    failed = true;
    continue;
  }

  const oldRaw = readAtBaseRef(versionPath);
  const newRaw = readAtHead(versionPath);

  if (newRaw === null) {
    console.error(`ERROR: ${versionPath} could not be read at HEAD.`);
    failed = true;
    continue;
  }

  const oldVersion = semver.valid(semver.clean(oldRaw));
  const newVersion = semver.valid(semver.clean(newRaw));

  if (!newVersion) {
    console.error(`ERROR: ${versionPath} = "${newRaw}" is not a valid SemVer string.`);
    failed = true;
    continue;
  }

  // First time a VERSION file is introduced: just require valid SemVer.
  if (!oldVersion) {
    summary.push(`${dir}: VERSION initialized at ${newVersion}`);
    continue;
  }

  if (!semver.gt(newVersion, oldVersion)) {
    console.error(`ERROR: ${versionPath} did not increase: ${oldVersion} -> ${newVersion}. Schema changes require a strictly higher SemVer version.`);
    failed = true;
    continue;
  }

  const bumpType = semver.diff(oldVersion, newVersion); // "major" | "minor" | "patch" | ...
  const breaking = hasBreakingChangeMarker(dir);

  if (breaking && bumpType !== "major") {
    console.error(`ERROR: ${dir} contains a "BREAKING CHANGE:" commit but VERSION only received a "${bumpType}" bump (${oldVersion} -> ${newVersion}). Breaking contract changes require a MAJOR version bump.`);
    failed = true;
    continue;
  }

  summary.push(`${dir}: ${oldVersion} -> ${newVersion} (${bumpType}${breaking ? ", breaking" : ""})`);
}

if (failed) {
  console.error(`\nSchema contract gate failed. Bump proto/<contract>/VERSION with a SemVer-valid, strictly increasing value, and use a MAJOR bump for any change flagged with a 'BREAKING CHANGE:' commit footer.`);
  process.exit(1);
}

if (summary.length > 0) {
  console.log("Schema version gate passed:");
  for (const line of summary) console.log(`  - ${line}`);
} else {
  console.log("Schema version gate passed: no proto/** changes in this diff.");
}