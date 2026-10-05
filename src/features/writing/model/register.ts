import type { Alpine } from "alpinejs";

import { registerCarousel } from "./carousel";
import { registerFilter } from "./filter";
import { registerReader } from "./reader";
import { registerToc } from "./toc";

export function registerWriting(Alpine: Alpine) {
  registerReader(Alpine);
  registerToc(Alpine);
  registerCarousel(Alpine);
  registerFilter(Alpine);
}
