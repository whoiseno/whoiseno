import type { Alpine } from "alpinejs";

export function registerReader(Alpine: Alpine) {
  Alpine.data("writingReader", () => {
    const root = document.documentElement;

    return {
      wide: false,
      focus: false,
      toggleWide() {
        this.wide = !this.wide;
        root.toggleAttribute("data-wide", this.wide);
      },
      setFocus(on: boolean) {
        if (on === this.focus) return;
        this.focus = on;
        root.dataset.focus = on ? "on" : "off";
        document.querySelectorAll("[data-focus-hide]").forEach((el) => el.toggleAttribute("inert", on));
      },
    };
  });
}
