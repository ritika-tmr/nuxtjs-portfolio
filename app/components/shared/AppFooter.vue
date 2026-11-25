<script setup>
// The footer is also the Contact section (#contact): heading, email with a
// copy button, location and links. It ends every page.
const { state } = useApp();
const contact = computed(() => state.value.contact);
const socials = computed(() => state.value.socialProfiles);
const year = computed(() => state.value.copyrightDate);

const copied = ref(false);
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(contact.value.email);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch (e) {
    const el = document.getElementById("footer-email");
    if (el) window.getSelection()?.selectAllChildren(el);
  }
}
</script>

<template>
  <footer id="contact" class="relative mt-24 scroll-mt-24 sm:mt-32" aria-labelledby="contact-title">
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
        <h2 id="contact-title" v-reveal class="max-w-3xl text-4xl leading-[1.05] sm:text-6xl">
          Have a dataset that needs a <em class="text-gold">story</em>? Let's talk.
        </h2>

        <div class="mt-8 flex flex-wrap items-center gap-3">
          <a :href="`mailto:${contact.email}`" class="font-display text-2xl font-semibold sm:text-3xl">
            <span id="footer-email" class="squiggle squiggle-gold break-all">{{ contact.email }}</span>
          </a>
          <button type="button" class="btn !px-4 !py-2 text-sm border border-current" @click="copyEmail">
            {{ copied ? "Copied" : "Copy" }}
          </button>
        </div>

        <div class="mt-8 flex flex-wrap items-center gap-4">
          <a :href="`mailto:${contact.email}`" class="btn btn-red">Say hello</a>
          <a :href="contact.linkedin" target="_blank" rel="noopener" class="btn border border-current">LinkedIn</a>
          <p class="hand-note ml-1 rotate-[-3deg] !text-gold sm:ml-8 lg:sr-only">replies faster than my dashboards refresh</p>
        </div>

        <p class="mt-8 flex items-center gap-2 opacity-80">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
          {{ contact.location }}
        </p>

        <div class="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm opacity-75 sm:flex-row sm:items-center sm:justify-between">
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
