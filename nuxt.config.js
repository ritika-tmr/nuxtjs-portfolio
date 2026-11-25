// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  colorMode: {
    classSuffix: "",
  },

  app: {
    // Page content fades between routes; the red "turning the page" wave
    // lives in app/components/loaders/PageTurn.vue
    pageTransition: { name: "chapter", mode: "out-in" },
    head: {
      title: "Ritika Tamrakar",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Ritika Tamrakar: data visualisation analyst, project manager and frontend developer. Turning messy data into stories people actually read.",
        },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/yomari.svg" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Epilogue:ital,wght@0,400;0,500;0,700;1,400&display=swap",
        },
      ],
    },
  },

  // The site is one long Home page; the old separate pages point to their sections
  routeRules: {
    "/about": { redirect: "/#story" },
    "/skills": { redirect: "/#skills" },
    "/contact": { redirect: "/#contact" },
  },

  // Register components by file name only (e.g. <SkillsMap />, not
  // <SkillsSkillsMap />), matching the Nuxt 2 behaviour the templates use
  components: [{ path: "~/components", pathPrefix: false }],

  // Global CSS (~ resolves to app/ in Nuxt 4). app.css holds the Tailwind
  // directives plus the design tokens, so the module uses it as its entry.
  tailwindcss: {
    cssPath: "~/assets/app.css",
  },

  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/color-mode"],
});
