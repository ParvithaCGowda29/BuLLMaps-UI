import { PaneGrip, paneHeaderProps, usePaneSpot } from './PaneLayout'
import { useEffect, useRef, useState } from 'react'
import { useUppyState } from '@uppy/react'
import type { Snapshot } from '../api/types'
import { setUi, uppy, useUi } from '../lib/store'
import { navigate, usePath } from '../lib/route'
import { GLOBAL_ROUTES, globalByPath, screenByPath, screenLabel, stageOf } from '../tracker/trackerConfig.ts'
import { signOut, switchToMasters, useSession } from '../features/login/session'
import { Icon, Tip, fmtFull, fmtTime } from './ui'
import { AppSettingsModal } from './AppSettingsModal'
import { BrandLockup } from './BrandLockup'
import { UploadFilesBlock } from '../steps/UploadPanes'

export const useUploadsInFlight = () =>
  useUppyState(uppy, s => Object.values(s.files).filter(f => f.progress.uploadStarted && !f.progress.uploadComplete && !f.error).length)

/** The highlighted navigation entry for a path (a hidden screen highlights its parent entry). */
export const navScreen = (path: string) => { const s = screenByPath(path)?.item; return s?.navAs ?? s?.id }

export function TopBar({ syncedAt, offline }: { snap?: Snapshot; syncedAt: number; offline: boolean }) {
  const path = usePath()
  const id = screenByPath(path)?.id
  const global = globalByPath(path)
  const theme = useUi(s => s.theme)
  const env = useUi(s => s.env)
  // Breadcrumb: Stage › Step (Admin › Masters keeps the workspace name).
  const first = global === 'admin' ? 'Admin' : id ? stageOf(id)?.label ?? '' : env === 'FDE' ? 'FDE workspace' : 'Staging'
  const current = global ? GLOBAL_ROUTES[global].label : id ? screenLabel(id) : ''
  return (
    <header className="topbar">
      <div className="brand">
        <button className="icon-btn nav-drawer-btn" onClick={() => setUi(s => ({ drawer: s.drawer === 'nav' ? null : 'nav' }))} aria-label="Open navigation" title="Navigation"><Icon name="menu" /></button>
        <BrandLockup />
        {/* Each crumb can shrink and ellipsize; the full text is in its tooltip. The screen name keeps priority. */}
        <nav aria-label="Breadcrumb" className="crumbs">
          <button className="link crumb-link crumb" onClick={() => navigate('/')} title={first}>{first}</button>
          {current && <><Icon name="chevron" size={12} /><strong className="crumb crumb-current" title={current} aria-current="page">{current}</strong></>}
        </nav>
      </div>
      <div className="topbar-right">
        <span className={`sync ${offline ? 'tone-err' : 'tone-muted'}`} role="status" title={syncedAt ? `Last backend sync ${fmtFull(new Date(syncedAt).toISOString())}` : undefined}>
          <Icon name={offline ? 'alert' : 'db'} size={12} />
          <span className="sync-text">{offline ? `Backend unreachable. Status unknown since ${syncedAt ? fmtTime(new Date(syncedAt).toISOString()) : 'start'}` : `All changes saved · ${syncedAt ? fmtTime(new Date(syncedAt).toISOString()) : '—'}`}</span>
        </span>
        {/* Glass mode switch: native radios (Staging = left half, FDE = right half); the sphere sits over the inactive half. */}
        <fieldset className="env-glass" data-env={env} aria-describedby="env-hint" title="View context, not a deploy">
          <legend className="sr-only">Environment mode</legend>
          <span className="eg-track" aria-hidden />
          <span className="eg-sphere" aria-hidden>
            <span className="eg-ghost">{env === 'FDE' ? 'Staging' : 'FDE'}</span>
            {env === 'FDE'
              ? <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5M9 3 7 13" /></svg>
              : <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M8 1.8 14.5 5 8 8.2 1.5 5z" /><path d="m3.2 7.6 4.8 2.4 4.8-2.4 1.7.85L8 11.6 1.5 8.45z" opacity=".85" /><path d="m3.2 10.6 4.8 2.4 4.8-2.4 1.7.85L8 14.6 1.5 11.45z" opacity=".7" /></svg>}
          </span>
          <span className="eg-text" aria-hidden>{env}</span>
          {(['Staging', 'FDE'] as const).map(e => (
            <label key={e} className={`eg-opt eg-${e.toLowerCase()} ${env === e ? 'on' : ''}`}>
              <input type="radio" name="env" value={e} checked={env === e} aria-label={e}
                onChange={() => setUi({ env: e })} />
            </label>
          ))}
        </fieldset>
        <span id="env-hint" className="sr-only">View context, not a deploy</span>
        <button className="icon-btn" aria-pressed={theme === 'light'} onClick={() => setUi({ theme: theme === 'dark' ? 'light' : 'dark' })}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
        <ProfileMenu />
        <button className="icon-btn assist-drawer-btn" onClick={() => setUi(s => ({ drawer: s.drawer === 'assistant' ? null : 'assistant' }))} aria-label="Open BuLLM Assistant" title="BuLLM Assistant"><Icon name="sparkle" /></button>
      </div>
      <AppSettingsModal />
    </header>
  )
}

// Profile: who is signed in, Switch to Masters, and Sign out. Click or keyboard opens it; Escape or an outside click closes it.
function ProfileMenu() {
  const email = useSession()
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const outside = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])
  const close = () => { setOpen(false); btn.current?.focus() }
  return (
    <div className="profile" ref={wrap} onKeyDown={e => { if (e.key === 'Escape' && open) close() }}>
      <button ref={btn} className="icon-btn" aria-expanded={open} aria-controls="profile-menu" aria-label="Profile" title="Profile" onClick={() => setOpen(o => !o)}>
        <Icon name="user" />
      </button>
      <div id="profile-menu" className="profile-menu" hidden={!open}>
        <p className="profile-who"><span className="muted xs">Signed in as</span><strong>{email ?? '—'}</strong></p>
        <button className="profile-item" onClick={() => { setOpen(false); switchToMasters() }}><Icon name="db" size={14} />Switch to Masters</button>
        <button className="profile-item" onClick={() => { setOpen(false); signOut() }}><Icon name="logout" size={14} />Sign out</button>
      </div>
    </div>
  )
}

/** BuLLMaps navigation: the Router at the front and the ten execution skills behind it, in the owner's
 *  order and naming (her 10-skills list, 18 Nov 2026; master doc "BuLLMaps - Skill & Subskill mapping",
 *  5 Nov 2026). Every skill's sub-skills are the same four phases (master doc §5; "Agent Workflow" tab,
 *  BuLLM - BuLLMaps Workflow v0.1). The tagline under each name is the agency role from the master doc.
 *  Skills have no screens yet, so rows only fold open - nothing here navigates or reports status. */
interface Skill { id: string; label: string; icon: string; role: string; description: string }
const PHASES = [
  { n: 1, label: 'Research, Extract, Audit & Analyze', description: 'Find out what is needed and what is true today, starting from the previous cycle\'s results.' },
  { n: 2, label: 'Recommend, Strategize, Plan & Client Review', description: 'Turn findings into a plan. The client reviews and approves the scope, the expected output, the audience and any budget.' },
  { n: 3, label: 'Create, Fix, Optimize & Schedule', description: 'Produce the work as drafts, fix what is rejected, test it and set the timing. Nothing is live at this point.' },
  { n: 4, label: 'Upload, Publish, Monitor & Report', description: 'Only after approval, publish or deliver, verify the result, monitor it and report back.' },
]
const ROUTER: Skill = { id: '0', label: 'Router / Concierge', icon: 'tb-robot', role: 'the front desk', description: 'Listens, works out what is being asked, keeps the business basics on file, asks one short question when something is missing, routes the work to the right skills, and controls every approval.' }
const SKILLS: Skill[] = [
  { id: '1', label: 'Audit & Strategy', icon: 'gauge', role: 'the consultant', description: 'Checks where my marketing stands and tells me what to do next, with a simple plan.' },
  { id: '2', label: 'Website', icon: 'schema', role: 'the storefront', description: 'Fixes and improves my website so people find me on Google.' },
  { id: '3', label: 'SEO (Organic, Local & AEO/GEO)', icon: 'tb-search', role: 'the signposts', description: 'Improves visibility on Google, on Maps and in AI answers.' },
  { id: '4', label: 'Content & Creatives', icon: 'tb-photo', role: 'the studio', description: 'Writes and makes text, image, video and audio content.' },
  { id: '5', label: 'Paid Ads', icon: 'tb-target', role: 'the media buyer', description: 'Runs ads across platforms inside the approved budget.' },
  { id: '6', label: 'Social Media', icon: 'tb-thumb-up', role: 'the noticeboard', description: 'Publishes and answers on social channels.' },
  { id: '7', label: 'Brand', icon: 'shield', role: 'the brand guardian', description: 'Keeps the look and reputation consistent.' },
  { id: '8', label: 'MQL', icon: 'tb-inbox', role: 'the lead sorter', description: 'Cleans, scores and routes every marketing enquiry.' },
  { id: '9', label: 'CRM', icon: 'tb-briefcase', role: 'the notebook', description: 'The customer notebook: records and follow-up.' },
  { id: '10', label: 'Reports & Publishing', icon: 'graph', role: 'the report desk', description: 'Puts the numbers together and reports back.' },
]

export function NavRail({ snap }: { snap?: Snapshot }) {
  const path = usePath()
  const current = navScreen(path)
  const drawer = useUi(s => s.drawer)
  // Narrow screens open the pane as an overlay drawer: always show the full rail there (17 Nov 2026).
  const collapsed = useUi(s => s.shell.nav) && drawer !== 'nav'
  const [open, setOpen] = useState<Set<string>>(() => new Set())
  const [query, setQuery] = useState('')
  const toggleSkill = (id: string) => setOpen(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const openSkill = (id: string) => { setQuery(''); setOpen(s => new Set(s).add(id)) }
  // The search card is hidden on Upload, so a query typed elsewhere does not filter the skills there.
  const q = current === '1.1' && snap ? '' : query.trim().toLowerCase()
  const phaseHits = (s: Skill) => PHASES.filter(p => p.label.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  const skillHit = (s: Skill) => s.label.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.role.includes(q)
  const hits = q ? [ROUTER, ...SKILLS].filter(s => skillHit(s) || phaseHits(s).length) : []
  const toggleRail = () => setUi(s => ({ shell: { ...s.shell, nav: !s.shell.nav } }))
  const onUpload = current === '1.1'
  const navSpot = usePaneSpot('nav')

  // One skill group: the skill row folds open to its four phase sub-skills (inert until the skill screens exist).
  const skillGroup = (s: Skill) => {
    const isOpen = open.has(s.id)
    return (
      <li key={s.id} className="nv-stage">
        <button className="nv-stage-btn" aria-expanded={isOpen} aria-controls={`nv-group-${s.id}`} onClick={() => toggleSkill(s.id)} title={s.description}>
          <span className="nv-mark" aria-hidden><Icon name={s.icon} size={15} /></span>
          <span className="nv-stage-text">
            <span className="nv-stage-name">{s.label}</span>
            <span className="nv-stage-status">{s.role}</span>
          </span>
        </button>
        <ul id={`nv-group-${s.id}`} className="nv-items" hidden={!isOpen}>
          {PHASES.map(p => (
            <li key={p.n}><span className="nv-item nv-static" title={p.description}>
              <span className="nv-sub-num muted xs" aria-hidden>{s.id}.{p.n}</span>
              <span className="nv-label">{p.label}</span>
            </span></li>
          ))}
        </ul>
      </li>
    )
  }

  // Collapsed (17 Nov 2026, per user): a slim icon rail - the stage icons on their dotted connector, active
  // stage highlighted, names in tooltips; the top chevron expands again. Works at either edge (data-opens).
  if (collapsed) {
    const opens = navSpot === 2 ? 'left' : 'right'
    return (
      <nav className="shell-pane shell-rail" aria-label="Workflow navigation" data-opens={opens}>
        <div className="rail-head">
          <button className="icon-btn sm" onClick={toggleRail} aria-expanded={false} aria-label="Expand navigation" title="Expand navigation">
            <Icon name={opens === 'left' ? 'panel-left' : 'panel-right'} size={14} />
          </button>
        </div>
        <ul className="nv-mini">{[ROUTER, ...SKILLS].map(s => (
          <li key={s.id}><Tip text={s.label} note={s.role}>
            <button className="nv-dot" onClick={() => { toggleRail(); setOpen(prev => new Set(prev).add(s.id)) }} aria-label={s.label}>
              <Icon name={s.icon} size={15} />
            </button>
          </Tip><span className="nv-mini-label" aria-hidden>{s.label}</span></li>
        ))}</ul>
      </nav>
    )
  }

  return (
    <nav className="shell-pane navrail" aria-labelledby="nav-title">
      {/* Collapse control at the pane's far-left edge, before the title (17 Nov 2026, approved wireframes change 1). */}
      <header {...paneHeaderProps} className="shell-head">
        <button className="icon-btn sm" onClick={toggleRail} aria-expanded aria-label="Collapse navigation" title="Collapse"><Icon name="panel-left" size={14} /></button>
        <h2 id="nav-title">{onUpload ? 'Workflow' : 'Navigate'}</h2>
        <PaneGrip pane="nav" />
      </header>
      <div className="nv-body">
        {/* Upload swaps the search card for + Add files; the card is display:none, so no empty
            space sits between Add files and the skills list (per user, 18 Nov 2026). */}
        <div className="nv-top" data-upload={onUpload && snap ? '' : undefined}>
        {onUpload && snap && <UploadFilesBlock snap={snap} />}
        <div className="nv-card">
          <strong className="nv-card-title">BuLLMaps</strong>
          <span className="muted xs">The marketing agent</span>
          <label className="nv-search">
            <Icon name="search" size={13} />
            <span className="sr-only">Search skills</span>
            <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search skills"
              onKeyDown={e => { if (e.key === 'Escape') setQuery('') }} />
          </label>
        </div>
        </div>
        {q ? (
          <ul className="nv-items nv-results" aria-label="Search results">
            {hits.length ? hits.flatMap(s => [
              <li key={s.id}><button className="nv-item" onClick={() => openSkill(s.id)}>
                <Icon name={s.icon} size={14} /><span className="nv-label">{s.label}</span><span className="muted xs">{s.id === '0' ? 'Router' : 'Skill'}</span>
              </button></li>,
              ...phaseHits(s).map(p => (
                <li key={`${s.id}.${p.n}`}><button className="nv-item" onClick={() => openSkill(s.id)} title={p.description}>
                  <span className="nv-sub-num muted xs" aria-hidden>{s.id}.{p.n}</span><span className="nv-label">{p.label}</span><span className="muted xs">{s.label}</span>
                </button></li>
              )),
            ]) : <li className="muted xs nv-none">No skill matches “{query}”.</li>}
          </ul>
        ) : (
          <ol className="nv-stages">
            {skillGroup(ROUTER)}
            <li className="nv-divider" aria-hidden>Execution skills</li>
            {SKILLS.map(skillGroup)}
          </ol>
        )}
      </div>
    </nav>
  )
}
