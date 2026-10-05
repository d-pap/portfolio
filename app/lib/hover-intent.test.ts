import { test } from "node:test";
import assert from "node:assert/strict";
import { createHoverIntent } from "./hover-intent.ts";

function setup() {
  const events: string[] = [];
  let open: number | null = null;
  const intent = createHoverIntent<number>({
    open: (id) => { open = id; events.push(`open ${id}`); },
    close: () => { open = null; events.push("close"); },
    isOpen: () => open !== null,
  });
  return { intent, events };
}

test("opens after 90ms, not before", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const { intent, events } = setup();
  intent.enter(1);
  t.mock.timers.tick(89);
  assert.deepEqual(events, []);
  t.mock.timers.tick(1);
  assert.deepEqual(events, ["open 1"]);
});

test("leaving before the delay cancels the open", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const { intent, events } = setup();
  intent.enter(1);
  t.mock.timers.tick(50);
  intent.leave();
  t.mock.timers.tick(500);
  assert.deepEqual(events, ["close"]);
});

test("once open, moving to another claim switches immediately", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const { intent, events } = setup();
  intent.now(1);
  intent.leave();
  intent.enter(2);
  assert.deepEqual(events, ["open 1", "open 2"]);
  t.mock.timers.tick(500);
  assert.deepEqual(events, ["open 1", "open 2"]);
});

test("closing waits 220ms and re-entering keeps it open", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const { intent, events } = setup();
  intent.now(1);
  intent.leave();
  t.mock.timers.tick(219);
  intent.enter(1);
  t.mock.timers.tick(1000);
  assert.deepEqual(events, ["open 1", "open 1"]);
  intent.leave();
  t.mock.timers.tick(220);
  assert.deepEqual(events, ["open 1", "open 1", "close"]);
});

test("shut closes now and dispose cancels pending work", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const { intent, events } = setup();
  intent.enter(1);
  intent.dispose();
  t.mock.timers.tick(500);
  assert.deepEqual(events, []);
  intent.now(2);
  intent.shut();
  assert.deepEqual(events, ["open 2", "close"]);
});
