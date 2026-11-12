import { state as getInitialState } from "~/data/portfolio.js";

export function useApp() {
  const appState = useState("app", () => getInitialState());

  return {
    state: appState,
    get: (key) => computed(() => appState.value[key]),
    getProjectById: (id) =>
      computed(() => appState.value.projects.find((project) => project.id === id)),
  };
}
