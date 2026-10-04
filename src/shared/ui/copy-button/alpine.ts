import type { Alpine } from "alpinejs";

export function registerCopyButton(Alpine: Alpine) {
  Alpine.data("copyText", (value: string) => {
    let timer: number | undefined;

    return {
      copied: false,
      async copy() {
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          return;
        }
        this.copied = true;
        window.clearTimeout(timer);
        timer = window.setTimeout(() => (this.copied = false), 2000);
      },
    };
  });
}
