<script setup>
const links = NAV_LINKS;

const route = useRoute();
const { state } = useApp();
const open = ref(false);
const scrolled = ref(false);

const isActive = (to) => (to === "/" ? route.path === "/" : route.path.startsWith(to));
const mailto = computed(
  () => `mailto:${state.value.contact.email}?subject=${encodeURIComponent("Let's work together")}&body=${encodeURIComponent("Hi Ritika,")}`
);

watch(() => route.path, () => (open.value = false));

const onScroll = () => (scrolled.value = window.scrollY > 24);
onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));
</script>

<template>
  <header class="site-header sticky top-0 z-50 transition-colors duration-300" :class="{ 'is-scrolled': scrolled }">
    <div class="container flex items-center justify-between gap-4 py-4 sm:py-5">
      <NuxtLink to="/" class="group flex items-center gap-2.5" aria-label="Ritika Tamrakar, home">
        <span class="logo-dot flex h-11 w-11 items-center justify-center bg-bridal font-display text-xl text-on-bridal transition-transform duration-300 group-hover:rotate-[-8deg]">R</span>
        <span class="font-hand text-[1.8rem] leading-none">ritika</span>
      </NuxtLink>

      <nav class="nav-pill hidden items-center gap-1 rounded-full px-3 py-2 md:flex" aria-label="Main">
        <NuxtLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="squiggle squiggle-gold squiggle-hover rounded-full px-3.5 py-1.5 text-[15px] transition-colors"
          :class="isActive(l.to) ? 'is-active font-bold text-bridal' : 'hover:text-bridal'"
          :aria-current="isActive(l.to) ? 'page' : undefined"
        >{{ l.label }}</NuxtLink>
      </nav>

      <div class="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <a :href="mailto" class="btn btn-red hidden !px-5 !py-2.5 sm:inline-flex">Hire me</a>
        <button
          type="button"
          class="flex h-11 w-11 items-center justify-center rounded-full border border-line md:hidden"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          aria-label="Menu"
          @click="open = !open"
        >
          <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path v-if="!open" d="M4 7c4-1.5 12 1.5 16 0M4 12h16M4 17c4 1.5 12-1.5 16 0" />
            <path v-else d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>

    <Transition name="drop">
      <nav v-if="open" id="mobile-nav" class="container pb-6 md:hidden" aria-label="Mobile">
        <div class="mobile-sheet flex flex-col gap-1 bg-paper-2 p-5">
          <NuxtLink
            v-for="l in links"
            :key="l.to"
            :to="l.to"
            class="rounded-2xl px-4 py-3 font-display text-2xl"
            :class="isActive(l.to) ? 'text-bridal' : ''"
          >{{ l.label }}</NuxtLink>
          <a :href="mailto" class="btn btn-red mt-3">Hire me</a>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.site-header.is-scrolled {
  background: color-mix(in srgb, var(--paper) 88%, transparent);
  backdrop-filter: blur(10px);
}
.logo-dot {
  border-radius: 50% 46% 52% 48%;
}
.nav-pill {
  background: color-mix(in srgb, var(--surface) 78%, transparent);
  box-shadow: 0 10px 30px color-mix(in srgb, var(--wood) 10%, transparent);
}
.mobile-sheet {
  border-radius: 36px 48px 40px 52px / 44px 36px 52px 40px;
}
.drop-enter-active,
.drop-leave-active {
  transition: opacity 0.2s ease, transform 0.25s ease;
}
.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
