import type { Alpine } from "alpinejs";

/** A heading counts as reached once its top edge crosses this distance from the viewport top (below the sticky header). */
const HEADING_OFFSET = 100;

export function registerWriting(Alpine: Alpine) {
  Alpine.data("writingReader", () => {
    const root = document.documentElement;
    let headings: HTMLElement[] = [];

    return {
      wide: false,
      focus: false,
      active: "",
      init() {
        headings = Array.from(document.querySelectorAll<HTMLElement>('[data-slot="prose"] :is(h2, h3)[id]'));
        this.update();
      },
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
      update() {
        const atBottom = window.innerHeight + window.scrollY >= root.scrollHeight - 2;
        let current = "";
        for (const heading of headings) {
          if (heading.getBoundingClientRect().top > HEADING_OFFSET) break;
          current = heading.id;
        }
        this.active = atBottom && headings.length > 0 ? headings[headings.length - 1].id : current;
      },
    };
  });

  Alpine.data("carousel", () => ({
    canPrev: false,
    canNext: false,
    init() {
      this.update();
    },
    update() {
      const track = this.$refs.track;
      this.canPrev = track.scrollLeft > 1;
      this.canNext = track.scrollLeft + track.clientWidth < track.scrollWidth - 1;
    },
    go(direction: 1 | -1) {
      const track = this.$refs.track;
      const slides = Array.from(track.children) as HTMLElement[];
      const trackLeft = track.getBoundingClientRect().left;
      const offsets = slides.map((slide) => slide.getBoundingClientRect().left - trackLeft);
      const target = direction === 1 ? offsets.find((offset) => offset > 1) : offsets.findLast((offset) => offset < -1);
      track.scrollBy({ left: target ?? 0, behavior: "smooth" });
    },
  }));
}
