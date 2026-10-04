import type { Alpine } from "alpinejs";

import { registerAccordion } from "./accordion/alpine";
import { registerCopyButton } from "./copy-button/alpine";
import { registerDropdownMenu } from "./dropdown-menu/alpine";
import { registerPopover } from "./popover/alpine";

export function registerUi(Alpine: Alpine) {
  registerAccordion(Alpine);
  registerCopyButton(Alpine);
  registerDropdownMenu(Alpine);
  registerPopover(Alpine);
}
