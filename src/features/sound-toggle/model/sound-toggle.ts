import { isSoundOn, setSoundOn } from "@/shared/lib/sound";
import type { Alpine } from "alpinejs";

export function registerSoundToggle(Alpine: Alpine) {
  Alpine.data("soundToggle", () => ({
    on: true,
    init() {
      this.on = isSoundOn();
    },
    toggle() {
      this.on = !this.on;
      setSoundOn(this.on);
    },
  }));
}
