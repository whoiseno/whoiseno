import { collection, config, fields, singleton } from "@keystatic/core";

export default config({
  storage: import.meta.env.PROD ? { kind: "github", repo: "whoiseno/whoiseno" } : { kind: "local" },

  ui: {
    navigation: {
      Profile: ["profile"],
      Work: ["works", "projects"],
      Uses: ["software", "hardware"],
      Library: ["books", "movies"],
    },
  },

  singletons: {
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
        location: fields.text({ label: "Location" }),
        startDate: fields.date({ label: "Start date", validation: { isRequired: true } }),
        endDate: fields.date({ label: "End date", description: "Leave empty for a current role" }),
        link: fields.url({ label: "Company website" }),
        skills: fields.array(fields.text({ label: "Skill" }), {
          label: "Skills",
          itemLabel: (props) => props.value,
        }),
        content: fields.markdoc({ label: "Responsibilities and achievements" }),
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

    software: collection({
      label: "Software",
      path: "src/content/software/*",
      slugField: "name",
      format: { data: "yaml" },
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        description: fields.text({ label: "Description", multiline: true }),
        link: fields.url({ label: "Link" }),
      },
    }),

    hardware: collection({
      label: "Hardware",
      path: "src/content/hardware/*",
      slugField: "name",
      format: { data: "yaml" },
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        description: fields.text({ label: "Description", multiline: true }),
        link: fields.url({ label: "Link" }),
      },
    }),

    books: collection({
      label: "Books",
      path: "src/content/books/*",
      slugField: "title",
      format: { data: "yaml" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        author: fields.text({ label: "Author", validation: { isRequired: true } }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Reading", value: "reading" },
            { label: "Read", value: "read" },
            { label: "Want to read", value: "want" },
          ],
          defaultValue: "read",
        }),
        rating: fields.integer({ label: "Rating (1-5)", validation: { min: 1, max: 5 } }),
        finishedDate: fields.date({ label: "Finished on" }),
        link: fields.url({ label: "Link" }),
        note: fields.text({ label: "Note", multiline: true }),
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
            { label: "Show", value: "show" },
            { label: "Anime", value: "anime" },
          ],
          defaultValue: "movie",
        }),
        year: fields.integer({ label: "Release year" }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Watching", value: "watching" },
            { label: "Watched", value: "watched" },
            { label: "Planned", value: "planned" },
          ],
          defaultValue: "watched",
        }),
        rating: fields.integer({ label: "Rating (1-5)", validation: { min: 1, max: 5 } }),
        link: fields.url({ label: "Link" }),
        note: fields.text({ label: "Note", multiline: true }),
      },
    }),
  },
});
