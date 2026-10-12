import { execFileSync } from "node:child_process";

/** Accepts git's `%cs` output (YYYY-MM-DD) and nothing else. */
export function parseCommitDate(output: string): string | null {
  const value = output.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const month = Number(match[2]);
  const day = Number(match[3]);
  return month >= 1 && month <= 12 && day >= 1 && day <= 31 ? value : null;
}

/**
 * The day the site last actually changed: the newest commit, read at build time. Every redeploy would
 * otherwise claim an update. Null when git isn't available, so the line is left out rather than guessed.
 */
export function lastUpdated(): string | null {
  try {
    return parseCommitDate(execFileSync("git", ["log", "-1", "--format=%cs"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
  } catch {
    return null;
  }
}
