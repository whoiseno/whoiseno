import type { Alpine } from "alpinejs";

interface TypeTooltipOptions {
  delayDuration: number;
}

/** Only the state lives here. `TooltipTrigger` decides when to call `enter()` and `leave()`, `TooltipContent` follows `shown`. */
export function registerTooltip(Alpine: Alpine) {
  Alpine.data("tooltip", ({ delayDuration }: TypeTooltipOptions) => {
    let timer: number | undefined;

    return {
      shown: false,
      enter() {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => (this.shown = true), delayDuration);
      },
      leave() {
        window.clearTimeout(timer);
        this.shown = false;
      },
    };
  });
}
