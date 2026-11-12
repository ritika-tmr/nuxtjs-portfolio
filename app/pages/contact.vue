<script setup>
const { state } = useApp();
const contact = computed(() => state.value.contact);
const socials = computed(() => state.value.socialProfiles);
const copied = ref(false);

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(contact.value.email);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch (e) {
    const el = document.getElementById("email-text");
    if (el) window.getSelection()?.selectAllChildren(el);
  }
}

useHead({ title: "Contact · Ritika Tamrakar" });
</script>

<template>
  <section class="relative">
    <Wash :shape="0" tint="gold-soft" :opacity="0.9" class="-right-32 -top-24 h-[30rem] w-[34rem]" />
    <Wash :shape="3" tint="mist" :opacity="0.55" class="-left-40 top-80 h-[24rem] w-[28rem]" />

    <div class="container relative grid items-center gap-14 pt-8 sm:pt-14 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <h1 class="text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.02]">Say <em class="text-bridal">hello.</em></h1>
        <p class="mt-6 max-w-xl text-lg text-muted sm:text-xl">
          A dashboard that nobody reads, a dataset that needs a story, or a frontend that needs some care? I'd love to hear about it.
        </p>

        <div class="mt-10 flex flex-wrap items-center gap-4">
          <a :href="`mailto:${contact.email}`" class="font-display text-2xl font-semibold sm:text-4xl">
            <span id="email-text" class="squiggle squiggle-gold break-all">{{ contact.email }}</span>
          </a>
          <button type="button" class="btn btn-ghost !px-4 !py-2 text-sm" @click="copyEmail">
            {{ copied ? "Copied" : "Copy" }}
          </button>
        </div>

        <ul class="mt-12 space-y-4 text-lg">
          <li class="flex items-center gap-3">
            <svg viewBox="0 0 24 24" class="h-6 w-6 text-bridal" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
            <span>{{ contact.location }}</span>
          </li>
          <li v-for="s in socials" :key="s.id" class="flex items-center gap-3">
            <svg v-if="s.icon === 'linkedin'" viewBox="0 0 24 24" class="h-6 w-6 text-bridal" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            <svg v-else viewBox="0 0 24 24" class="h-6 w-6 text-bridal" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3.1-.4 6.4-1.5 6.4-6.9a5.4 5.4 0 0 0-1.5-3.7 5 5 0 0 0-.1-3.8s-1.2-.4-3.9 1.5a13.4 13.4 0 0 0-7 0C6.3 1.6 5.1 2 5.1 2a5 5 0 0 0-.1 3.8 5.4 5.4 0 0 0-1.5 3.7c0 5.4 3.3 6.5 6.4 6.9a3.4 3.4 0 0 0-.9 2.6V22" /></svg>
            <a :href="s.url" target="_blank" rel="noopener" class="squiggle squiggle-brick squiggle-hover">{{ s.name }}</a>
          </li>
        </ul>
      </div>

      <div class="relative mx-auto w-[min(360px,80%)]">
        <YomariPlate class="float-slow w-full" />
        <p class="hand-note mt-4 -rotate-3 text-center">come for the data, stay for the yomari</p>
      </div>
    </div>
  </section>
</template>
