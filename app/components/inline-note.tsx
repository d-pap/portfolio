"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import "./inline-note.css";

const OPEN_NOTE_EVENT = "portfolio:inline-note-open";
const HOVER_INTENT_DELAY = 220;
type Point = { x: number; y: number };
let activeHoverNote: { id: string; protects: (point: Point) => boolean } | null = null;

// The convex hull joins a small departure area to the destination rectangle.
// Unlike a delay, this protects slow and diagonal travel for its entire path.
function inSafeCorridor(point: Point, origin: Point, destination: DOMRect) {
  const buffer = 10;
  const points = [
    { x: origin.x - buffer, y: origin.y - buffer },
    { x: origin.x + buffer, y: origin.y - buffer },
    { x: origin.x - buffer, y: origin.y + buffer },
    { x: origin.x + buffer, y: origin.y + buffer },
    { x: destination.left - buffer, y: destination.top - buffer },
    { x: destination.right + buffer, y: destination.top - buffer },
    { x: destination.left - buffer, y: destination.bottom + buffer },
    { x: destination.right + buffer, y: destination.bottom + buffer },
  ].sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (a: Point, b: Point, c: Point) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const halfHull = (vertices: Point[]) => {
    const hull: Point[] = [];
    for (const vertex of vertices) {
      while (hull.length > 1 && cross(hull[hull.length - 2], hull[hull.length - 1], vertex) <= 0) hull.pop();
      hull.push(vertex);
    }
    return hull.slice(0, -1);
  };
  const hull = [...halfHull(points), ...halfHull([...points].reverse())];
  return hull.every((vertex, index) => cross(vertex, hull[(index + 1) % hull.length], point) >= 0);
}

interface InlineNoteProps {
  label: string;
  children: ReactNode;
  id?: string;
}

export function InlineNote({ label, children, id }: InlineNoteProps) {
  const generatedId = useId();
  const panelId = id ?? `inline-note-${generatedId}`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoveringTrigger = useRef(false);
  const lastTriggerPoint = useRef<Point | null>(null);
  const lastPanelPoint = useRef<Point | null>(null);
  const transit = useRef<{ origin: Point; destination: "panel" | "trigger" } | null>(null);
  const pinned = useRef(false);
  const suppressFocus = useRef(false);
  const suppressHover = useRef(false);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState({ left: 0, top: 0, maxHeight: 0, ready: false, above: false });

  function cancelExit() {
    if (exitTimer.current) clearTimeout(exitTimer.current);
    exitTimer.current = null;
  }

  function cancelHover() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  }

  function protects(point: Point) {
    const trip = transit.current;
    if (!trip) return false;
    const destination = trip.destination === "panel" ? panelRef.current : triggerRef.current;
    return !!destination && inSafeCorridor(point, trip.origin, destination.getBoundingClientRect());
  }

  function reveal() {
    cancelExit();
    cancelHover();
    transit.current = null;
    activeHoverNote = { id: panelId, protects };
    document.dispatchEvent(new CustomEvent(OPEN_NOTE_EVENT, { detail: panelId }));
    setOpen(true);
  }

  function dismiss(restoreFocus = false) {
    cancelExit();
    cancelHover();
    transit.current = null;
    if (activeHoverNote?.id === panelId) activeHoverNote = null;
    pinned.current = false;
    setOpen(false);
    if (restoreFocus && panelRef.current?.contains(document.activeElement)) {
      suppressFocus.current = true;
      triggerRef.current?.focus({ preventScroll: true });
      suppressFocus.current = false;
    }
  }

  function scheduleExit() {
    if (exitTimer.current || pinned.current) return;
    exitTimer.current = setTimeout(() => {
      exitTimer.current = null;
      if (!panelRef.current?.contains(document.activeElement) && document.activeElement !== triggerRef.current) dismiss();
    }, 120);
  }

  function requestHover(point: Point) {
    if (suppressHover.current) return;
    if (activeHoverNote?.id === panelId) {
      cancelExit();
      cancelHover();
      return;
    }
    cancelHover();
    if (activeHoverNote?.protects(point)) {
      // A neighboring trigger must not steal an active note during transit.
      // Resting on it deliberately still switches notes, without another click.
      hoverTimer.current = setTimeout(() => {
        hoverTimer.current = null;
        if (hoveringTrigger.current && !suppressHover.current) reveal();
      }, HOVER_INTENT_DELAY);
    } else reveal();
  }

  function beginTransit(point: Point, destination: "panel" | "trigger") {
    if (activeHoverNote?.id !== panelId) return;
    const origin = (destination === "panel" ? lastTriggerPoint.current : lastPanelPoint.current) ?? point;
    transit.current = { origin, destination };
    if (protects(point)) cancelExit();
    else {
      transit.current = null;
      scheduleExit();
    }
  }

  function handleBlur(event: React.FocusEvent) {
    const next = event.relatedTarget as Node | null;
    if (next && (triggerRef.current?.contains(next) || panelRef.current?.contains(next))) return;
    dismiss();
  }

  useEffect(() => {
    function otherNoteOpened(event: Event) {
      if ((event as CustomEvent<string>).detail !== panelId) dismiss();
    }
    function cancelPendingHover(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      cancelHover();
      if (hoveringTrigger.current) suppressHover.current = true;
    }
    document.addEventListener(OPEN_NOTE_EVENT, otherNoteOpened);
    document.addEventListener("keydown", cancelPendingHover);
    return () => {
      cancelExit();
      cancelHover();
      if (activeHoverNote?.id === panelId) activeHoverNote = null;
      document.removeEventListener(OPEN_NOTE_EVENT, otherNoteOpened);
      document.removeEventListener("keydown", cancelPendingHover);
    };
  }, [panelId]);

  useLayoutEffect(() => {
    if (!open) return;
    function position() {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      if (!trigger || !panel) return;
      const anchor = trigger.getBoundingClientRect();
      const bounds = panel.getBoundingClientRect();
      const gutter = 16;
      const gap = 12;
      const viewportHeight = window.innerHeight;
      const paragraph = trigger.closest("p")?.getBoundingClientRect();
      // Clear the whole paragraph so a note cannot block its neighboring triggers.
      const verticalAnchor = paragraph && paragraph.height < viewportHeight * 0.6 ? paragraph : anchor;
      if (anchor.bottom < gutter || anchor.top > viewportHeight - gutter) {
        dismiss();
        return;
      }
      // Constrain the panel on its chosen side, so it never covers its trigger.
      const desiredHeight = Math.min(panel.scrollHeight + 2, viewportHeight - gutter * 2);
      const spaceBelow = Math.max(0, viewportHeight - verticalAnchor.bottom - gap - gutter);
      const spaceAbove = Math.max(0, verticalAnchor.top - gap - gutter);
      const above = spaceBelow < desiredHeight && spaceAbove > spaceBelow;
      const maxHeight = above ? spaceAbove : spaceBelow;
      const height = Math.min(desiredHeight, maxHeight);
      setPlacement({
        left: Math.max(gutter, Math.min(anchor.left - 14, window.innerWidth - bounds.width - gutter)),
        top: above ? verticalAnchor.top - height - gap : verticalAnchor.bottom + gap,
        maxHeight,
        ready: true,
        above,
      });
    }
    position();
    const observer = new ResizeObserver(position);
    if (panelRef.current) observer.observe(panelRef.current);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !panelRef.current?.contains(target)) dismiss();
    }
    function pointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) {
        cancelExit();
        transit.current = null;
      } else if (protects({ x: event.clientX, y: event.clientY })) cancelExit();
      else {
        transit.current = null;
        scheduleExit();
      }
    }
    function leaveWindow(event: PointerEvent) {
      if (!event.relatedTarget) {
        transit.current = null;
        scheduleExit();
      }
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        suppressHover.current = true;
        dismiss(true);
      }
    }
    document.addEventListener("pointermove", pointerMove);
    document.addEventListener("pointerout", leaveWindow);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointermove", pointerMove);
      document.removeEventListener("pointerout", leaveWindow);
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <span className="inline-note">
      <button
        ref={triggerRef}
        type="button"
        className="inline-note-trigger"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-describedby={open ? panelId : undefined}
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse" || suppressHover.current) return;
          hoveringTrigger.current = true;
          lastTriggerPoint.current = { x: event.clientX, y: event.clientY };
          requestHover({ x: event.clientX, y: event.clientY });
        }}
        onPointerMove={(event) => {
          if (event.pointerType === "mouse") {
            lastTriggerPoint.current = { x: event.clientX, y: event.clientY };
            requestHover(lastTriggerPoint.current);
          }
        }}
        onPointerLeave={(event) => {
          hoveringTrigger.current = false;
          suppressHover.current = false;
          cancelHover();
          if (event.pointerType === "mouse") beginTransit({ x: event.clientX, y: event.clientY }, "panel");
        }}
        onFocus={() => {
          if (!suppressFocus.current) reveal();
        }}
        onBlur={handleBlur}
        onClick={() => {
          if (pinned.current) dismiss();
          else {
            suppressHover.current = false;
            pinned.current = true;
            reveal();
          }
        }}
      >
        {label}
      </button>
      {open && createPortal(
        <div
          id={panelId}
          ref={panelRef}
          className="inline-note-panel"
          role="region"
          aria-label={label}
          data-placement={placement.above ? "above" : "below"}
          style={{ left: placement.left, top: placement.top, maxHeight: placement.ready ? placement.maxHeight : undefined, visibility: placement.ready ? "visible" : "hidden" }}
          onPointerEnter={(event) => {
            lastPanelPoint.current = { x: event.clientX, y: event.clientY };
            transit.current = null;
            cancelExit();
          }}
          onPointerMove={(event) => {
            lastPanelPoint.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") beginTransit({ x: event.clientX, y: event.clientY }, "trigger");
          }}
          onBlur={handleBlur}
        >
          {children}
        </div>,
        document.body,
      )}
    </span>
  );
}
