import type { Alpine } from "alpinejs";

import { registerFilter } from "./filter";
import { registerReader } from "./reader";
import { registerSidenotes } from "./sidenotes";
import { registerToc } from "./toc";

export function registerWriting(Alpine: Alpine) {
  registerReader(Alpine);
  registerToc(Alpine);
  registerFilter(Alpine);
  registerSidenotes(Alpine);
}
