<script setup>
const { state } = useApp();
const projects = computed(() => state.value.projects);

const filters = [
  { key: "", label: "everything" },
  { key: "frontend", label: "frontend" },
  { key: "ui/ux", label: "ui/ux" },
  { key: "backend", label: "backend" },
];
const active = ref("");
const norm = (s) => (s || "").toLowerCase().replace(/\s+/g, "");
const shown = computed(() => (active.value ? projects.value.filter((p) => norm(p.tag).includes(active.value)) : projects.value));

// Two staggered columns instead of a grid of equal tiles
const looks = [
  { shape: 0, tint: "mist", ring: "gold" },
  { shape: 1, tint: "sage-soft", ring: "brick" },
  { shape: 2, tint: "brick-soft", ring: "bridal" },
  { shape: 3, tint: "gold-soft", ring: "sage" },
  { shape: 1, tint: "bridal-soft", ring: "gold" },
];
const columns = computed(() => {
  const cols = [[], []];
  shown.value.forEach((p, i) => cols[i % 2].push({ p, look: looks[i % looks.length], i }));
  return cols;
});

useHead({ title: "Projects · Ritika Tamrakar" });
</script>

<template>
  <div>
    <section class="relative">
      <Wash :shape="2" tint="bridal-soft" :opacity="0.6" class="-left-40 -top-40 h-[28rem] w-[32rem]" />
      <div class="container relative flex flex-wrap items-end justify-between gap-6 pb-6 pt-8 sm:pt-14">
        <div>
          <h1 class="text-[clamp(2.6rem,6.5vw,5rem)] leading-[1.03]">Things I've <em class="text-bridal">made.</em></h1>
          <p class="mt-4 max-w-lg text-lg text-muted">{{ state.projectsDescription }}</p>
        </div>
        <div class="flex flex-wrap gap-x-6 gap-y-2 text-lg" role="group" aria-label="Filter projects">
          <button
            v-for="f in filters"
            :key="f.label"
            type="button"
            class="squiggle squiggle-gold squiggle-hover"
            :class="active === f.key ? 'is-active font-bold text-bridal' : 'hover:text-bridal'"
            :aria-pressed="active === f.key"
            @click="active = f.key"
          >{{ f.label }}</button>
        </div>
      </div>
    </section>

    <section class="container mt-12" aria-label="Projects">
      <div v-if="shown.length" class="grid gap-16 md:grid-cols-2 md:gap-x-20">
        <div v-for="(col, c) in columns" :key="`col${c}`" class="flex flex-col gap-20" :class="c === 1 ? 'md:pt-40' : ''">
          <ProjectCard
            v-for="item in col"
            :key="item.p.id"
            v-reveal="(item.i % 2) * 120"
            :project="item.p"
            :shape="item.look.shape"
            :tint="item.look.tint"
            :ring="item.look.ring"
            heading-level="h2"
          />
        </div>
      </div>
      <p v-else class="hand-note text-center">nothing here yet. check back soon.</p>
    </section>
  </div>
</template>
