import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("./ending.js", import.meta.url), "utf8");

/** Run the real boot script with a clock and scroll surface we can control. Browser checks cover actual gesture delivery. */
function browser(seen = false) {
  const listeners = new Map<string, Function[]>();
  const timers = new Map<number, { at: number; fn: Function }>();
  let now = 0, serial = 0;
  class Element { closest() { return null; } }
  const target = new Element();
  const root = { dataset: {} as Record<string, string>, scrollHeight: 2300 };
  const personal = { inert: false, querySelector: () => ({}) };
  const button = { addEventListener: (type: string, fn: Function) => listeners.set(`button:${type}`, [fn]) };
  const bump = { querySelector: () => button };
  const storage = new Map(seen ? [["after-hours-seen", "1"]] : []);
  const env = {
    scrollY: 0, innerHeight: 900, Element,
    location: { pathname: "/", hash: "" },
    performance: { now: () => now },
    sessionStorage: { getItem: (k: string) => storage.get(k), setItem: (k: string, v: string) => storage.set(k, v) },
    document: {
      readyState: "complete", documentElement: root, prerendering: false,
      getElementById: (id: string) => id === "ending" ? bump : personal,
      querySelector: () => ({ getBoundingClientRect: () => ({ top: 1888 - env.scrollY }) }),
    },
    getComputedStyle: () => ({ getPropertyValue: () => "12" }),
    addEventListener: (type: string, fn: Function) => listeners.set(type, [...(listeners.get(type) ?? []), fn]),
    scrollTo: ({ top }: { top: number }) => { env.scrollY = top; },
    scrollBy: ({ top }: { top: number }) => { env.scrollY += top; },
    setTimeout: (fn: Function, delay: number) => { const id = ++serial; timers.set(id, { fn, at: now + delay }); return id; },
    clearTimeout: (id: number) => timers.delete(id),
    requestAnimationFrame: (fn: Function) => { const id = ++serial; timers.set(id, { fn, at: now + 16 }); return id; },
    cancelAnimationFrame: (id: number) => timers.delete(id),
  };
  const context = vm.createContext({ ...env, window: {} });
  // Scroll position must remain live when the script reads the global value.
  Object.defineProperty(context, "scrollY", { get: () => env.scrollY });
  vm.runInContext(source, context);
  function fire(type: string, data = {}) {
    const event = { target, cancelable: true, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...data };
    for (const fn of listeners.get(type) ?? []) fn(event);
    return event;
  }
  function wait(ms: number) {
    const end = now + ms;
    while (true) {
      const next = [...timers].filter(([, timer]) => timer.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      timers.delete(next[0]); now = next[1].at; next[1].fn(now);
    }
    now = end;
  }
  const wheel = (dy: number, extra = {}) => fire("wheel", { deltaY: dy, deltaX: 0, deltaMode: 0, ...extra });
  return { env, root, personal, storage, fire, wait, wheel };
}

test("arrival and its inertia hold the first card; each fresh wheel gesture advances once", () => {
  const b = browser();
  assert.equal(b.personal.inert, true);
  b.wheel(1200);
  assert.equal(b.env.scrollY, 1000);
  assert.equal(b.root.dataset.bumpStep, "0");
  for (let i = 0; i < 10; i++) { b.wait(30); b.wheel(80); }
  assert.equal(b.root.dataset.bumpStep, "0");
  b.wait(250); b.wheel(10); b.wheel(14);
  assert.equal(b.root.dataset.bumpStep, "1");
  b.wheel(100);
  assert.equal(b.root.dataset.bumpStep, "1");
  b.wait(250); b.wheel(80);
  assert.equal(b.root.dataset.bumpStep, "2");
  b.wait(949);
  assert.equal(b.root.dataset.ending, "holding");
  b.wait(900);
  assert.equal(b.root.dataset.ending, "done");
  assert.equal(b.personal.inert, false);
  assert.equal(b.env.scrollY, 1400);
  assert.equal(b.storage.get("after-hours-seen"), "1");
});

test("scrolling up releases the gate and cancels a pending final reveal", () => {
  const b = browser();
  b.wheel(1200); b.wait(250); b.wheel(100); b.wait(250); b.wheel(100);
  b.wheel(-100); b.wait(2000);
  assert.equal(b.env.scrollY, 900);
  assert.equal(b.root.dataset.ending, "waiting");
  assert.equal(b.root.dataset.bumpStep, "0");
  assert.equal(b.storage.size, 0);
});

test("a restored home stays unlocked and keeps its scroll position", () => {
  const b = browser(true);
  b.env.scrollY = 1400;
  b.fire("pageshow"); b.fire("scroll");
  assert.equal(b.env.scrollY, 1400);
  assert.equal(b.root.dataset.ending, "done");
  assert.equal(b.root.dataset.bumpStep, "2");
  assert.equal(b.personal.inert, false);
  assert.equal(b.wheel(50).defaultPrevented, false);
});

test("End arrives at the first card, held keys do not skip cards, Home releases the gate", () => {
  const b = browser();
  b.fire("keydown", { key: "End" });
  b.fire("keydown", { key: "End", repeat: true });
  assert.equal(b.root.dataset.bumpStep, "0");
  b.fire("keydown", { key: "PageDown" });
  assert.equal(b.root.dataset.bumpStep, "1");
  b.fire("keydown", { key: "Home" });
  assert.equal(b.env.scrollY, 0);
  assert.equal(b.root.dataset.ending, "waiting");
});

test("horizontal scrolling and pinch-to-zoom are left to the browser", () => {
  const b = browser();
  assert.equal(b.wheel(1200, { ctrlKey: true }).defaultPrevented, false);
  assert.equal(b.wheel(1200, { deltaX: 1300 }).defaultPrevented, false);
  assert.equal(b.env.scrollY, 0);
});

test("one touch swipe advances one card even with many move events", () => {
  const b = browser();
  b.wheel(1200);
  b.fire("touchstart", { touches: [{ clientY: 600 }] });
  for (const clientY of [570, 540, 510, 480]) b.fire("touchmove", { touches: [{ clientY }] });
  assert.equal(b.root.dataset.bumpStep, "1");
  b.fire("touchend");
  b.fire("touchstart", { touches: [{ clientY: 400 }] });
  b.fire("touchmove", { touches: [{ clientY: 450 }] });
  assert.equal(b.root.dataset.ending, "waiting");
  assert.equal(b.env.scrollY, 950);
});

test("click activation advances the same sequence", () => {
  const b = browser();
  b.wheel(1200);
  b.fire("button:click");
  assert.equal(b.root.dataset.bumpStep, "1");
  b.fire("button:click"); b.wait(1800);
  assert.equal(b.root.dataset.ending, "done");
});

test("an explicit link to the personal section bypasses the interlude", () => {
  const b = browser();
  b.env.location.hash = "#back";
  b.fire("hashchange");
  assert.equal(b.root.dataset.ending, "done");
  assert.equal(b.personal.inert, false);
});
