<script setup>
// Home is the whole site in one long page:
// hero -> story (map flying beside the chapters) -> skills tree -> selected
// work -> contact (the footer). The menu scrolls to each section.
const { state } = useApp();
const featured = computed(() =>
  ["Roadmate", "FilmVault", "Woodenkits"].map((t) => state.value.projects.find((p) => p.title === t)).filter(Boolean)
);
const looks = [
  { shape: 2, tint: "mist", ring: "gold" },
  { shape: 1, tint: "sage-soft", ring: "brick" },
  { shape: 3, tint: "brick-soft", ring: "bridal" },
];

useSectionSpy(["top", "story", "skills", "work", "contact"]);
useHead({ title: "Ritika Tamrakar · data, design and frontend" });
</script>

<template>
  <div>
    <HeroSection />

    <StorySection />

    <SkillsSection />

    <!-- Selected work -->
    <section id="work" class="container mt-20 scroll-mt-24" aria-labelledby="work-title">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <h2 id="work-title" v-reveal class="text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.03]">Things I've <em class="text-bridal">made.</em></h2>
        <NuxtLink to="/projects" class="squiggle squiggle-brick font-bold">See all {{ state.projects.length }} projects →</NuxtLink>
      </div>
      <div class="mt-14 grid gap-16 md:grid-cols-2 md:gap-x-20">
        <ProjectCard
          v-for="(p, i) in featured"
          :key="p.id"
          v-reveal="(i % 2) * 150"
          :project="p"
          :shape="looks[i].shape"
          :tint="looks[i].tint"
          :ring="looks[i].ring"
          :class="[i === 1 ? 'md:mt-32' : '', i === 2 ? 'md:col-span-2 md:mx-auto md:w-1/2' : '']"
        />
      </div>
    </section>
  </div>
</template>
