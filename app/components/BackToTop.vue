<script setup>
const show = ref(false);
const onScroll = () => (show.value = window.scrollY > 600);
const top = () => window.scrollTo({ top: 0, behavior: "smooth" });
onMounted(() => window.addEventListener("scroll", onScroll, { passive: true }));
onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));
</script>

<template>
  <Transition name="pop">
    <button
      v-show="show"
      type="button"
      class="back-top fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center bg-bridal text-on-bridal"
      aria-label="Back to top"
      @click="top"
    >
      <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 14l6-6 6 6" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.back-top {
  border-radius: 50% 46% 52% 48%;
  box-shadow: 0 4px 0 color-mix(in srgb, var(--bridal) 55%, #000);
  transition: transform 0.2s ease;
}
.back-top:hover {
  transform: translateY(-3px) rotate(-6deg);
}
.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
</style>
