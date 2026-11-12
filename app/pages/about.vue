<script setup>
const { state } = useApp();
const story = computed(() => state.value.story);
const qualifications = computed(() => state.value.qualifications);
const awards = computed(() => state.value.awards);

const tints = { brick: "brick-soft", gold: "gold-soft", mist: "mist", sage: "sage-soft", bridal: "bridal-soft", white: "white" };

// One gentle S-bend per chapter, passing through each chapter's marker
const thread = computed(() => {
  const n = story.value.length;
  let d = "M50 0 L50 50";
  for (let i = 0; i < n - 1; i++) {
    const x = i % 2 === 0 ? 92 : 8;
    const y0 = i * 100 + 50;
    d += ` C ${x} ${y0 + 30}, ${x} ${y0 + 70}, 50 ${y0 + 100}`;
  }
  return { d: `${d} L50 ${n * 100}`, h: n * 100 };
});

useHead({ title: "Story · Ritika Tamrakar" });
</script>

<template>
  <div>
    <section class="relative">
      <Wash :shape="1" tint="gold-soft" :opacity="0.9" class="-left-40 -top-32 h-[28rem] w-[34rem]" />
      <Wash :shape="3" tint="mist" :opacity="0.6" class="-right-32 top-24 h-[24rem] w-[28rem]" />
      <div class="container relative flex flex-wrap items-end justify-between gap-8 pb-6 pt-8 sm:pt-14">
        <h1 class="text-[clamp(2.6rem,6.5vw,5rem)] leading-[1.03]">
          How I got here,<br />
          <em class="text-bridal">the long way round.</em>
        </h1>
        <p class="hand-note max-w-xs rotate-3">follow the gold thread. it gets less dusty, I promise.</p>
      </div>
    </section>

    <section class="container relative mt-10 sm:mt-16" aria-label="Story chapters">
      <svg
        class="pointer-events-none absolute left-1/2 top-0 hidden h-full w-[300px] -translate-x-1/2 lg:block"
        :viewBox="`0 0 100 ${thread.h}`"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path :d="thread.d" fill="none" style="stroke: var(--gold)" stroke-width="4" stroke-dasharray="2 14" stroke-linecap="round" vector-effect="non-scaling-stroke" />
      </svg>

      <ol class="relative">
        <li
          v-for="(ch, i) in story"
          :key="ch.id"
          class="grid items-center gap-8 py-10 lg:grid-cols-[1fr_96px_1fr] lg:gap-6 lg:py-14"
        >
          <div v-reveal class="mx-auto w-full max-w-[420px]" :class="i % 2 === 0 ? 'lg:order-1' : 'lg:order-3'">
            <BlobFrame :shape="i % 4" :tint="tints[ch.tint] || 'mist'" :ring="i % 2 ? 'brick' : 'gold'" ratio="6 / 5">
              <StoryArt :kind="ch.art" />
            </BlobFrame>
          </div>
          <div class="order-2 hidden justify-center lg:flex" aria-hidden="true">
            <span class="h-6 w-6 rounded-full border-[5px] border-bridal bg-paper" />
          </div>
          <div v-reveal="120" class="max-w-md" :class="i % 2 === 0 ? 'lg:order-3' : 'lg:order-1 lg:ml-auto'">
            <p class="hand-note">{{ ch.when }}</p>
            <h2 class="mt-1 text-4xl leading-tight sm:text-[2.6rem]">{{ ch.title }}</h2>
            <p class="mt-4 text-lg text-muted">{{ ch.body }}</p>
            <p v-if="ch.aside" class="mt-3 -rotate-2 font-hand text-2xl text-bridal">{{ ch.aside }}</p>
          </div>
        </li>
      </ol>
    </section>

    <section class="container mt-16" aria-labelledby="paperwork-title">
      <div class="paperwork relative mx-auto max-w-3xl bg-paper-2 px-8 py-10 sm:px-14">
        <Sparkle class="absolute -right-3 -top-4 h-10 w-10" />
        <h2 id="paperwork-title" class="hand-note !text-3xl">the paperwork version</h2>
        <ul class="mt-4 space-y-4">
          <li v-for="q in qualifications" :key="q.id">
            <p class="font-display text-xl font-semibold">{{ q.course }}, {{ q.major }}</p>
            <p class="text-muted">{{ q.institution }} · {{ q.location }}</p>
          </li>
          <li v-for="a in awards" :key="`a${a.id}`">
            <p class="font-display text-xl font-semibold">{{ a.title }}: {{ a.description }}</p>
            <p class="text-muted">{{ a.institution }} · {{ a.date }}</p>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.paperwork {
  border-radius: 48px 64px 52px 72px / 60px 44px 70px 50px;
  transform: rotate(-0.6deg);
}
</style>
