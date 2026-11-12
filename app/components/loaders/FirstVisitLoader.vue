<script setup>
// Shown once per browser session on the first page load. The server renders
// it visible; a tiny head script hides it straight away on later visits in
// the same session, so there is no flash. A CSS fallback removes it even if
// JavaScript never runs.
const KEY = "rt-loader-seen";

useHead({
  script: [
    {
      key: "rt-loader-flag",
      tagPosition: "head",
      innerHTML: `try{if(sessionStorage.getItem("${KEY}"))document.documentElement.classList.add("loader-seen")}catch(e){}`,
    },
  ],
});

const lines = [
  "Steaming the yomari…",
  "Adding the chaku…",
  "Hanging the dachi apa…",
  "Pretty, pretty, pretty close…",
];

const visible = ref(true);
const leaving = ref(false);
const progress = ref(0);
const line = computed(() => lines[Math.min(lines.length - 1, Math.floor(progress.value * lines.length))]);
let raf = 0;

function finish() {
  cancelAnimationFrame(raf);
  progress.value = 1;
  try {
    sessionStorage.setItem(KEY, "1");
  } catch (e) {}
  leaving.value = true;
  setTimeout(() => (visible.value = false), 900);
}

onMounted(() => {
  if (document.documentElement.classList.contains("loader-seen")) {
    visible.value = false;
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const minTime = reduce ? 300 : 1700;
  const start = performance.now();
  let loaded = document.readyState === "complete";
  if (!loaded) window.addEventListener("load", () => (loaded = true), { once: true });
  const step = (now) => {
    const t = (now - start) / minTime;
    // Ease toward 90% until the page has loaded, then run to the end
    progress.value = loaded ? Math.min(1, t) : Math.min(0.9, t);
    if (progress.value >= 1) setTimeout(finish, reduce ? 0 : 250);
    else raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
});
onBeforeUnmount(() => cancelAnimationFrame(raf));
</script>

<template>
  <div
    v-if="visible"
    class="first-loader fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-paper px-4"
    :class="{ 'is-leaving': leaving }"
    role="status"
    aria-live="polite"
  >
    <div class="absolute left-5 top-5 flex items-center gap-2 sm:left-8 sm:top-6">
      <span class="logo-dot flex h-10 w-10 items-center justify-center bg-bridal font-display text-lg text-on-bridal">R</span>
      <span class="font-hand text-2xl">ritika</span>
    </div>
    <button type="button" class="btn btn-ghost absolute right-5 top-5 !px-4 !py-2 sm:right-8 sm:top-6" @click="finish">Skip</button>

    <YomariPlate class="w-[min(260px,62vw)]" :fill="progress" />
    <div class="h-1.5 w-[min(280px,70vw)] overflow-hidden rounded-full bg-paper-2" aria-hidden="true">
      <div class="h-full rounded-full bg-bridal" :style="{ width: `${progress * 100}%` }" />
    </div>
    <p class="hand-note text-center">{{ line }}</p>
  </div>
</template>

<style>
.loader-seen .first-loader {
  display: none !important;
}
</style>

<style scoped>
.logo-dot {
  border-radius: 50% 46% 52% 48%;
}
.first-loader {
  transition: transform 0.9s cubic-bezier(0.7, 0, 0.3, 1);
  /* safety net: never block the page if scripts fail */
  animation: loader-fallback 0.6s 6s forwards;
}
.first-loader.is-leaving {
  transform: translateY(-100%);
}
@keyframes loader-fallback {
  to {
    transform: translateY(-100%);
    visibility: hidden;
  }
}
</style>
