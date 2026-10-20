import { test } from "node:test";
import assert from "node:assert/strict";
import { AsciiFluid } from "./ascii-fluid.ts";

function samples(field: AsciiFluid) {
  const result: number[] = [];
  for (let y = 0; y < 300; y += 15)
    for (let x = 0; x < 400; x += 15) result.push(field.density(x, y));
  return result;
}

test("a stationary pointer adds no disturbance to ambient flow", () => {
  const idle = new AsciiFluid(400, 300), pointer = new AsciiFluid(400, 300);
  for (let i = 0; i < 60; i++) {
    pointer.drag(200, 150, 200, 150, 1 / 60);
    idle.step(1 / 60);
    pointer.step(1 / 60);
  }
  assert.deepEqual(samples(pointer), samples(idle));
});

test("opposite strokes transport the field differently", () => {
  const right = new AsciiFluid(400, 300), left = new AsciiFluid(400, 300);
  right.drag(100, 150, 300, 150, 0.1);
  left.drag(300, 150, 100, 150, 0.1);
  for (let i = 0; i < 30; i++) { right.step(1 / 60); left.step(1 / 60); }
  const a = samples(right), b = samples(left);
  assert.ok(a.reduce((sum, value, i) => sum + Math.abs(value - b[i]), 0) > 0.5);
});

test("rapid edge-to-edge strokes and delayed frames keep pigment finite and bounded", () => {
  const fluid = new AsciiFluid(400, 300);
  for (let i = 0; i < 90; i++) {
    fluid.drag(i % 2 ? 0 : 400, 0, i % 2 ? 400 : 0, 300, 0.001);
    fluid.step(i % 10 === 0 ? 3 : 1 / 60);
  }
  for (const value of samples(fluid)) assert.ok(Number.isFinite(value) && value >= 0 && value <= 1);
});
