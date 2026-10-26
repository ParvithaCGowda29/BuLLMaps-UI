import { useEffect } from 'react'
import { setUi, useUi } from './lib/store'
import { navigate, usePath } from './lib/route'
import { SkillsRail, TopBar } from './components/shell'
import { AssistantPane } from './components/AssistantPane'
import { ResultsPane } from './components/ResultsPane'
import { Icon } from './components/ui'
import { SKILLS } from './skills/skills.config.ts'
import { useTask } from './skills/task'
import { LoginPage } from './features/login/LoginPage'
import { useSession } from './features/login/session'

export default function App() {
  const path = usePath()
  const session = useSession()
  // /login is public and has no shell; every other route needs a session (else /login?next=<where you were going>).
  const redirect = path === '/login' ? (session ? '/' : null) : session ? null : `/login?next=${encodeURIComponent(location.pathname + location.search + location.hash)}`
  useEffect(() => { if (redirect) navigate(redirect, { replace: true }) }, [redirect])
  if (redirect) return null
  if (path === '/login') return <LoginPage />
  return <Shell />
}

/** One shell: top bar, then SKILLS · BuLLMaps Assistant · RESULTS & EDITS. */
function Shell() {
  const theme = useUi(s => s.theme)
  const drawer = useUi(s => s.drawer)
  const shell = useUi(s => s.shell)
  const skill = useTask(s => SKILLS[s.skill]?.name)
  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  useEffect(() => {
    if (!drawer) return
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setUi({ drawer: null }) }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [drawer])
  return (
    // data-env="FDE" keeps the shell's blue top-bar accent line (styles.css); there is no Staging view here.
    <div className="app" data-env="FDE">
      <a className="skip" href="#ws-title">Skip to results</a>
      <TopBar />
      <div className="shell" data-nav={shell.nav ? 'collapsed' : undefined} data-assist={shell.assistant ? 'collapsed' : undefined} data-drawer={drawer ?? undefined}>
        <div className="shell-slot slot-nav"><SkillsRail /></div>
        {/* Mounted once for the session, so the conversation survives everything else. */}
        <div className="shell-slot slot-assist"><AssistantPane /></div>
        {drawer && <button className="drawer-scrim" aria-label="Close panel" onClick={() => setUi({ drawer: null })} />}
        <section className="shell-pane workspace" aria-labelledby="ws-title">
          <header className="shell-head ws-head">
            <h2 id="ws-title" tabIndex={-1}><Icon name="table" size={13} /><span className="ws-kicker">Results &amp; edits</span>{skill && <span className="ws-title">{skill}</span>}</h2>
          </header>
          <div className="ws-body"><ResultsPane /></div>
        </section>
      </div>
    </div>
  )
}
