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
import bull from '../assets/login/bull-head-transparent.png'

export function SkillSteps() {
  const selected = useUi(s => s.selectedSkill)
  // Nothing picked yet (19 Nov 2026, per user): no output content, just an animated waiting-for-input widget.
  if (!selected) return (
    <div className="sk-steps sk-wait" aria-label="Outputs">
      <img src={bull} alt="" className="sk-wait-bull" />
      <p className="sk-wait-text">Waiting for your input<span className="sk-dots" aria-hidden><span>.</span><span>.</span><span>.</span></span></p>
      <p className="muted xs">Pick a skill or sub-skill on the left to see its output here.</p>
    </div>
  )
  const [skillId, subN] = selected.split('.')
  const subs = (SKILL_STEPS[skillId] ?? []).filter(sub => !subN || sub.n === selected)
  // Skill 0 (Router / Concierge, 19 Nov 2026, per user): the RFQ-style design - a green-tick progress checklist,
  // then the output card with the sub-skill's outputs visible inline. No numbering, no gating chip (gating lives
  // in the left pane only), nothing to export.
  if (skillId === '0') return (
    <div className="sk-steps">
      <h3 className="sk-skill">{SKILL_NAMES[skillId]}</h3>
      {subs.map(sub => <RouterSubBlock key={sub.n} sub={sub} />)}
    </div>
  )
  return (
    <div className="sk-steps">
      <h3 className="sk-skill">{SKILL_NAMES[skillId] ?? 'Skill'}</h3>
      {subs.map(sub => <SubSkillBlock key={sub.n} sub={sub} />)}
    </div>
  )
}

function RouterSubBlock({ sub }: { sub: SubSkillInfo }) {
  return (
    <section className="sk-sub sk-router" aria-label={sub.name}>
      <header className="sk-sub-head">
        <h4 className="sk-sub-name">{sub.name}</h4>
      </header>
      <ol className="sk-track">
        {sub.steps.map(st => (
          <li key={st.n} className="sk-step done">
            <span className="sk-mark" aria-hidden><Icon name="check" size={11} /></span>
            <span className="sk-body">
              <span className="sk-label">{st.name}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="sk-result" role="status">
        <p className="sk-result-head">
          <span className="sk-result-check" aria-hidden><Icon name="check" size={11} /></span>
          <strong>{sub.name} completed successfully.</strong>
        </p>
        <p className="sk-result-sub muted xs">Your outputs are ready.</p>
        <ul className="sk-result-list">
          {sub.steps.map(st => <li key={st.n}>{st.output}</li>)}
        </ul>
      </div>
    </section>
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
