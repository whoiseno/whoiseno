import { registerThemeToggle } from "@/features/theme-toggle/alpine";
import { registerWriting } from "@/features/writing/alpine";
import { registerUi } from "@/shared/ui/alpine";
import anchor from "@alpinejs/anchor";
import intersect from "@alpinejs/intersect";
import type { Alpine } from "alpinejs";

export default (Alpine: Alpine) => {
  Alpine.plugin(anchor);
  Alpine.plugin(intersect);
  registerUi(Alpine);
  registerThemeToggle(Alpine);
  registerWriting(Alpine);
};
