<script setup>
// A screenshot in a blob frame. Until the image has loaded, a carved lattice
// screen covers it; then the screen slides up like an opening window.
defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: "" },
  shape: { type: Number, default: 0 },
  tint: { type: String, default: "mist" },
  ring: { type: String, default: "gold" },
  ratio: { type: String, default: "4 / 3" },
});
const img = ref(null);
const loaded = ref(false);
onMounted(() => {
  if (img.value?.complete && img.value.naturalWidth) loaded.value = true;
});
</script>

<template>
  <BlobFrame :shape="shape" :tint="tint" :ring="ring" :ratio="ratio">
    <img
      ref="img"
      :src="src"
      :alt="alt"
      loading="lazy"
      decoding="async"
      class="shot absolute left-[13%] top-[15%] h-[70%] w-[74%] object-contain transition-transform duration-700 ease-out group-hover:-rotate-1 group-hover:scale-[1.05]"
      @load="loaded = true"
      @error="loaded = true"
    />
    <div class="lattice-screen absolute inset-0" :class="{ 'is-lifted': loaded }" aria-hidden="true" />
  </BlobFrame>
</template>

<style scoped>
.shot {
  filter: drop-shadow(0 12px 18px color-mix(in srgb, var(--wood) 22%, transparent));
}
</style>
