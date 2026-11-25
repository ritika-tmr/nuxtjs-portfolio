<script setup>
// A wavy edge between sections. `flip` makes it a bottom edge (wave hangs down).
defineProps({
  tint: { type: String, default: "sage-soft" },
  flip: { type: Boolean, default: false },
  height: { type: Number, default: 120 },
});
</script>

<template>
  <svg
    class="pointer-events-none block w-full"
    :style="{ height: `clamp(48px, 9vw, ${height}px)` }"
    viewBox="0 0 1440 120"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      v-if="!flip"
      d="M0,72 C220,6 460,120 760,54 C1020,0 1240,84 1440,30 L1440,121 L0,121 Z"
      :style="{ fill: `var(--${tint})` }"
    />
    <path
      v-else
      d="M0,-1 L1440,-1 L1440,42 C1180,120 900,6 640,66 C400,120 180,48 0,84 Z"
      :style="{ fill: `var(--${tint})` }"
    />
  </svg>
</template>
