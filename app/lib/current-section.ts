export type HeadingPosition = { id: string; top: number };
export type SpyView = { line: number; height: number; atBottom: boolean; hash: string };

/**
 * The section the case page's section list marks as current: the last heading at or above `line`.
 * A short final section can never scroll up to the line, so at the bottom of the page the last heading
 * on screen counts instead, unless the heading the visitor jumped to (the URL hash) is still on screen.
 */
export function currentSection(headings: HeadingPosition[], view: SpyView): string {
  if (view.atBottom) {
    const visible = headings.filter((heading) => heading.top >= 0 && heading.top < view.height);
    const target = visible.find((heading) => `#${heading.id}` === view.hash);
    if (target) return target.id;
    if (visible.length > 0) return visible[visible.length - 1].id;
  }
  let current = "overview";
  for (const heading of headings) if (heading.top <= view.line) current = heading.id;
  return current;
}
