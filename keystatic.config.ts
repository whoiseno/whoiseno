import { collection, config, fields, singleton } from "@keystatic/core";
import { block, inline, repeating, wrapper } from "@keystatic/core/content-components";

import { aspectRatioCatalog, aspectRatioNames, type TypeAspectRatioName } from "./src/shared/config/aspect-ratio";
import { logoCatalog, logoNames } from "./src/shared/config/logos";
import { mediaSourceCatalog, mediaSourceNames, type TypeMediaKind } from "./src/shared/config/media-sources";

function aspectRatioField(defaultValue: TypeAspectRatioName) {
  return fields.select({
    label: "Aspect ratio",
    description: "Crops the image to this shape. Original keeps its own ratio.",
    options: aspectRatioNames.map((value) => ({ label: aspectRatioCatalog[value].label, value })),
    defaultValue,
  });
}

function usesFields(kind: "software" | "hardware") {
  return {
    name: fields.slug({ name: { label: "Name" } }),
    logo: fields.image({
      label: "Logo",
      description: "Square works best",
      directory: `src/assets/uses/${kind}`,
      publicPath: `../../assets/uses/${kind}/`,
    }),
    description: fields.text({ label: "Description", description: "What the product is", multiline: true }),
    usage: fields.text({ label: "How I use it", multiline: true }),
    link: fields.url({ label: "Link" }),
  };
}

function posterField(kind: "movies") {
  return fields.image({
    label: "Poster",
    description: "Cover or poster, portrait works best",
    directory: `src/assets/${kind}`,
    publicPath: `../../assets/${kind}/`,
  });
}

function mediaLinksField(kind: TypeMediaKind) {
  return fields.array(
    fields.object({
      source: fields.select({
        label: "Source",
        options: mediaSourceNames(kind).map((value) => ({ label: mediaSourceCatalog[value].label, value })),
        defaultValue: mediaSourceNames(kind)[0],
      }),
      id: fields.text({
        label: "ID or URL",
        description: "The ID the source uses, or the full page URL",
        validation: { isRequired: true },
      }),
    }),
    {
      label: "Attribution links",
      description: "Links back to the catalogues the details came from",
      itemLabel: (props) => `${mediaSourceCatalog[props.fields.source.value].name}: ${props.fields.id.value}`,
    },
  );
}

export default config({
  storage: import.meta.env.PROD ? { kind: "github", repo: "whoiseno/whoiseno" } : { kind: "local" },

  ui: {
    navigation: {
      Site: ["navigation", "profile"],
      Work: ["works", "projects"],
      Writing: ["writing"],
      Uses: ["software", "hardware"],
      Hobbies: ["movies"],
    },
  },

  singletons: {
    navigation: singleton({
      label: "Navigation",
      path: "src/content/navigation/",
      format: { data: "yaml" },
      schema: {
        links: fields.array(
          fields.object({
            label: fields.text({ label: "Label", validation: { isRequired: true } }),
            href: fields.text({
              label: "Link",
              description: 'Site path, e.g. "/writing"',
              validation: { isRequired: true },
            }),
            visible: fields.checkbox({ label: "Show in navigation", defaultValue: true }),
          }),
          {
            label: "Links",
            description: "Shown in this order. Untick a link to hide it without deleting it.",
            itemLabel: (props) => `${props.fields.label.value}${props.fields.visible.value ? "" : " (hidden)"}`,
          },
        ),
      },
    }),

    profile: singleton({
      label: "Profile",
      path: "src/content/profile/",
      format: { contentField: "bio" },
      schema: {
        name: fields.text({ label: "Name", validation: { isRequired: true } }),
        role: fields.text({ label: "Role", description: "One line under your name" }),
        location: fields.text({ label: "Location" }),
        status: fields.text({
          label: "Status badge",
          description: 'Shown as a green badge next to the role, e.g. "Working". Leave empty to hide.',
        }),
        avatar: fields.image({
          label: "Avatar",
          directory: "src/assets/profile",
          publicPath: "../../assets/profile/",
        }),
        socials: fields.array(
          fields.object({
            platform: fields.select({
              label: "Platform",
              options: [
                { label: "GitHub", value: "github" },
                { label: "LinkedIn", value: "linkedin" },
                { label: "X", value: "x" },
                { label: "Instagram", value: "instagram" },
                { label: "YouTube", value: "youtube" },
                { label: "Email", value: "email" },
              ],
              defaultValue: "github",
            }),
            url: fields.text({
              label: "URL",
              description: "Profile URL, or a mailto: link for email",
              validation: { isRequired: true },
            }),
            handle: fields.text({
              label: "Handle",
              description: 'Shown under the platform name, e.g. "@whoiseno". Taken from the URL when empty.',
            }),
            displayName: fields.text({
              label: "Hover card name",
              description: "Defaults to your profile name",
            }),
            bio: fields.text({ label: "Hover card bio", multiline: true }),
            avatar: fields.image({
              label: "Hover card avatar",
              description: "Defaults to your profile avatar",
              directory: "src/assets/profile/socials",
              publicPath: "../../assets/profile/socials/",
            }),
            banner: fields.image({
              label: "Hover card banner",
              directory: "src/assets/profile/socials",
              publicPath: "../../assets/profile/socials/",
            }),
            verified: fields.checkbox({ label: "Verified", defaultValue: false }),
          }),
          { label: "Socials", itemLabel: (props) => props.fields.platform.value },
        ),
        bio: fields.markdoc({ label: "Bio" }),
      },
    }),
  },

  collections: {
    works: collection({
      label: "Works",
      path: "src/content/works/*",
      slugField: "company",
      format: { contentField: "content" },
      schema: {
        company: fields.slug({ name: { label: "Company" } }),
        role: fields.text({ label: "Role", validation: { isRequired: true } }),
        location: fields.text({ label: "Location", description: 'City and country, e.g. "Hyderabad, India"' }),
        workMode: fields.select({
          label: "Work mode",
          options: [
            { label: "On-Site", value: "on-site" },
            { label: "Remote", value: "remote" },
            { label: "Hybrid", value: "hybrid" },
          ],
          defaultValue: "on-site",
        }),
        startDate: fields.date({ label: "Start date", validation: { isRequired: true } }),
        endDate: fields.date({
          label: "End date",
          description: 'Leave empty for a current role, which shows the "Working" badge',
        }),
        link: fields.url({ label: "Company website" }),
        technologies: fields.multiselect({
          label: "Technologies & Tools",
          options: logoNames.map((value) => ({ label: logoCatalog[value].label, value })),
        }),
        content: fields.markdoc({ label: "What I've done" }),
      },
    }),

    projects: collection({
      label: "Projects",
      path: "src/content/projects/*",
      slugField: "title",
      entryLayout: "content",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        featured: fields.checkbox({ label: "Featured", description: "Show on the home page", defaultValue: false }),
        description: fields.text({ label: "Short description", multiline: true, validation: { isRequired: true } }),
        logo: fields.image({
          label: "Logo",
          description: "Shown centered on the project card. A transparent PNG or SVG works best",
          directory: "src/assets/projects",
          publicPath: "../../assets/projects/",
        }),
        startDate: fields.date({ label: "Start date", validation: { isRequired: true } }),
        endDate: fields.date({ label: "End date", description: "Leave empty if ongoing" }),
        skills: fields.array(fields.text({ label: "Skill" }), {
          label: "Skills",
          itemLabel: (props) => props.value,
        }),
        demoLink: fields.url({ label: "Demo link" }),
        sourceLink: fields.url({ label: "Source link" }),
        content: fields.markdoc({ label: "Details" }),
      },
    }),

    writing: collection({
      label: "Writing",
      path: "src/content/writing/*",
      slugField: "title",
      entryLayout: "content",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        kind: fields.select({
          label: "Kind",
          options: [
            { label: "Blog", value: "blog" },
            { label: "Tutorial", value: "tutorial" },
            { label: "Journal", value: "journal" },
            { label: "Note", value: "note" },
          ],
          defaultValue: "blog",
        }),
        publishedDate: fields.date({ label: "Published on", validation: { isRequired: true } }),
        description: fields.text({ label: "Short description", multiline: true }),
        cover: fields.image({
          label: "Cover image",
          description: "Optional. Shown under the title and used as the social preview image. Not shown in the list",
          directory: "src/assets/writing",
          publicPath: "../../assets/writing/",
        }),
        coverAlt: fields.text({ label: "Cover image description", description: "Alt text for screen readers" }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          description: "Each tag links to a page listing every post that uses it",
          itemLabel: (props) => props.value,
        }),
        content: fields.markdoc({
          label: "Content",
          options: {
            image: { directory: "src/assets/writing", publicPath: "../../assets/writing/" },
            codeBlock: {
              schema: {
                mark: fields.text({ label: "Highlight lines", description: "For example 1,3-5" }),
                ins: fields.text({ label: "Added lines", description: "Lines to show as inserted, for example 2" }),
                del: fields.text({ label: "Removed lines", description: "Lines to show as deleted, for example 3" }),
                wrap: fields.checkbox({ label: "Wrap long lines", description: "Readers can still toggle this" }),
              },
            },
          },
          components: {
            carousel: repeating({
              label: "Carousel",
              description: "Swipeable row of slides, each holding an image or text",
              schema: { caption: fields.text({ label: "Caption", description: "Optional, shown under the slides" }) },
              children: ["slide"],
              validation: { children: { min: 2 } },
            }),
            slide: wrapper({
              label: "Slide",
              schema: { ratio: aspectRatioField("original") },
              forSpecificLocations: true,
            }),
            columns: repeating({
              label: "Two columns",
              description: "Side-by-side layout, stacked on small screens",
              schema: {},
              children: ["column"],
              validation: { children: { min: 2, max: 2 } },
            }),
            column: wrapper({ label: "Column", schema: {}, forSpecificLocations: true }),
            math: block({
              label: "Math block",
              description: "LaTeX equation on its own line",
              schema: {
                expression: fields.text({ label: "LaTeX", multiline: true, validation: { isRequired: true } }),
              },
              ContentView: ({ value }) => value.expression,
            }),
            inlineMath: inline({
              label: "Inline math",
              description: "LaTeX equation inside a sentence",
              schema: { expression: fields.text({ label: "LaTeX", validation: { isRequired: true } }) },
              ContentView: ({ value }) => value.expression,
            }),
          },
        }),
      },
    }),

    software: collection({
      label: "Software",
      path: "src/content/software/*",
      slugField: "name",
      format: { data: "yaml" },
      schema: usesFields("software"),
    }),

    hardware: collection({
      label: "Hardware",
      path: "src/content/hardware/*",
      slugField: "name",
      format: { data: "yaml" },
      schema: {
        ...usesFields("hardware"),
        photos: fields.array(
          fields.object({
            image: fields.image({
              label: "Photo",
              directory: "src/assets/uses/hardware",
              publicPath: "../../assets/uses/hardware/",
            }),
            alt: fields.text({
              label: "Alt text",
              description: "Describes the photo for screen readers. Defaults to the product name.",
            }),
            ratio: aspectRatioField("1/1"),
          }),
          {
            label: "Photos",
            description: "Your own photos of it, shown in order",
            itemLabel: (props) => props.fields.alt.value || "Photo",
          },
        ),
      },
    }),

    movies: collection({
      label: "Movies",
      path: "src/content/movies/*",
      slugField: "title",
      format: { data: "yaml" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        kind: fields.select({
          label: "Kind",
          options: [
            { label: "Movie", value: "movie" },
            { label: "Series", value: "series" },
            { label: "Show", value: "show" },
            { label: "Anime", value: "anime" },
          ],
          defaultValue: "movie",
        }),
        creator: fields.text({ label: "Director or creator" }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Watching", value: "watching" },
            { label: "Watched", value: "watched" },
            { label: "Planned", value: "planned" },
          ],
          defaultValue: "watched",
        }),
        poster: posterField("movies"),
        posterRatio: aspectRatioField("2/3"),
        releaseDate: fields.date({ label: "Released on" }),
        startedDate: fields.date({ label: "Started on" }),
        watchedDate: fields.date({ label: "Finished on" }),
        rating: fields.integer({ label: "My rating (1-5)", validation: { min: 1, max: 5 } }),
        description: fields.text({ label: "My description", multiline: true }),
        links: mediaLinksField("movie"),
      },
    }),
  },
});
