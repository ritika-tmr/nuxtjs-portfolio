// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  colorMode: {
    classSuffix: "",
  },

  app: {
    // Page transition (styles live in app/layouts/default.vue)
    pageTransition: { name: "fade", mode: "out-in" },
    head: {
      title: "Ritika's Portfolio",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Portfolio of Ritika Tamrakar, Frontend Developer and UI/UX Designer.",
        },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [{ rel: "icon", type: "image/png", href: "/code-logo.png" }],
    },
  },

  // Register components by file name only (e.g. <Qualifications />, not
  // <AboutQualifications />), matching the Nuxt 2 behaviour the templates use
  components: [{ path: "~/components", pathPrefix: false }],

  // Global CSS (~ resolves to app/ in Nuxt 4)
  css: ["~/assets/app.css"],

  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/color-mode"],
});
