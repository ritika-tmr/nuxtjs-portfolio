<script setup>
const { state } = useApp();
const contact = computed(() => state.value.contact);
const socials = computed(() => state.value.socialProfiles);
const year = computed(() => state.value.copyrightDate);
</script>

<template>
  <footer class="relative mt-24 sm:mt-32">
    <WaveDivider tint="footer" :height="130" class="-mb-px" />
    <div class="relative isolate overflow-hidden pb-10 pt-6 sm:pt-10" style="background: var(--footer); color: var(--on-footer)">
      <!-- Red blob with its handwritten note (desktop); on phones the note sits under the buttons -->
      <div class="pointer-events-none absolute right-0 top-6 hidden h-80 w-[28rem] items-center justify-center lg:flex xl:right-8" aria-hidden="true">
        <Wash :shape="2" tint="bridal" :opacity="0.35" class="inset-0 h-full w-full" />
        <p class="relative max-w-[15rem] -rotate-6 text-center font-hand text-[2rem] leading-tight text-on-bridal">
          replies faster than my dashboards refresh
        </p>
      </div>
      <div class="container relative">
        <h2 class="max-w-3xl text-4xl leading-[1.05] sm:text-6xl">
          Have a dataset that needs a <em class="text-gold">story</em>? Let's talk.
        </h2>
        <div class="mt-8 flex flex-wrap items-center gap-4">
          <a :href="`mailto:${contact.email}`" class="btn btn-red">Say hello</a>
          <a :href="contact.linkedin" target="_blank" rel="noopener" class="btn border border-current">LinkedIn</a>
          <p class="hand-note ml-1 rotate-[-3deg] !text-gold sm:ml-8 lg:sr-only">replies faster than my dashboards refresh</p>
        </div>

        <div class="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm opacity-75 sm:flex-row sm:items-center sm:justify-between">
          <p>© {{ year }} Ritika Tamrakar · made with Nuxt and a lot of chiya</p>
          <ul class="flex gap-5">
            <li v-for="s in socials" :key="s.id">
              <a :href="s.url" target="_blank" rel="noopener" class="squiggle squiggle-gold squiggle-hover">{{ s.name }}</a>
            </li>
            <li><a :href="`mailto:${contact.email}`" class="squiggle squiggle-gold squiggle-hover">Email</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
