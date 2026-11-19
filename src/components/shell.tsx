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
import { useRuns } from '../steps/runHistory'
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
        {/* Run history (19 Nov 2026, per user): the finished-runs record lives in the topbar, RFQ/BAM style. */}
        <RunHistoryMenu />
        <span className={`sync ${offline ? 'tone-err' : 'tone-muted'}`} role="status" title={syncedAt ? `Last backend sync ${fmtFull(new Date(syncedAt).toISOString())}` : undefined}>
          <Icon name={offline ? 'alert' : 'db'} size={12} />
          <span className="sync-text">{offline ? `Backend unreachable. Status unknown since ${syncedAt ? fmtTime(new Date(syncedAt).toISOString()) : 'start'}` : `All changes saved · ${syncedAt ? fmtTime(new Date(syncedAt).toISOString()) : '—'}`}</span>
        </span>
        {/* The Staging/FDE glass switch is removed (19 Nov 2026, per user); the topbar keeps sync, theme and profile. */}
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

// Run history (19 Nov 2026, per user): a topbar clock menu listing finished runs, newest first, from the
// localStorage record (runHistory.ts). Click or keyboard opens it; Escape or an outside click closes it.
function RunHistoryMenu() {
  const runs = useRuns()
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
      <button ref={btn} className="icon-btn" aria-expanded={open} aria-controls="run-history-menu" aria-label="Run history" title="Run history" onClick={() => setOpen(o => !o)}>
        <Icon name="clock" />
      </button>
      <div id="run-history-menu" className="profile-menu runs-menu" hidden={!open}>
        <p className="profile-who"><span className="muted xs">Run history</span></p>
        {runs.length === 0 && <p className="runs-empty muted xs">No finished runs yet. A run is recorded here when one finishes.</p>}
        {runs.map(h => (
          <div key={h.key} className="runs-row">
            <span className="runs-skill">{h.skill}</span>
            <time className="muted xs" dateTime={h.endedAt}>{new Date(h.endedAt).toLocaleString()}</time>
            <span className={`runs-status ${h.status === 'succeeded' ? 'is-pass' : 'is-fail'}`}>{h.status === 'succeeded' ? 'Passed' : 'Failed'}</span>
          </div>))}
      </div>
    </div>
  )
}

/** BuLLMaps navigation: the ten execution skills in the owner's order and naming (her 10-skills list, 18 Nov
 *  2026; master doc "BuLLMaps - Skill & Subskill mapping", 5 Nov 2026). The Router is not a nav entry (18 Nov
 *  2026, per user): it is the voice intake, mapped to the middle pane. Each skill's four sub-skills are its own,
 *  named and described from the "BuLLMaps" tab of her sub-skills spreadsheet (18 Nov 2026, per user; supersedes
 *  the shared four phases). The tagline under each name is the agency role from the master doc.
 *  Skills have no screens yet, so rows only fold open - nothing here navigates or reports status. */
interface Skill { id: string; label: string; icon: string; role: string; description: string }
interface SubSkill { n: number; label: string; description: string }
// Sub-skill names (19 Nov 2026, per user): her adopted Agent Workflow tab's names, verbatim - every skill has the
// same four phases. The descriptions stay skill-specific (search + tooltips only).
const SUBSKILLS: Record<string, SubSkill[]> = {
  '1': [
    { n: 1, label: 'Research, Extract, Audit & Analyze', description: 'Runs search, keyword, competitor, backlink, citation and lead-driver audits to show what is working and what is holding us back.' },
    { n: 2, label: 'Recommend, Strategize, Plan & Client Review', description: 'Audits our LinkedIn, Google Business Profile, website and brand assets to find gaps and fixes.' },
    { n: 3, label: 'Create, Fix, Optimize & Schedule', description: 'Discovers our offers, ideal customers, market size and which channels bring leads today.' },
    { n: 4, label: 'Upload, Publish, Monitor & Report', description: 'Turns audit findings into a strategy, budget, forecast and content plan.' },
  ],
  '2': [
    { n: 1, label: 'Research, Extract, Audit & Analyze', description: 'Plans and builds the website foundation - structure, design, UX, hosting and WordPress setup.' },
    { n: 2, label: 'Recommend, Strategize, Plan & Client Review', description: 'Builds and optimizes every page type with content, images, on-page SEO and schema.' },
    { n: 3, label: 'Create, Fix, Optimize & Schedule', description: 'Sets up forms, tracking, speed, security, access control, privacy and backups.' },
    { n: 4, label: 'Upload, Publish, Monitor & Report', description: 'Deploys the site, runs pre-launch QA, and gets pages indexed and monitored after go-live.' },
  ],
  '3': [
    { n: 1, label: 'Research, Extract, Audit & Analyze', description: 'Tracks rankings and improves pages so they rank higher in organic search.' },
    { n: 2, label: 'Recommend, Strategize, Plan & Client Review', description: 'Optimizes our Google Business Profile and improves local map rankings across our service areas.' },
    { n: 3, label: 'Create, Fix, Optimize & Schedule', description: 'Makes our business visible and cited in AI answers like ChatGPT, Gemini and Google AI.' },
    { n: 4, label: 'Upload, Publish, Monitor & Report', description: 'Manages reviews, keeps business details consistent everywhere, and covers PR, video, image and ecommerce SEO.' },
  ],
  '4': [
    { n: 1, label: 'Research, Extract, Audit & Analyze', description: 'Writes and optimizes all written content - posts, pages, case studies, whitepapers and briefs.' },
    { n: 2, label: 'Recommend, Strategize, Plan & Client Review', description: 'Creates podcast and audio content.' },
    { n: 3, label: 'Create, Fix, Optimize & Schedule', description: 'Creates videos from reels to long-form, and repurposes them for every channel.' },
    { n: 4, label: 'Upload, Publish, Monitor & Report', description: 'Creates images - banners, social posts, infographics, ad creatives and accessible alt text.' },
  ],
  '5': [
    { n: 1, label: 'Research, Extract, Audit & Analyze', description: 'Sets up ad audiences, budgets, bids and conversion tracking before spend starts.' },
    { n: 2, label: 'Recommend, Strategize, Plan & Client Review', description: 'Creates ad copy, creatives and versions that match the landing page message.' },
    { n: 3, label: 'Create, Fix, Optimize & Schedule', description: 'Builds and launches approved campaigns on Meta, Google and other ad platforms.' },
    { n: 4, label: 'Upload, Publish, Monitor & Report', description: 'Improves live campaigns through A/B tests, search-term reviews, spend checks and lead-quality feedback.' },
  ],
  '6': [
    { n: 1, label: 'Research, Extract, Audit & Analyze', description: 'Plans the social calendar, listens to conversations and creates posts.' },
    { n: 2, label: 'Recommend, Strategize, Plan & Client Review', description: 'Publishes and schedules posts across social platforms, GBP and the website.' },
    { n: 3, label: 'Create, Fix, Optimize & Schedule', description: 'Replies to our audience and moderates the community.' },
    { n: 4, label: 'Upload, Publish, Monitor & Report', description: 'Tracks links and results, and runs experiments to learn what works.' },
  ],
  '7': [
    { n: 1, label: 'Research, Extract, Audit & Analyze', description: 'Defines brand identity and messaging, and keeps every asset consistent.' },
    { n: 2, label: 'Recommend, Strategize, Plan & Client Review', description: 'Tracks mentions, manages reviews and reputation, and escalates crises.' },
    { n: 3, label: 'Create, Fix, Optimize & Schedule', description: 'Builds authority through backlinks, citations and influencer collaborations.' },
    { n: 4, label: 'Upload, Publish, Monitor & Report', description: 'Covers offline brand work - banners, print, conferences and meetups.' },
  ],
  '8': [
    { n: 1, label: 'Research, Extract, Audit & Analyze', description: 'Captures every lead into the CRM and removes duplicates and spam.' },
    { n: 2, label: 'Recommend, Strategize, Plan & Client Review', description: 'Enriches leads with fit and intent data, and scores how qualified they are.' },
    { n: 3, label: 'Create, Fix, Optimize & Schedule', description: 'Defines what counts as an MQL and keeps qualification calibrated with sales feedback.' },
    { n: 4, label: 'Upload, Publish, Monitor & Report', description: 'Alerts the right person and routes each qualified lead to sales or an appointment.' },
  ],
  '9': [
    { n: 1, label: 'Research, Extract, Audit & Analyze', description: 'Keeps CRM data clean, mapped and deduplicated, and captures leads from every source.' },
    { n: 2, label: 'Recommend, Strategize, Plan & Client Review', description: 'Tracks pipeline stages and ties revenue back to the source that brought it.' },
    { n: 3, label: 'Create, Fix, Optimize & Schedule', description: 'Runs lead follow-up over WhatsApp, email and LinkedIn.' },
    { n: 4, label: 'Upload, Publish, Monitor & Report', description: 'Sends lead alerts, runs nurture sequences and hands off to sales.' },
  ],
  '10': [
    { n: 1, label: 'Research, Extract, Audit & Analyze', description: 'Pulls analytics data and answers on-demand report requests.' },
    { n: 2, label: 'Recommend, Strategize, Plan & Client Review', description: 'Reports on ads, social engagement, competitors and SEO performance.' },
    { n: 3, label: 'Create, Fix, Optimize & Schedule', description: 'Builds brand reports, unified KPI dashboards and client project reports.' },
    { n: 4, label: 'Upload, Publish, Monitor & Report', description: 'Sends the weekly summary and publishes and distributes finished reports.' },
  ],
}
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
  // Opening a skill also selects it: the Outputs pane tracks its steps (18 Nov 2026, per user).
  const toggleSkill = (id: string) => setOpen(s => { const n = new Set(s); if (n.has(id)) { n.delete(id) } else { n.add(id); setUi({ selectedSkill: id }) } return n })
  const openAndSelect = (id: string) => setUi({ selectedSkill: id })
  const openSkill = (id: string) => { setQuery(''); setOpen(s => new Set(s).add(id)); openAndSelect(id) }
  // The search card is hidden on Upload, so a query typed elsewhere does not filter the skills there.
  const q = current === '1.1' && snap ? '' : query.trim().toLowerCase()
  const subHits = (s: Skill) => (SUBSKILLS[s.id] ?? []).filter(p => p.label.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  const skillHit = (s: Skill) => s.label.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.role.includes(q)
  const hits = q ? SKILLS.filter(s => skillHit(s) || subHits(s).length) : []
  const toggleRail = () => setUi(s => ({ shell: { ...s.shell, nav: !s.shell.nav } }))
  const onUpload = current === '1.1'
  const navSpot = usePaneSpot('nav')
  const selected = useUi(s => s.selectedSkill)

  // One skill group: the skill row folds open to its four sub-skills; clicking one shows its output on the right
  // (19 Nov 2026, per user: the Outputs pane tracks the picked skill or sub-skill, empty until one is picked).
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
          {(SUBSKILLS[s.id] ?? []).map(p => (
            <li key={p.n}><button className={`nv-item nv-static nv-pick${selected === `${s.id}.${p.n}` ? ' on' : ''}`} title={p.description}
              onClick={() => setUi({ selectedSkill: `${s.id}.${p.n}` })}>
              <span className="nv-sub-num muted xs" aria-hidden>{s.id}.{p.n}</span>
              <span className="nv-label">{p.label}</span>
            </button></li>
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
        <ul className="nv-mini">{SKILLS.map(s => (
          <li key={s.id}><Tip text={s.label} note={s.role}>
            <button className="nv-dot" onClick={() => { toggleRail(); setOpen(prev => new Set(prev).add(s.id)); openAndSelect(s.id) }} aria-label={s.label}>
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
                <Icon name={s.icon} size={14} /><span className="nv-label">{s.label}</span><span className="muted xs">Skill</span>
              </button></li>,
              ...subHits(s).map(p => (
                <li key={`${s.id}.${p.n}`}><button className="nv-item" onClick={() => openSkill(s.id)} title={p.description}>
                  <span className="nv-sub-num muted xs" aria-hidden>{s.id}.{p.n}</span><span className="nv-label">{p.label}</span><span className="muted xs">{s.label}</span>
                </button></li>
              )),
            ]) : <li className="muted xs nv-none">No skill matches “{query}”.</li>}
          </ul>
        ) : (
          <ol className="nv-stages">
            <li className="nv-divider" aria-hidden>Execution skills</li>
            {SKILLS.map(skillGroup)}
          </ol>
        )}
      </div>
    </nav>
  )
}
