<script setup>
// A round, slightly tilted sticker (e.g. the Optimise win).
defineProps({
  small: { type: String, default: "" },
  big: { type: String, required: true },
  tilt: { type: Number, default: -10 },
});
</script>

<template>
  <div
    class="sticker flex aspect-square flex-col items-center justify-center rounded-full bg-bridal text-center text-on-bridal"
    :style="{ transform: `rotate(${tilt}deg)` }"
  >
    <span v-if="small" class="font-hand text-xl leading-none">{{ small }}</span>
    <span class="mt-1.5 font-display text-2xl font-semibold leading-tight" v-html="big" />
  </div>
</template>

<style scoped>
.sticker {
  box-shadow: 0 0 0 6px var(--paper), 0 0 0 8px var(--gold);
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1.4);
}
.sticker:hover {
  transform: rotate(0deg) scale(1.06) !important;
}
</style>
