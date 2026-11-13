// Which Home section is currently on screen ("top", "story", "skills",
// "work", "contact"), shared between the page and the header's navigation.
export function useActiveSection() {
  return useState("activeSection", () => "top");
}

// Call from a page: watches the given section ids and updates the shared value
// with whichever one crosses a band a third of the way down the screen.
export function useSectionSpy(ids) {
  const active = useActiveSection();
  let observer = null;
  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) active.value = e.target.id;
      },
      { rootMargin: "-33% 0px -60% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  });
  onBeforeUnmount(() => {
    observer?.disconnect();
    active.value = "top";
  });
}
