const clamp = (n: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));
const smooth = (n: number) => n * n * (3 - 2 * n);
const hash = (x: number, y: number) => {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
};
function noise(x: number, y: number): number {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = smooth(x - ix), fy = smooth(y - iy);
  const a = hash(ix, iy), b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
  return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
}

/**
 * Small CPU fluid grid: mouse momentum is advected, diffused and pressure-projected;
 * a passive pigment is carried by that flow. No radial wave or particle emitters.
 * Method: https://developer.nvidia.com/gpugems/gpugems/part-vi-beyond-triangles/chapter-38-fast-fluid-dynamics-simulation-gpu
 */
export class AsciiFluid {
  readonly spacing: number;
  readonly columns: number;
  readonly rows: number;
  private u: Float32Array;
  private v: Float32Array;
  private nextU: Float32Array;
  private nextV: Float32Array;
  private ink: Float32Array;
  private nextInk: Float32Array;
  private source: Float32Array;
  private pressure: Float32Array;
  private divergence: Float32Array;
  private time = 0;

  constructor(width: number, height: number) {
    this.spacing = Math.max(9, width / 120, height / 100);
    this.columns = Math.ceil(width / this.spacing) + 2;
    this.rows = Math.ceil(height / this.spacing) + 2;
    const size = this.columns * this.rows;
    this.u = new Float32Array(size);
    this.v = new Float32Array(size);
    this.nextU = new Float32Array(size);
    this.nextV = new Float32Array(size);
    this.ink = new Float32Array(size);
    this.nextInk = new Float32Array(size);
    this.source = new Float32Array(size);
    this.pressure = new Float32Array(size);
    this.divergence = new Float32Array(size);
    const shapeScale = Math.max(1, Math.min(290, Math.min(width, height) / 3));
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        const nx = x * this.spacing / shapeScale, ny = y * this.spacing / shapeScale;
        const wx = nx + 1.6 * noise(nx * 0.7 + 8, ny * 0.7 + 3);
        const wy = ny + 1.6 * noise(nx * 0.7 + 2, ny * 0.7 + 9);
        const broad = noise(wx + 4, wy + 7);
        const detail = noise(wx * 2.8 + 9, wy * 2.8);
        const grain = noise(wx * 6, wy * 6 + 4);
        // Threshold broad shapes into pigment and open channels so a drag has visible edges to carry.
        const value = smooth(clamp((broad * 0.8 + detail * 0.16 + grain * 0.04 - 0.38) / 0.3));
        this.source[y * this.columns + x] = value;
      }
    }
    this.ink.set(this.source);
  }

  private sample(field: Float32Array, x: number, y: number): number {
    x = clamp(x, 0, this.columns - 1.001);
    y = clamp(y, 0, this.rows - 1.001);
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy, i = iy * this.columns + ix;
    return (field[i] * (1 - fx) + field[i + 1] * fx) * (1 - fy) +
      (field[i + this.columns] * (1 - fx) + field[i + this.columns + 1] * fx) * fy;
  }

  density(x: number, y: number): number {
    return this.sample(this.ink, x / this.spacing + 1, y / this.spacing + 1);
  }

  /** A brush transfers momentum along the actual swept path, in grid cells/second. */
  drag(fromX: number, fromY: number, toX: number, toY: number, seconds: number) {
    const dx = (toX - fromX) / this.spacing, dy = (toY - fromY) / this.spacing;
    const distance = Math.hypot(dx, dy);
    if (!distance || seconds <= 0) return;
    const speed = Math.min(distance / Math.max(seconds, 0.008), 100);
    const vx = dx / distance * speed, vy = dy / distance * speed;
    const steps = Math.min(160, Math.max(1, Math.ceil(distance)));
    const radius = Math.max(2.5, 42 / this.spacing);
    for (let step = 0; step <= steps; step++) {
      const cx = fromX / this.spacing + 1 + dx * step / steps;
      const cy = fromY / this.spacing + 1 + dy * step / steps;
      for (let y = Math.max(1, Math.floor(cy - radius)); y <= Math.min(this.rows - 2, cy + radius); y++) {
        for (let x = Math.max(1, Math.floor(cx - radius)); x <= Math.min(this.columns - 2, cx + radius); x++) {
          const r2 = ((x - cx) ** 2 + (y - cy) ** 2) / (radius * radius);
          if (r2 >= 1) continue;
          const weight = (1 - r2) ** 2 * 0.24;
          const i = y * this.columns + x;
          this.u[i] += (vx - this.u[i]) * weight;
          this.v[i] += (vy - this.v[i]) * weight;
        }
      }
    }
  }

  step(seconds: number) {
    const dt = clamp(seconds, 0, 1 / 30);
    if (!dt) return;
    this.time += dt;
    const w = this.columns, h = this.rows;
    const damping = Math.exp(-dt * 1.35);
    // Semi-Lagrangian advection and a small viscosity term keep the wake continuous.
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        const px = x - this.u[i] * dt, py = y - this.v[i] * dt;
        const u = this.sample(this.u, px, py), v = this.sample(this.v, px, py);
        this.nextU[i] = (u + dt * 0.8 * (this.u[i-1] + this.u[i+1] + this.u[i-w] + this.u[i+w] - 4*u)) * damping;
        this.nextV[i] = (v + dt * 0.8 * (this.v[i-1] + this.v[i+1] + this.v[i-w] + this.v[i+w] - 4*v)) * damping;
      }
    }
    [this.u, this.nextU] = [this.nextU, this.u];
    [this.v, this.nextV] = [this.nextV, this.v];
    this.pressure.fill(0);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        this.divergence[i] = -0.5 * (this.u[i+1] - this.u[i-1] + this.v[i+w] - this.v[i-w]);
      }
    }
    // Pressure redistributes a local push sideways instead of compressing the field.
    for (let iteration = 0; iteration < 14; iteration++) {
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = y * w + x;
          this.pressure[i] = (this.divergence[i] + this.pressure[i-1] + this.pressure[i+1] + this.pressure[i-w] + this.pressure[i+w]) * 0.25;
        }
      }
    }
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        this.u[i] -= 0.5 * (this.pressure[i+1] - this.pressure[i-1]);
        this.v[i] -= 0.5 * (this.pressure[i+w] - this.pressure[i-w]);
        // Ambient flow stays visible without needing a pointer gesture.
        const ax = 6.6 * Math.sin(y * 0.075 + this.time * 0.3);
        const ay = 5.1 * Math.cos(x * 0.065 - this.time * 0.25);
        const carried = this.sample(this.ink, x - (this.u[i] + ax) * dt, y - (this.v[i] + ay) * dt);
        this.nextInk[i] = carried + (this.source[i] - carried) * dt * 0.045;
      }
    }
    // Seed incoming pigment from the composition so dense edge ink cannot flood a small viewport.
    for (let x = 1; x < w - 1; x++) {
      this.nextInk[x] = this.source[x];
      this.nextInk[(h-1)*w+x] = this.source[(h-1)*w+x];
    }
    for (let y = 0; y < h; y++) {
      this.nextInk[y*w] = this.source[y*w];
      this.nextInk[y*w+w-1] = this.source[y*w+w-1];
    }
    [this.ink, this.nextInk] = [this.nextInk, this.ink];
  }
}
