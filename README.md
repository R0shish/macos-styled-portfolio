# macOS Portfolio

A portfolio that looks and feels like macOS — Finder, Notes, Terminal, Mail, Preview, System Settings, Spotlight, Quick Look, a working dock, menu bar and Trash.

Everything personal lives in one file, so you can clone it and make it yours in a few minutes.

## Make it yours

1. Clone the repo and install dependencies

   ```bash
   npm install
   npm run dev
   ```

2. Edit [`data/portfolio.json`](data/portfolio.json) — your name, links, experience, projects, awards, skills, wallpapers and the welcome notification.
3. Replace `public/CV.pdf` with your CV (or point `profile.cv` somewhere else).
4. Drop your own wallpapers in `public/wallpapers/` and list them under `system.wallpapers`.

That's it. Every app reads from that file — nothing personal is hardcoded in the components.

### Content reference

The shape of the file is defined by `PortfolioContent` in [`app/lib/content/types.ts`](app/lib/content/types.ts).

| Field               | Used by                                                                     |
| ------------------- | --------------------------------------------------------------------------- |
| `site`              | Browser tab title and description                                           |
| `profile`           | Contacts card, Notes, Terminal, menu bar, Mail, lock screen                 |
| `profile.links`     | Any link left out is hidden everywhere (`repository` → VS Code in the dock) |
| `experiences`       | Notes, Terminal `experience`, Spotlight                                     |
| `projects`          | Finder (tags become sidebar tags), Spotlight, Terminal                      |
| `awards`, `skills`  | Notes, Terminal                                                             |
| `system.wallpapers` | System Settings → Wallpaper (`src` image or CSS `gradient`)                 |
| `system.default*`   | First-visit appearance and wallpaper                                        |
| `system.hostname`   | Terminal prompt                                                             |

Dates use `YYYY-MM` (leave `end` out for a current role).

## Using your own backend

The app never imports the JSON directly. It calls an API through a `ContentSource` ([`app/lib/content/source.ts`](app/lib/content/source.ts)):

```ts
export interface ContentSource {
  load(): Promise<PortfolioContent>;
}
```

By default it fetches `GET /api/portfolio`, a route that serves `data/portfolio.json` and is exported as a static file at build time, so it works on GitHub Pages too.

To use a real backend, return the same `PortfolioContent` shape from any endpoint and set:

```bash
NEXT_PUBLIC_CONTENT_API_URL=https://your-api.example.com/portfolio
```

(Allow CORS from your site's origin.) For anything more custom — auth headers, a CMS SDK, GraphQL — implement `ContentSource` yourself and export it as `contentSource`.

## Development

```bash
npm run dev          # start the dev server
npm run check        # lint, typecheck, formatting and tests — what CI runs
npm test             # unit tests (Vitest)
npm run format       # format with Prettier
```

### Architecture

```
app/
├── api/portfolio/     Static API route serving data/portfolio.json
├── components/
│   ├── apps/          One folder per app (Finder, Notes, Terminal, …), lazy-loaded
│   ├── desktop/       Desktop icons and marquee selection
│   ├── dock/          Dock layout, items, magnification
│   ├── menubar/       Menu bar, menus, Control Center
│   ├── window/        Window chrome, frame geometry, resize, error boundary
│   └── …              Spotlight, Quick Look, launcher, system screens
├── context/           React state: content, settings, windows, files, overlays, notifications
├── hooks/             Reusable hooks
└── lib/
    ├── content/       Zod schema (the content contract) and content sources
    ├── file-system.ts Virtual file system shared by Desktop, Finder and Quick Look
    ├── apps.tsx       App registry
    └── design-tokens.ts  Type scale and layer order used by Tailwind
```

- **Content** is validated with Zod at the API boundary, so a bad backend response shows a readable error instead of breaking the UI.
- **Window management** is a pure reducer (`context/window-state.ts`) with selectors, so every interaction is unit tested.
- **Logic lives outside components** — geometry, search, navigation and the file system are plain functions with tests next to them.
- **Each app runs in an error boundary**, so one crashing app shows a "quit unexpectedly" sheet instead of taking down the desktop.

## Deploying

`npm run build` produces a static site in `out/`. CI runs `npm run check` on every pull request, and the deploy workflow runs the same checks before publishing to GitHub Pages on every push to `main`.

## Built with

Next.js, Tailwind CSS, Framer Motion and react-draggable.

App icons, SF Symbols and the SF Pro font are Apple's. They're licensed for use on Apple platforms, so swap them out if you need to be strict about it.
