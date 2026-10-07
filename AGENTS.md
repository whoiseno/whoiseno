# AGENTS.md

## 0. Non-negotiables

These rules override everything else in this file when in conflict:

1. **No flattery, no filler.** Skip openers like "Great question", "You're absolutely right", "Excellent idea", "I'd be happy to". Start with the answer or the action.
2. **Disagree when you disagree.** If the user's premise is wrong, say so before doing the work. Agreeing with false premises to be polite is the single worst failure mode in coding agents.
3. **Never fabricate.** Not file paths, not commit hashes, not API names, not test results, not library functions. If you don't know, read the file, run the command, or say "I don't know, let me check."
4. **Stop when confused.** If the task has two plausible interpretations, ask. Do not pick silently and proceed.
5. **Touch only what you must.** Every changed line must trace directly to the user's request. No drive-by refactors, reformatting, or "while I was in there" cleanups.

---

## 1. Before writing code

**Goal: understand the problem and the codebase before producing a diff.**

- State your plan in one or two sentences before editing. For anything non-trivial, produce a numbered list of steps with a verification check for each.
- Read the files you will touch. Read the files that call the files you will touch. Claude Code: use subagents for exploration so the main context stays clean.
- Match existing patterns in the codebase. If the project uses pattern X, use pattern X, even if you'd do it differently in a greenfield repo.
- Surface assumptions out loud: "I'm assuming you want X, Y, Z. If that's wrong, say so." Do not bury assumptions inside the implementation.
- If two approaches exist, present both with tradeoffs. Do not pick one silently. Exception: trivial tasks (typo, rename, log line) where the diff fits in one sentence.

---

## 2. Writing code: simplicity first

**Goal: the minimum code that solves the stated problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code. No configurability, flexibility, or hooks that were not requested.
- No error handling for impossible scenarios. Handle the failures that can actually happen.
- If the solution runs 200 lines and could be 50, rewrite it before showing it.
- If you find yourself adding "for future extensibility", stop. Future extensibility is a future decision.
- Bias toward deleting code over adding code. Shipping less is almost always better.

The test: would a senior engineer reading the diff call this overcomplicated? If yes, simplify.

---

## 3. Surgical changes

**Goal: clean, reviewable diffs. Change only what the request requires.**

- Do not "improve" adjacent code, comments, formatting, or imports that are not part of the task.
- Do not refactor code that works just because you are in the file.
- Do not delete pre-existing dead code unless asked. If you notice it, mention it in the summary.
- Do clean up orphans created by your own changes (unused imports, variables, functions your edit made obsolete).
- Match the project's existing style exactly: indentation, quotes, naming, file layout.

The test: every changed line traces directly to the user's request. If a line fails that test, revert it.

---

## 4. Goal-driven execution

**Goal: define success as something you can verify, then loop until verified.**

Rewrite vague asks into verifiable goals before starting:

- "Add validation" becomes "Write tests for invalid inputs (empty, malformed, oversized), then make them pass."
- "Fix the bug" becomes "Write a failing test that reproduces the reported symptom, then make it pass."
- "Refactor X" becomes "Ensure the existing test suite passes before and after, and no public API changes."
- "Make it faster" becomes "Benchmark the current hot path, identify the bottleneck with profiling, change it, show the benchmark is faster."

For every task:

1. State the success criteria before writing code.
2. Write the verification (test, script, benchmark, screenshot diff) where practical.
3. Run the verification. Read the output. Do not claim success without checking.
4. If the verification fails, fix the cause, not the test.

---

## 5. Tool use and verification

- Prefer running the code to guessing about the code. If a test suite exists, run it. If a linter exists, run it. If a type checker exists, run it.
- Never report "done" based on a plausible-looking diff alone. Plausibility is not correctness.
- When debugging, address root causes, not symptoms. Suppressing the error is not fixing the error.
- For UI changes, verify visually: screenshot before, screenshot after, describe the diff.
- Use CLI tools (gh, aws, gcloud, kubectl) when they exist. They are more context-efficient than reading docs or hitting APIs unauthenticated.
- When reading logs, errors, or stack traces, read the whole thing. Half-read traces produce wrong fixes.

---

## 6. Session hygiene

- Context is the constraint. Long sessions with accumulated failed attempts perform worse than fresh sessions with a better prompt.
- After two failed corrections on the same issue, stop. Summarize what you learned and ask the user to reset the session with a sharper prompt.
- Use subagents (Claude Code: "use subagents to investigate X") for exploration tasks that would otherwise pollute the main context with dozens of file reads.
- When committing, write descriptive commit messages (subject under 72 chars, body explains the why). No "update file" or "fix bug" commits. No "Co-Authored-By: Claude" attribution unless the project explicitly wants it.

---

## 7. Communication style

- Direct, not diplomatic. "This won't scale because X" beats "That's an interesting approach, but have you considered...".
- Concise by default. Two or three short paragraphs unless the user asks for depth. No padding, no restating the question, no ceremonial closings.
- When a question has a clear answer, give it. When it does not, say so and give your best read on the tradeoffs.
- Celebrate only what matters: shipping, solving genuinely hard problems, metrics that moved. Not feature ideas, not scope creep, not "wouldn't it be cool if".
- No excessive bullet points, no unprompted headers, no emoji. Prose is usually clearer than structure for short answers.

---

## 8. When to ask, when to proceed

**Ask before proceeding when:**

- The request has two plausible interpretations and the choice materially affects the output.
- The change touches something you've been told is load-bearing, versioned, or has a migration path.
- You need a credential, a secret, or a production resource you don't have access to.
- The user's stated goal and the literal request appear to conflict.

**Proceed without asking when:**

- The task is trivial and reversible (typo, rename a local variable, add a log line).
- The ambiguity can be resolved by reading the code or running a command.
- The user has already answered the question once in this session.

---

## 9. Self-improvement loop

**This file is living. Keep it short by keeping it honest.**

After every session where the agent did something wrong:

1. Ask: was the mistake because this file lacks a rule, or because the agent ignored a rule?
2. If lacking: add the rule under "Project Learnings" below, written as concretely as possible ("Always use X for Y" not "be careful with Y").
3. If ignored: the rule may be too long, too vague, or buried. Tighten it or move it up.
4. Every few weeks, prune. For each line, ask: "Would removing this cause the agent to make a mistake?" If no, delete. Bloated AGENTS.md files get ignored wholesale.

Boris Cherny (creator of Claude Code) keeps his team's file around 100 lines. Under 300 is a good ceiling. Over 500 and you are fighting your own config.

---

## 10. Project context

**Fill this in per project. Keep it specific. Delete sections that don't apply.**

### Stack

- Language and version: Astro, Tailwind CSS, and Alpinejs
- Framework(s): Astro
- Package manager: PNPM
- Runtime / deployment target: NODE / Vercel

### Commands

- Install: pnpm install
- Build: pnpm build
- Test (all): NONE
- Test (single file): NONE
- Lint: pnpm lint
- Typecheck: pnpm astro check
- Run locally: pnpm dev

Prefer single-file or single-test runs during iteration. Full suites are for the final verification pass.

### Layout

- Source lives in: `src/*`
- Tests live in: NONE
- Do not modify: `TODO` (generated code, vendored deps, legacy areas)

### Conventions specific to this repo

- Naming: Pascal case for type & interfaces with a prefix `Type*`, and camel Case for variables and functions.
- Import style: ESM Module imports, types must have the `type` keyword in the import.
- Images and files from the CMS: declare them with `cloudAssetField` in `keystatic.config.ts` and `media(image)` in `content.config.ts`, and draw an image from a content field with `AssetImage`, never `fields.image` or `Image` from `astro:assets`. See `docs/content.md#media-on-cloudinary`.
- Error handling pattern: `TODO`
- Testing pattern and framework: `TODO`

### Forbidden

- `TODO`: things that look reasonable but will break this project.

---

## 11. Project Learnings

**Accumulated corrections. This section is for the agent to maintain, not just the human.**

When the user corrects your approach, append a one-line rule here before ending the session. Write it concretely ("Always use X for Y"), never abstractly ("be careful with Y"). If an existing line already covers the correction, tighten it instead of adding a new one. Remove lines when the underlying issue goes away (model upgrades, refactors, process changes).

- Never add a segment to an FSD layer: `shared` has only `ui`, `lib`, `config` and `api`, so put new code in the closest of those (a Keystatic field is a component, so it lives in `shared/ui/<name>/`). Only a directory the framework requires, such as `src/pages/api` for an Astro route, may fall outside the layout.
- A `HEAD` that follows redirects does not prove Astro can load a remote image: every redirect hop must match `image.domains` or `image.remotePatterns`, and `**.host` does not match the bare `host`.
- Import `cn` and `tv` from `@/shared/lib/tailwind`, never from `tailwind-variants`: only the wrapper teaches tailwind-merge the Utopia token names, and without it `cn("text-step-0", "text-muted-foreground")` drops the size.
- Type is `Text` (or `text-step-*` on a container) and gaps, padding and margins are the Utopia space tokens (`p-s`, `gap-xs-s`); there is no `sm:`, `md:` or `lg:`, and `rail:` is the only breakpoint. A `max-w-*` name that is also a space token (`3xs` to `3xl`) needs its `--max-width-*` alias in `global.css`, or it resolves to a few rem.
- Style footnotes and anything else `sidenotes.ts` moves in the `[data-slot="footnote"]` block of `global.css`, never with utility classes on the element: utilities sit in a later layer than components and would out-rank the margin-rail overrides.
- Only one `pnpm dev` can run per project and a config edit restarts it, which can leave the optimizer without the Keystatic packages (the CMS page then fails with 504 "Outdated Optimize Dep"); fix it with `pnpm stop` and a clean start. The Claude browser pane does not run `requestAnimationFrame` while it is hidden, so patch it to `setTimeout` and re-init the Alpine component (`Alpine.destroyTree` then `initTree`) before testing layout code. The hidden pane also never fires `IntersectionObserver`, anime.js pauses while `document.hidden`, and screenshots time out: drive an animation by hand (`engine.useDefaultMainLoop = false`, then `engine.update()` on an interval) and read computed styles and rects.
- When building a compound component, look up its shadcn/ui structure first and split it by responsibility (root, trigger, content, item): never one component that does both trigger and content. The steps are in `docs/layers/shared.md#building-a-compound-component`.
- A part that spreads `data-slot` onto a component that renders a literal element (`Button`, `Card`) emits the attribute twice and the browser keeps the first: let that component take `data-slot` as a prop (`Button` does) or leave the slot alone.
- `astro preview` cannot serve a Vercel build, so the adapter is picked by a `--node` flag (`pnpm build:node`, `pnpm preview`) and every other command, including the `pnpm build` that Vercel runs, uses the Vercel adapter. `DEV` and `NODE_ENV` cannot choose it, because `astro build` is a production build wherever it runs. `pnpm build` can end with `EPERM ... symlink` on Windows after the pages are already in `dist/client`; `pnpm build:node` has no such step.
