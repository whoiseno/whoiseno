import type { Alpine } from "alpinejs";

export function registerScrollToTop(Alpine: Alpine) {
  Alpine.data("scrollToTop", () => ({
    scrolled: false,
    init() {
      this.update();
    },
    update() {
      this.scrolled = window.scrollY > 200;
    },
    top() {
      window.scrollTo({ top: 0 });
    },
  }));
}
