import type { Alpine } from "alpinejs";

import { registerAccordion } from "./accordion/alpine";
import { registerCopyButton } from "./copy-button/alpine";
import { registerDropdownMenu } from "./dropdown-menu/alpine";
import { registerLightbox } from "./lightbox/alpine";
import { registerPopover } from "./popover/alpine";

export function registerUi(Alpine: Alpine) {
  registerAccordion(Alpine);
  registerCopyButton(Alpine);
  registerDropdownMenu(Alpine);
  registerLightbox(Alpine);
  registerPopover(Alpine);
}
