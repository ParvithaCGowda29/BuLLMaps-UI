# BuLLMaps UI

The front end for BuLLMaps, the voice-first marketing workspace. A marketer signs in and talks to the Router (the middle-pane chat) in plain words; the Router plans the work across ten execution skills, and the right-hand Outputs pane shows every sub-skill's steps, its expected output, and its run status as the work proceeds. Nothing goes live without the client's approval at the human-gated steps.

## Tech stack

React 19, TypeScript, Vite 8, Refine core, TanStack Query, AG Grid, xyflow (workflow graphs), Uppy (uploads), TipTap (rich text), Monaco (code), assistant-ui (chat), Storybook 10.

## Prerequisites

- Node.js 22 or later (tests and the mock check use `node --experimental-strip-types`)
- npm 10 or later

## Getting started

```bash
git clone https://github.com/ParvithaCGowda29/BuLLMaps-UI.git
cd BuLLMaps-UI
npm install
npm run dev
```

The dev server runs on http://localhost:5188 (strict port; stop whatever else uses 5188). Sign in with any work email and a password of 8 or more characters: sign-in is a development mock. Production builds fail closed and refuse every sign-in.

## Updating a local copy

```bash
git pull origin main
npm install   # only needed when package.json changed
npm run dev   # restart the dev server, then hard-refresh the browser
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server on port 5188 |
| `npm run build` | Type-check (`tsc --noEmit`) and build for production into `dist/` |
| `npm run preview` | Serve the production build locally on port 5188 |
| `npm test` | Run the unit tests (tracker, evidence, RAG pipeline, SOW diff, scan gate, standardize, goal, router, pane layout) |
| `npm run check` | Validate the mock API adapter |
| `npm run storybook` | Start Storybook on port 6006 |
| `npm run build-storybook` | Build the static Storybook |

## Backends

None yet. The app is front-end only and runs end to end on built-in mocks: the Router conversation, skill workflows and the Outputs pane all execute in the browser. An OpenRouter key entered in engine settings is stored in the browser only.

One environment variable: `VITE_APP_TIMEZONE` pins the display timezone (default: the viewer's).
