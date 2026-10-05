import type { Alpine } from "alpinejs";

interface TypeWritingReaderState {
  wide: boolean;
  focus: boolean;
}

export function registerReader(Alpine: Alpine) {
  Alpine.store("writingReader", {
    wide: false,
    focus: false,
    toggleWide(this: TypeWritingReaderState) {
      this.wide = !this.wide;
      document.documentElement.toggleAttribute("data-wide", this.wide);
    },
    setFocus(this: TypeWritingReaderState, on: boolean) {
      if (on === this.focus) return;
      this.focus = on;
      document.documentElement.dataset.focus = on ? "on" : "off";
      document.querySelectorAll("[data-focus-hide]").forEach((el) => el.toggleAttribute("inert", on));
    },
  });
}
