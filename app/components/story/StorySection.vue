<script setup>
// Story section of Home: the journey map and the chapters together. The map stays
// pinned at the side (a strip along the top on phones) while the chapters
// scroll past; whichever chapter is in the middle of the screen decides
// which city the yomari flies to.
const { state } = useApp();
const story = computed(() => state.value.story);
const journey = computed(() => state.value.journey);
const qualifications = computed(() => state.value.qualifications);
const awards = computed(() => state.value.awards);

const tints = { brick: "brick-soft", gold: "gold-soft", mist: "mist", sage: "sage-soft", bridal: "bridal-soft", white: "white" };

// The flight follows the scroll: between the middle of one chapter and the
// middle of the next, the yomari travels from one chapter's city to the
// next one's (flying during the central part of that stretch).
const chapterEls = ref([]);
const journeyPos = ref(0); // fractional position along the journey stops
const activeStop = computed(() => Math.round(journeyPos.value));
const smooth = (t) => t * t * (3 - 2 * t);

function updateJourney() {
  const els = chapterEls.value.filter(Boolean);
  if (!els.length) return;
  const mid = window.innerHeight / 2;
  const centres = els.map((el) => {
    const r = el.getBoundingClientRect();
    return r.top + r.height / 2;
  });
  const stops = story.value.map((ch) => ch.stop ?? 0);
  if (mid <= centres[0]) return (journeyPos.value = stops[0]);
  if (mid >= centres.at(-1)) return (journeyPos.value = stops.at(-1));
  const i = centres.findIndex((c, k) => mid >= c && mid < centres[k + 1]);
  const f = (mid - centres[i]) / (centres[i + 1] - centres[i]);
  const t = smooth(Math.max(0, Math.min(1, (f - 0.2) / 0.6)));
  journeyPos.value = stops[i] + (stops[i + 1] - stops[i]) * t;
}

onMounted(() => {
  updateJourney();
  window.addEventListener("scroll", updateJourney, { passive: true });
  window.addEventListener("resize", updateJourney);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateJourney);
  window.removeEventListener("resize", updateJourney);
});

</script>

<template>
  <section id="story" class="story-section relative mt-10 scroll-mt-24" aria-labelledby="story-title">
    <div class="relative">
      <Wash :shape="1" tint="gold-soft" :opacity="0.9" class="-left-40 -top-32 h-[28rem] w-[34rem]" />
      <Wash :shape="3" tint="mist" :opacity="0.6" class="-right-32 top-24 h-[24rem] w-[28rem]" />
      <div class="container relative flex flex-wrap items-end justify-between gap-8 pb-6 pt-8 sm:pt-14">
        <h2 id="story-title" v-reveal class="text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.03]">
          How I got here,<br />
          <em class="text-bridal">the long way round.</em>
        </h2>
        <p class="hand-note max-w-xs rotate-3">follow the yomari. it gets less dusty, I promise.</p>
      </div>
    </div>

    <!-- map + chapters, side by side -->
    <div class="container relative mt-8 lg:mt-14" aria-label="Story chapters">
      <div class="lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
        <!-- the map: pinned while the chapters scroll -->
        <div class="sticky top-[76px] z-10 -mx-4 h-[36vh] sm:mx-0 lg:top-28 lg:h-[calc(100vh-9rem)]">
          <div class="map-frame h-full overflow-hidden bg-mist">
            <ClientOnly>
              <JourneyMap :stops="journey" :stop="journeyPos" />
              <template #fallback>
                <div class="flex h-full items-center justify-center p-6">
                  <p class="hand-note text-center !text-[1.5rem]">{{ journey.map((s) => s.city).join(" → ") }}</p>
                </div>
              </template>
            </ClientOnly>
          </div>
          <p class="now-label pointer-events-none absolute bottom-4 left-4 bg-paper px-4 py-1.5 font-hand text-xl text-brick sm:bottom-6 sm:left-6">
            now: {{ journey[activeStop]?.city }}, {{ journey[activeStop]?.years }}
          </p>
        </div>

        <!-- the chapters -->
        <ol class="relative">
          <li
            v-for="(ch, i) in story"
            :key="ch.id"
            :ref="(el) => (chapterEls[i] = el)"
            :data-index="i"
            class="chapter flex min-h-[75vh] flex-col justify-center gap-8 py-12 lg:min-h-[90vh]"
          >
            <div class="w-full max-w-[380px]" :class="i % 2 ? 'self-end' : ''">
              <BlobFrame :shape="i % 4" :tint="tints[ch.tint] || 'mist'" :ring="i % 2 ? 'brick' : 'gold'" ratio="6 / 5">
                <StoryArt :kind="ch.art" />
              </BlobFrame>
            </div>
            <div class="max-w-md" :class="i % 2 ? 'self-end' : ''">
              <p class="hand-note">{{ ch.when }}</p>
              <h3 class="mt-1 text-4xl leading-tight sm:text-[2.6rem]">{{ ch.title }}</h3>
              <p class="mt-4 text-lg text-muted">{{ ch.body }}</p>
              <p v-if="ch.aside" class="mt-3 -rotate-2 font-hand text-2xl text-bridal">{{ ch.aside }}</p>
            </div>
          </li>
        </ol>
      </div>
    </div>

    <div class="container mt-16" aria-labelledby="paperwork-title">
      <div class="paperwork relative mx-auto max-w-3xl bg-paper-2 px-8 py-10 sm:px-14">
        <Sparkle class="absolute -right-3 -top-4 h-10 w-10" />
        <h3 id="paperwork-title" class="hand-note !text-3xl">the paperwork version</h3>
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
    </div>
  </section>
</template>

<style scoped>
.map-frame {
  border-radius: 0 0 36px 44px / 0 0 40px 34px;
  box-shadow: 0 14px 34px color-mix(in srgb, var(--wood) 12%, transparent);
}
@media (min-width: 640px) {
  .map-frame {
    border-radius: 48px 64px 52px 70px / 60px 44px 70px 50px;
  }
}
.now-label {
  border-radius: 999px;
  box-shadow: 0 6px 16px color-mix(in srgb, var(--wood) 12%, transparent);
}
.paperwork {
  border-radius: 48px 64px 52px 72px / 60px 44px 70px 50px;
  transform: rotate(-0.6deg);
}
</style>
