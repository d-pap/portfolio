/** The visible characters of a text in reading order: whitespace is skipped, punctuation kept. */
export function letters(text: string): string[] {
  return [...text].filter((ch) => !/\s/.test(ch));
}

/** Index pairs [i, j] where a[i] === b[j], forming a longest common subsequence. */
function lcs(a: string[], b: string[]): [number, number][] {
  const rows = Array.from({ length: a.length + 1 }, () => new Uint16Array(b.length + 1));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      rows[i][j] = a[i] === b[j] ? rows[i + 1][j + 1] + 1 : Math.max(rows[i + 1][j], rows[i][j + 1]);
    }
  }
  const pairs: [number, number][] = [];
  for (let i = 0, j = 0; i < a.length && j < b.length; ) {
    if (a[i] === b[j]) pairs.push([i++, j++]);
    else if (rows[i + 1][j] >= rows[i][j + 1]) i++;
    else j++;
  }
  return pairs;
}

/**
 * Pairs of letter indices (see `letters`) that carry over from one version of a text to the other.
 * Both versions come as the same sequence of parts (the fixed text and each phrase). Unchanged parts
 * stay pinned letter for letter; a changed part only matches against its own other version, so
 * letters never jump between phrases or out of the fixed text.
 */
export function matchLetters(before: string[], after: string[]): [number, number][] {
  if (before.length !== after.length) throw new Error("matchLetters: both versions need the same number of parts");
  const pairs: [number, number][] = [];
  let offsetBefore = 0;
  let offsetAfter = 0;
  before.forEach((part, k) => {
    const local = part === after[k] ? letters(part).map((_, i): [number, number] => [i, i]) : matchPart(part, after[k]);
    for (const [i, j] of local) pairs.push([offsetBefore + i, offsetAfter + j]);
    offsetBefore += letters(part).length;
    offsetAfter += letters(after[k]).length;
  });
  return pairs;
}

/**
 * Letter pairs within one changed part. Shared words anchor the match. Between two anchors, letters
 * pair up locally, so a kept letter never travels past a word both versions share.
 */
function matchPart(before: string, after: string): [number, number][] {
  const words = (text: string) => {
    let first = 0;
    return text.split(/\s+/).filter(Boolean).map((word) => {
      const chars = [...word];
      const entry = { word, chars, first };
      first += chars.length;
      return entry;
    });
  };
  const from = words(before);
  const to = words(after);
  const anchors: [number, number][] = [[-1, -1], ...lcs(from.map((w) => w.word), to.map((w) => w.word)), [from.length, to.length]];

  const pairs: [number, number][] = [];
  for (let k = 0; k < anchors.length - 1; k++) {
    const [a, b] = anchors[k];
    const [nextA, nextB] = anchors[k + 1];
    if (a >= 0) from[a].chars.forEach((_, c) => pairs.push([from[a].first + c, to[b].first + c]));
    const gapFrom = from.slice(a + 1, nextA).flatMap((w) => w.chars.map((ch, c) => ({ ch, at: w.first + c })));
    const gapTo = to.slice(b + 1, nextB).flatMap((w) => w.chars.map((ch, c) => ({ ch, at: w.first + c })));
    for (const [i, j] of lcs(gapFrom.map((l) => l.ch), gapTo.map((l) => l.ch))) pairs.push([gapFrom[i].at, gapTo[j].at]);
  }
  return pairs;
}

/**
 * A CSS `linear()` easing that follows a spring released from rest and settled by the end of the
 * animation. A damping ratio below 1 overshoots slightly before settling; 0.78 overshoots about 2%.
 */
export function springEasing(dampingRatio: number, samples = 48): string {
  if (!(dampingRatio > 0 && dampingRatio < 1)) throw new Error("springEasing: dampingRatio must be between 0 and 1");
  const decay = Math.log(1000); // the swing has shrunk to 0.1% by the end
  const omega = decay / dampingRatio;
  const damped = omega * Math.sqrt(1 - dampingRatio ** 2);
  const at = (t: number) => 1 - Math.exp(-decay * t) * (Math.cos(damped * t) + (decay / damped) * Math.sin(damped * t));
  const points = Array.from({ length: samples + 1 }, (_, i) => (i === samples ? 1 : Number(at(i / samples).toFixed(4))));
  return `linear(${points.join(", ")})`;
}
