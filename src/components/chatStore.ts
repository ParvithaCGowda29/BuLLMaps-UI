// The assistant thread's saved copies, shared by AssistantPane (which writes them) and LoginPage (which clears
// them on every sign-in, 19 Nov 2026, per user). Kept in its own module so LoginPage does not import the pane.
import type { ExportedMessageRepository } from '@assistant-ui/react'

export const THREAD_KEY = (project: string) => `bam-chat-thread:${project}`
/** Text-only copy of the thread (attachments hold File objects and are not saved). */
export function saveThread(project: string, exp: ExportedMessageRepository) {
  try {
    const messages = exp.messages.map(m => ({ ...m, message: { ...m.message, attachments: [] } }))
    sessionStorage.setItem(THREAD_KEY(project), JSON.stringify({ ...exp, messages }))
  } catch { /* storage blocked or full: the in-memory copy still holds */ }
}
export function loadThread(project: string): ExportedMessageRepository | null {
  try { const raw = sessionStorage.getItem(THREAD_KEY(project)); return raw ? JSON.parse(raw, (k, v) => (k === 'createdAt' && typeof v === 'string' ? new Date(v) : v)) as ExportedMessageRepository : null } catch { return null }
}
export const threads = new Map<string, ExportedMessageRepository>()
/** Fresh login (19 Nov 2026, per user): forget every saved thread - the in-memory module copies AND the
    sessionStorage copies, so the pane always mounts into the empty state after a sign-in. */
export function resetChatThreads() {
  threads.clear()
  try { for (const k of Object.keys(sessionStorage)) if (k.startsWith('bam-chat-thread:')) sessionStorage.removeItem(k) } catch { /* storage blocked */ }
}
