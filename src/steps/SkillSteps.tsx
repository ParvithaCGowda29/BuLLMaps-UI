// Outputs pane: the selected BuLLMaps skill's step tracker (18 Nov 2026, per user; her reference visual). Steps are
// her sub-skills spreadsheet's Steps column; each step carries its expected output and, from the adopted Agent
// Workflow tab, whether it runs automated (robot) or is human-gated by an owner approval (shield). All steps show
// pending: nothing has run - the tracker never fakes progress, and the completion card and export row render only
// when a real run finishes (no backend is connected yet).
import './skill-steps.css'
import { Icon } from '../components/ui'
import { useUi } from '../lib/store'
import { SKILL_STEPS, SKILL_NAMES, type SubSkillInfo } from '../lib/bullmapsSteps'

export function SkillSteps() {
  const selected = useUi(s => s.selectedSkill ?? '1')
  const subs = SKILL_STEPS[selected] ?? []
  return (
    <div className="sk-steps">
      <h3 className="sk-skill">{SKILL_NAMES[selected] ?? 'Skill'}</h3>
      {subs.map(sub => <SubSkillBlock key={sub.n} sub={sub} />)}
    </div>
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
