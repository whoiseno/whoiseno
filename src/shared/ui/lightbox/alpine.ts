import type { Alpine } from "alpinejs";

export function registerLightbox(Alpine: Alpine) {
  Alpine.data("lightbox", () => ({
    load() {
      const image = this.$refs.image as HTMLImageElement;
      if (!image.getAttribute("src")) image.src = image.dataset.src ?? "";
    },
    show() {
      this.load();
      (this.$refs.dialog as HTMLDialogElement).showModal();
    },
    hide() {
      (this.$refs.dialog as HTMLDialogElement).close();
    },
    dismiss(event: MouseEvent) {
      if (!(event.target as Element).closest("img, p, button")) this.hide();
    },
  }));
}
