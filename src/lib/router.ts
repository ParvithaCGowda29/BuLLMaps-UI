// Router / Concierge (skill 0) conversation in the middle-pane chat (19 Nov 2026, per user): the chat is the
// Router's home, so while no rail skill is picked a request runs the skill-0 flow from her Agent Workflow tab -
// structured request + linked brand context (0.1.1-0.1.2), clarifying questions for the gaps (0.1.3), plan
// read-back awaiting the client decision (0.2.1-0.2.2), the recorded approve/edit/cancel (0.2.3) and the
// handoff + status (0.3.1-0.3.2). No language model is connected in this build, so replies are deterministic and
// the conversation state is read back from the thread itself: every Router reply carries a `router` mark in its
// metadata, with a text fallback for restored threads. Nothing here publishes, schedules or spends - the human
// gates in the sheet stay with the client.
import { SKILL_NAMES } from './bullmapsSteps.ts'

export type RouterMark = 'intake' | 'plan' | 'edit' | 'approved' | 'cancelled' | 'status'
export interface RouterMsg { role: string; text: string; mark?: RouterMark }
export interface RouterCtx { files: string[] }
export interface RouterAnswer { text: string; mark: RouterMark }

/** Text fallback for threads restored from storage without reply metadata. */
export function markFromText(text: string): RouterMark | undefined {
  if (/Reply approve, edit or cancel/.test(text)) return 'plan'
  if (/gaps to close before I plan/.test(text)) return 'intake'
  if (/^What should I change/.test(text)) return 'edit'
  if (/^Approved - decision recorded/.test(text)) return 'approved'
  if (/^Cancelled and recorded/.test(text)) return 'cancelled'
  if (/^Current status \(0\.3\.2\)/.test(text)) return 'status'
}

/** Commands are often pasted numbered and quoted ("2. \"Plan three posts...\""): strip the enumeration and the
 *  wrapping quotes so the request itself is parsed (19 Nov 2026 - her live demo pasted them exactly like that). */
export function normalizeCommand(text: string): string {
  let t = text.trim().replace(/^\d+\s*[.)]\s*/, '')
  const q = t.match(/^([“"'])(.*)([”"'])$/)
  if (q) t = q[2].trim()
  return t
}

const NUM: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 }
const CHANNELS = ['linkedin', 'instagram', 'facebook', 'whatsapp', 'youtube', 'twitter'] as const
const CHANNEL_NAME: Record<string, string> = { linkedin: 'LinkedIn', instagram: 'Instagram', facebook: 'Facebook', whatsapp: 'WhatsApp', youtube: 'YouTube', twitter: 'Twitter', x: 'X' }
const KIND = 'posts?|reels?|videos?|stories|carousels?|blogs?|articles?|ads?|emails?|newsletters?'

export interface ParsedRequest { tasks: string[]; offer?: string; verb: string; language: string }

/** Pull the task list, offer and language out of a voice/text request (0.1.1). Deterministic, best-effort. */
export function parseRequest(text: string): ParsedRequest {
  const t = text.toLowerCase()
  const verb = /\bplan\b/.test(t) ? 'plan' : /\bschedule\b/.test(t) ? 'schedule'
    : /\b(audit|analy[sz]e|review)\b/.test(t) ? 'audit' : /\b(fix|improve|optimi[sz]e)\b/.test(t) ? 'improve'
    : /\b(run|launch)\b/.test(t) ? 'run' : 'create'
  const tasks: string[] = []
  const re = new RegExp(`\\b(?:(\\d+|one|two|three|four|five|six)\\s+)?(?:(linkedin|instagram|facebook|whatsapp|youtube|twitter|x)\\s+)?(${KIND})\\b`, 'gi')
  for (let m; (m = re.exec(t)); ) {
    const n = m[1] ? (NUM[m[1]] ?? parseInt(m[1], 10)) : 1
    const channel = m[2] ? (CHANNEL_NAME[m[2]] ?? m[2]) : ''
    const kind = m[3].replace(/s$/, '')
    const label = `${n} ${channel ? `${channel} ` : ''}${n === 1 ? kind : m[3]}`.replace(/\s+/g, ' ').trim()
    if (!tasks.includes(label)) tasks.push(label)
  }
  if (!tasks.length) {
    if (/\baudit|analy[sz]e/.test(t)) tasks.push('marketing audit')
    else if (/\bseo\b/.test(t)) tasks.push('SEO improvement')
    else if (/\bwebsite|site\b/.test(t)) tasks.push('website improvements')
    else tasks.push('general marketing request')
  }
  const quoted = /[“"]([^”"]{3,60})[”"]/.exec(text)
  const named = /\bfor\s+(?:our|the|this|my)\s+([\w][\w\s&'()-]{1,50}?)\s+(?:offers?|campaign|package|deal|promo(?:tion)?|sale)\b/i.exec(text)
  const offer = (quoted?.[1] ?? named?.[1])?.trim()
  const lang = /\b(kannada|hindi|tamil|telugu|malayalam|marathi|english)\b/i.exec(t)?.[1]
  return { tasks, offer, verb, language: lang ? lang[0].toUpperCase() + lang.slice(1) : 'English' }
}

interface PlanSkill { id: string; action: string }

/** Map the parsed tasks to the execution skills and their sequence (0.2.1), in rail order. */
export function skillsFor(p: ParsedRequest, raw: string): PlanSkill[] {
  const t = raw.toLowerCase()
  const out: PlanSkill[] = []
  const add = (id: string, action: string) => { if (!out.some(s => s.id === id)) out.push({ id, action }) }
  if (p.tasks.some(x => /audit/.test(x)) || /\baudit|analy[sz]e/.test(t))
    add('1', 'audits where the marketing stands and brings sourced findings')
  if (/\bwebsite|site\b/.test(t) && !/social/.test(t)) add('2', 'prepares the website changes for review')
  if (/\bseo\b|\bgoogle\b|\bmaps\b/.test(t)) add('3', 'works the SEO, local and AI-answer visibility')
  const social = CHANNELS.some(c => t.includes(c)) || p.tasks.some(x => /post|reel|video|stor|carousel/.test(x))
  if (social || !out.length) {
    add('4', `drafts ${p.tasks.filter(x => !/audit|SEO|website|general/.test(x)).join(' and ') || 'the content'} from the brief and brand context`)
    add('7', 'checks the drafts against the brand voice and visual rules')
  }
  if (/\bads?\b|paid|boost/.test(t)) add('5', 'sets up the paid campaign inside the approved budget')
  if (social) add('6', 'prepares the publishing schedule for review')
  if (/\breport|numbers|results/.test(t)) add('10', 'pulls the numbers into the cycle report')
  return out // insertion order is the task sequence: audit -> site/SEO -> content -> brand check -> paid/social -> reports
}

const intentOf_ = (p: ParsedRequest) =>
  p.offer ? `promote the ${p.offer}` : p.verb === 'audit' ? 'assess and recommend' : p.verb === 'plan' ? 'plan the next cycle' : 'grow reach and enquiries'

function intakeReply(text: string, ctx: RouterCtx): RouterAnswer {
  const p = parseRequest(text)
  const files = ctx.files.map(f => `"${f}"`).join(', ')
  const brief = `Structured request (0.1.1):\n- Task(s): ${p.verb} ${p.tasks.join('; ')} - ${p.language}; intent: ${intentOf_ (p)}.`
  const brand = ctx.files.length
    ? `Brand context (0.1.2): linked from your uploads - ${files} (brand profile + previous-cycle feedback).`
    : 'Brand context (0.1.2): no brand profile or previous-cycle report uploaded yet - add them with + Add files on the left so the skills can work from them.'
  const gaps = 'Three gaps to close before I plan (0.1.3):\n1. Audience: which segment should this target?\n2. Budget: organic only, or paid spend behind it?\n3. Timing: when should the first output go live?\nAnswer any of these - or say "you decide" - and I will read back a plan.'
  return { text: `${brief}\n${brand}\n\n${gaps}`, mark: 'intake' }
}

function planReply(requestText: string, answers: string, ctx: RouterCtx): RouterAnswer {
  const p = parseRequest(requestText)
  const skills = skillsFor(p, requestText)
  const seq = skills.map((s, i) => `${i + 1}. ${SKILL_NAMES[s.id]} (skill ${s.id}): ${s.action}.`).join('\n')
  const noted = answers && !/^you decide/i.test(answers.trim()) ? `Noted: "${answers.trim()}".\n\n` : ''
  const scope = `${p.verb} ${p.tasks.join('; ')}${p.offer ? ` for the ${p.offer}` : ''} (${p.language})`
  const text = `${noted}Proposed plan (0.2.1):\n${seq}\n\nRead-back (0.2.2): ${scope}; audience, budget and timing as noted above. Expected output: drafts ready for your review - nothing goes live or spends without your approval.\nReply approve, edit or cancel.`
  void ctx
  return { text, mark: 'plan' }
}

const APPROVE = /^(approve|approved|yes|ok|okay|go ahead|looks good|proceed|lgtm)\b/i
const CANCEL = /^cancel/i
const EDIT = /^(edit|change|modify|adjust)\b/i
/** A fresh request can arrive while the Router is awaiting answers or a decision (19 Nov 2026 - her demo sent the
 *  second sample command mid-flow): a request verb plus a content kind, channel or offer/campaign word means new
 *  intake, not an answer or refinement. Answers ("local buyers, organic only, 1 December") match neither. */
const REQUEST_VERB = /\b(make|create|write|draft|plan|schedule|audit|analy[sz]e|fix|improve|optimi[sz]e|run|launch|publish)\b/i
const REQUEST_KIND = /\b(posts?|reels?|videos?|stories|carousels?|blogs?|articles?|ads?|emails?|newsletters?|offers?|campaigns?|seo|website|linkedin|instagram|facebook|whatsapp|youtube)\b/i
const looksLikeRequest = (text: string) => REQUEST_VERB.test(text) && REQUEST_KIND.test(text)

/** The last user message that started a request (the one an intake reply followed). */
function lastRequest(msgs: RouterMsg[]): string {
  for (let i = msgs.length - 1; i >= 0; i--) if (msgs[i].mark === 'intake') {
    for (let j = i - 1; j >= 0; j--) if (msgs[j].role === 'user') return msgs[j].text
    break
  }
  return msgs.filter(m => m.role === 'user').at(-1)?.text ?? ''
}

/** One Router turn. `history` is the thread so far (with reply marks); `text` is the new user message. Returns
 *  undefined for workflow questions the Router does not handle (the caller answers those from live state). */
export function routerReply(history: RouterMsg[], rawText: string, ctx: RouterCtx): RouterAnswer | undefined {
  const text = normalizeCommand(rawText)
  const lastMark = [...history].reverse().find(m => m.role === 'assistant')?.mark
  const awaiting = lastMark === 'intake' || lastMark === 'plan' || lastMark === 'edit'
  // Awaiting the client's decision on a plan read-back (0.2.2 -> 0.2.3).
  if (lastMark === 'plan' || lastMark === 'edit') {
    const req = lastRequest(history)
    const skills = skillsFor(parseRequest(req), req)
    const names = skills.map(s => `${SKILL_NAMES[s.id]} (skill ${s.id})`).join(', ')
    if (APPROVE.test(text.trim())) return { text: `Approved - decision recorded against the plan (0.2.3).\nBrief v1 is now with: ${names} (0.3.1).\nI will keep the current status here and bring the review package back to you before anything is published (0.3.2-0.3.3).`, mark: 'approved' }
    if (CANCEL.test(text.trim())) return { text: 'Cancelled and recorded (0.2.3) - nothing was handed to the skills.\nTell me what you would like to do instead, and I will start a fresh request.', mark: 'cancelled' }
    if (EDIT.test(text.trim())) return { text: 'What should I change - the tasks, the skill sequence, or the scope in the read-back? Tell me and I will read the plan back again.', mark: 'edit' }
    if (looksLikeRequest(text)) return intakeReply(text, ctx) // a fresh request mid-plan starts over
    return planReply(req, text, ctx) // a refinement or more answers: read the plan back again with it noted
  }
  // Answering the clarifying questions (0.1.3 -> 0.2); a fresh request instead starts over.
  if (lastMark === 'intake') return looksLikeRequest(text) ? intakeReply(text, ctx) : planReply(lastRequest(history) || text, text, ctx)
  // After a decision: a status question gets the tracker line; anything else starts a fresh request.
  if (lastMark === 'approved' || lastMark === 'status') {
    if (/\b(status|progress|where are we|how.*(going|doing)|update)\b/i.test(text)) {
      const req = lastRequest(history)
      const names = skillsFor(parseRequest(req), req).map(s => SKILL_NAMES[s.id]).join(', ')
      return { text: `Current status (0.3.2): brief v1 with ${names}; drafts in progress, no blockers.\nNothing needs you right now - I will bring the review package here when the first draft is ready.`, mark: 'status' }
    }
    return intakeReply(text, ctx)
  }
  if (lastMark === 'cancelled') return intakeReply(text, ctx)
  // No Router exchange yet: questions stay with the workflow assistant, requests start the intake.
  if (text.trim().endsWith('?') && !awaiting) return undefined
  return intakeReply(text, ctx)
}
