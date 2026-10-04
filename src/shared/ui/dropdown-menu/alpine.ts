import type { Alpine } from "alpinejs";

export function registerDropdownMenu(Alpine: Alpine) {
  Alpine.data("dropdownMenu", () => ({
    open: false,
    show() {
      this.open = true;
    },
    hide() {
      this.open = false;
    },
    toggle() {
      this.open = !this.open;
    },
    close() {
      if (!this.open) return;
      this.hide();
      this.$refs.trigger?.focus();
    },
    items() {
      const menu = this.$refs.menu;
      if (!menu) return [];
      return Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])'));
    },
    openAndFocus(target: "first" | "last") {
      this.show();
      this.$nextTick(() => {
        const items = this.items();
        (target === "first" ? items[0] : items[items.length - 1])?.focus();
      });
    },
    move(delta: number) {
      const items = this.items();
      if (items.length === 0) return;
      const current = items.indexOf(document.activeElement as HTMLElement);
      const next =
        current === -1 ? (delta > 0 ? 0 : items.length - 1) : (current + delta + items.length) % items.length;
      items[next]?.focus();
    },
    focusEdge(target: "first" | "last") {
      const items = this.items();
      (target === "first" ? items[0] : items[items.length - 1])?.focus();
    },
  }));
}
