export type Box = { left: number; top: number; right: number; bottom: number };

const LINE_TOLERANCE = 1;
const round = (value: number) => Math.round(value * 10) / 10;

export function firstLine(lines: readonly Box[]): Box {
  if (lines.length === 0) throw new Error("phrase has no line boxes");
  return lines.reduce((a, b) => (b.top < a.top - LINE_TOLERANCE || (Math.abs(b.top - a.top) <= LINE_TOLERANCE && b.left < a.left) ? b : a));
}

export function lastLine(lines: readonly Box[]): Box {
  if (lines.length === 0) throw new Error("phrase has no line boxes");
  return lines.reduce((a, b) => (b.top > a.top + LINE_TOLERANCE || (Math.abs(b.top - a.top) <= LINE_TOLERANCE && b.right > a.right) ? b : a));
}

/**
 * Which side of the line the thread should run on: the side whose horizontal run
 * (from the phrase end to `endX`) crosses the least claim underline. Ties go below.
 */
export function routeSide(phraseLast: Box, others: readonly Box[], endX: number, tolerance = 2): "below" | "above" {
  const height = phraseLast.bottom - phraseLast.top;
  const overlap = (box: Box) => Math.max(0, Math.min(box.right, endX) - Math.max(box.left, phraseLast.right));
  let below = 0;
  let above = 0;
  for (const box of others) {
    if (Math.abs(box.top - phraseLast.top) <= tolerance) below += overlap(box);
    else if (box.bottom <= phraseLast.top + tolerance && box.bottom >= phraseLast.top - height) above += overlap(box);
  }
  return above < below ? "above" : "below";
}

type ThreadInput = {
  phrase: Box;
  marker: Box;
  target: { x: number; y: number };
  above?: boolean;
  gutter?: number;
  radius?: number;
  drop?: number;
};

/**
 * Below (default): leaves the end of the phrase's underline and drops `drop`px into
 * the gap under the line. Above: leaves the marker and rises over the line. Either way
 * it runs to a gutter `gutter`px left of the note, turns with rounded corners, and ends
 * at `target`.
 */
export function threadPath({ phrase, marker, target, above = false, gutter = 34, radius = 9, drop = 6 }: ThreadInput): string {
  const turnX = Math.max(phrase.right, marker.right) + 3;
  const parts: string[] = [];
  let runY: number;
  if (above) {
    const startY = (marker.top + marker.bottom) / 2;
    runY = phrase.top - drop;
    parts.push(`M${round(turnX)} ${round(startY)}`, `C${round(turnX + 5)} ${round(startY)} ${round(turnX + 3)} ${round(runY)} ${round(turnX + 9)} ${round(runY)}`);
  } else {
    const startY = phrase.bottom - 0.75;
    runY = startY + drop;
    parts.push(`M${round(phrase.right)} ${round(startY)}`, `H${round(turnX)}`, `C${round(turnX + 5)} ${round(startY)} ${round(turnX + 3)} ${round(runY)} ${round(turnX + 9)} ${round(runY)}`);
  }

  const dy = target.y - runY;
  if (Math.abs(dy) < 1) {
    parts.push(`H${round(target.x)}`);
    return parts.join(" ");
  }
  const dir = Math.sign(dy);
  const r = Math.min(radius, Math.abs(dy) / 2);
  const gx = Math.max(target.x - gutter, turnX + 9 + r);
  parts.push(
    `H${round(gx - r)}`,
    `Q${round(gx)} ${round(runY)} ${round(gx)} ${round(runY + dir * r)}`,
    `V${round(target.y - dir * r)}`,
    `Q${round(gx)} ${round(target.y)} ${round(gx + r)} ${round(target.y)}`,
    `H${round(target.x)}`,
  );
  return parts.join(" ");
}
