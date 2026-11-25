<script setup>
// Skills section of Home: the interactive skills tree.
const { state } = useApp();
const skills = computed(() => state.value.skills);
const story = computed(() => state.value.story);
</script>

<template>
  <section id="skills" class="relative mt-24 scroll-mt-24" aria-labelledby="skills-title">
    <WaveDivider tint="paper-2" class="-mb-px" />
    <div class="bg-paper-2 pb-16 pt-6">
      <div class="container relative flex flex-wrap items-end justify-between gap-6 pb-8">
        <h2 id="skills-title" v-reveal class="text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.03]">
          Everything <em class="text-bridal">connects.</em>
        </h2>
        <p class="max-w-md text-lg text-muted">
          Data, design, delivery and code, as one tree. Hover a branch and its skills light up; the dotted gold threads are the soft skills that tie it all together.
        </p>
      </div>

      <div class="container">
        <ClientOnly>
          <SkillsMap :skills="skills" :story="story" />
          <!-- Without JavaScript (and while it loads) the same skills as a list -->
          <template #fallback>
            <ul class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <li v-for="b in skills.branches" :key="b.id">
                <p class="font-display text-2xl font-semibold" :style="{ color: `var(${b.color})` }">{{ b.label }}</p>
                <p class="text-muted">{{ skills.leaves.filter((l) => l.branch === b.id).map((l) => l.label).join(", ") }}</p>
              </li>
            </ul>
          </template>
        </ClientOnly>
        <p class="hand-note mt-8 text-right">drag a node. it bounces back, like me after a deadline.</p>
      </div>
    </div>
    <WaveDivider tint="paper-2" flip class="-mt-px" />
  </section>
</template>
