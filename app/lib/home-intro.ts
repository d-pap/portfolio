/** Every <Claim n={k}> in the intro needs exactly one <Note n={k}>, and the reverse. */
export function checkIntroPairs(source: string, where = "content/home.mdx"): number[] {
  const numbers = (pattern: RegExp) => Array.from(source.matchAll(pattern), (match) => Number(match[1]));
  const claims = numbers(/<Claim\s+n=\{(\d+)\}/g);
  const notes = numbers(/<Note\s+n=\{(\d+)\}/g);
  const duplicate = (list: number[]) => list.find((n, i) => list.indexOf(n) !== i);

  if (claims.length === 0) throw new Error(`${where}: no <Claim> found`);
  const twiceClaim = duplicate(claims);
  if (twiceClaim !== undefined) throw new Error(`${where}: claim ${twiceClaim} appears twice`);
  const twiceNote = duplicate(notes);
  if (twiceNote !== undefined) throw new Error(`${where}: note ${twiceNote} appears twice`);
  const lonelyClaim = claims.find((n) => !notes.includes(n));
  if (lonelyClaim !== undefined) throw new Error(`${where}: claim ${lonelyClaim} has no <Note n={${lonelyClaim}}>`);
  const lonelyNote = notes.find((n) => !claims.includes(n));
  if (lonelyNote !== undefined) throw new Error(`${where}: note ${lonelyNote} has no matching <Claim>`);
  return [...claims].sort((a, b) => a - b);
}
