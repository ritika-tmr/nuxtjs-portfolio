<script setup>
// Skills as a force-directed tree (after https://observablehq.com/@d3/force-directed-tree):
// "What I bring" is the root, branches are its children, skills are leaves.
// Soft skills float between branches on dashed gold threads.
// - on load the tree springs out from the centre
// - drag any node; the tree settles around it
// - hover a node (or use the chips) to light up its family
// - click for details, including the story chapter a skill came from
// - "Play the story" empties the tree and regrows it chapter by chapter
import { select, selectAll, forceSimulation, forceLink, forceManyBody, forceCollide, forceRadial, forceX, forceY, drag, easeBackOut } from "d3";

const props = defineProps({
  skills: { type: Object, required: true },
  story: { type: Array, required: true },
});

const svgEl = ref(null);
const scroller = ref(null);
const playing = ref(false);
const caption = ref(null);
const selected = ref(null);
const focusBranch = ref(null);

const chapterById = computed(() => Object.fromEntries(props.story.map((c) => [c.id, c])));
const branchById = computed(() => Object.fromEntries(props.skills.branches.map((b) => [b.id, b])));
const leavesOf = (id) => props.skills.leaves.filter((l) => l.branch === id);

const W = 1060, H = 900;
let reduce = false;
let sim, nodeSel, revealSel, labelSel, allLinks, nodes, links, byId;
const T = (ms) => (reduce ? 0 : ms);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rad = (a) => (a * Math.PI) / 180;

function build() {
  nodes = [];
  links = [];
  byId = new Map();
  const add = (n) => (nodes.push(n), byId.set(n.id, n), n);
  add({ id: "core", label: "What I bring", type: "core", depth: 0, x: 0, y: 0, fx: 0, fy: 0 });
  props.skills.branches.forEach((b, bi) => {
    // start each branch just off-centre in its own direction, so the tree
    // bursts outward evenly instead of from a random tangle
    const dx = Math.cos(rad(b.angle)), dy = Math.sin(rad(b.angle));
    add({ ...b, type: "branch", depth: 1, bi, x: dx * 12, y: dy * 12 });
    links.push({ source: "core", target: b.id, kind: "trunk" });
    const kids = leavesOf(b.id);
    kids.forEach((l, j) => {
      const id = `l:${l.label}`;
      add({ id, label: l.label, type: "leaf", depth: 2, branch: b.id, chapter: l.chapter, note: l.note, color: b.color, j, k: kids.length, x: dx * 20 + j, y: dy * 20 + j });
      links.push({ source: b.id, target: id, kind: "twig" });
    });
  });
  props.skills.softs.forEach((s) => {
    const id = `s:${s.label}`;
    add({ id, label: s.label, type: "soft", depth: 2, joins: s.joins, note: s.note, chapter: 6, x: 0, y: 0 });
    s.joins.forEach((t) => links.push({ source: id, target: t, kind: "soft" }));
  });
  // Target spot for every node: branches on an even hexagon, skills fanned
  // within their branch's slice (staggered at two radii so neighbouring
  // labels don't touch), soft skills midway between the branches they join.
  nodes.forEach((d) => {
    if (d.type === "branch") (d.tA = d.angle, d.tR = 175);
    if (d.type === "leaf") {
      const b = byId.get(d.branch);
      // on the left/right the labels stack vertically, so one radius is
      // enough; at the top/bottom they sit side by side, so stagger them
      const side = Math.abs(Math.cos(rad(b.angle))) > 0.8;
      const spread = side ? Math.min(62, 8 * d.k) : Math.min(44, 11 * d.k);
      d.tA = b.angle + (d.k > 1 ? (d.j / (d.k - 1) - 0.5) * spread : 0);
      d.tR = side ? 320 : null; // top/bottom fans are ranked below
    }
    if (d.type === "soft") (d.tA = meanAngle(d.joins.map((j) => byId.get(j).angle)), d.tR = 250);
  });
  // soft skills that share the same gap sit side by side, a few degrees apart
  const byGap = new Map();
  nodes.filter((n) => n.type === "soft").forEach((n) => {
    const k = Math.round(n.tA);
    byGap.set(k, [...(byGap.get(k) || []), n]);
  });
  byGap.forEach((group) => group.forEach((n, i) => (n.tA += (i - (group.length - 1) / 2) * 16)));
  // Top/bottom fans: labels sit side by side, so give each its own row. The
  // skill pointing most steeply up/down goes on the outermost ring.
  props.skills.branches.forEach((b) => {
    const fan = nodes.filter((n) => n.type === "leaf" && n.branch === b.id && n.tR === null);
    fan
      .sort((p, q) => Math.abs(Math.sin(rad(p.tA))) - Math.abs(Math.sin(rad(q.tA))))
      .forEach((n, rank) => (n.tR = 282 + rank * 32));
  });
}
const meanAngle = (angles) =>
  (Math.atan2(
    angles.reduce((sum, a) => sum + Math.sin(rad(a)), 0),
    angles.reduce((sum, a) => sum + Math.cos(rad(a)), 0)
  ) * 180) / Math.PI;

const half = (d) => (d.type === "core" ? 56 : d.type === "branch" ? 90 : d.type === "soft" ? 70 : 22 + d.label.length * 9);
// keep nodes (and the label on their outer side) inside the frame
const clamp = () =>
  nodes.forEach((d) => {
    const m = half(d);
    if (d.type === "leaf") {
      d.x = d.x < 0 ? Math.max(-W / 2 + m, d.x) : Math.min(W / 2 - m, d.x);
    } else {
      d.x = Math.max(-W / 2 + m, Math.min(W / 2 - m, d.x));
    }
    d.y = Math.max(-H / 2 + 40, Math.min(H / 2 - 36, d.y));
  });

// split a long heading at the space nearest its middle
const wrapLabel = (label) => {
  if (label.length <= 14) return [label];
  const mid = label.length / 2;
  let best = -1;
  for (let i = 0; i < label.length; i++) if (label[i] === " " && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
  return best < 0 ? [label] : [label.slice(0, best), label.slice(best + 1)];
};
const colorOf = (d) => `var(${d.color || "--bridal"})`;
const softPath = (l) => {
  const s = l.source, t = l.target;
  const mx = (s.x + t.x) / 2, my = (s.y + t.y) / 2;
  return `M${s.x},${s.y}Q${mx * 1.15},${my * 1.15} ${t.x},${t.y}`;
};

function family(d) {
  if (!d || d.type === "core") return null;
  const s = new Set([d.id]);
  if (d.type === "branch") {
    s.add("core");
    links.forEach((l) => {
      if (l.source.id === d.id) s.add(l.target.id);
      if (l.target.id === d.id) s.add(l.source.id);
    });
  }
  if (d.type === "leaf") (s.add(d.branch), s.add("core"));
  if (d.type === "soft") d.joins.forEach((j) => s.add(j));
  return s;
}
function highlight(set) {
  nodeSel.classed("dim", (d) => !!set && !set.has(d.id));
  allLinks.classed("dim", (l) => !!set && !(set.has(l.source.id) && set.has(l.target.id)));
}
function selectNode(d) {
  selected.value = d.type === "core" ? null : { ...d };
  focusBranch.value = d.type === "branch" ? d.id : null;
  nodeSel.classed("sel", (n) => n === d && d.type !== "core");
  highlight(family(d));
}
function focusChip(id) {
  selectNode(focusBranch.value === id ? byId.get("core") : byId.get(id));
}

function render() {
  const svg = select(svgEl.value);
  svg.selectAll("*").remove();
  const gTree = svg.append("g"), gSoft = svg.append("g"), gNodes = svg.append("g");

  const treeSel = gTree.selectAll("line").data(links.filter((l) => l.kind !== "soft")).join("line")
    .attr("class", (l) => `link ${l.kind}`)
    .style("stroke", (l) => (l.kind === "trunk" ? colorOf(byId.get(typeof l.target === "string" ? l.target : l.target.id)) : "var(--line)"))
    .style("stroke-width", (l) => (l.kind === "trunk" ? 3 : 1.5));
  const softSel = gSoft.selectAll("path").data(links.filter((l) => l.kind === "soft")).join("path")
    .attr("class", "link soft-link");
  allLinks = selectAll([...treeSel.nodes(), ...softSel.nodes()]);

  nodeSel = gNodes.selectAll("g.node").data(nodes).join("g")
    .attr("class", (d) => `node ${d.type}`)
    .attr("tabindex", 0).attr("role", "button")
    .attr("aria-label", (d) => (d.type === "core" ? "Overview" : d.label));
  revealSel = nodeSel.append("g").attr("class", "reveal-g");

  revealSel.each(function (d) {
    const g = select(this);
    if (d.type === "core") {
      g.append("circle").attr("class", "pulse").attr("r", 52);
      g.append("circle").attr("class", "shape core-shape").attr("r", 50);
      ["What I", "bring"].forEach((t, i) => g.append("text").attr("class", "core-text").attr("text-anchor", "middle").attr("y", i ? 20 : -4).text(t));
      return;
    }
    if (d.type === "branch") {
      g.append("circle").attr("class", "shape").attr("r", 14).style("fill", colorOf(d));
      // long headings wrap onto two lines; bottom branches put them below the dot
      const lines = wrapLabel(d.label);
      const below = Math.sin(rad(d.angle)) > 0.3;
      const t = g.append("text").attr("class", "label branch-text").attr("text-anchor", "middle");
      lines.forEach((line, i) => {
        const y = below ? 36 + i * 19 : -24 - (lines.length - 1 - i) * 19;
        t.append("tspan").attr("x", 0).attr("y", y).text(line);
      });
      return;
    }
    if (d.type === "soft") {
      g.append("circle").attr("class", "shape soft-shape").attr("r", 8);
      g.append("text").attr("class", "label soft-text").attr("text-anchor", "middle").attr("y", 28).text(d.label);
      return;
    }
    g.append("circle").attr("class", "shape leaf-shape").attr("r", 6).style("fill", colorOf(d));
    g.append("text").attr("class", "label leaf-text").attr("dy", "0.35em").attr("x", 10).text(d.label);
  });
  labelSel = nodeSel.selectAll("text.leaf-text");

  nodeSel
    .on("mouseenter", (e, d) => { if (!playing.value) highlight(family(d)); })
    .on("mouseleave", () => { if (!playing.value) highlight(family(selected.value ? byId.get(selected.value.id) : null)); })
    .on("click", (e, d) => { e.stopPropagation(); selectNode(d); })
    .on("keydown", (e, d) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectNode(d); } });
  svg.on("click", () => selectNode(byId.get("core")));

  nodeSel.filter((d) => d.type !== "core").call(
    drag()
      .on("start", (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
      .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
      .on("end", (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
  );
}

function ticked() {
  clamp();
  allLinks.filter("line")
    .attr("x1", (l) => l.source.x).attr("y1", (l) => l.source.y)
    .attr("x2", (l) => l.target.x).attr("y2", (l) => l.target.y);
  allLinks.filter("path").attr("d", softPath);
  nodeSel.attr("transform", (d) => `translate(${d.x},${d.y})`);
  // leaf labels sit on the outer side of their dot
  labelSel
    .attr("text-anchor", (d) => (d.x < 0 ? "end" : "start"))
    .attr("x", (d) => (d.x < 0 ? -10 : 10));
}

function makeSim() {
  // Rings keep the tree readable: branches on an inner ring, skills on an
  // outer ring, soft skills in between; links and charge sort out the angles.
  const ring = (d) => (d.type === "branch" ? 175 : d.type === "leaf" ? 335 : d.type === "soft" ? 245 : 0);
  sim = forceSimulation(nodes)
    .force("link", forceLink(links).id((d) => d.id)
      .distance((l) => (l.kind === "trunk" ? 175 : l.kind === "twig" ? 120 : 160))
      .strength((l) => (l.kind === "trunk" ? 0.7 : l.kind === "twig" ? 0.08 : 0.03)))
    // modest repulsion: strong leaf charge would shove busy branches inward
    .force("charge", forceManyBody().strength((d) => (d.type === "core" ? -600 : d.type === "branch" ? -400 : d.type === "soft" ? -200 : -120)).distanceMax(260))
    .force("collide", forceCollide((d) => (d.type === "core" ? 64 : d.type === "branch" ? 44 : d.type === "soft" ? 28 : 16)).strength(0.9))
    // pull each node toward its target spot (see build)
    .force("bx", forceX((d) => (d.tR ? d.tR * Math.cos(rad(d.tA)) : 0)).strength((d) => (d.type === "branch" ? 0.9 : d.type === "soft" ? 0.5 : d.type === "leaf" ? 0.55 : 0)))
    .force("by", forceY((d) => (d.tR ? d.tR * Math.sin(rad(d.tA)) : 0)).strength((d) => (d.type === "branch" ? 0.9 : d.type === "soft" ? 0.5 : d.type === "leaf" ? 0.55 : 0)))
    .force("ring", forceRadial(ring, 0, 0).strength((d) => (d.type === "core" ? 0 : d.type === "leaf" ? 0.45 : 0.6)))
    .on("tick", ticked);
}

function grow() {
  // the springy entrance: everything starts at the centre and the
  // simulation pushes it out; labels fade in once things have spread
  // Fixed starting angles (no randomness), so the tree settles the same way
  // every time: skills fan out around their branch, soft skills start
  // between the two branches they connect.
  nodes.forEach((d) => {
    if (d.type === "core") return;
    let a, r;
    if (d.type === "branch") (a = d.angle, r = 18);
    else if (d.type === "leaf") (a = byId.get(d.branch).angle + (d.j - (d.k - 1) / 2) * 7, r = 30);
    else (a = meanAngle(d.joins.map((j) => byId.get(j).angle)), r = 24);
    d.x = Math.cos(rad(a)) * r;
    d.y = Math.sin(rad(a)) * r;
    d.fx = d.fy = null;
  });
  revealSel.interrupt().attr("transform", "scale(1)").style("opacity", 1);
  allLinks.interrupt().style("opacity", 1);
  selectAll(svgEl.value.querySelectorAll("text.label")).interrupt().style("opacity", 0)
    .transition().delay((d) => T(500 + d.depth * 250)).duration(T(500)).style("opacity", 1);
  if (reduce) {
    sim.stop();
    for (let i = 0; i < 400; i++) sim.tick();
    ticked();
  } else {
    sim.alpha(1).alphaTarget(0).restart();
  }
}

function visibleAt(n) {
  const s = new Set(["core"]);
  nodes.forEach((d) => {
    if ((d.type === "leaf" || d.type === "soft") && d.chapter <= n) {
      s.add(d.id);
      if (d.branch) s.add(d.branch);
      if (d.joins) d.joins.forEach((j) => s.add(j));
    }
  });
  return s;
}
function applyVisible(set) {
  revealSel.transition().duration(T(600)).ease(easeBackOut.overshoot(1.6))
    .attr("transform", (d) => (set.has(d.id) ? "scale(1)" : "scale(0.2)"))
    .style("opacity", (d) => (set.has(d.id) ? 1 : 0));
  allLinks.transition().duration(T(500)).style("opacity", (l) => (set.has(l.source.id) && set.has(l.target.id) ? 1 : 0));
}

async function play() {
  playing.value = true;
  selectNode(byId.get("core"));
  applyVisible(new Set(["core"]));
  await sleep(T(700));
  for (const ch of props.story) {
    if (!playing.value) break;
    const added = nodes.filter((d) => (d.type === "leaf" || d.type === "soft") && d.chapter === ch.id).map((d) => d.label);
    caption.value = { when: ch.when, title: ch.title, added };
    applyVisible(visibleAt(ch.id));
    if (!reduce) sim.alpha(0.3).restart();
    await sleep(reduce ? 1200 : 2300);
  }
  stop();
}
function stop() {
  playing.value = false;
  applyVisible(new Set(nodes.map((d) => d.id)));
  setTimeout(() => { if (!playing.value) caption.value = null; }, 1800);
}
function reset() {
  playing.value = false;
  caption.value = null;
  selectNode(byId.get("core"));
  grow();
}

onMounted(async () => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  build();
  if (document.fonts?.ready) await document.fonts.ready;
  const sc = scroller.value;
  if (sc && sc.scrollWidth > sc.clientWidth) sc.scrollLeft = (sc.scrollWidth - sc.clientWidth) / 2;
  render();
  makeSim();
  selectNode(byId.get("core"));
  // grow the tree when it first scrolls into view (not before anyone sees it)
  growObserver = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      growObserver.disconnect();
      grow();
    },
    { threshold: 0.25 }
  );
  growObserver.observe(svgEl.value);
});
let growObserver = null;
onBeforeUnmount(() => {
  playing.value = false;
  growObserver?.disconnect();
  if (sim) sim.stop();
});
</script>

<template>
  <div>
    <div class="mb-5 flex flex-wrap items-center gap-3">
      <button type="button" class="btn btn-red !py-2.5" @click="playing ? stop() : play()">
        {{ playing ? "■ Stop" : "▶ Play the story" }}
      </button>
      <button type="button" class="btn btn-ghost !py-2.5" @click="reset">Reset</button>
      <div class="flex flex-wrap items-center gap-x-1 gap-y-1 sm:ml-3" role="group" aria-label="Focus a branch">
        <button
          v-for="(b, i) in skills.branches"
          :key="b.id"
          type="button"
          class="chip"
          :style="{ '--c': `var(${b.color})`, '--tilt': `${[-2, 1.5, -1, 2, -1.5, 1][i % 6]}deg` }"
          :aria-pressed="focusBranch === b.id"
          @click="focusChip(b.id)"
        >
          <i aria-hidden="true" /><span>{{ b.label }}</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div class="map-stage relative min-w-0">
        <div ref="scroller" class="overflow-x-auto">
          <svg
            ref="svgEl"
            class="block h-auto w-full min-w-[780px] touch-none"
            :viewBox="`${-W / 2} ${-H / 2} ${W} ${H}`"
            role="img"
            aria-label="Skills as a tree: What I bring branches into data visualisation, analytics, project management, frontend, UI/UX and graphic design, and languages, with soft skills linking the branches."
          />
        </div>
        <Transition name="cap">
          <div v-if="caption" class="map-caption absolute left-4 top-3 max-w-[min(420px,80%)] bg-paper px-5 py-3" aria-live="polite">
            <p class="font-hand text-xl leading-none text-muted">{{ caption.when }}</p>
            <p class="font-display text-xl font-semibold leading-tight">{{ caption.title }}</p>
            <p class="font-hand text-xl leading-tight text-brick">
              {{ caption.added.length ? `+ ${caption.added.join(", ")}` : "+ a love of how things are made" }}
            </p>
          </div>
        </Transition>
      </div>

      <aside class="panel bg-paper px-7 py-8" aria-live="polite">
        <template v-if="!selected">
          <p class="font-hand text-xl leading-none text-muted">the big picture</p>
          <h2 class="mt-1 text-3xl">{{ skills.branches.length }} branches, one person.</h2>
          <div class="my-4 grid grid-cols-3 text-center">
            <div><b class="block font-display text-3xl text-bridal">{{ skills.branches.length }}</b><span class="text-xs text-muted">branches</span></div>
            <div><b class="block font-display text-3xl text-bridal">{{ skills.leaves.length }}</b><span class="text-xs text-muted">skills</span></div>
            <div><b class="block font-display text-3xl text-bridal">{{ skills.softs.length }}</b><span class="text-xs text-muted">soft skills</span></div>
          </div>
          <p class="text-muted">Hover a branch to light up its skills. Click any of them to see which chapter of the story it came from. Drag a node and the tree rearranges itself.</p>
          <p class="hand-note mt-3">Frontend came first. The data came later, and it stuck.</p>
        </template>
        <template v-else-if="selected.type === 'branch'">
          <p class="font-hand text-xl leading-none text-muted">a branch</p>
          <h2 class="mt-1 text-3xl" :style="{ color: `var(${selected.color})` }">{{ selected.label }}</h2>
          <p class="mt-3">{{ selected.about }}</p>
          <div class="mt-3 flex flex-wrap gap-1.5">
            <span v-for="l in leavesOf(selected.id)" :key="l.label" class="rounded-full bg-paper px-2.5 py-1 text-xs">{{ l.label }}</span>
          </div>
        </template>
        <template v-else-if="selected.type === 'leaf'">
          <p class="font-hand text-xl leading-none text-muted">
            a skill from <span :style="{ color: `var(${branchById[selected.branch].color})` }">{{ branchById[selected.branch].label }}</span>
          </p>
          <h2 class="mt-1 text-3xl">{{ selected.label }}</h2>
          <div v-if="chapterById[selected.chapter]" class="my-3 border-l-[3px] border-dotted border-gold py-1 pl-3 text-sm">
            <b>{{ chapterById[selected.chapter].title }}</b><br />
            <span class="text-muted">{{ chapterById[selected.chapter].when }}</span>
          </div>
          <p>{{ selected.note }}</p>
          <a href="#story" class="squiggle squiggle-brick mt-3 inline-block text-sm font-bold">Read the chapter →</a>
        </template>
        <template v-else>
          <p class="font-hand text-xl leading-none text-muted">a soft skill that ties branches together</p>
          <h2 class="mt-1 font-hand text-4xl text-gold-ink">{{ selected.label }}</h2>
          <p class="mt-3">{{ selected.note }}</p>
          <div class="mt-3 flex flex-wrap gap-1.5">
            <span v-for="j in selected.joins" :key="j" class="rounded-full bg-paper px-2.5 py-1 text-xs">{{ branchById[j].label }}</span>
          </div>
        </template>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.map-stage {
  background:
    radial-gradient(ellipse 45% 40% at 18% 30%, color-mix(in srgb, var(--mist) 70%, transparent), transparent 70%),
    radial-gradient(ellipse 40% 45% at 85% 65%, color-mix(in srgb, var(--gold-soft) 85%, transparent), transparent 70%),
    radial-gradient(ellipse 35% 30% at 50% 95%, color-mix(in srgb, var(--sage-soft) 90%, transparent), transparent 70%);
}
.panel {
  border-radius: 46px 70px 52px 64px / 60px 44px 70px 50px;
  transform: rotate(-0.6deg);
}
.map-caption {
  border-radius: 22px 30px 24px 34px;
  box-shadow: 0 8px 24px color-mix(in srgb, var(--wood) 10%, transparent);
}
/* Branch shortcuts: no boxes. A tinted blob in the branch colour, a wavy
   underline that draws in on hover, and a soft blob behind the active one. */
.chip {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px 9px 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
  border-radius: 46% 54% 52% 48% / 58% 46% 54% 42%;
  transition: background-color 0.25s ease, transform 0.25s ease;
}
.chip i {
  width: 14px;
  height: 12px;
  flex: none;
  background: var(--c);
  border-radius: 52% 48% 60% 40% / 55% 60% 40% 45%;
  transform: rotate(var(--tilt));
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1.4);
}
.chip span {
  position: relative;
}
.chip span::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -5px;
  height: 5px;
  background: var(--c);
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 18' preserveAspectRatio='none'><path d='M2 10 C 25 2, 45 16, 70 9 S 115 2, 140 10 S 180 15, 198 6' fill='none' stroke='black' stroke-width='5' stroke-linecap='round'/></svg>") center / 100% 100% no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 18' preserveAspectRatio='none'><path d='M2 10 C 25 2, 45 16, 70 9 S 115 2, 140 10 S 180 15, 198 6' fill='none' stroke='black' stroke-width='5' stroke-linecap='round'/></svg>") center / 100% 100% no-repeat;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s ease;
}
.chip:hover i {
  transform: rotate(calc(var(--tilt) * -6)) scale(1.15);
}
.chip:hover span::after,
.chip[aria-pressed="true"] span::after {
  transform: scaleX(1);
}
.chip[aria-pressed="true"] {
  font-weight: 700;
  background: color-mix(in srgb, var(--c) 16%, transparent);
  transform: rotate(var(--tilt));
}
.cap-enter-active,
.cap-leave-active {
  transition: opacity 0.35s, transform 0.35s;
}
.cap-enter-from,
.cap-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* d3-rendered tree */
:deep(.node) {
  cursor: grab;
}
:deep(.node.core) {
  cursor: default;
}
:deep(.node:active) {
  cursor: grabbing;
}
:deep(.node text) {
  pointer-events: none;
  user-select: none;
  font-family: "Epilogue", system-ui, sans-serif;
}
:deep(.node),
:deep(.link) {
  transition: opacity 0.25s;
}
:deep(.node.dim),
:deep(.link.dim) {
  opacity: 0.12;
}
:deep(.label) {
  paint-order: stroke;
  stroke: var(--paper);
  stroke-width: 4px;
  stroke-linejoin: round;
}
:deep(.node.sel .shape) {
  stroke: var(--ink);
  stroke-width: 3;
}
:deep(.node:focus-visible) {
  outline: none;
}
:deep(.node:focus-visible .shape) {
  stroke: var(--gold);
  stroke-width: 4;
}
:deep(.link) {
  fill: none;
  stroke-linecap: round;
}
:deep(.soft-link) {
  stroke: var(--gold);
  stroke-width: 1.6;
  stroke-dasharray: 6 7;
  animation: march 1.4s linear infinite;
}
:deep(.core-shape) {
  fill: var(--bridal);
  stroke: var(--gold);
  stroke-width: 5;
}
:deep(.pulse) {
  fill: none;
  stroke: var(--gold);
  stroke-width: 3;
  animation: pulse 2.8s ease-out infinite;
  transform-box: fill-box;
  transform-origin: center;
}
:deep(.core-text) {
  font-family: "Fraunces", Georgia, serif !important;
  font-size: 21px;
  font-weight: 600;
  fill: var(--on-bridal);
}
:deep(.branch .shape) {
  stroke: var(--paper);
  stroke-width: 3;
}
:deep(.branch-text) {
  fill: var(--ink);
  font-weight: 700;
  font-size: 18px;
}
:deep(.leaf-shape) {
  stroke: var(--paper);
  stroke-width: 2;
}
:deep(.leaf-text) {
  fill: var(--ink);
  font-size: 16px;
}
:deep(.soft-shape) {
  fill: var(--gold-soft);
  stroke: var(--gold);
  stroke-width: 1.5;
  stroke-dasharray: 3 2;
}
:deep(.soft-text) {
  fill: var(--gold-ink);
  font-family: "Caveat", cursive !important;
  font-size: 24px;
  font-weight: 700;
}
@keyframes march {
  to {
    stroke-dashoffset: -26;
  }
}
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.55;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}
</style>
