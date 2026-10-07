import { bind, play, setEnabled, setVolume } from "cuelume";

const STORAGE_KEY = "sound";
/** Cuelume's master volume, from 0 to 1. The cues are meant to sit under the page, not on top of it. */
const VOLUME = 0.4;

/** Whether the visitor wants sound. On until they say otherwise. */
export function isSoundOn(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSoundOn(on: boolean) {
  setEnabled(on);
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {}
  // The click that switched sound on happened while it was still off, so it was silent. This lets the visitor hear it.
  if (on) play("toggle", { direction: "forward" });
}

/** Applies the volume and the saved choice, then starts listening for the `data-cuelume-*` attributes. Call once. */
export function initSound() {
  setVolume(VOLUME);
  setEnabled(isSoundOn());
  bind();
}
