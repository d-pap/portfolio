export type Mode = "work" | "play";

/** A run of plain text, or a phrase with a work and a play version. */
export type AboutPart = string | { work: string; play: string };

const squash = (text: string) => text.replace(/\s+/g, " ");
const lineAt = (source: string, i: number) => `line ${source.slice(0, i).split("\n").length}`;

/** Parses the about paragraph. Each switchable phrase is written `{work version | play version}`. */
export function parseAbout(raw: string, where = "content/about.txt"): AboutPart[] {
  const parts: AboutPart[] = [];
  let text = "";
  let open = -1;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (ch === "{") {
      if (open >= 0) throw new Error(`${where}: "{" at ${lineAt(raw, i)} is inside another phrase`);
      open = i;
    } else if (ch === "}") {
      if (open < 0) throw new Error(`${where}: "}" at ${lineAt(raw, i)} has no matching "{"`);
      const sides = raw.slice(open + 1, i).split("|");
      if (sides.length !== 2) throw new Error(`${where}: the phrase at ${lineAt(raw, open)} needs exactly one "|" between its work and play versions`);
      const [work, play] = sides.map((side) => squash(side).trim());
      if (!work || !play) throw new Error(`${where}: the phrase at ${lineAt(raw, open)} needs text on both sides of "|"`);
      if (text) parts.push(squash(text));
      parts.push({ work, play });
      text = "";
      open = -1;
    } else if (open < 0) {
      text += ch;
    }
  }
  if (open >= 0) throw new Error(`${where}: "{" at ${lineAt(raw, open)} is never closed`);
  if (text) parts.push(squash(text));

  if (typeof parts[0] === "string") parts[0] = parts[0].trimStart();
  const last = parts.length - 1;
  if (typeof parts[last] === "string") parts[last] = parts[last].trimEnd();
  const kept = parts.filter((part) => part !== "");
  if (!kept.some((part) => typeof part !== "string")) throw new Error(`${where}: needs at least one {work | play} phrase`);
  return kept;
}
