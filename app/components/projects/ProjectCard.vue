<script setup>
const props = defineProps({
  project: { type: Object, required: true },
  shape: { type: Number, default: 0 },
  tint: { type: String, default: "mist" },
  ring: { type: String, default: "gold" },
  headingLevel: { type: String, default: "h3" },
});

const summary = computed(() => {
  const text = props.project.objectivesDetails || "";
  const first = text.split(/(?<=\.)\s/)[0];
  return first.length > 150 ? `${first.slice(0, 147).trim()}…` : first;
});
const tools = computed(() => props.project.technologies.slice(0, 4).map((t) => t.toLowerCase()).join(" · "));
</script>

<template>
  <NuxtLink :to="`/projects/${project.id}`" class="project-card group block">
    <ProjectImage :src="project.img" :alt="`${project.title} screenshot`" :shape="shape" :tint="tint" :ring="ring" />
    <div class="mt-6 px-2 sm:px-6">
      <component :is="headingLevel" class="flex items-baseline gap-3 text-3xl sm:text-4xl">
        <span class="squiggle squiggle-gold squiggle-hover">{{ project.title }}</span>
        <span class="text-bridal transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
      </component>
      <p class="mt-2 max-w-md text-muted">{{ summary }}</p>
      <p class="hand-note mt-2 !text-[1.45rem]">{{ tools }}</p>
    </div>
  </NuxtLink>
</template>
