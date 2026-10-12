"use client";

import { useLayoutEffect, useRef, useState, type MouseEvent } from "react";

/**
 * Most people would rather paste the address than have a mail app open, so a plain click copies it and the text rolls
 * to "copied" and back. Modified and non-primary clicks keep the mailto link, and a blocked clipboard falls back to it.
 */
export function CopyEmail({ href, address }: { href: string; address: string }) {
  const [copied, setCopied] = useState(false);
  const roll = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | undefined>(undefined);

  // The box's width follows whichever word is showing, so the underline grows and shrinks with it.
  useLayoutEffect(() => {
    const box = roll.current;
    if (!box) return;
    const [email, done] = Array.from(box.children) as HTMLElement[];
    box.style.width = `${(copied ? done : email).scrollWidth}px`;
  }, [copied]);

  useLayoutEffect(() => () => window.clearTimeout(timer.current), []);

  async function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      window.location.href = href;
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <a className={copied ? "back-email copy-email is-copied" : "back-email copy-email"} href={href} onClick={onClick}>
      <span ref={roll} className="copy-roll">
        <span className="copy-address">{address}</span>
        <span className="copy-done" aria-hidden="true">copied</span>
      </span>
    </a>
  );
}
