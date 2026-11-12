<script setup>
// "Turning the page": a bridal-red wave rolls up over the screen as soon as
// you navigate. It lifts only once it has fully covered the screen AND the
// next page is ready. Shared state lets other layout parts (the next-page
// link) swap while the screen is covered.
const router = useRouter();
const nuxtApp = useNuxtApp();
const active = useState("pageTurnActive", () => false); // a turn is in progress
const covered = useState("pageTurnCovered", () => false); // wave fully over the screen
const phase = ref("idle"); // idle | covering | leaving
const COVER = 260; // ms: matches the cover transition below
const LEAVE = 380; // ms: matches the roll-off transition below
let pageReady = false;
const timers = [];
const later = (fn, ms) => timers.push(setTimeout(fn, ms));
const clearAll = () => timers.splice(0).forEach(clearTimeout);
let offRouter = null;
let offFinish = null;

function maybeLeave() {
  if (phase.value !== "covering" || !covered.value || !pageReady) return;
  // one frame for the new page to paint under the wave, then roll off
  later(() => {
    phase.value = "leaving";
    later(() => {
      phase.value = "idle";
      active.value = false;
      covered.value = false;
    }, LEAVE);
  }, 40);
}

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  offRouter = router.beforeEach((to, from) => {
    if (to.path === from.path) return;
    clearAll();
    pageReady = false;
    covered.value = false;
    active.value = true;
    phase.value = "covering";
    later(() => {
      covered.value = true;
      maybeLeave();
    }, COVER);
    // never leave the screen covered if something goes wrong
    later(() => {
      pageReady = true;
      maybeLeave();
    }, 3000);
  });
  offFinish = nuxtApp.hook("page:finish", () => {
    pageReady = true;
    maybeLeave();
  });
});
onBeforeUnmount(() => {
  if (offRouter) offRouter();
  if (offFinish) offFinish();
  clearAll();
  active.value = false;
  covered.value = false;
});
</script>

<template>
  <div class="page-turn pointer-events-none fixed inset-0 z-[90] overflow-hidden" :class="`is-${phase}`" aria-hidden="true">
    <div class="page-turn-wave absolute inset-x-0 -bottom-[30%] h-[130%]">
      <svg class="block h-[90px] w-full" viewBox="0 0 1440 90" preserveAspectRatio="none">
        <path d="M0,60 C220,0 460,90 760,40 C1020,0 1240,70 1440,20 L1440,91 L0,91 Z" style="fill: var(--bridal)" />
      </svg>
      <div class="flex h-[calc(100%-89px)] items-start justify-center bg-bridal pt-[22vh]">
        <span class="font-hand text-3xl text-on-bridal sm:text-4xl">turning the page →</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-turn-wave {
  transform: translateY(100%);
}
/* rolls up and covers the screen quickly */
.is-covering .page-turn-wave {
  transform: translateY(0%);
  transition: transform 0.26s cubic-bezier(0.3, 0, 0.3, 1);
}
/* rolls off the top once the next page is ready */
.is-leaving .page-turn-wave {
  transform: translateY(-115%);
  transition: transform 0.38s cubic-bezier(0.6, 0, 0.4, 1);
}
</style>
