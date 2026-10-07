const ID = /^[A-Za-z0-9_-]+$/;

/**
 * Numbers the footnotes of one document in the order they are referenced, and checks that references and footnotes
 * pair up: every `footnoteRef` needs exactly one `footnote` with the same id, and the other way round. A broken pair
 * would only show up as a note that never appears, so it fails the build with the id in the message instead.
 *
 * @param {import("@markdoc/markdoc").Node} document
 * @returns {Map<string, number>} footnote id to its number, counting from 1
 */
export function numberFootnotes(document) {
  const numbers = new Map();
  const defined = new Set();

  for (const node of document.walk()) {
    if (node.type !== "tag" || (node.tag !== "footnoteRef" && node.tag !== "footnote")) continue;
    const { id } = node.attributes;
    if (typeof id !== "string" || !ID.test(id)) {
      throw new Error(`A ${node.tag} needs an id of letters, digits, "-" or "_". Got ${JSON.stringify(id)}.`);
    }
    if (node.tag === "footnoteRef") {
      if (numbers.has(id))
        throw new Error(`Footnote "${id}" is referenced twice. Each reference needs its own footnote.`);
      numbers.set(id, numbers.size + 1);
    } else {
      if (defined.has(id)) throw new Error(`Footnote "${id}" is written twice.`);
      defined.add(id);
    }
  }

  for (const id of numbers.keys()) {
    if (!defined.has(id))
      throw new Error(`Footnote "${id}" is referenced but never written. Add a footnote with that id.`);
  }
  for (const id of defined) {
    if (!numbers.has(id))
      throw new Error(`Footnote "${id}" is written but never referenced. Add a footnoteRef with that id.`);
  }

  return numbers;
}
