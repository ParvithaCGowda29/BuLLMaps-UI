// Showcase messages on the login panel. Add or remove one line; the carousel adapts.
// BuLLMaps marketing copy (18 Nov 2026, per user): voice-first intake through the Router, approvals before publish.
// Skill/sub-skill structure follows the "BuLLMaps" tab of her sub-skills spreadsheet (18 Nov 2026), which has no
// shared four phases - each skill carries its own four sub-skills.
export interface LoginMessage { headline: string; flow: string }

export const LOGIN_MESSAGES: LoginMessage[] = [
  { headline: 'Ask for marketing in plain words, from where you already are.', flow: 'Voice note > Router > Skill > Done' },
  { headline: 'One front desk routes every request to the right skill.', flow: 'Listen > Understand > Route > Approve' },
  { headline: 'Ten skills, forty sub-skills, one marketing agent.', flow: 'Skill > Sub-skill > Step > Done' },
  { headline: 'Nothing goes live without your approval.', flow: 'Draft > Review > Approve > Publish' },
]
