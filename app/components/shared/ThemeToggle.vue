<script setup>
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");
const toggle = () => (colorMode.preference = isDark.value ? "light" : "dark");
</script>

<template>
  <button
    type="button"
    class="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-transform hover:rotate-12"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggle"
  >
    <ClientOnly>
      <svg v-if="isDark" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg v-else viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20.4 14.5A8.5 8.5 0 0 1 9.5 3.6a8.5 8.5 0 1 0 10.9 10.9z" />
      </svg>
      <template #fallback><span class="h-5 w-5" /></template>
    </ClientOnly>
  </button>
</template>
