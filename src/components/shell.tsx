import { useEffect, useRef, useState } from 'react'
import { setUi, useUi } from '../lib/store'
import { signOut, switchToMasters, useSession } from '../features/login/session'
import { SKILLS } from '../skills/skills.config.ts'
import { newTask, pickSkill, pickSub, useTask } from '../skills/task'
import StatusMark, { type StatusMarkStatus } from './reactbits/StatusMark'
import './reactbits/reactbits.css'
import './skills.css'
import { Icon, Tip } from './ui'
import { BrandLockup } from './BrandLockup'

export function TopBar() {
  const theme = useUi(s => s.theme)
  return (
    <header className="topbar">
      <div className="brand">
        <button className="icon-btn nav-drawer-btn" onClick={() => setUi(s => ({ drawer: s.drawer === 'nav' ? null : 'nav' }))} aria-label="Open skills" title="Skills"><Icon name="menu" /></button>
        <BrandLockup tag="marketing workflows" />
      </div>
      <div className="topbar-right">
        <button className="icon-btn" aria-pressed={theme === 'light'} onClick={() => setUi({ theme: theme === 'dark' ? 'light' : 'dark' })}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
        <ProfileMenu />
        <button className="icon-btn assist-drawer-btn" onClick={() => setUi(s => ({ drawer: s.drawer === 'assistant' ? null : 'assistant' }))} aria-label="Open BuLLMaps Assistant" title="BuLLMaps Assistant"><Icon name="sparkle" /></button>
      </div>
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

const LABEL: Record<StatusMarkStatus, string> = { pending: 'Idle', running: 'Working on a task', done: 'Plan approved', failed: 'Failed', cancelled: 'Cancelled' }
const Ring = ({ status, size = 18 }: { status: StatusMarkStatus; size?: number }) =>
  <StatusMark className="rb-sm" status={status} size={size} strokeWidth={1.6} color="var(--accent)" doneColor="var(--ok)" errorColor="var(--err)" />

/** SKILLS: the ten skills from skills.config.ts. The active skill opens its four subskills; the open subskill shows its steps. */
export function SkillsRail() {
  const { skill, open, sub, step, task } = useTask(s => s)
  const collapsed = useUi(s => s.shell.nav)
  const toggleRail = () => setUi(s => ({ shell: { ...s.shell, nav: !s.shell.nav } }))
  // The skill (and subskill) holding the current task shows it on its ring: working until approved, then a check.
  const ringOf = (i: number, j?: number): StatusMarkStatus => {
    const r = task?.route
    if (!r || r.skill !== i || (j !== undefined && r.sub !== j)) return 'pending'
    return task.phase === 'approved' ? 'done' : 'running'
  }
  const start = () => { newTask(); setUi({ drawer: null }) }

  if (collapsed) return (
    <nav className="shell-pane shell-rail" aria-label="Skills">
      <div className="rail-head">
        <button className="icon-btn sm" onClick={toggleRail} aria-expanded={false} aria-label="Expand skills" title="Expand skills"><Icon name="panel-right" size={14} /></button>
      </div>
      <ul className="nv-mini">{SKILLS.map((s, i) => (
        <li key={s.id}><Tip text={s.name} note={LABEL[ringOf(i)]}>
          <button className={`nv-dot ${skill === i ? 'on' : ''}`} onClick={() => { toggleRail(); if (skill !== i || !open) pickSkill(i) }} aria-label={`${s.name}: ${LABEL[ringOf(i)]}`}>
            <Icon name={s.icon} size={15} />
          </button>
        </Tip><span className="nv-mini-label" aria-hidden>{s.name.split(' ')[0]}</span></li>
      ))}</ul>
    </nav>
  )

  return (
    <nav className="shell-pane navrail sk-rail" aria-labelledby="nav-title">
      <header className="shell-head">
        <h2 id="nav-title">Skills</h2>
        <span className="sk-head-actions">
          <button className="sk-task" onClick={start}><Icon name="tb-plus" size={14} />Task</button>
          <button className="icon-btn sm" onClick={toggleRail} aria-expanded aria-label="Collapse skills" title="Collapse"><Icon name="panel-left" size={14} /></button>
        </span>
      </header>
      <ul className="sk-list">
        {SKILLS.map((s, i) => {
          const isOpen = skill === i && open
          return (
            <li key={s.id} className={`sk-skill${skill === i ? ' on' : ''}`}>
              <button className="sk-row" aria-expanded={isOpen} aria-controls={`sk-${s.id}`} onClick={() => { pickSkill(i); setUi({ drawer: null }) }}>
                <Ring status={ringOf(i)} />
                <span className="sk-name">{s.name}</span>
                <span className="sk-count" aria-label={`${s.subskills.length} subskills`}>{s.subskills.length}</span>
                <span className="sk-chev" aria-hidden><Icon name="chevron" size={12} /></span>
                <span className="sr-only">, {LABEL[ringOf(i)]}</span>
              </button>
              {isOpen && <ul id={`sk-${s.id}`} className="sk-subs">
                {s.subskills.map((ss, j) => (
                  <li key={ss.name} className={`sk-sub${sub === j ? ' on' : ''}`}>
                    <button className="sk-row sk-subrow" aria-expanded={sub === j} onClick={() => pickSub(j)}>
                      <Ring status={ringOf(i, j)} size={15} />
                      <span className="sk-name">{ss.name}</span>
                      <span className="sk-chev" aria-hidden><Icon name="chevron" size={11} /></span>
                    </button>
                    {sub === j && <ul className="sk-steps">
                      {ss.steps.map((st, k) => (
                        <li key={st.name} className={step === k ? 'on' : undefined} title={st.description || undefined} aria-current={step === k ? 'step' : undefined}>{st.name}</li>
                      ))}
                    </ul>}
                  </li>
                ))}
              </ul>}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
