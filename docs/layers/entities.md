# `src/entities`

Domain objects and the minimal UI needed to display them. The `@/entities/*` alias is defined in [`tsconfig.json`](../../tsconfig.json).

```
src/entities/
└── profile/
    ├── getProfile.ts     # getEntry("profile", "index"); throws a helpful error if the entry is missing
    ├── socials.ts            # platform -> label, icon and action label; getSocialLinks(profile.data)
    ├── ProfileContacts.astro # email address with a copy button, and a hover-card icon per other social
    └── ProfileHero.astro     # avatar, name, role, status badge, location, Markdoc bio, contacts
```

The profile is the only entity because it is the only piece of data reused across layers: the home hero (`pages/index.astro`) and the footer (`app/layouts/Site.astro`) both read it. Works, projects, books, movies and writing are rendered by feature slices instead (see [`features.md`](./features.md)), since each is only shown by its own section.

`getSocialLinks(profile.data)` turns the profile's `socials` into `TypeSocialLink[]` (from `shared/config/site.ts`), applying the `handle`, `displayName` and `avatar` fallbacks described in [`content.md`](../content.md). Both `ProfileHero` and `Site.astro` call it. `ProfileContacts` renders the email entry as the address plus a `CopyButton`, and every other entry as an icon link inside a hover `Popover` showing the banner, avatar, name, verified mark, handle, bio and an action button (Follow, Connect or Subscribe).

The profile content is the `profile` singleton in [`keystatic.config.ts`](../../keystatic.config.ts); see [`content.md`](../content.md).

## Conventions

- Each entity gets its own subfolder with its data access (`get*.ts`) next to its UI.
- An entity may import from `shared` only. Never from `features`, `pages` or `app`, and never from another entity.
- Keep entities passive: rendering and shaping data, not interaction (that is `features`) or routing (that is `pages`).

See [`architecture.md`](../architecture.md) for how this layer relates to the rest of the app.
