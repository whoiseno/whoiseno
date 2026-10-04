import type { Alpine } from "alpinejs";

interface TypePopoverOptions {
  hover: boolean;
  openDelay: number;
  closeDelay: number;
}

export function registerPopover(Alpine: Alpine) {
  Alpine.data("popover", ({ hover, openDelay, closeDelay }: TypePopoverOptions) => {
    let timer: number | undefined;

    return {
      open: false,
      hover,
      show() {
        window.clearTimeout(timer);
        this.open = true;
      },
      hide() {
        window.clearTimeout(timer);
        this.open = false;
      },
      toggle() {
        if (this.open) this.hide();
        else this.show();
      },
      enter() {
        if (!hover) return;
        window.clearTimeout(timer);
        timer = window.setTimeout(() => (this.open = true), openDelay);
      },
      leave() {
        if (!hover) return;
        window.clearTimeout(timer);
        timer = window.setTimeout(() => (this.open = false), closeDelay);
      },
    };
  });
}
