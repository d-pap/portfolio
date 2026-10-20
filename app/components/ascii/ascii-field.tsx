"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AsciiFluid } from "app/lib/ascii-fluid";
import { useMotion } from "./motion";

const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** Character density reveals pigment carried through a small fluid simulation. */
export function AsciiField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { paused } = useMotion();
  const pathname = usePathname();
  const home = pathname === "/";
  const enabled = home || pathname.startsWith("/work/");

  useEffect(() => {
    if (!enabled || !canvas.current) return;
    const element = canvas.current;
    const ctx = element.getContext("2d", { alpha: true });
    if (!ctx) return;
    let width = 0, height = 0, cell = 5.4, line = 9, fontSize = 9;
    let frame = 0, scrollFrame = 0, last = 0;
    let fluid: AsciiFluid;
    let previous: { x: number; y: number; at: number } | null = null;
    let current: { x: number; y: number; at: number } | null = null;
    const ramp = " .,:~=/+&%#@0";

    const updateOpacity = () => {
      scrollFrame = 0;
      const projects = home ? document.getElementById("projects") : null;
      const remaining = projects
        ? clamp((projects.getBoundingClientRect().top - 105) / Math.max(1, height - 105))
        : 0;
      const eased = remaining * remaining * (3 - 2 * remaining);
      element.style.opacity = String(0.14 + eased * 0.64);
    };
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateOpacity);
      previous = current = null;
    };
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = "#888";
      ctx.textBaseline = "top";
      const columns = Math.ceil(width / cell), rows = Math.ceil(height / line);
      for (let row = 0; row < rows; row++) {
        let text = "";
        for (let col = 0; col < columns; col++) {
          const value = clamp((fluid.density(col * cell, row * line) - 0.08) / 0.84);
          text += ramp[Math.min(ramp.length - 1, Math.floor(value * ramp.length))];
        }
        ctx.fillText(text, 0, row * line);
      }
    };
    const resize = () => {
      width = document.documentElement.clientWidth;
      height = window.innerHeight;
      fontSize = width < 600 ? 8.5 : Math.max(9, width / 170);
      line = fontSize;
      ctx.font = `${fontSize}px monospace`;
      cell = ctx.measureText("M").width;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      element.width = Math.round(width * ratio);
      element.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      fluid = new AsciiFluid(width, height);
      previous = current = null;
      updateOpacity();
      draw();
    };
    const tick = (now: number) => {
      if (document.hidden || paused) return;
      if (!last || now - last >= 15) {
        const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
        last = now;
        if (previous && current && current.at !== previous.at) {
          const inputDt = (current.at - previous.at) / 1000;
          if (inputDt < 0.15) fluid.drag(previous.x, previous.y, current.x, current.y, inputDt);
          previous = current;
        }
        fluid.step(dt);
        draw();
      }
      frame = requestAnimationFrame(tick);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      last = 0;
      previous = current = null;
      if (!document.hidden && !paused) frame = requestAnimationFrame(tick);
    };
    const move = (event: PointerEvent) => {
      // Leave text selection, dialogs and touch scrolling alone.
      if (event.pointerType !== "mouse" || paused || document.querySelector(".info-panel:popover-open")) return;
      current = { x: event.clientX, y: event.clientY, at: performance.now() };
      if (!previous || current.at - previous.at > 150) previous = current;
    };
    const leave = () => { previous = current = null; };
    resize();
    schedule();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", schedule);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(scrollFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [enabled, home, paused]);

  return enabled ? <canvas ref={canvas} className="ascii-field" aria-hidden="true" /> : null;
}
