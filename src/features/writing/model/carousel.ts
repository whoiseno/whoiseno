import type { Alpine } from "alpinejs";

export function registerCarousel(Alpine: Alpine) {
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
      const columnLeft = this.$root.getBoundingClientRect().left;
      const offsets = slides.map((slide) => slide.getBoundingClientRect().left - columnLeft);
      const target = direction === 1 ? offsets.find((offset) => offset > 1) : offsets.findLast((offset) => offset < -1);
      track.scrollBy({ left: target ?? 0, behavior: "smooth" });
    },
  }));
}
