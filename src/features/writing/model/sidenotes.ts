import type { Alpine } from "alpinejs";

interface TypeNote {
  el: HTMLElement;
  /** The number in the text that the note belongs to. */
  ref: HTMLElement;
  /** Holds the note's place in the text while the note is in the rail. */
  anchor: Comment;
}

interface TypePlacement {
  note: TypeNote;
  height: number;
  top: number;
}

/** Clicking these does their own job instead of pinning the note. */
const CONTROLS = "a[href], button, video, audio, input, summary, dialog";

const pixels = (value: string) => Number.parseFloat(value) || 0;

function collect(prose: HTMLElement): TypeNote[] {
  const notes: TypeNote[] = [];
  for (const ref of prose.querySelectorAll<HTMLElement>("[data-footnote-ref]")) {
    const el = prose.querySelector<HTMLElement>(`[data-footnote="${CSS.escape(ref.dataset.footnoteRef ?? "")}"]`);
    if (el) notes.push({ el, ref, anchor: new Comment("footnote") });
  }
  return notes;
}

/**
 * Lines the footnotes up in a rail beside the text, each level with its number. Where a note would sit on top of the
 * next one it is clipped with a fade, and a click on the note or its number pins it open and nudges the notes below
 * out of the way. A note that is too close to the previous one is pushed down instead. Below the rail breakpoint the
 * notes stay in the text, where they were written.
 */
function setup(layer: HTMLElement): (() => void) | undefined {
  const prose = document.querySelector<HTMLElement>('[data-slot="prose"] > article');
  const host = layer.parentElement;
  if (!prose || !host) return;

  const notes = collect(prose);
  if (notes.length === 0) return;

  const root = document.documentElement;
  const controller = new AbortController();
  const { signal } = controller;
  const byElement = new Map<Element, TypeNote>();
  for (const note of notes) {
    byElement.set(note.el, note);
    byElement.set(note.ref, note);
  }

  let active = false;
  let frame: number | undefined;
  let overflow = 0;
  let expanded: TypeNote | undefined;
  let hovered: TypeNote | undefined;
  let focused: TypeNote | undefined;

  const owner = (target: EventTarget | null) => {
    const el = target instanceof Element ? target : null;
    const ref = el?.closest("[data-footnote-ref]");
    if (ref) return { note: byElement.get(ref), fromRef: true };
    const own = el?.closest("[data-footnote]");
    return { note: own ? byElement.get(own) : undefined, fromRef: false };
  };

  const paint = (note: TypeNote | undefined) => {
    if (!note) return;
    const lit = note === hovered || note === focused || note === expanded;
    note.el.toggleAttribute("lit", lit);
    note.ref.toggleAttribute("lit", lit);
    note.ref.toggleAttribute("pinned", note === expanded);
  };

  const hover = (note: TypeNote | undefined) => {
    if (note === hovered) return;
    const previous = hovered;
    hovered = note;
    paint(previous);
    paint(note);
  };

  const focus = (note: TypeNote | undefined) => {
    if (note === focused) return;
    const previous = focused;
    focused = note;
    paint(previous);
    paint(note);
  };

  const schedule = () => {
    if (frame === undefined) frame = requestAnimationFrame(layout);
  };

  const animate = () => layer.setAttribute("animating", "");
  const settle = () => layer.removeAttribute("animating");

  const expand = (note: TypeNote | undefined) => {
    const previous = expanded;
    if (note === previous) return;
    expanded = note;
    previous?.el.removeAttribute("expanded");
    note?.el.setAttribute("expanded", "");
    paint(previous);
    paint(note);
    schedule();
  };

  const collapse = (animated = false) => {
    if (animated) animate();
    else settle();
    expand(undefined);
  };

  const layout = () => {
    frame = undefined;
    if (!active) return;

    // The rail starts where the text column ends. Its width sets how the notes wrap, so it comes before measuring.
    layer.style.left = `${Math.round(prose.getBoundingClientRect().right - host.getBoundingClientRect().left)}px`;
    const rail = layer.getBoundingClientRect();
    if (rail.height === 0) return;

    const style = getComputedStyle(notes[0].el);
    const pad = pixels(style.paddingBlockStart);
    const lead = pixels(style.lineHeight);
    const step = pad + 2 * lead;

    const placed: TypePlacement[] = [];
    let flow: number | undefined;
    for (const note of notes) {
      const wanted = note.ref.getBoundingClientRect().top - rail.top - pad;
      const top = flow === undefined || wanted - flow >= lead ? wanted : flow + step;
      flow = top;
      placed.push({ note, height: note.el.offsetHeight, top });
    }

    // Open notes make the ones below them move aside.
    const index = placed.findIndex(({ note }) => note === expanded);
    const pivot = placed[index];
    if (pivot) {
      const trailing = placed.slice(index + 1);
      const shift = trailing.length === 0 ? 0 : Math.max(0, pivot.top + pivot.height + lead - trailing[0].top);
      for (const entry of trailing) entry.top += shift;
    }

    // Notes that run past the end of the text make the page longer, instead of being cut off by it.
    const bottom = Math.max(...placed.map(({ top, height }) => top + height));
    const needed = Math.max(0, Math.ceil(bottom - (rail.height - overflow)));
    if (needed !== overflow) {
      overflow = needed;
      host.style.setProperty("--sidenotes-overflow", `${needed}px`);
    }

    let lost = false;
    let below: number | undefined;
    for (let i = placed.length - 1; i >= 0; i--) {
      const { note, height, top } = placed[i];
      const on = top + height > 0;
      note.el.toggleAttribute("visible", on);
      if (note === expanded && !on) lost = true;
      if (on) {
        const room = below === undefined ? height : below - top;
        note.el.style.translate = `0 ${Math.round(top)}px`;
        note.el.toggleAttribute("clipped", room < height);
        if (room < height) note.el.style.setProperty("--clip", `${Math.round(height - room)}px`);
        else note.el.style.removeProperty("--clip");
      }
      below = top;
    }

    if (lost) collapse();
  };

  const place = () => {
    for (const note of notes) {
      note.el.before(note.anchor);
      layer.append(note.el);
      note.el.setAttribute("data-placed", "");
      note.el.querySelector("[data-slot=footnote-marker]")?.setAttribute("tabindex", "-1");
    }
  };

  const restore = () => {
    hover(undefined);
    focus(undefined);
    collapse();
    for (const note of notes) {
      note.anchor.replaceWith(note.el);
      note.el.removeAttribute("data-placed");
      note.el.removeAttribute("visible");
      note.el.removeAttribute("clipped");
      note.el.style.removeProperty("translate");
      note.el.style.removeProperty("--clip");
      note.el.querySelector("[data-slot=footnote-marker]")?.removeAttribute("tabindex");
    }
    layer.style.removeProperty("left");
    host.style.removeProperty("--sidenotes-overflow");
    overflow = 0;
  };

  const apply = () => {
    const on = getComputedStyle(layer).display !== "none";
    if (on === active) return;
    active = on;
    root.toggleAttribute("data-sidenotes", on);
    if (on) {
      place();
      schedule();
    } else {
      restore();
    }
  };

  document.addEventListener(
    "click",
    (event) => {
      if (!active) return;
      const { note, fromRef } = owner(event.target);
      if (!note) return;
      const target = event.target as Element;
      if (fromRef || target.closest("[data-slot=footnote-marker]")) {
        event.preventDefault();
      } else {
        if (target.closest(CONTROLS)) return;
        if (getSelection()?.isCollapsed === false) return;
      }
      if (note === expanded) {
        collapse(true);
      } else {
        expand(note);
        animate();
      }
    },
    { signal, capture: true },
  );

  document.addEventListener(
    "pointerover",
    (event) => {
      if (active) hover(owner(event.target).note);
    },
    { signal, passive: true },
  );
  document.addEventListener("pointerleave", () => hover(undefined), { signal, passive: true });

  document.addEventListener(
    "focusin",
    (event) => {
      const { note } = owner(event.target);
      focus(note && (event.target as Element).matches(":focus-visible") ? note : undefined);
    },
    { signal },
  );
  document.addEventListener("focusout", () => focus(undefined), { signal });

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" && expanded) collapse(true);
    },
    { signal },
  );

  layer.addEventListener(
    "transitionend",
    ({ propertyName }) => {
      if (propertyName === "translate" || propertyName === "clip-path") settle();
    },
    { signal },
  );

  // The text moves when it rewraps, an image loads or wide mode animates; the notes follow it.
  const railResize = new ResizeObserver(() => {
    apply();
    schedule();
  });
  railResize.observe(layer);
  const textResize = new ResizeObserver(schedule);
  textResize.observe(prose);
  const noteResize = new ResizeObserver(schedule);
  for (const note of notes) noteResize.observe(note.el);
  void document.fonts?.ready.then(schedule);

  apply();

  return () => {
    controller.abort();
    railResize.disconnect();
    textResize.disconnect();
    noteResize.disconnect();
    if (frame !== undefined) cancelAnimationFrame(frame);
    if (active) restore();
    root.removeAttribute("data-sidenotes");
  };
}

export function registerSidenotes(Alpine: Alpine) {
  Alpine.data("sidenotes", () => {
    let teardown: (() => void) | undefined;

    return {
      init() {
        teardown = setup(this.$root);
      },
      destroy() {
        teardown?.();
      },
    };
  });
}
