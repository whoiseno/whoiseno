import type { Alpine } from "alpinejs";

/** A heading counts as reached once its top edge crosses this distance from the viewport top. */
const HEADING_OFFSET = 100;

export function registerToc(Alpine: Alpine) {
  Alpine.data("writingToc", () => {
    let headings: HTMLElement[] = [];

    return {
      active: "",
      init() {
        headings = Array.from(document.querySelectorAll<HTMLElement>('[data-slot="prose"] :is(h1, h2, h3)[id]'));
        this.update();
      },
      update() {
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        let current = "";
        for (const heading of headings) {
          if (heading.getBoundingClientRect().top > HEADING_OFFSET) break;
          current = heading.id;
        }
        this.active = atBottom && headings.length > 0 ? headings[headings.length - 1].id : current;
      },
    };
  });
}
