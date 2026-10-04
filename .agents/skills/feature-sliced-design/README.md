# Feature-Sliced Design Skill for Codex (v2.1)

This skill helps Codex apply the Feature-Sliced Design (FSD) v2.1 architecture methodology to frontend projects.

## What's New in FSD v2.1

**Main update**: the **"Pages First"** approach.

- Keep code where it is used until reuse is needed.
- Start with `pages` and `widgets`; extract to `features` or `entities` only with real reuse.
- Improve cohesion, simplify refactoring, and speed up development.

## What This Skill Includes

- Full guidance for the 6 active FSD layers (`app`, `pages`, `widgets`, `features`, `entities`, `shared`)
- **NEW v2.1**: "Pages First" placement strategy
- **NEW v2.1**: Public API for cross-imports (`@x` notation) in entities
- **NEW v2.1**: Application-aware code in `shared`
- Layer/slice/segment organization rules
- Public API patterns and best practices
- Examples for React, Redux, React Query, and Next.js
- Anti-patterns to avoid (including premature extraction)
- Migration strategy from v2.0 to v2.1
- Decision framework for placing code correctly
- Steiger architecture linter integration

## Installation

### Local installation for Codex

1. Create a directory for custom skills:

   ```bash
   mkdir -p ~/.codex/skills
   ```

2. Copy as a single skill file:

   ```bash
   cp SKILL.md ~/.codex/skills/feature-sliced-design.md
   ```

3. Or copy as a skill folder:
   ```bash
   mkdir -p ~/.codex/skills/feature-sliced-design
   cp SKILL.md ~/.codex/skills/feature-sliced-design/
   cp -r agents ~/.codex/skills/feature-sliced-design/
   ```

### Alternative method

Place the `feature-sliced-design-skill` folder in your project root and point Codex to use it.

## Usage

The skill should trigger when you:

- Mention "FSD", "Feature-Sliced Design", or "feature sliced"
- Create a new frontend structure
- Refactor existing code
- Discuss architecture or code organization
- Ask where a piece of code should live
- Resolve cross-import or dependency issues
- Decompose features or components

## Usage Examples

### Example 1: Creating a new feature (v2.1 approach)

```
User: "Create a profile edit form"
Codex: I will place it in pages/profile/ because it is used only on this page.
       If reuse appears later, we can move it to features/.
```

### Example 2: Refactoring with Pages First

```
User: "I have a UserProfile component in features/, but it is used on one page"
Codex: In v2.1, it should move back to pages/. Features should contain reusable interactions.
```

### Example 3: Project setup

```
User: "Help me set up a new React project with FSD v2.1"
Codex: [creates structure, configures path aliases, explains Pages First]
```

### Example 4: Cross-imports

```
User: "Entity User needs to reference Order"
Codex: Use @x notation for explicit cross-imports between entities.
```

## Key Concepts in v2.1

### Pages First approach

```
1. Start in pages/ and keep code near usage.
2. Extract to features/entities only with real reuse.
3. Do not predict future reuse; wait for real repetition.
```

### Layers

```
app/        <- App initialization
pages/      <- Pages with their own logic
widgets/    <- Composite UI blocks with their own logic
features/   <- Reusable business interactions
entities/   <- Reusable business entities
shared/     <- Infrastructure and application-aware shared code
```

**Note**: The `processes/` layer is deprecated in v2.1.

### Import rule

A module can import only from lower layers:

- `features/` -> `entities/`, `shared/`
- `entities/` must not import from `features/`

### Public API

Each slice should expose a public API through `index.ts`:

```typescript
// features/auth/index.ts
export { LoginForm } from "./ui/LoginForm";
export { useAuth } from "./model/useAuth";
```

## Typical Project Structure

```text
src/
├── app/
├── pages/
├── widgets/
├── features/
├── entities/
└── shared/
```

## Supported Technologies

- React
- Vue
- Angular
- Svelte
- Next.js
- Redux / Redux Toolkit
- React Query
- MobX
- TypeScript
- Vite
- Create React App

## Additional Tools

### Steiger - Architecture linter for FSD

[Steiger](https://github.com/feature-sliced/steiger) is the official tool for validating FSD rules:

```bash
npm install -D @feature-sliced/steiger
npx steiger src
```

Checks include:

- Import rule violations
- Public API usage
- Cross-import violations
- Layer structure consistency

## Resources

- [Official FSD docs](https://feature-sliced.design/)
- [FSD documentation repo](https://github.com/feature-sliced/documentation)
- [Steiger linter](https://github.com/feature-sliced/steiger)
- [FSD examples](https://feature-sliced.design/examples)

## Migration from FSD v2.0 to v2.1

Migration is non-breaking and can be gradual:

1. Audit existing code.
2. Move page-specific logic back to `pages/`.
3. Keep widget-specific logic in `widgets/`.
4. Keep only truly reusable logic in `features/` and `entities/`.
5. Update `shared` with infrastructure and app-level constants.
6. Remove deprecated `processes/` usage.

## Troubleshooting

### Skill does not activate

- Confirm the file/folder is in the expected skill directory.
- Confirm naming is correct.
- Restart Codex.

### Unsure where to place code

Ask Codex: "In FSD, where should I place [code description]?"

### Import rule violation

The skill should identify the violation and propose a fix.

## License

This skill is based on official Feature-Sliced Design documentation and is free to use.

---

**Important**: This skill follows FSD v2.1 and the "Pages First" approach. Treat it as practical guidance, not rigid law.

**Golden rule (v2.1)**: Start in `pages/widgets`; extract to `features/entities` only when real reuse appears.
