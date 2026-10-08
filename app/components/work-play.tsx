"use client";

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import type { AboutPart, Mode } from "app/lib/about";
import { letters, matchLetters, springEasing } from "app/lib/morph";
import "./work-play.css";

type Box = { x: number; y: number; h: number };
/** Each visible letter's box, and which phrase it sits in (-1 for the text between phrases). */
type Snapshot = { text: string; boxes: Box[]; phrases: number[]; height: number };

// Each group runs as a left-to-right sweep across the letters that change: `sweep` is how long the
// sweep takes to cross them. Letters leave first, kept letters glide, and new letters land in orange,
// then settle to ink.
const LEAVE = { duration: 240, sweep: 120 };
const GLIDE = { duration: 680, sweep: 80 };
const LAND = { delay: 110, duration: 460, sweep: 200, settle: 700 };
const EASE_OUT = "cubic-bezier(.22, 1, .36, 1)";

/** The about paragraph, where clicking a `{work | play}` phrase flips it to its other version. */
export function WorkPlay({ parts }: { parts: AboutPart[] }) {
  const phraseCount = parts.filter((part) => typeof part !== "string").length;
  const [modes, setModes] = useState<Mode[]>(() => Array(phraseCount).fill("work"));
  const host = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLParagraphElement>(null);
  const before = useRef<{ snapshot: Snapshot; modes: Mode[] } | null>(null);
  const running = useRef<(() => void) | null>(null);

  // Measure the old letters while they're still on screen, then let React swap the text.
  function change(next: Mode[]) {
    if (!host.current || !text.current || next.every((mode, i) => mode === modes[i])) return;
    running.current?.();
    before.current = { snapshot: snapshot(text.current, host.current), modes };
    setModes(next);
  }

  // The new text is in the DOM but not painted yet, so the morph starts from the old positions.
  useLayoutEffect(() => {
    const from = before.current;
    if (!from || !host.current || !text.current) return;
    before.current = null;
    const changed = new Set(modes.flatMap((mode, n) => (mode === from.modes[n] ? [] : [n])));
    const versions = { from: partTexts(parts, from.modes), to: partTexts(parts, modes) };
    running.current = morph(host.current, text.current, from.snapshot, versions, changed, () => (running.current = null));
  }, [modes]);

  useEffect(() => () => running.current?.(), []);

  const flip = (n: number) => change(modes.map((mode, i) => (i === n ? (mode === "work" ? "play" : "work") : mode)));

  let phrase = 0;
  return (
    <div className="wp-text" ref={host}>
      <p ref={text}>
        {parts.map((part, k) => {
          if (typeof part === "string") return part;
          const n = phrase++;
          const mode = modes[n];
          const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            flip(n);
          };
          return (
            <span key={k} className="wp-phrase" data-phrase={n} role="button" tabIndex={0} aria-label={`${part[mode]}, switch to the ${mode === "work" ? "play" : "work"} version`} onClick={() => flip(n)} onKeyDown={onKeyDown}>
              {part[mode]}
            </span>
          );
        })}
      </p>
    </div>
  );
}

/** The text of each part, with every phrase in its given mode. */
function partTexts(parts: AboutPart[], modes: Mode[]): string[] {
  let n = 0;
  return parts.map((part) => (typeof part === "string" ? part : part[modes[n++]]));
}

/** Where each visible letter sits, relative to the host, measured with ranges so the text stays plain. */
function snapshot(p: HTMLElement, host: HTMLElement): Snapshot {
  const origin = host.getBoundingClientRect();
  const boxes: Box[] = [];
  const phrases: number[] = [];
  const range = document.createRange();
  const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
    const data = node.data;
    const phrase = node.parentElement?.closest<HTMLElement>(".wp-phrase")?.dataset.phrase;
    for (let i = 0; i < data.length; ) {
      const size = data.codePointAt(i)! > 0xffff ? 2 : 1;
      if (!/\s/.test(data[i])) {
        range.setStart(node, i);
        range.setEnd(node, i + size);
        const r = range.getBoundingClientRect();
        boxes.push({ x: r.left - origin.left, y: r.top - origin.top, h: r.height });
        phrases.push(phrase === undefined ? -1 : Number(phrase));
      }
      i += size;
    }
  }
  return { text: p.textContent ?? "", boxes, phrases, height: p.offsetHeight };
}

/**
 * Animates from the old letter positions to the new text. Every letter of a phrase that changed,
 * new or carried over, lands in orange and settles to ink, so the phrase reads as one piece.
 * Returns a function that ends the morph early.
 */
function morph(
  host: HTMLElement,
  p: HTMLElement,
  from: Snapshot,
  versions: { from: string[]; to: string[] },
  changed: Set<number>,
  done: () => void,
): () => void {
  const to = snapshot(p, host);
  const animations: Animation[] = [];
  if (from.height !== to.height) {
    animations.push(p.animate([{ height: `${from.height}px` }, { height: `${to.height}px` }], { duration: GLIDE.duration, easing: EASE_OUT }));
  }

  const oldLetters = letters(from.text);
  const newLetters = letters(to.text);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const overlay = document.createElement("div");
  overlay.className = "wp-overlay";
  overlay.setAttribute("aria-hidden", "true");

  if (reduce || oldLetters.length !== from.boxes.length || newLetters.length !== to.boxes.length) {
    animations.push(p.animate([{ opacity: 0.25 }, { opacity: 1 }], { duration: 220, easing: "ease-out" }));
  } else {
    const ink = getComputedStyle(p).color;
    const accent = getComputedStyle(host).getPropertyValue("--accent").trim();
    const glide = CSS.supports("animation-timing-function", "linear(0, 1)") ? springEasing(0.78) : EASE_OUT;
    const pairs = matchLetters(versions.from, versions.to);
    const keptOld = new Set(pairs.map(([i]) => i));
    const keptNew = new Set(pairs.map(([, j]) => j));
    const leaveAt = sweep(oldLetters.length, keptOld);
    const landAt = sweep(newLetters.length, keptNew);

    const place = (ch: string, box: Box) => {
      const el = document.createElement("span");
      el.textContent = ch;
      el.style.cssText = `left:${box.x}px;top:${box.y}px;height:${box.h}px;line-height:${box.h}px`;
      overlay.append(el);
      return el;
    };

    const total = LAND.duration + LAND.settle;
    const landed = LAND.duration / total;
    const landDelay = (j: number) => LAND.delay + landAt(j) * LAND.sweep;
    for (const [i, j] of pairs) {
      const a = from.boxes[i];
      const b = to.boxes[j];
      const el = place(newLetters[j], b);
      if (changed.has(to.phrases[j])) {
        animations.push(el.animate([
          { color: ink, easing: EASE_OUT },
          { offset: landed * 0.3, color: accent },
          { offset: landed, color: accent, easing: "ease-in-out" },
          { color: ink },
        ], { duration: total, delay: landDelay(j), fill: "both" }));
      }
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;
      const delay = landAt(j) * GLIDE.sweep;
      if (Math.abs(dy) > b.h / 2) {
        // A letter that changes lines fades across instead of flying over the paragraph.
        const dir = dy < 0 ? 1 : -1;
        animations.push(el.animate([
          { transform: `translate(${dx}px, ${dy}px)`, opacity: 1 },
          { offset: 0.4, transform: `translate(${dx + 10 * dir}px, ${dy}px)`, opacity: 0 },
          { offset: 0.4, transform: `translate(${-10 * dir}px, 0)`, opacity: 0 },
          { transform: "none", opacity: 1 },
        ], { duration: GLIDE.duration, delay, easing: "ease-in-out", fill: "backwards" }));
      } else {
        animations.push(el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: GLIDE.duration, delay, easing: glide, fill: "backwards" }));
      }
    }

    oldLetters.forEach((ch, i) => {
      if (keptOld.has(i)) return;
      animations.push(place(ch, from.boxes[i]).animate([
        { opacity: 1, transform: "none", filter: "blur(0px)" },
        { opacity: 0, transform: "translateY(-0.2em) scale(0.96)", filter: "blur(3px)" },
      ], { duration: LEAVE.duration, delay: leaveAt(i) * LEAVE.sweep, easing: "cubic-bezier(.4, 0, 1, 1)", fill: "both" }));
    });

    newLetters.forEach((ch, j) => {
      if (keptNew.has(j)) return;
      animations.push(place(ch, to.boxes[j]).animate([
        { opacity: 0, transform: "translateY(0.3em)", filter: "blur(4px)", color: accent, easing: EASE_OUT },
        { offset: landed, opacity: 1, transform: "none", filter: "blur(0px)", color: accent, easing: "ease-in-out" },
        { opacity: 1, transform: "none", filter: "blur(0px)", color: ink },
      ], { duration: total, delay: landDelay(j), fill: "both" }));
    });

    host.append(overlay);
    host.classList.add("is-morphing");
  }

  let ended = false;
  const end = () => {
    if (ended) return;
    ended = true;
    animations.forEach((animation) => animation.cancel());
    overlay.remove();
    host.classList.remove("is-morphing");
    done();
  };
  Promise.all(animations.map((animation) => animation.finished)).then(end, () => {});
  return end;
}

/** Maps a letter's index to 0–1 across the span of letters that change, so each group sweeps left to right. */
function sweep(count: number, kept: Set<number>): (i: number) => number {
  let first = -1;
  let last = -1;
  for (let i = 0; i < count; i++) {
    if (kept.has(i)) continue;
    if (first < 0) first = i;
    last = i;
  }
  return (i) => (last <= first ? 0 : Math.min(1, Math.max(0, (i - first) / (last - first))));
}
