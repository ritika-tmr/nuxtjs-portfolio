<script setup>
const { state } = useApp();
const skills = computed(() => state.value.skills);
const story = computed(() => state.value.story);

useHead({ title: "Skills · Ritika Tamrakar" });
</script>

<template>
  <div>
    <section class="relative">
      <Wash :shape="2" tint="mist" :opacity="0.55" class="-left-40 top-10 h-[26rem] w-[30rem]" />
      <div class="container relative flex flex-wrap items-end justify-between gap-6 pb-8 pt-8 sm:pt-14">
        <h1 class="text-[clamp(2.6rem,6.5vw,5rem)] leading-[1.03]">Everything <em class="text-bridal">connects.</em></h1>
        <p class="max-w-md text-lg text-muted">
          Hover a branch and its skills light up. The dotted gold threads are the soft skills that tie it all together.
        </p>
      </div>
    </section>

    <section class="container" aria-label="Skills mind map">
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
    </section>
  </div>
</template>
