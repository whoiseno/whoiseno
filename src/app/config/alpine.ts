import { registerScrollToTop } from "@/features/scroll-to-top/client";
import { registerSoundToggle } from "@/features/sound-toggle/client";
import { registerThemeToggle } from "@/features/theme-toggle/client";
import { registerWriting } from "@/features/writing/client";
import { registerUi } from "@/shared/ui/alpine";
import anchor from "@alpinejs/anchor";
import intersect from "@alpinejs/intersect";
import type { Alpine } from "alpinejs";

import { registerSidebar } from "../ui/sidebar/alpine";

export default (Alpine: Alpine) => {
  Alpine.plugin(anchor);
  Alpine.plugin(intersect);
  registerUi(Alpine);
  registerSidebar(Alpine);
  registerScrollToTop(Alpine);
  registerSoundToggle(Alpine);
  registerThemeToggle(Alpine);
  registerWriting(Alpine);
};
