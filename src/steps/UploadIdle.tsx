// Upload's right pane with zero files (18 Nov 2026, per user): the selected skill's step tracker from her
// sub-skills spreadsheet, with each step's expected output and its automated / human-gated icon from the adopted
// Agent Workflow tab. Nothing has run, so every step shows pending. (Replaces the 22 Oct skeleton placeholders.)
import './upload-idle.css'
import { SkillSteps } from './SkillSteps'

export function UploadIdle({ leaving }: { leaving?: boolean }) {
  return (
    <div className={`up-idle${leaving ? ' up-idle-leaving' : ''}`} aria-hidden={leaving || undefined}>
      <SkillSteps />
    </div>
  )
}
