<script setup>
defineProps({ tint: { type: String, default: "gold" } });
</script>

<template>
  <svg class="pointer-events-none" viewBox="0 0 40 40" aria-hidden="true">
    <path
      d="M20 2 C22 14 26 18 38 20 C26 22 22 26 20 38 C18 26 14 22 2 20 C14 18 18 14 20 2Z"
      :style="{ fill: `var(--${tint})` }"
    />
  </svg>
</template>
