// Smooth scrolling to Home's sections (/#story, /#skills, ...), leaving room
// for the sticky header. Back/forward restores the previous position.
export default {
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) {
      const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // wait a moment when arriving from another page, so the section exists
      return new Promise((resolve) => {
        setTimeout(
          () => resolve({ el: to.hash, top: 84, behavior: reduce || to.path !== from.path ? "auto" : "smooth" }),
          to.path !== from.path ? 450 : 0
        );
      });
    }
    return { top: 0 };
  },
};
