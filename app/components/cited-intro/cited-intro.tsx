"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from "react";
import { createHoverIntent } from "app/lib/hover-intent";
import { anchorFor, layoutNotes, type NoteMeasure } from "app/lib/note-layout";
import { citedPhraseFollows, firstLine, lastLine, threadPath, type Box } from "app/lib/thread-path";
import { CitationContext, type CitationApi } from "./context";
import "./cited-intro.css";

const STACKED = "(max-width: 899px)";
const REDUCED = "(prefers-reduced-motion: reduce)";

function boxIn(rect: DOMRect, origin: DOMRect): Box {
  return { left: rect.left - origin.left, top: rect.top - origin.top, right: rect.right - origin.left, bottom: rect.bottom - origin.top };
}

function linesOf(el: Element | null | undefined, origin: DOMRect): Box[] {
  return el ? Array.from(el.getClientRects(), (rect) => boxIn(rect, origin)) : [];
}

export function CitedIntro({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const thread = useRef<SVGPathElement>(null);
  const dot = useRef<SVGCircleElement>(null);
  const claims = useRef(new Map<number, HTMLElement>());
  const notes = useRef(new Map<number, HTMLElement>());
  const drawnFor = useRef<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [stacked, setStacked] = useState(false);
  const activeRef = useRef<number | null>(null);
  activeRef.current = active;

  const intent = useMemo(
    () =>
      createHoverIntent<number>({
        open: (n) => setActive(n),
        // Keyboard focus inside the intro keeps a note open after the pointer leaves.
        close: () => { if (!root.current?.contains(document.activeElement)) setActive(null); },
        isOpen: () => activeRef.current !== null,
      }),
    [],
  );
  useEffect(() => () => intent.dispose(), [intent]);

  useEffect(() => {
    const query = window.matchMedia(STACKED);
    const update = () => setStacked(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  function hideThread() {
    drawnFor.current = null;
    for (const el of [thread.current, dot.current]) {
      if (!el) continue;
      el.style.transition = "opacity 160ms linear";
      el.style.opacity = "0";
    }
  }

  function drawThread(n: number, noteTop: number, origin: DOMRect) {
    const line = thread.current;
    const end = dot.current;
    const claim = claims.current.get(n);
    const note = notes.current.get(n);
    const phrase = claim?.querySelector(".claim-phrase");
    const marker = claim?.querySelector(".claim-marker");
    if (!line || !end || !note || !phrase || !marker) return;
    const phraseLines = linesOf(phrase, origin);
    if (phraseLines.length === 0) return;
    const last = lastLine(phraseLines);
    const others: Box[] = [];
    claims.current.forEach((other, m) => { if (m !== n) others.push(...linesOf(other.querySelector(".claim-phrase"), origin)); });
    const target = { x: note.getBoundingClientRect().left - origin.left - 8, y: noteTop + 10 };

    line.setAttribute("d", threadPath({ phrase: last, marker: boxIn(marker.getBoundingClientRect(), origin), target, above: citedPhraseFollows(last, others) }));
    end.setAttribute("cx", String(target.x));
    end.setAttribute("cy", String(target.y));
    const length = line.getTotalLength();
    line.style.strokeDasharray = String(length);

    // Re-layouts (resize, fonts) update the path in place; only a newly opened claim draws.
    if (drawnFor.current === n) return;
    drawnFor.current = n;
    const reduced = window.matchMedia(REDUCED).matches;
    line.style.transition = "none";
    end.style.transition = "none";
    line.style.strokeDashoffset = reduced ? "0" : String(length);
    line.style.opacity = reduced ? "0" : "1";
    end.style.opacity = "0";
    end.style.transform = reduced ? "scale(1)" : "scale(0)";
    void line.getBoundingClientRect();
    if (reduced) {
      line.style.transition = "opacity 150ms linear";
      end.style.transition = "opacity 150ms linear";
      line.style.opacity = "1";
      end.style.opacity = "1";
      return;
    }
    line.style.transition = "stroke-dashoffset 560ms var(--ease-in-out) 140ms";
    line.style.strokeDashoffset = "0";
    end.style.transition = "opacity 120ms linear 640ms, transform 240ms var(--spring) 640ms";
    end.style.opacity = "1";
    end.style.transform = "scale(1)";
  }

  function layout() {
    const el = root.current;
    if (!el) return;
    if (stacked) {
      notes.current.forEach((note) => { note.style.transform = ""; });
      el.style.removeProperty("--notes-height");
      hideThread();
      return;
    }
    const origin = el.getBoundingClientRect();
    const measures: NoteMeasure[] = [];
    notes.current.forEach((note, n) => {
      const lines = linesOf(claims.current.get(n)?.querySelector(".claim-phrase"), origin);
      const collapsed = note.querySelector<HTMLElement>(".note-head")?.offsetHeight ?? 0;
      const evidence = note.querySelector<HTMLElement>(".note-inner")?.scrollHeight ?? 0;
      measures.push({ n, anchor: lines.length ? anchorFor(firstLine(lines)) : 0, collapsed, expanded: collapsed + evidence });
    });
    const { tops, height } = layoutNotes(measures, activeRef.current);
    tops.forEach((top, n) => {
      const note = notes.current.get(n);
      if (note) note.style.transform = `translateY(${top}px)`;
    });
    el.style.setProperty("--notes-height", `${height}px`);
    const n = activeRef.current;
    if (n === null) hideThread();
    else drawThread(n, tops.get(n) ?? 0, origin);
  }
  const layoutRef = useRef(layout);
  layoutRef.current = layout;

  useLayoutEffect(() => { layoutRef.current(); }, [active, stacked]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new ResizeObserver(() => layoutRef.current());
    observer.observe(el);
    notes.current.forEach((note) => observer.observe(note));
    document.fonts?.ready.then(() => layoutRef.current());
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!stacked || active === null) return;
    // Wait for the note body to finish expanding, or "nearest" measures the collapsed note and never scrolls.
    const reduced = window.matchMedia(REDUCED).matches;
    const timer = window.setTimeout(
      () => notes.current.get(active)?.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" }),
      reduced ? 0 : 480,
    );
    return () => window.clearTimeout(timer);
  }, [active, stacked]);

  const forceClose = () => {
    intent.dispose();
    setActive(null);
  };

  const api = useMemo<CitationApi>(
    () => ({
      active,
      enter: (n) => intent.enter(n),
      leave: () => intent.leave(),
      // Open on keyboard focus only; a mouse click focuses the claim too, and press() handles that.
      focus: (n, el) => { if (el.matches(":focus-visible")) intent.now(n); },
      // Mouse clicks pin the note open; taps toggle it.
      press: (n, pointerType) => {
        if (pointerType === "mouse" || activeRef.current !== n) intent.now(n);
        else forceClose();
      },
      key: (n) => { if (activeRef.current === n) forceClose(); else intent.now(n); },
      registerClaim: (n, el) => { if (el) claims.current.set(n, el); else claims.current.delete(n); },
      registerNote: (n, el) => { if (el) notes.current.set(n, el); else notes.current.delete(n); },
    }),
    [active, intent],
  );

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && activeRef.current !== null) {
      forceClose();
      return;
    }
    const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    const current = (event.target as HTMLElement).closest<HTMLElement>(".claim");
    if (!step || !current) return;
    event.preventDefault();
    const order = [...claims.current.keys()].sort((a, b) => a - b);
    const next = order[(order.indexOf(Number(current.dataset.n)) + step + order.length) % order.length];
    claims.current.get(next)?.focus();
  }

  function onBlur(event: FocusEvent<HTMLDivElement>) {
    if (!root.current?.contains(event.relatedTarget as Node | null)) intent.leave();
  }

  return (
    <CitationContext.Provider value={api}>
      <div ref={root} className={active === null ? "cited" : "cited has-open"} onKeyDown={onKeyDown} onBlur={onBlur}>
        {children}
        <svg className="cited-thread" aria-hidden="true" focusable="false">
          <path ref={thread} />
          <circle ref={dot} r={2.75} cx={0} cy={0} />
        </svg>
      </div>
    </CitationContext.Provider>
  );
}
