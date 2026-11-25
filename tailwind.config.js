// Colours are CSS variables (see app/assets/app.css) so light and dark mode
// swap in one place.
module.exports = {
  content: [
    "./app/components/**/*.{vue,js,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue",
    "./nuxt.config.{js,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        "paper-2": "var(--paper-2)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        line: "var(--line)",
        bridal: "var(--bridal)",
        "bridal-soft": "var(--bridal-soft)",
        "on-bridal": "var(--on-bridal)",
        gold: "var(--gold)",
        "gold-soft": "var(--gold-soft)",
        "gold-ink": "var(--gold-ink)",
        brick: "var(--brick)",
        "brick-soft": "var(--brick-soft)",
        sage: "var(--sage)",
        "sage-soft": "var(--sage-soft)",
        mist: "var(--mist)",
        wood: "var(--wood)",
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        body: ['"Epilogue"', "system-ui", "sans-serif"],
        hand: ['"Caveat"', '"Comic Sans MS"', "cursive"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "6rem",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
