// BuLLMaps run history (19 Nov 2026, per user), the BAM pattern: finished skill runs are kept client-side in
// localStorage (last 25) and listed in the Outputs pane's Run history accordion. `recordRun` is the single entry
// point a finished run calls; nothing records yet because no backend run exists, so the list stays honestly empty.
import { useCallback, useSyncExternalStore } from 'react'

export interface PastRun { key: string; skill: string; startedAt: string; endedAt: string; status: string }

const HKEY = 'bullmaps-runs'
let runs: PastRun[] = (() => { try { return JSON.parse(localStorage.getItem(HKEY) ?? '[]') as PastRun[] } catch { return [] } })()
const subs = new Set<() => void>()

/** Records a finished run (newest first, capped at 25). */
export function recordRun(run: Omit<PastRun, 'key'>) {
  const key = `${run.skill}:${run.endedAt}`
  if (runs.some(r => r.key === key)) return
  runs = [{ key, ...run }, ...runs].slice(0, 25)
  try { localStorage.setItem(HKEY, JSON.stringify(runs)) } catch { /* storage blocked */ }
  subs.forEach(f => f())
}

// getSnapshot must return a cached reference (a fresh filter() result per call loops useSyncExternalStore).
let cacheSkill: string | undefined
let cacheBase = runs
let cacheOut: PastRun[] = runs
function snapshot(skill?: string): PastRun[] {
  if (skill === cacheSkill && runs === cacheBase) return cacheOut
  cacheSkill = skill
  cacheBase = runs
  cacheOut = skill ? runs.filter(r => r.skill === skill || r.skill.startsWith(`${skill}.`)) : runs
  return cacheOut
}

/** Finished runs for a skill ('3') or sub-skill ('3.2'), newest first. */
export function useRuns(skill?: string): PastRun[] {
  const getSnapshot = useCallback(() => snapshot(skill), [skill])
  return useSyncExternalStore(cb => { subs.add(cb); return () => { subs.delete(cb) } }, getSnapshot)
}
