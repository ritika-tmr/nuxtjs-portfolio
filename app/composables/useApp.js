import { state as getInitialState } from "~/data/portfolio.js";

export function useApp() {
  const appState = useState("app", () => getInitialState());

  // The store is created once per tab. If new sections are added to
  // portfolio.js while a tab is open (live reload during development), fill
  // them in so they don't render empty until a full refresh.
  const initial = getInitialState();
  for (const key of Object.keys(initial)) {
    if (!(key in appState.value)) appState.value[key] = initial[key];
  }

  return {
    state: appState,
    get: (key) => computed(() => appState.value[key]),
    getProjectById: (id) =>
      computed(() => appState.value.projects.find((project) => project.id === id)),
  };
}
