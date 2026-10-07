import type { Alpine } from "alpinejs";

import { registerCarousel } from "./carousel";
import { registerFilter } from "./filter";
import { registerReader } from "./reader";
import { registerSidenotes } from "./sidenotes";
import { registerToc } from "./toc";

export function registerWriting(Alpine: Alpine) {
  registerReader(Alpine);
  registerToc(Alpine);
  registerCarousel(Alpine);
  registerFilter(Alpine);
  registerSidenotes(Alpine);
}
