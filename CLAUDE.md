# BuLLMaps (frontend)

Marketing-workflows UI, copied from the BuLLM Pipeline UI (frontend3) on 22 Oct 2026 and customised. React 19 + Vite + TypeScript, assistant-ui. The other dependencies from frontend3 (Refine, TipTap, AG Grid, Monaco, Uppy, React Flow, Filerobot) are still installed but not imported.

## Commands

- `npm run dev`: dev server, always **http://localhost:5176** (`strictPort`; 5173 Masters, 5174 Pipeline, 5175 taken)
- `npm run build`: `tsc --noEmit` + production build
- `npm test`: `src/skills/skills.test.ts` (matrix shape, router, approval gate)

## Shell

Top bar (BuLLMaps wordmark: Bu #FF9800, LLMaps #0084C2 light / #4FB2E8 dark, muted "marketing workflows" tag; theme; profile menu with Switch to Masters / Sign out), then 3 panes (`App.tsx`, styles `v3.css` + `styles.css` tokens):

- **SKILLS** (`SkillsRail`, `components/shell.tsx`, `skills.css`): "+ Task" (new thread, results back to waiting), ten skills with a Status Mark ring, subskill count and chevron; the active skill opens its 4 subskills, the open subskill its steps (dot bullets). Collapses to a 56px icon rail.
- **BuLLMaps Assistant** (`components/AssistantPane.tsx`): Orb empty state, "How can I help you today?", starter chips (hidden after the first message), composer + · input · mic (browser speech recognition; a stub when unsupported) · send. Every turn goes through the router.
- **RESULTS & EDITS** (`components/ResultsPane.tsx`, `results.css`): header suffix = active skill. Waiting state until a skill has a plan, then request · plan (the subskill's steps) · approval (Approve / Cancel).

## Skills and router

- `src/skills/skills.config.ts` is the ONE source of the 10 × 4 matrix (skill, subskills, steps, plus `icon` and router `keywords`). Changing workflows = editing that file.
- `src/skills/router.ts` (pure, tested): keyword routing, ONE clarifying question when a request is short (`QUESTION` per skill) or unmatched, plan read-back, hard stop for approval (`yes`/`approve` or the Approve button). `src/skills/task.ts` is the shared store for the task and the rail selection.
- No model, publishing, ad or analytics service is connected: approval says so and nothing runs.

## Login

Unchanged from frontend3 apart from branding (`src/features/login/`): own session (`bullm_pipeline_session` key, per origin), "Marketing workspace" + "BuLLMaps" chip, Masters switch as before.
