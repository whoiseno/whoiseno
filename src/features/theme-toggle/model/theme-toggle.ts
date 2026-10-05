import type { Alpine } from "alpinejs";

export function registerThemeToggle(Alpine: Alpine) {
  Alpine.data("themeToggle", () => ({
    toggle() {
      const apply = () => {
        const dark = document.documentElement.classList.toggle("dark");
        try {
          localStorage.setItem("theme", dark ? "dark" : "light");
        } catch {}
      };

      if (
        typeof document.startViewTransition !== "function" ||
        matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        apply();
        return;
      }

      const root = document.documentElement;
      root.dataset.themeTransition = "";
      document.startViewTransition(apply).finished.finally(() => delete root.dataset.themeTransition);
    },
  }));
}
