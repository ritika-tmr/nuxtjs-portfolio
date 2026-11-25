<script setup>
// "The long way round": a scroll-driven journey across a dot-matrix world map.
// While this tall section scrolls past, a sticky map follows the yomari as it
// flies between the stops in `stops`: the camera zooms in on each city,
// pulls out mid-flight, and the flown route draws in behind it.
// Reduced motion: no flying; the whole route is shown at once.
// Driven mode: pass `stop` (an index into `stops`) and the map fills its
// parent instead; the yomari flies to that stop whenever it changes.
import { geoNaturalEarth1, geoPath, geoInterpolate } from "d3";
import { feature } from "topojson-client";

const props = defineProps({
  // [{ id, city, years, line, lon, lat }]
  stops: { type: Array, required: true },
  // optional heading drawn over the map; leave empty when the page already has one
  heading: { type: String, default: "" },
  note: { type: String, default: "" },
  // driven mode: position along the journey (0..stops-1). Whole numbers sit at a
  // stop; fractions are mid-flight, so the parent can tie the flight to scrolling.
  stop: { type: Number, default: null },
});
const driven = computed(() => props.stop !== null);
let pos = 0; // driven mode: position along the journey, 0..stops-1 (fractions = mid-flight)
let lastTime = performance.now();

const section = ref(null);
const canvas = ref(null);
const reduce = ref(false);
const active = ref(0); // index of the stop currently shown
const flying = ref(null); // { to } while between stops
const progress = ref(0);

// world space: the projection is fitted to WW x WH units
const WW = 1000, WH = 520;
const DOT = 2.4; // dot grid spacing in world units
let projection, dots = [], routes = [], pts = [];
let ctx, vw = 0, vh = 0, dpr = 1, raf = 0, visible = false, yomari = null, t0 = performance.now();

// Phases: hold at a stop, fly to the next, hold, ... Flights get more scroll.
const HOLD = 1, FLY = 1.6;
const phases = computed(() => {
  const list = [];
  props.stops.forEach((_, i) => {
    list.push({ kind: "hold", i });
    if (i < props.stops.length - 1) list.push({ kind: "fly", i });
  });
  return list;
});
const totalWeight = computed(() => phases.value.reduce((s, p) => s + (p.kind === "hold" ? HOLD : FLY), 0));

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

function readColours() {
  const cs = getComputedStyle(document.documentElement);
  const v = (n) => cs.getPropertyValue(n).trim();
  return { sea: v("--mist"), land: v("--sage"), route: v("--bridal"), pin: v("--bridal"), ink: v("--ink"), paper: v("--paper"), gold: v("--gold") };
}

async function buildWorld() {
  const land110 = (await import("world-atlas/land-110m.json")).default;
  const land = feature(land110, land110.objects.land);
  projection = geoNaturalEarth1().fitSize([WW, WH], { type: "Sphere" });
  // rasterise the land once, then sample a grid of dots from it
  const S = 2;
  const off = document.createElement("canvas");
  off.width = WW * S;
  off.height = WH * S;
  const octx = off.getContext("2d", { willReadFrequently: true });
  octx.scale(S, S);
  octx.beginPath();
  geoPath(projection, octx)(land);
  octx.fillStyle = "#000";
  octx.fill();
  const data = octx.getImageData(0, 0, off.width, off.height).data;
  dots = [];
  for (let y = DOT / 2; y < WH; y += DOT) {
    for (let x = DOT / 2; x < WW; x += DOT) {
      const i = (Math.round(y * S) * off.width + Math.round(x * S)) * 4 + 3;
      if (data[i] > 0) dots.push([x, y]);
    }
  }
  // stop positions and great-circle routes between them
  pts = props.stops.map((s) => projection([s.lon, s.lat]));
  routes = props.stops.slice(0, -1).map((s, i) => {
    const n = props.stops[i + 1];
    const interp = geoInterpolate([s.lon, s.lat], [n.lon, n.lat]);
    return Array.from({ length: 81 }, (_, k) => projection(interp(k / 80)));
  });
}

// Where we are along the journey for a scroll progress p (0..1)
function stateAt(p) {
  if (driven.value) {
    if (reduce.value) return { kind: "hold", i: Math.round(props.stop) };
    const i = Math.floor(pos + 1e-6);
    const t = pos - i;
    return t < 1e-3 || i >= props.stops.length - 1 ? { kind: "hold", i: Math.min(i, props.stops.length - 1) } : { kind: "fly", i, t };
  }
  if (reduce.value) return { overview: true };
  let w = p * totalWeight.value;
  for (const ph of phases.value) {
    const len = ph.kind === "hold" ? HOLD : FLY;
    if (w <= len || ph === phases.value.at(-1)) {
      const t = Math.max(0, Math.min(1, w / len));
      return { ...ph, t };
    }
    w -= len;
  }
}

function pointOnRoute(r, t) {
  const f = t * (r.length - 1);
  const k = Math.min(r.length - 2, Math.floor(f));
  const u = f - k;
  return [lerp(r[k][0], r[k + 1][0], u), lerp(r[k][1], r[k + 1][1], u), Math.atan2(r[k + 1][1] - r[k][1], r[k + 1][0] - r[k][0])];
}

function draw() {
  if (!ctx || !projection) return;
  const c = readColours();
  const st = stateAt(progress.value);
  const base = Math.max(vw / WW, vh / WH);
  const Z_STOP = vw < 640 ? 2.6 : 3.2;
  const Z_FLY = 1.15;

  // camera centre/zoom and the traveller's position
  let cx, cy, zoom, traveller, heading = 0, flownRoute = -1, flownT = 0;
  if (st.overview) {
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    zoom = Math.min((vw * 0.7) / (Math.max(...xs) - Math.min(...xs)) / base, (vh * 0.6) / (Math.max(...ys) - Math.min(...ys)) / base);
    traveller = pts.at(-1);
    flownRoute = routes.length - 1;
    flownT = 1;
  } else if (st.kind === "hold") {
    [cx, cy] = pts[st.i];
    zoom = Z_STOP;
    traveller = pts[st.i];
    flownRoute = st.i - 1;
    flownT = 1;
  } else {
    const t = ease(st.t);
    const [x, y, a] = pointOnRoute(routes[st.i], t);
    traveller = [x, y];
    heading = a;
    cx = x;
    cy = y;
    zoom = Z_STOP - (Z_STOP - Z_FLY) * Math.sin(Math.PI * t);
    flownRoute = st.i;
    flownT = t;
  }
  const scale = base * zoom;
  const toScreen = (x, y) => [(x - cx) * scale + vw / 2, (y - cy) * scale + vh / 2];

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, vw, vh);
  ctx.fillStyle = c.sea;
  ctx.fillRect(0, 0, vw, vh);

  // land dots (only the ones on screen)
  const r = Math.max(0.7, DOT * scale * 0.36);
  ctx.fillStyle = c.land;
  ctx.beginPath();
  for (const [x, y] of dots) {
    const sx = (x - cx) * scale + vw / 2;
    const sy = (y - cy) * scale + vh / 2;
    if (sx < -r || sy < -r || sx > vw + r || sy > vh + r) continue;
    ctx.moveTo(sx + r, sy);
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
  }
  ctx.fill();

  // flown route: dashed red, drawn up to the traveller
  ctx.save();
  ctx.strokeStyle = c.route;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.setLineDash([2, 9]);
  for (let i = 0; i <= flownRoute; i++) {
    const rt = routes[i];
    const upto = i < flownRoute ? 1 : flownT;
    const n = Math.max(1, Math.round(upto * (rt.length - 1)));
    ctx.beginPath();
    rt.slice(0, n + 1).forEach(([x, y], k) => {
      const [sx, sy] = toScreen(x, y);
      k ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy);
    });
    if (i === flownRoute && upto < 1) {
      const [sx, sy] = toScreen(traveller[0], traveller[1]);
      ctx.lineTo(sx, sy);
    }
    ctx.stroke();
  }
  ctx.restore();

  // city pins and labels
  ctx.font = "600 15px Epilogue, system-ui, sans-serif";
  props.stops.forEach((s, i) => {
    if (i > 0 && pts[i][0] === pts[0][0] && pts[i][1] === pts[0][1]) return; // Kathmandu again
    const [sx, sy] = toScreen(pts[i][0], pts[i][1]);
    if (sx < -50 || sy < -50 || sx > vw + 50 || sy > vh + 50) return;
    ctx.fillStyle = c.paper;
    ctx.beginPath();
    ctx.arc(sx, sy, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = c.pin;
    ctx.beginPath();
    ctx.arc(sx, sy, 5, 0, Math.PI * 2);
    ctx.fill();
    const label = s.city;
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = c.paper;
    ctx.beginPath();
    ctx.roundRect(sx + 12, sy + 8, tw + 16, 26, 13);
    ctx.fill();
    ctx.fillStyle = c.ink;
    ctx.fillText(label, sx + 20, sy + 26);
  });

  // the traveller: the yomari, bobbing, tilted along the flight path
  if (yomari && traveller) {
    const [sx, sy] = toScreen(traveller[0], traveller[1]);
    const bob = reduce.value ? 0 : Math.sin((performance.now() - t0) / 380) * 3;
    const w = vw < 640 ? 56 : 72;
    const h = w * (196 / 232);
    const tilt = st.kind === "fly" ? Math.max(-0.5, Math.min(0.5, heading)) * 0.5 : 0;
    ctx.save();
    ctx.translate(sx, sy - h * 0.95 + bob);
    ctx.rotate(tilt);
    ctx.drawImage(yomari, -w / 2, -h / 2, w, h);
    ctx.restore();
  }
}

function measure() {
  const el = canvas.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  vw = rect.width;
  vh = rect.height;
  dpr = Math.min(2, window.devicePixelRatio || 1);
  el.width = Math.round(vw * dpr);
  el.height = Math.round(vh * dpr);
}

function onScroll() {
  if (driven.value) return;
  const el = section.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const span = rect.height - window.innerHeight;
  const p = span > 0 ? Math.max(0, Math.min(1, -rect.top / span)) : 1;
  progress.value = p;
  const st = stateAt(p);
  if (st.overview) {
    active.value = props.stops.length - 1;
    flying.value = null;
  } else if (st.kind === "hold") {
    active.value = st.i;
    flying.value = null;
  } else {
    active.value = st.t < 0.5 ? st.i : st.i + 1;
    flying.value = { to: props.stops[st.i + 1] };
  }
}

function frame() {
  const now = performance.now();
  const dt = Math.min(64, now - lastTime);
  lastTime = now;
  if (driven.value && !reduce.value) {
    // follow the target closely, with a little smoothing so wheel steps glide
    const target = props.stop;
    pos += (target - pos) * Math.min(1, dt / 90);
    if (Math.abs(target - pos) < 0.002) pos = target;
  }
  if (visible) draw();
  raf = requestAnimationFrame(frame);
}

let observer = null;
const onResize = () => {
  measure();
  onScroll();
};

onMounted(async () => {
  reduce.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  ctx = canvas.value.getContext("2d");
  if (driven.value) pos = props.stop;
  // the side panel can change size (e.g. on layout shifts), so watch it
  new ResizeObserver(() => measure()).observe(canvas.value);
  measure();
  await buildWorld();
  const img = new Image();
  img.src = "/yomari.svg";
  img.onload = () => (yomari = img);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  observer = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" });
  observer.observe(section.value);
  if (document.fonts?.ready) document.fonts.ready.then(() => draw());
  raf = requestAnimationFrame(frame);
});
onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResize);
  observer?.disconnect();
});
</script>

<template>
  <section
    ref="section"
    :class="driven ? 'relative h-full w-full' : 'journey relative'"
    :style="driven ? undefined : { height: reduce ? '100vh' : `${stops.length * 110 + 60}vh` }" :aria-labelledby="heading ? 'journey-title' : undefined" :aria-label="heading ? undefined : 'Journey map: Kathmandu, Beijing, Kathmandu, Sydney'">
    <div :class="driven ? 'absolute inset-0 overflow-hidden' : 'sticky top-0 h-screen overflow-hidden'">
      <canvas ref="canvas" class="absolute inset-0 h-full w-full" aria-hidden="true" />
      <!-- soft fade behind the heading so it reads over the map -->
      <div v-if="heading" class="pointer-events-none absolute inset-x-0 top-0 h-72" style="background: linear-gradient(var(--mist) 35%, transparent)" aria-hidden="true" />

      <!-- heading and the current stop -->
      <div v-if="!driven" class="container pointer-events-none relative flex h-full flex-col justify-between pb-10 pt-28 sm:pt-32">
        <div>
          <h2 v-if="heading" id="journey-title" class="text-4xl sm:text-6xl">{{ heading }}</h2>
          <p v-if="note" class="hand-note mt-1 rotate-1 !text-muted">{{ note }}</p>
        </div>

        <div class="stop-card w-[min(420px,100%)] bg-paper px-6 py-5" aria-live="polite">
          <Transition name="stop" mode="out-in">
            <div v-if="flying" key="flying">
              <p class="hand-note">off to {{ flying.to.city }}…</p>
              <p class="mt-1 text-muted">{{ flying.to.years }}</p>
            </div>
            <div v-else :key="`stop-${active}`">
              <p class="hand-note">{{ stops[active].years }}</p>
              <p class="font-display text-3xl font-semibold sm:text-4xl">{{ stops[active].city }}</p>
              <p class="mt-1 text-muted">{{ stops[active].line }}</p>
            </div>
          </Transition>
          <!-- progress through the stops -->
          <ol class="mt-4 flex items-center gap-2" aria-label="Journey progress">
            <li
              v-for="(s, i) in stops"
              :key="s.id"
              class="h-2 rounded-full transition-all duration-300"
              :class="i === active ? 'w-8 bg-bridal' : i < active ? 'w-2' : 'w-2 bg-line'"
              :style="i < active ? { background: 'color-mix(in srgb, var(--bridal) 55%, transparent)' } : undefined"
              :aria-current="i === active ? 'step' : undefined"
            >
              <span class="sr-only">{{ s.city }}, {{ s.years }}</span>
            </li>
          </ol>
        </div>
      </div>

      <p v-if="!driven && !reduce && progress < 0.95" class="hand-note pointer-events-none absolute bottom-10 right-24 hidden !text-muted sm:block">keep scrolling, we're flying ↓</p>
    </div>
  </section>
</template>

<style scoped>
.stop-card {
  border-radius: 28px 36px 30px 40px / 34px 28px 38px 30px;
  box-shadow: 0 12px 30px color-mix(in srgb, var(--wood) 14%, transparent);
}
.stop-enter-active,
.stop-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.stop-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.stop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
