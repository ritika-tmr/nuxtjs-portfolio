<script setup>
// "Next page" link at the end of each main page, following the nav order.
// Contact loops back to Home. Project detail pages have their own
// "next project" link, so this stays hidden there.
const route = useRoute();

// This sits in the layout, outside the page transition, so it would switch
// the instant the route changes. Instead it switches once the next page is
// ready AND the red page-turn wave fully covers the screen (PageTurn.vue
// lifts the wave only after both), so the swap happens out of sight.
// Without the wave (reduced motion) it switches as soon as the page is ready.
const nuxtApp = useNuxtApp();
const turnActive = useState("pageTurnActive", () => false);
const turnCovered = useState("pageTurnCovered", () => false);
const shownPath = ref(route.path);
const readyPath = ref(route.path);
const offFinish = nuxtApp.hook("page:finish", () => (readyPath.value = route.path));
watchEffect(() => {
  if (!turnActive.value || turnCovered.value) shownPath.value = readyPath.value;
});
onBeforeUnmount(() => offFinish());

const next = computed(() => {
  const i = NAV_LINKS.findIndex((l) => l.to === shownPath.value);
  if (i < 0) return null;
  return { ...NAV_LINKS[(i + 1) % NAV_LINKS.length], loops: i === NAV_LINKS.length - 1 };
});
</script>

<template>
  <nav v-if="next" class="container mt-24" aria-label="Next page">
    <NuxtLink
      :to="next.to"
      class="group flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-10"
    >
      <span class="hand-note">{{ next.loops ? "back to the beginning" : "next up" }} · {{ next.teaser }}</span>
      <span class="font-display text-4xl font-semibold sm:text-6xl">
        <span class="squiggle squiggle-gold squiggle-hover">{{ next.label }}</span>
        <span class="ml-2 inline-block text-bridal transition-transform duration-300 group-hover:translate-x-2" aria-hidden="true">→</span>
      </span>
    </NuxtLink>
  </nav>
</template>
