<script setup>
// A soft watercolour patch for backgrounds. Purely decorative.
const props = defineProps({
  shape: { type: Number, default: 0 },
  tint: { type: String, default: "mist" },
  opacity: { type: Number, default: 0.6 },
});
const d = computed(() => blobPath(props.shape));
</script>

<template>
  <svg
    class="pointer-events-none absolute -z-10"
    viewBox="-80 -80 160 160"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path :d="d" :style="{ fill: `var(--${tint})` }" :opacity="opacity" />
  </svg>
</template>
