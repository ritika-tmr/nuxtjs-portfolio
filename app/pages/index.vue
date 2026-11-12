<script setup>
const { state } = useApp();
const journey = computed(() => state.value.journey);
const featured = computed(() =>
  ["Roadmate", "Woodenkits"].map((t) => state.value.projects.find((p) => p.title === t)).filter(Boolean)
);

useHead({ title: "Ritika Tamrakar · data, design and frontend" });
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative">
      <Wash :shape="0" tint="mist" :opacity="0.65" class="-left-40 -top-40 h-[34rem] w-[40rem]" />
      <Wash :shape="2" tint="gold-soft" :opacity="0.9" class="-right-40 -top-56 h-[30rem] w-[34rem]" />

      <div class="container relative grid items-center gap-14 pb-16 pt-6 sm:pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:pb-24">
        <div>
          <h1 class="text-[clamp(2.8rem,7vw,5.6rem)] leading-[1.02]">
            I turn messy data into
            <em class="squiggle squiggle-tight squiggle-gold text-bridal">stories</em>
            you'll actually read.
          </h1>
          <p class="mt-7 max-w-xl text-lg text-muted sm:text-xl">
            From sketching packaging in my family's woodshop in Nepal to building dashboards in Sydney.
            I'm a data visualisation analyst, project manager and frontend developer.
          </p>
          <div class="mt-9 flex flex-wrap items-center gap-6">
            <NuxtLink to="/projects" class="btn btn-red">See my work</NuxtLink>
            <NuxtLink to="/about" class="squiggle squiggle-brick font-bold">Read my story</NuxtLink>
          </div>
        </div>

        <div class="relative mx-auto w-[min(400px,82%)] lg:mr-0">
          <Wash :shape="1" tint="brick-soft" :opacity="0.75" class="-left-14 -top-10 h-[calc(100%+5rem)] w-[calc(100%+7rem)]" />
          <div class="float-slow relative">
            <AnkhiJhyal :lattice="0.34">
              <img
                src="/displayPicture.jpg"
                alt="Ritika Tamrakar"
                class="h-full w-full object-cover"
                style="object-position: 50% 0%; transform: scale(1.85); transform-origin: 49% 14%"
              />
            </AnkhiJhyal>
          </div>
          <StickerBadge small="winner" big="Optimise<br>2025" :tilt="-12" class="absolute -left-8 bottom-[18%] w-32 sm:-left-14 sm:w-36" />
          <Sparkle class="absolute -right-4 top-2 h-10 w-10" />
          <Sparkle tint="brick" class="absolute -left-2 top-[18%] h-6 w-6" />
          <div class="absolute -bottom-16 left-0 flex items-end gap-2 sm:-left-20">
            <svg class="h-14 w-20 -scale-x-100 rotate-[200deg]" viewBox="0 0 120 80" aria-hidden="true">
              <path d="M6 10 C 40 0, 80 20, 92 58" fill="none" style="stroke: var(--brick)" stroke-width="3" stroke-linecap="round" />
              <path d="M80 50 L93 62 L104 46" fill="none" style="stroke: var(--brick)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <p class="hand-note -rotate-3">my mum has told everyone</p>
          </div>
        </div>
      </div>
    </section>

    <!-- The long way round -->
    <section class="mt-16" aria-labelledby="journey-title">
      <WaveDivider tint="sage-soft" />
      <div class="bg-sage-soft pb-10 pt-4">
        <div class="container">
          <div class="flex flex-wrap items-end justify-between gap-4">
            <h2 id="journey-title" v-reveal class="text-4xl sm:text-6xl">The long way round</h2>
            <p class="hand-note rotate-2 !text-muted">four cities, one very patient suitcase</p>
          </div>

          <div class="relative mt-14">
            <!-- The thread runs pin to pin; pins sit at the start of each column, staggered by the mt-* below -->
            <svg class="absolute inset-x-0 top-0 hidden h-[110px] w-full md:block" viewBox="0 0 100 110" preserveAspectRatio="none" aria-hidden="true">
              <path
                d="M-2 100 C 0 92, 0 80, 1 77 C 14 77, 13 29, 26.5 29 C 39 29, 39 61, 52 61 C 65 61, 64 13, 77.5 13 C 90 13, 92 40, 102 44"
                fill="none"
                style="stroke: var(--gold)"
                stroke-width="4"
                stroke-dasharray="2 14"
                stroke-linecap="round"
                vector-effect="non-scaling-stroke"
              />
            </svg>
            <ol class="relative grid gap-10 border-l-4 border-dotted border-gold pl-8 md:grid-cols-4 md:gap-6 md:border-0 md:pl-0">
              <li
                v-for="(stop, i) in journey"
                :key="stop.id"
                v-reveal="i * 120"
                class="relative"
                :class="['md:pt-16', 'md:pt-4', 'md:pt-12', 'md:pt-0'][i % 4]"
              >
                <span class="pin absolute -left-[2.85rem] top-1 md:static md:mb-5 md:block" aria-hidden="true" />
                <p class="font-display text-3xl font-semibold">{{ stop.city }}</p>
                <p class="hand-note">{{ stop.years }}</p>
                <p class="text-muted">{{ stop.line }}</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
      <WaveDivider tint="sage-soft" flip />
    </section>

    <!-- Selected work -->
    <section class="container mt-20" aria-labelledby="work-title">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <h2 id="work-title" v-reveal class="text-4xl sm:text-6xl">Things I've made</h2>
        <NuxtLink to="/projects" class="squiggle squiggle-brick font-bold">See them all →</NuxtLink>
      </div>
      <div class="mt-14 grid gap-16 md:grid-cols-2 md:gap-x-20">
        <ProjectCard
          v-for="(p, i) in featured"
          :key="p.id"
          v-reveal="i * 150"
          :project="p"
          :shape="i === 0 ? 2 : 3"
          :tint="i === 0 ? 'mist' : 'brick-soft'"
          :ring="i === 0 ? 'gold' : 'brick'"
          :class="i === 1 ? 'md:mt-32' : ''"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.pin {
  width: 26px;
  height: 26px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  background: var(--bridal);
  box-shadow: 0 0 0 5px var(--sage-soft);
}
</style>
