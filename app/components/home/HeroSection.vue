<script setup>
// Home hero with an entrance sequence: the headline rises in word by word, the
// gold squiggle draws under "stories", the window's lattice slides up to reveal
// the portrait, the sticker pops in, and the background shapes drift with the
// pointer. The sequence waits for the first-visit loader to finish.
// Without JavaScript (no `js-anim` class) or with reduced motion, the hero is
// simply shown complete.
useHead({
  script: [
    {
      key: "rt-js-anim",
      tagPosition: "head",
      innerHTML: `document.documentElement.classList.add("js-anim")`,
    },
  ],
});

const before = ["I", "turn", "messy", "data", "into"];
const after = ["you'll", "actually", "read."];
const roles = ["data visualisation analyst", "project manager", "frontend developer", "UI designer"];

const ready = ref(false);
const roleIndex = ref(0);
const root = ref(null);
let roleTimer = 0;

function start() {
  ready.value = true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  roleTimer = setInterval(() => (roleIndex.value = (roleIndex.value + 1) % roles.length), 2600);
}

// background shapes drift a little with the pointer (CSS variables)
function onPointer(e) {
  const el = root.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
  el.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
}

onMounted(() => {
  const loaderShowing = document.querySelector(".first-loader") && !document.documentElement.classList.contains("loader-seen");
  if (loaderShowing) window.addEventListener("rt-loader-done", start, { once: true });
  else requestAnimationFrame(start);
  if (window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("pointermove", onPointer, { passive: true });
  }
});
onBeforeUnmount(() => {
  clearInterval(roleTimer);
  window.removeEventListener("rt-loader-done", start);
  window.removeEventListener("pointermove", onPointer);
});
</script>

<template>
  <section id="top" ref="root" class="hero relative" :class="{ 'is-ready': ready }">
    <Wash :shape="0" tint="mist" :opacity="0.65" class="drift drift-a -left-40 -top-40 h-[34rem] w-[40rem]" />
    <Wash :shape="2" tint="gold-soft" :opacity="0.9" class="drift drift-b -right-40 -top-56 h-[30rem] w-[34rem]" />

    <div class="container relative grid items-center gap-14 pb-16 pt-6 sm:pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:pb-24">
      <div>
        <h1 class="text-[clamp(2.8rem,7vw,5.6rem)] leading-[1.06]" aria-label="I turn messy data into stories you'll actually read.">
          <span aria-hidden="true">
            <template v-for="(w, i) in before" :key="`b${i}`"><span class="word-wrap"><span class="word" :style="{ '--i': i }">{{ w }}</span></span>{{ " " }}</template>
            <span class="word-wrap"><em class="word squiggle squiggle-tight squiggle-gold draw-squiggle text-bridal" :style="{ '--i': before.length }">stories</em></span>{{ " " }}
            <template v-for="(w, i) in after" :key="`a${i}`"><span class="word-wrap"><span class="word" :style="{ '--i': before.length + 1 + i }">{{ w }}</span></span>{{ " " }}</template>
          </span>
        </h1>
        <p class="rise mt-7 max-w-xl text-lg text-muted sm:text-xl" style="--d: 1.05s">
          From sketching packaging in my family's woodshop in Nepal to building dashboards in Sydney.
        </p>
        <p class="rise mt-3 text-lg sm:text-xl" style="--d: 1.2s">
          I'm a
          <span class="role-slot">
            <Transition name="role" mode="out-in">
              <span :key="roleIndex" class="font-bold text-bridal">{{ roles[roleIndex] }}</span>
            </Transition>
          </span>
        </p>
        <div class="rise mt-9 flex flex-wrap items-center gap-6" style="--d: 1.35s">
          <a href="#work" class="btn btn-red">See my work</a>
          <a href="#story" class="squiggle squiggle-brick font-bold">Read my story</a>
        </div>
      </div>

      <div class="relative mx-auto w-[min(400px,82%)] lg:mr-0">
        <Wash :shape="1" tint="brick-soft" :opacity="0.75" class="drift drift-c -left-14 -top-10 h-[calc(100%+5rem)] w-[calc(100%+7rem)]" />
        <div class="window-in relative">
          <div class="float-slow">
            <AnkhiJhyal :lattice="0.34" class="lattice-intro">
              <img
                src="/displayPicture.jpg"
                alt="Ritika Tamrakar"
                class="h-full w-full object-cover"
                style="object-position: 50% 0%; transform: scale(1.85); transform-origin: 49% 14%"
              />
            </AnkhiJhyal>
          </div>
        </div>
        <div class="sticker-in absolute -left-8 bottom-[18%] w-32 sm:-left-14 sm:w-36">
          <StickerBadge small="winner" big="Optimise<br>2025" :tilt="-12" />
        </div>
        <Sparkle class="twinkle absolute -right-4 top-2 h-10 w-10" />
        <Sparkle tint="brick" class="twinkle absolute -left-2 top-[18%] h-6 w-6" style="animation-delay: -1.2s" />
        <div class="rise absolute -bottom-16 left-0 flex items-end gap-2 sm:-left-20" style="--d: 2.2s">
          <svg class="h-14 w-20 -scale-x-100 rotate-[200deg]" viewBox="0 0 120 80" aria-hidden="true">
            <path d="M6 10 C 40 0, 80 20, 92 58" fill="none" style="stroke: var(--brick)" stroke-width="3" stroke-linecap="round" />
            <path d="M80 50 L93 62 L104 46" fill="none" style="stroke: var(--brick)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <p class="hand-note -rotate-3">my mum has told everyone</p>
        </div>
      </div>
    </div>

    <a href="#story" class="scroll-cue rise absolute bottom-0 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-muted lg:flex" style="--d: 2.5s" aria-label="Scroll to the story">
      <span class="font-hand text-xl">scroll for the story</span>
      <svg class="bob h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
    </a>
  </section>
</template>

<style scoped>
.word-wrap {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  padding-bottom: 0.12em;
  margin-bottom: -0.12em;
}
.word {
  display: inline-block;
}
.role-slot {
  display: inline-block;
  min-width: 14ch;
}
.role-enter-active,
.role-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.role-enter-from {
  opacity: 0;
  transform: translateY(0.5em);
}
.role-leave-to {
  opacity: 0;
  transform: translateY(-0.5em);
}

/* background shapes follow the pointer a little */
.drift {
  transition: translate 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.drift-a {
  translate: calc(var(--px, 0) * -40px) calc(var(--py, 0) * -30px);
}
.drift-b {
  translate: calc(var(--px, 0) * 30px) calc(var(--py, 0) * 24px);
}
.drift-c {
  translate: calc(var(--px, 0) * -18px) calc(var(--py, 0) * -14px);
}
.twinkle {
  animation: twinkle 3.2s ease-in-out infinite;
}
@keyframes twinkle {
  50% {
    transform: scale(0.75) rotate(20deg);
    opacity: 0.6;
  }
}
.bob {
  animation: bob 1.8s ease-in-out infinite;
}
@keyframes bob {
  50% {
    transform: translateY(5px);
  }
}
.scroll-cue {
  bottom: -1rem;
}
</style>

<style>
/* Entrance sequence. Plain (unscoped) CSS so these selectors stay exactly as
   written; every rule is limited to the hero by ".hero". */
.js-anim .hero .word,
.js-anim .hero .rise,
.js-anim .hero .window-in,
.js-anim .hero .sticker-in {
  animation-play-state: paused;
}
.js-anim .hero.is-ready .word,
.js-anim .hero.is-ready .rise,
.js-anim .hero.is-ready .window-in,
.js-anim .hero.is-ready .sticker-in,
.js-anim .hero.is-ready .draw-squiggle::after,
.js-anim .hero.is-ready .lattice-intro .lattice-screen {
  animation-play-state: running;
}
.js-anim .hero .word {
  animation: word-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  animation-delay: calc(0.08s * var(--i) + 0.1s);
}
@keyframes word-up {
  from {
    transform: translateY(110%) rotate(4deg);
  }
}
.js-anim .hero .draw-squiggle::after {
  animation: draw 0.6s cubic-bezier(0.6, 0, 0.3, 1) 0.95s both paused;
}
@keyframes draw {
  from {
    transform: scaleX(0);
  }
}
.js-anim .hero .rise {
  animation: rise 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) var(--d, 0s) both;
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
}
.js-anim .hero .window-in {
  animation: window-in 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s both;
}
@keyframes window-in {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.94);
  }
}
/* the lattice starts closed and slides up to reveal the face */
.js-anim .hero .lattice-intro .lattice-screen {
  animation: lattice-open 1.1s cubic-bezier(0.6, 0, 0.3, 1) 0.9s both paused;
}
@keyframes lattice-open {
  from {
    height: 100%;
  }
}
.js-anim .hero .sticker-in {
  animation: sticker-in 0.7s cubic-bezier(0.2, 0.8, 0.2, 1.5) 1.7s both;
}
@keyframes sticker-in {
  from {
    opacity: 0;
    transform: scale(0.3) rotate(-90deg);
  }
}
</style>
