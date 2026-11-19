// Outputs pane (19 Nov 2026, per user): empty until a skill or sub-skill is picked in the left rail, then it shows
// exactly that pick - the whole skill's sub-skills and steps, or the one picked sub-skill. Steps are her sub-skills
// spreadsheet's Steps column; each step carries its expected output and, from the adopted Agent Workflow tab,
// whether it runs automated (robot) or is human-gated by an owner approval (shield). All steps show pending:
// nothing has run - the tracker never fakes progress. A Run history accordion (BAM style) lists finished runs;
// it stays empty until a real run finishes (no backend is connected yet).
import './skill-steps.css'
import { Icon } from '../components/ui'
import { useUi } from '../lib/store'
import { SKILL_STEPS, SKILL_NAMES, type SubSkillInfo } from '../lib/bullmapsSteps'
import { useRuns, type PastRun } from './runHistory'

export function SkillSteps() {
  const selected = useUi(s => s.selectedSkill)
  const runs = useRuns(selected)
  // Nothing picked yet: the pane stays empty (19 Nov 2026, per user).
  if (!selected) return <div className="sk-steps" aria-label="Outputs" />
  const [skillId, subN] = selected.split('.')
  const subs = (SKILL_STEPS[skillId] ?? []).filter(sub => !subN || sub.n === selected)
  return (
    <div className="sk-steps">
      <h3 className="sk-skill">{SKILL_NAMES[skillId] ?? 'Skill'}</h3>
      {subs.map(sub => <SubSkillBlock key={sub.n} sub={sub} />)}
      <RunHistory runs={runs} />
    </div>
  )
}

/** BAM-style run history: finished runs of the picked skill or sub-skill, newest first. */
function RunHistory({ runs }: { runs: PastRun[] }) {
  return (
    <details className="accordion sk-history">
      <summary><Icon name="clock" size={12} />Run history<span className="muted xs">{runs.length ? `${runs.length} run${runs.length === 1 ? '' : 's'}` : 'No finished runs yet'}</span></summary>
      <ul className="run-history">{runs.map(h => (
        <li key={h.key}>
          <span className="xs">{h.skill}</span>
          <time className="muted xs" dateTime={h.endedAt}>{new Date(h.endedAt).toLocaleString()}</time>
          <span className={`sk-run-status ${h.status === 'succeeded' ? 'is-pass' : 'is-fail'}`}>{h.status === 'succeeded' ? 'Passed' : 'Failed'}</span>
        </li>))}</ul>
    </details>
  )
}

function SubSkillBlock({ sub }: { sub: SubSkillInfo }) {
  const gated = sub.steps.filter(s => s.gated).length
  // One shared expected output across the sub-skill shows once, under the track; mixed outputs show per step.
  const outputs = [...new Set(sub.steps.map(s => s.output))]
  const shared = outputs.length === 1 ? outputs[0] : null
  return (
    <section className="sk-sub" aria-label={`${sub.n} ${sub.name}`}>
      <header className="sk-sub-head">
        <span className="sk-sub-num muted xs" aria-hidden>{sub.n}</span>
        <h4 className="sk-sub-name">{sub.name}</h4>
        <span className={`sk-gate${gated ? ' is-gated' : ''}`}
          title={gated ? `${gated} of ${sub.steps.length} steps need owner approval` : 'Every step runs automated'}>
          {gated ? <><Icon name="tb-shield-check" size={12} />{gated === sub.steps.length ? 'Human-gated' : `${gated} gated`}</>
            : <><Icon name="tb-robot" size={12} />Automated</>}
        </span>
      </header>
      <ol className="sk-track">
        {sub.steps.map(st => (
          <li key={st.n} className="sk-step">
            <span className="sk-mark" aria-hidden />
            <span className="sk-body">
              <span className="sk-label">{st.name}
                <span className="sk-step-gate" title={st.gated ? 'Needs owner approval' : 'Automated'}>
                  <Icon name={st.gated ? 'tb-shield-check' : 'tb-robot'} size={11} />
                </span>
              </span>
              {!shared && <span className="sk-out muted xs">{st.output}</span>}
            </span>
          </li>
        ))}
      </ol>
      {shared && <p className="sk-out sk-out-shared muted xs">Output: {shared}</p>}
    </section>
  )
}
