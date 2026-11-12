// v-reveal: sections below the fold drift up as they scroll into view.
// Anything already on screen at load stays put, so the first view is
// complete without scrolling (and with JavaScript off, nothing is hidden).
export default defineNuxtPlugin((nuxtApp) => {
  let observer = null;
  const getObserver = () => {
    if (observer) return observer;
    observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.remove("is-hidden");
            observer.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    return observer;
  };

  nuxtApp.vueApp.directive("reveal", {
    getSSRProps: () => ({}),
    mounted(el, binding) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
      el.classList.add("reveal", "is-hidden");
      if (binding.value) el.style.transitionDelay = `${binding.value}ms`;
      getObserver().observe(el);
    },
    unmounted(el) {
      if (observer) observer.unobserve(el);
    },
  });
});
