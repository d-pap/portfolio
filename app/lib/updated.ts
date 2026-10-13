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
 * The day the site last actually changed: the newest commit. Every redeploy would otherwise claim an update.
 * next.config.ts reads it at build time into SITE_COMMIT_DATE, because pages refreshed after a deploy render where there
 * is no git; asking git directly covers tests and scripts. Null when neither works, so the line is left out.
 */
export function lastUpdated(): string | null {
  const built = parseCommitDate(process.env.SITE_COMMIT_DATE ?? "");
  if (built) return built;
  try {
    return parseCommitDate(execFileSync("git", ["log", "-1", "--format=%cs"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
  } catch {
    return null;
  }
}

/** The later of two dates (YYYY-MM-DD or ISO), as YYYY-MM-DD. */
export function laterDate(a: string | null, b: string | null): string | null {
  const days = [a, b].filter((d): d is string => Boolean(d)).map((d) => d.slice(0, 10)).sort();
  return days.length ? days[days.length - 1] : null;
}
