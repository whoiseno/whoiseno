import type { Alpine } from "alpinejs";

interface TypeAccordionOptions {
  type: "single" | "multiple";
  defaultValue: string[];
}

export function registerAccordion(Alpine: Alpine) {
  Alpine.data("accordion", ({ type, defaultValue }: TypeAccordionOptions) => ({
    openItems: [...defaultValue],
    isOpen(value: string) {
      return this.openItems.includes(value);
    },
    toggle(value: string) {
      if (this.isOpen(value)) {
        this.openItems = this.openItems.filter((item) => item !== value);
        return;
      }
      this.openItems = type === "single" ? [value] : [...this.openItems, value];
    },
  }));
}
