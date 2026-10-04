import type { Alpine } from "alpinejs";

import { registerCarousel } from "./carousel";
import { registerFilter } from "./filter";
import { registerReader } from "./reader";

export function registerWriting(Alpine: Alpine) {
  registerReader(Alpine);
  registerCarousel(Alpine);
  registerFilter(Alpine);
}
