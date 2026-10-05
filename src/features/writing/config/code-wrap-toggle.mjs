import { createInlineSvgUrl, definePlugin } from "astro-expressive-code";
import { h, removeClassName } from "astro-expressive-code/hast";

const wrapIcon = createInlineSvgUrl([
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'>",
  "<path d='M3 6h18'/><path d='M3 12h15a3 3 0 1 1 0 6h-4'/><path d='m16 16-2 2 2 2'/><path d='M3 18h7'/>",
  "</svg>",
]);

// One delegated listener per page, so the toggle costs nothing per code block.
const clientModule = `document.addEventListener("click", (event) => {
  const button = event.target.closest?.(".expressive-code [data-wrap-toggle]");
  const pre = button?.closest("figure")?.querySelector("pre");
  if (!pre) return;
  button.setAttribute("aria-pressed", String(pre.classList.toggle("wrap")));
});`;

/**
 * Adds a button to every code block that switches line wrapping on and off.
 *
 * The core renderer only writes the hanging-indent variables when a block is wrapped, so every block
 * is rendered wrapped and the `wrap` class is taken off again for blocks that start unwrapped.
 */
export function pluginWrapToggle() {
  const startsWrapped = new WeakMap();

  return definePlugin({
    name: "Wrap toggle",
    baseStyles: ({ cssVar }) => `
      .wrap-toggle {
        --toggle-size: 2.5rem;
        position: absolute;
        z-index: 1;
        inset-block-start: calc(${cssVar("borderWidth")} + var(--button-spacing));
        inset-inline-end: calc(${cssVar("borderWidth")} + ${cssVar("uiPaddingInline")} / 2 + var(--toggle-size) + 0.25rem);
        direction: ltr;

        @media (scripting: none) {
          display: none;
        }

        button {
          position: relative;
          display: block;
          width: var(--toggle-size);
          height: var(--toggle-size);
          margin: 0;
          padding: 0;
          border: none;
          border-radius: 0.2rem;
          background: var(--code-background);
          opacity: 0.75;
          cursor: pointer;
          transition: opacity 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);

          div {
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: ${cssVar("frames.inlineButtonBackground")};
            opacity: ${cssVar("frames.inlineButtonBackgroundIdleOpacity")};
            transition: opacity 0.2s;
          }

          &::before {
            content: '';
            position: absolute;
            pointer-events: none;
            inset: 0;
            border-radius: inherit;
            border: ${cssVar("borderWidth")} solid ${cssVar("frames.inlineButtonBorder")};
            opacity: ${cssVar("frames.inlineButtonBorderOpacity")};
          }

          &::after {
            content: '';
            position: absolute;
            pointer-events: none;
            inset: 0;
            margin: 0.475rem;
            background-color: ${cssVar("frames.inlineButtonForeground")};
            -webkit-mask-image: ${wrapIcon};
            -webkit-mask-repeat: no-repeat;
            mask-image: ${wrapIcon};
            mask-repeat: no-repeat;
          }

          &:hover,
          &:focus-visible {
            opacity: 1;
            div {
              opacity: ${cssVar("frames.inlineButtonBackgroundHoverOrFocusOpacity")};
            }
          }

          &:active div,
          &[aria-pressed="true"] div {
            opacity: ${cssVar("frames.inlineButtonBackgroundActiveOpacity")};
          }
        }
      }

      @media (hover: hover) {
        .wrap-toggle {
          --toggle-size: 2rem;
        }

        .wrap-toggle button {
          opacity: 0;
        }

        .frame:hover .wrap-toggle button:not(:hover),
        .frame:focus-within .wrap-toggle button:not(:hover) {
          opacity: 0.75;
        }
      }

      /* Room for the copy button and this one */
      :nth-child(1 of .ec-line) .code {
        padding-inline-end: calc(4.25rem + ${cssVar("codePaddingInline")});
      }
    `,
    jsModules: [clientModule],
    hooks: {
      preprocessMetadata: ({ codeBlock }) => {
        startsWrapped.set(codeBlock, Boolean(codeBlock.props.wrap));
        codeBlock.props.wrap = true;
      },
      postprocessRenderedBlock: ({ codeBlock, renderData }) => {
        const wrapped = startsWrapped.get(codeBlock) ?? false;
        const figure = renderData.blockAst;
        const pre = figure.children.find((child) => child.type === "element" && child.tagName === "pre");
        if (!wrapped && pre) removeClassName(pre, "wrap");

        figure.children.push(
          h("div", { className: "wrap-toggle" }, [
            h(
              "button",
              {
                "type": "button",
                "title": "Toggle line wrapping",
                "aria-label": "Wrap lines",
                "aria-pressed": String(wrapped),
                "data-wrap-toggle": "",
              },
              [h("div")],
            ),
          ]),
        );
      },
    },
  });
}
