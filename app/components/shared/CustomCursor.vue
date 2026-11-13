<script setup>
// Custom cursor: a red dot that follows the pointer exactly and a gold ring
// that trails behind it. Over links/buttons the ring swells into a soft blob;
// on press it squeezes. Mouse and trackpad only: touch screens and anyone who
// prefers reduced motion keep the normal cursor behaviour (no trailing).
const enabled = ref(false);
const reduceMotion = ref(false);
const hovering = ref(false);
const pressed = ref(false);
const hidden = ref(true);
const dot = ref(null);
const ring = ref(null);
const tailEls = ref([]);

// Trailing tail: a chain of small dots, each chasing the one ahead of it, so
// fast movement stretches it out and it gathers back in when the mouse stops.
const TAIL = 20;
const tail = Array.from({ length: TAIL }, (_, i) => {
  const t = i / (TAIL - 1); // 0 = right behind the cursor, 1 = the tip
  return {
    key: i,
    size: 8 - t * 5.5,
    opacity: 0.7 * (1 - t) + 0.08,
    color: `color-mix(in srgb, var(--bridal) ${Math.round((1 - t) * 100)}%, var(--gold))`,
  };
});
const tailPos = tail.map(() => ({ x: 0, y: 0 }));

const INTERACTIVE = "a, button, [role='button'], label, summary, input, select, textarea, .node";
let x = 0, y = 0, rx = 0, ry = 0, raf = 0, reduce = false;

function onMove(e) {
  x = e.clientX;
  y = e.clientY;
  hidden.value = false;
  hovering.value = !!e.target.closest?.(INTERACTIVE);
  if (dot.value) dot.value.style.transform = `translate(${x}px, ${y}px)`;
  if (reduce && ring.value) {
    rx = x; ry = y;
    ring.value.style.transform = `translate(${rx}px, ${ry}px)`;
  }
}
function loop() {
  rx += (x - rx) * 0.18;
  ry += (y - ry) * 0.18;
  if (ring.value) ring.value.style.transform = `translate(${rx}px, ${ry}px)`;
  let px = x, py = y;
  tailPos.forEach((p, i) => {
    p.x += (px - p.x) * 0.3;
    p.y += (py - p.y) * 0.3;
    const el = tailEls.value[i];
    if (el) el.style.transform = `translate(${p.x}px, ${p.y}px)`;
    px = p.x;
    py = p.y;
  });
  raf = requestAnimationFrame(loop);
}
const onDown = () => (pressed.value = true);
const onUp = () => (pressed.value = false);
const onLeave = () => (hidden.value = true);

onMounted(() => {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  reduceMotion.value = reduce;
  enabled.value = true;
  document.documentElement.classList.add("has-custom-cursor");
  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("mousedown", onDown);
  window.addEventListener("mouseup", onUp);
  document.addEventListener("mouseleave", onLeave);
  if (!reduce) raf = requestAnimationFrame(loop);
});
onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  document.documentElement.classList.remove("has-custom-cursor");
  window.removeEventListener("mousemove", onMove);
  window.removeEventListener("mousedown", onDown);
  window.removeEventListener("mouseup", onUp);
  document.removeEventListener("mouseleave", onLeave);
});
</script>

<template>
  <div
    v-if="enabled"
    class="cursor-layer pointer-events-none fixed inset-0 z-[200]"
    :class="{ 'is-hover': hovering, 'is-pressed': pressed, 'is-hidden': hidden }"
    aria-hidden="true"
  >
    <template v-if="!reduceMotion">
      <div v-for="(t, i) in tail" :key="t.key" :ref="(el) => (tailEls[i] = el)" class="cursor-tail-pos">
        <span class="cursor-tail" :style="{ width: `${t.size}px`, height: `${t.size}px`, margin: `${-t.size / 2}px 0 0 ${-t.size / 2}px`, opacity: t.opacity, background: t.color }" />
      </div>
    </template>
    <div ref="ring" class="cursor-ring-pos"><span class="cursor-ring" /></div>
    <div ref="dot" class="cursor-dot-pos"><span class="cursor-dot" /></div>
  </div>
</template>

<style scoped>
.cursor-tail {
  position: absolute;
  border-radius: 50%;
  transition: opacity 0.2s ease;
}
.is-hidden .cursor-tail {
  opacity: 0 !important;
}
.cursor-tail-pos,
.cursor-ring-pos,
.cursor-dot-pos {
  position: fixed;
  left: 0;
  top: 0;
  will-change: transform;
}
.cursor-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  margin: -4px 0 0 -4px;
  border-radius: 50%;
  background: var(--bridal);
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.cursor-ring {
  position: absolute;
  width: 34px;
  height: 34px;
  margin: -17px 0 0 -17px;
  border: 1.5px solid var(--gold);
  border-radius: 48% 52% 46% 54% / 54% 46% 54% 46%;
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1.3), background-color 0.3s ease, border-color 0.3s ease, opacity 0.2s ease;
  animation: wobble 6s ease-in-out infinite;
}
@keyframes wobble {
  50% {
    border-radius: 54% 46% 52% 48% / 46% 54% 46% 54%;
  }
}
/* over links and buttons: the ring swells into a soft tinted blob */
.is-hover .cursor-ring {
  transform: scale(1.7);
  background: color-mix(in srgb, var(--gold) 22%, transparent);
  border-color: transparent;
}
.is-hover .cursor-dot {
  transform: scale(0.6);
}
/* on press: a little squeeze */
.is-pressed .cursor-ring {
  transform: scale(0.8);
}
.is-hover.is-pressed .cursor-ring {
  transform: scale(1.4);
}
.is-hidden .cursor-ring,
.is-hidden .cursor-dot {
  opacity: 0;
}
</style>
