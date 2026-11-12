<script setup>
// Two yomari on a golden plate. `fill` (0..1) raises the chaku (molasses)
// glow inside the dough, so the loader can show progress.
const props = defineProps({
  fill: { type: Number, default: 0 },
  steam: { type: Boolean, default: true },
});
const id = `yom-${useId()}`;
const chakuY = computed(() => 86 - 58 * Math.max(0, Math.min(1, props.fill)));
const dumplings = [
  { t: "translate(14,16) scale(.92)", cls: "y1" },
  { t: "translate(4,76) scale(.86)", cls: "y2" },
];
</script>

<template>
  <svg class="yomari-plate overflow-visible" viewBox="0 0 220 180" aria-hidden="true">
    <defs>
      <clipPath :id="id"><path :d="YOMARI" /></clipPath>
    </defs>
    <circle cx="122" cy="92" r="80" style="fill: var(--plate)" />
    <path d="M68 47 A70 70 0 0 0 68 137" fill="none" style="stroke: var(--plate-rim)" stroke-width="9" stroke-linecap="round" />
    <g v-if="steam" class="steam" fill="none" style="stroke: var(--muted)" stroke-width="2.5" stroke-linecap="round">
      <path d="M112 26 q-6 -8 0 -16 q6 -8 0 -16" />
      <path d="M132 22 q-6 -8 0 -16 q6 -8 0 -16" />
      <path d="M152 28 q-6 -8 0 -16 q6 -8 0 -16" />
    </g>
    <g v-for="dm in dumplings" :key="dm.cls" :transform="dm.t">
      <g :class="dm.cls">
        <path :d="YOMARI" style="fill: var(--dough-shade)" />
        <g :clip-path="`url(#${id})`">
          <path :d="YOMARI" transform="translate(0,-10)" style="fill: var(--dough)" />
          <rect x="0" y="30" width="200" height="90" :style="{ fill: 'var(--brick)', opacity: 0.22, transform: `translateY(${chakuY}px)`, transition: 'transform .4s ease' }" />
        </g>
        <circle cx="114" cy="50" r="8" fill="#fff" />
        <circle cx="99" cy="45" r="4.5" fill="#fff" />
      </g>
    </g>
  </svg>
</template>

<style scoped>
.y1,
.y2 {
  transform-box: fill-box;
  transform-origin: center;
  animation: yfloat 4s ease-in-out infinite;
}
.y2 {
  animation-delay: -2s;
}
@keyframes yfloat {
  50% {
    transform: translateY(-4px) rotate(-1.5deg);
  }
}
.steam path {
  opacity: 0;
  animation: steam 3.2s ease-out infinite;
}
.steam path:nth-child(2) {
  animation-delay: 0.6s;
}
.steam path:nth-child(3) {
  animation-delay: 1.2s;
}
@keyframes steam {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  35% {
    opacity: 0.7;
  }
  100% {
    opacity: 0;
    transform: translateY(-18px);
  }
}
</style>
