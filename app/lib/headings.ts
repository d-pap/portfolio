/** Section ids come from "## " heading text: lowercase, runs of anything but a–z and 0–9 become "-", trimmed. */
export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export type Heading = { id: string; text: string };

/** The "## " headings of an MDX body in order, skipping fenced code. Ids match what the MDX h2 renders. */
export function listHeadings(body: string): Heading[] {
  const headings: Heading[] = [];
  let fenced = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      fenced = !fenced;
      continue;
    }
    if (fenced) continue;
    const match = /^##\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const text = match[1].replace(/[*_`]/g, "").trim();
    headings.push({ id: slugify(text), text });
  }
  return headings;
}
