import { createScope, type Scope, type ScopeParams } from "animejs";

/**
 * `createScope` wrapper that always exposes a `reduceMotion` media query
 * (`scope.matches.reduceMotion`), so every animation in the app checks
 * `prefers-reduced-motion` the same way instead of each caller re-declaring it.
 */
export function createMotionScope(params: ScopeParams = {}): Scope {
  return createScope({
    ...params,
    mediaQueries: {
      reduceMotion: "(prefers-reduced-motion: reduce)",
      ...params.mediaQueries,
    },
  });
}
