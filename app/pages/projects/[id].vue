<script setup>
const route = useRoute();
const { state, getProjectById } = useApp();
const project = getProjectById(route.params.id);

const next = computed(() => {
  const list = state.value.projects;
  const i = list.findIndex((p) => p.id === route.params.id);
  return i >= 0 ? list[(i + 1) % list.length] : null;
});

const loaded = reactive({});
const markLoaded = (k) => (loaded[k] = true);
const imgRefs = ref([]);
onMounted(() => {
  imgRefs.value.forEach((el) => {
    if (el?.complete && el.naturalWidth) loaded[el.dataset.key] = true;
  });
});

const shapes = [
  "42px 64px 48px 70px / 56px 40px 66px 46px",
  "64px 40px 70px 48px / 44px 62px 42px 60px",
  "52px 70px 40px 58px / 62px 48px 58px 40px",
];

useHead({ title: computed(() => (project.value ? `${project.value.title} · Ritika Tamrakar` : "Project · Ritika Tamrakar")) });
</script>

<template>
  <div class="container">
    <article v-if="project" class="pt-8 sm:pt-12">
      <NuxtLink to="/projects" class="squiggle squiggle-brick squiggle-hover font-bold">← All projects</NuxtLink>

      <header class="relative mt-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p class="hand-note">{{ project.category }} · {{ project.publishDate.replace(/\s+,/, ",") }}</p>
          <h1 class="mt-1 text-[clamp(2.6rem,7vw,5.5rem)] leading-none">{{ project.title }}</h1>
        </div>
        <p class="max-w-md text-lg text-muted">{{ project.objectivesDetails }}</p>
      </header>

      <div class="mt-14 grid gap-12 md:grid-cols-2 md:gap-x-14">
        <figure
          v-for="(im, i) in project.projectImages"
          :key="`${im.img}-${i}`"
          v-reveal="(i % 2) * 120"
          :class="[i % 2 === 1 ? 'md:mt-24' : '', project.projectImages.length === 1 ? 'md:col-span-2' : '']"
        >
          <div class="relative overflow-hidden bg-paper-2" :style="{ borderRadius: shapes[i % shapes.length] }">
            <img
              :ref="(el) => (imgRefs[i] = el)"
              :data-key="`${im.img}-${i}`"
              :src="im.img"
              :alt="`${project.title}: ${im.title}`"
              loading="lazy"
              decoding="async"
              class="block w-full"
              @load="markLoaded(`${im.img}-${i}`)"
              @error="markLoaded(`${im.img}-${i}`)"
            />
            <div class="lattice-screen absolute inset-0" :class="{ 'is-lifted': loaded[`${im.img}-${i}`] }" aria-hidden="true" />
          </div>
          <figcaption class="hand-note mt-3 px-4 !text-xl !text-muted">{{ im.title }}</figcaption>
        </figure>
      </div>

      <div class="mt-20 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 class="text-3xl">Made with</h2>
          <ul class="mt-4 flex flex-wrap gap-x-5 gap-y-1">
            <li v-for="t in project.technologies" :key="t" class="font-hand text-2xl text-brick">{{ t.toLowerCase() }}</li>
          </ul>
          <p class="mt-6 text-muted">{{ project.tag.trim() }}</p>
        </div>
        <div>
          <h2 class="text-3xl">How it came together</h2>
          <p v-for="d in project.projectDetails" :key="d.id" class="mt-4 text-lg text-muted">{{ d.details }}</p>
        </div>
      </div>

      <NuxtLink
        v-if="next && next.id !== project.id"
        :to="`/projects/${next.id}`"
        class="group mt-24 flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-10"
      >
        <span class="hand-note">next project</span>
        <span class="font-display text-4xl font-semibold sm:text-6xl">
          <span class="squiggle squiggle-gold squiggle-hover">{{ next.title }}</span>
          <span class="ml-2 inline-block text-bridal transition-transform duration-300 group-hover:translate-x-2">→</span>
        </span>
      </NuxtLink>
    </article>

    <div v-else class="flex flex-col items-center py-24 text-center">
      <YomariPlate class="w-48" />
      <h1 class="mt-6 text-4xl">This project wandered off.</h1>
      <p class="mt-3 text-muted">It might have been renamed or moved.</p>
      <NuxtLink to="/projects" class="btn btn-red mt-8">See all projects</NuxtLink>
    </div>
  </div>
</template>
