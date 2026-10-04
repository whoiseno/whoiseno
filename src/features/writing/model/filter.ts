import type { Alpine } from "alpinejs";

interface TypeWritingFilterState {
  kind: string;
}

export function registerFilter(Alpine: Alpine) {
  Alpine.store("writingFilter", {
    kind: "all",
    set(this: TypeWritingFilterState, kind: string) {
      this.kind = kind;
    },
    shows(this: TypeWritingFilterState, kind: string) {
      return this.kind === "all" || this.kind === kind;
    },
  });
}
