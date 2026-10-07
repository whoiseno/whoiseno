import type { Alpine } from "alpinejs";

/** Only the state lives here. `SidebarTrigger` calls `toggle()`, `SidebarNav` follows `open` (below `rail` only). */
export function registerSidebar(Alpine: Alpine) {
  Alpine.data("sidebar", () => ({
    open: false,
    toggle() {
      this.open = !this.open;
    },
  }));
}
