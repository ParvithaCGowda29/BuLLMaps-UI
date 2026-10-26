import { useSyncExternalStore } from 'react'

// ponytail: History API instead of a router library; two routes (/login and the shell) need nothing more.
const subs = new Set<() => void>()
const emit = () => subs.forEach(f => f())
if (typeof window !== 'undefined') window.addEventListener('popstate', emit)

export function navigate(path: string, { replace = false } = {}) {
  if (location.pathname === path) return
  if (replace) history.replaceState(null, '', path)
  else history.pushState(null, '', path)
  emit()
}

export const usePath = () =>
  useSyncExternalStore(cb => { subs.add(cb); return () => { subs.delete(cb) } }, () => location.pathname)
