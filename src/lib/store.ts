import { useSyncExternalStore } from 'react'

// UI-only state: theme and the shell's panes. The task lives in skills/task.ts.
export interface Ui {
  theme: 'dark' | 'light'
  /** Collapsed SKILLS rail and assistant pane (the person's own choice, saved as `bullmaps-shell`). */
  shell: { nav: boolean; assistant: boolean }
  /** Narrow screens: which shell pane is open as an overlay drawer. */
  drawer: 'nav' | 'assistant' | null
}

const saved = (() => { try { return localStorage.getItem('bullmaps-theme') } catch { return null } })()
const savedShell = (() => { try { return JSON.parse(localStorage.getItem('bullmaps-shell') ?? 'null') as Ui['shell'] | null } catch { return null } })()
let state: Ui = {
  theme: saved === 'light' || saved === 'dark' ? saved : 'light',
  shell: { nav: savedShell?.nav === true, assistant: savedShell?.assistant === true },
  drawer: null,
}
const subs = new Set<() => void>()

export function setUi(patch: Partial<Ui> | ((s: Ui) => Partial<Ui>)) {
  state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) }
  try {
    localStorage.setItem('bullmaps-theme', state.theme)
    localStorage.setItem('bullmaps-shell', JSON.stringify(state.shell))
  } catch { /* storage blocked */ }
  subs.forEach(f => f())
}

export const getUi = () => state

export const useUi = <T,>(select: (s: Ui) => T) =>
  useSyncExternalStore(cb => { subs.add(cb); return () => { subs.delete(cb) } }, () => select(state))
