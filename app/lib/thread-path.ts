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

/** One box per text line: rects whose tops are within `tolerance` merge, sorted top to bottom. */
export function mergeLines(rects: readonly Box[], tolerance = 2): Box[] {
  const lines: Box[] = [];
  for (const rect of [...rects].sort((a, b) => a.top - b.top)) {
    const line = lines[lines.length - 1];
    if (line && rect.top - line.top <= tolerance) {
      line.left = Math.min(line.left, rect.left);
      line.right = Math.max(line.right, rect.right);
      line.bottom = Math.max(line.bottom, rect.bottom);
    } else {
      lines.push({ ...rect });
    }
  }
  return lines;
}

/** Horizontal length of `box` inside [from, to]. */
const overlap = (box: Box, from: number, to: number) => Math.max(0, Math.min(box.right, to) - Math.max(box.left, from));

/** Whether `box` sits on the phrase's own line, on the line just above it, or elsewhere. */
function lineOf(box: Box, phraseLast: Box, tolerance: number): "same" | "previous" | null {
  if (Math.abs(box.top - phraseLast.top) <= tolerance) return "same";
  if (box.bottom <= phraseLast.top + tolerance && box.bottom >= phraseLast.top - (phraseLast.bottom - phraseLast.top)) return "previous";
  return null;
}

/**
 * Which side of the line the thread should run on: the side whose horizontal run
 * (from the phrase end to `endX`) crosses the least claim underline. Ties go below.
 */
export function routeSide(phraseLast: Box, others: readonly Box[], endX: number, tolerance = 2): "below" | "above" {
  let below = 0;
  let above = 0;
  for (const box of others) {
    const line = lineOf(box, phraseLast, tolerance);
    if (line === "same") below += overlap(box, phraseLast.right, endX);
    else if (line === "previous") above += overlap(box, phraseLast.right, endX);
  }
  return above < below ? "above" : "below";
}

export type RunChoice = { above: boolean; runY?: number };

/**
 * Where the thread's horizontal run goes:
 * below the phrase's line if no other claim sits later on that line;
 * else above it if no claim on the previous line overlaps the run;
 * else below the whole paragraph if every later line ends before the drop point (a clear vertical path);
 * else the least-crossing side (routeSide).
 */
export function chooseRun({ phrase, marker, others, lines, endX, drop = 6, tolerance = 2 }: { phrase: Box; marker: Box; others: readonly Box[]; lines: readonly Box[]; endX: number; drop?: number; tolerance?: number }): RunChoice {
  const turnX = Math.max(phrase.right, marker.right) + 3;
  const blocked = (side: "same" | "previous") => others.some((box) => lineOf(box, phrase, tolerance) === side && overlap(box, turnX, endX) > 0);
  if (!blocked("same")) return { above: false };
  if (!blocked("previous")) return { above: true };
  const dropX = turnX + 9;
  // A line is below the phrase's line when it starts under the phrase. Raised markers and padded
  // claim boxes come back as separate rects a few px off their line's top, so `top` alone can't tell.
  const later = lines.filter((line) => line.top >= phrase.bottom - tolerance);
  if (later.length > 0 && later.every((line) => line.right < dropX - 2)) return { above: false, runY: Math.max(...later.map((line) => line.bottom)) + drop };
  return { above: routeSide(phrase, others, endX, tolerance) === "above" };
}

type ThreadInput = {
  phrase: Box;
  marker: Box;
  target: { x: number; y: number };
  above?: boolean;
  /** Run height for the far route, below the whole paragraph (see chooseRun). */
  runY?: number;
  gutter?: number;
  radius?: number;
  drop?: number;
};

/**
 * Below (default): leaves the end of the phrase's underline and drops `drop`px into
 * the gap under the line. Above: leaves the marker and rises over the line. Far (`runY`
 * given): leaves the underline, drops straight down past the marker to `runY`, under the
 * paragraph. Each way it runs to a gutter `gutter`px left of the note, turns with
 * rounded corners, and ends at `target`.
 */
export function threadPath({ phrase, marker, target, above = false, runY: farY, gutter = 34, radius = 9, drop = 6 }: ThreadInput): string {
  const turnX = Math.max(phrase.right, marker.right) + 3;
  const parts: string[] = [];
  let runY: number;
  let runX = turnX + 9;
  if (farY !== undefined) {
    const startY = phrase.bottom - 0.75;
    const dropX = turnX + 9;
    runY = farY;
    runX = dropX + 9;
    parts.push(
      `M${round(phrase.right)} ${round(startY)}`,
      `H${round(turnX)}`,
      `Q${round(dropX)} ${round(startY)} ${round(dropX)} ${round(startY + 9)}`,
      `V${round(runY - 9)}`,
      `Q${round(dropX)} ${round(runY)} ${round(dropX + 9)} ${round(runY)}`,
    );
  } else if (above) {
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
  const gx = Math.max(target.x - gutter, runX + r);
  parts.push(
    `H${round(gx - r)}`,
    `Q${round(gx)} ${round(runY)} ${round(gx)} ${round(runY + dir * r)}`,
    `V${round(target.y - dir * r)}`,
    `Q${round(gx)} ${round(target.y)} ${round(gx + r)} ${round(target.y)}`,
    `H${round(target.x)}`,
  );
  return parts.join(" ");
}
