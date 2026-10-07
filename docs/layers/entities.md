# `src/entities`

Domain objects and the minimal UI needed to display them. The `@/entities/*` alias is defined in [`tsconfig.json`](../../tsconfig.json).

```
src/entities/
├── navigation/
│   ├── index.ts                  # public API: getNavItems, TypeNavItem
│   ├── api/getNavItems.ts        # reads the navigation singleton; returns the visible links as TypeNavItem[]
│   └── model/types.ts            # TypeNavItem
├── profile/
│   ├── index.ts                  # public API: getProfile, getSocialLinks, TypeSocialLink, ProfileHero
│   ├── api/getProfile.ts         # getEntry("profile", "index"); throws a helpful error if the entry is missing
│   ├── lib/socials.ts            # platform -> label, icon and action label; getSocialLinks(profile.data)
│   ├── model/types.ts            # TypeSocialLink
│   └── ui/
│       ├── ProfileContacts.astro # email address with a copy button, and a hover-card icon per other social
│       └── ProfileHero.astro     # avatar, name, role, status badge, location, Markdoc bio, contacts
└── writing/
    ├── index.ts                  # public API: getWritingTags, TypeWritingTag
    ├── api/getWritingTags.ts     # getWritingTags(): TypeWritingTag[] from the writing collection
    └── model/types.ts            # TypeWritingTag: { slug, label, count }
```

The profile is reused across layers: the home hero (`pages/index.astro`) and the footer (`app/ui/Site.astro`) both read it. The writing tags are reused by the writing feature (`WritingTags`, rendered inside `WritingFilters`) and by `pages/writing/tags/[tag].astro`, which needs them in `getStaticPaths`.

`getNavItems()` reads the `navigation` singleton, drops links whose `visible` is `false` and returns the rest as `{ label, href }`. `Site.astro` passes the result to `SiteSidebar`, so editing the links in Keystatic is all it takes to change the navigation. It throws a helpful error when the singleton file is missing. Works, projects, books, movies and the writing list are rendered by feature slices instead (see [`features.md`](./features.md)), since each is only shown by its own section.

`getSocialLinks(profile.data)` turns the profile's `socials` into `TypeSocialLink[]` (from `entities/profile/model/types.ts`), applying the `handle`, `displayName` and `avatar` fallbacks described in [`content.md`](../content.md). Both `ProfileHero` and `Site.astro` call it. `ProfileContacts` renders the email entry as the address plus a `CopyButton`, and every other entry as a link showing the platform's own logo (`logo:github`, `logo:linkedin`, `logo:x`, `logo:instagram`, `logo:youtube`; the email entry uses a Reicon) inside a hover `Popover` showing the banner, avatar, name, verified mark, handle, bio and an action button (Follow, Connect or Subscribe).

The profile content is the `profile` singleton in [`keystatic.config.ts`](../../keystatic.config.ts); see [`content.md`](../content.md).

## Conventions

- Each entity is a slice with an `index.ts` public API. Its code is split into segments: `api` (data access, `get*.ts`), `model` (types), `lib` (helpers) and `ui` (components). Create only the segments an entity needs.
- Import an entity through its public API (`@/entities/profile`), never by file path. Inside a slice, use relative imports.
- An entity may import from `shared` only. Never from `features`, `pages` or `app`, and never from another entity.
- Keep entities passive: rendering and shaping data, not interaction (that is `features`) or routing (that is `pages`).

See [`architecture.md`](../architecture.md) for how this layer relates to the rest of the app.
