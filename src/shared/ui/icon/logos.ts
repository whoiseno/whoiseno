interface TypeLogoEntry {
  label: string;
  /** `true` when SVGL ships separate `-light` and `-dark` files for the logo. */
  themed: boolean;
}

/** Tech-stack logos from SVGL, stored in `src/icons/logos/`. Trademarks belong to their owners. */
export const logoCatalog = {
  "astro": { label: "Astro", themed: true },
  "aws": { label: "AWS", themed: true },
  "bun": { label: "Bun", themed: false },
  "cloudflare": { label: "Cloudflare", themed: false },
  "css": { label: "CSS", themed: false },
  "deno": { label: "Deno", themed: true },
  "docker": { label: "Docker", themed: false },
  "drizzle": { label: "Drizzle ORM", themed: true },
  "eslint": { label: "ESLint", themed: true },
  "expressjs": { label: "Express", themed: true },
  "figma": { label: "Figma", themed: false },
  "firebase": { label: "Firebase", themed: false },
  "framer": { label: "Framer", themed: true },
  "git": { label: "Git", themed: false },
  "github": { label: "GitHub", themed: true },
  "go": { label: "Go", themed: true },
  "graphql": { label: "GraphQL", themed: false },
  "html5": { label: "HTML5", themed: false },
  "javascript": { label: "JavaScript", themed: false },
  "linux": { label: "Linux", themed: false },
  "markdown": { label: "Markdown", themed: true },
  "mongodb": { label: "MongoDB", themed: true },
  "motion": { label: "Motion", themed: true },
  "nestjs": { label: "NestJS", themed: false },
  "netlify": { label: "Netlify", themed: false },
  "nextjs": { label: "Next.js", themed: false },
  "nodejs": { label: "Node.js", themed: false },
  "npm": { label: "npm", themed: false },
  "nuxt": { label: "Nuxt", themed: false },
  "pnpm": { label: "pnpm", themed: true },
  "postgresql": { label: "PostgreSQL", themed: false },
  "prettier": { label: "Prettier", themed: true },
  "prisma": { label: "Prisma", themed: true },
  "python": { label: "Python", themed: false },
  "radix-ui": { label: "Radix UI", themed: true },
  "react": { label: "React", themed: true },
  "redis": { label: "Redis", themed: false },
  "rust": { label: "Rust", themed: true },
  "sass": { label: "Sass", themed: false },
  "shadcn-ui": { label: "shadcn/ui", themed: true },
  "stripe": { label: "Stripe", themed: false },
  "supabase": { label: "Supabase", themed: false },
  "svelte": { label: "Svelte", themed: false },
  "tailwindcss": { label: "Tailwind CSS", themed: false },
  "tanstack": { label: "TanStack", themed: true },
  "trpc": { label: "tRPC", themed: false },
  "typescript": { label: "TypeScript", themed: false },
  "vercel": { label: "Vercel", themed: true },
  "vite": { label: "Vite", themed: false },
  "vscode": { label: "VS Code", themed: false },
  "vue": { label: "Vue", themed: false },
  "zod": { label: "Zod", themed: false },
} as const satisfies Record<string, TypeLogoEntry>;

export type TypeLogoName = keyof typeof logoCatalog;

export const logoNames = Object.keys(logoCatalog) as [TypeLogoName, ...TypeLogoName[]];
