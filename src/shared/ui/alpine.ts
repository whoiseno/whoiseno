import type { Alpine } from "alpinejs";

import { registerAccordion } from "./accordion/alpine";
import { registerCarousel } from "./carousel/alpine";
import { registerCopyButton } from "./copy-button/alpine";
import { registerDropdownMenu } from "./dropdown-menu/alpine";
import { registerLightbox } from "./lightbox/alpine";
import { registerPopover } from "./popover/alpine";
import { registerTooltip } from "./tooltip/alpine";

export function registerUi(Alpine: Alpine) {
  registerAccordion(Alpine);
  registerCarousel(Alpine);
  registerCopyButton(Alpine);
  registerDropdownMenu(Alpine);
  registerLightbox(Alpine);
  registerPopover(Alpine);
  registerTooltip(Alpine);
}
