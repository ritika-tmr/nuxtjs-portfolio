<script setup>
// An organic, blob-shaped frame. Whatever goes in the default slot (an image,
// an illustration) is clipped to the blob. A dotted outline sits just outside.
const props = defineProps({
  shape: { type: Number, default: 0 },
  tint: { type: String, default: "mist" }, // a token name from app.css
  ring: { type: String, default: "gold" }, // a token name, or "" for none
  ratio: { type: String, default: "4 / 3" },
});

const id = `blob-${useId()}`;
const d = computed(() => blobPath(props.shape));
</script>

<template>
  <div class="blob-frame relative w-full" :style="{ aspectRatio: ratio }">
    <svg
      v-if="ring"
      class="pointer-events-none absolute -inset-[4%] h-[108%] w-[108%] overflow-visible"
      viewBox="-80 -80 160 160"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        :d="d"
        transform="rotate(5)"
        fill="none"
        :style="{ stroke: `var(--${ring})` }"
        stroke-width="2"
        stroke-dasharray="2 8"
        stroke-linecap="round"
        vector-effect="non-scaling-stroke"
      />
    </svg>
    <div
      class="absolute inset-0 overflow-hidden"
      :style="{ clipPath: `url(#${id})`, background: `var(--${tint})` }"
    >
      <slot />
    </div>
    <svg width="0" height="0" class="absolute" aria-hidden="true" focusable="false">
      <clipPath :id="id" clipPathUnits="objectBoundingBox">
        <path :d="d" transform="translate(0.5 0.5) scale(0.00625)" />
      </clipPath>
    </svg>
  </div>
</template>
