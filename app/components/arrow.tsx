export function Arrow({ diagonal = true }: { diagonal?: boolean }) {
  return <svg className="link-arrow" width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d={diagonal ? "M4 12 12 4M4 4h8v8" : "M3 8h10M8 3l5 5-5 5"} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
