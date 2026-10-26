// Showcase messages on the login panel. Add or remove one line; the carousel adapts.
export interface LoginMessage { headline: string; flow: string }

export const LOGIN_MESSAGES: LoginMessage[] = [
  { headline: 'Say what you need. A skill picks it up from there.', flow: 'Ask > Clarify > Plan > Approve' },
  { headline: 'Reels, posts and reports from one voice note.', flow: 'Voice note > Brief > Draft > Review' },
  { headline: 'Nothing publishes or spends without your approval.', flow: 'Plan > Read back > Approve > Publish' },
  { headline: 'Ten marketing skills, one assistant.', flow: 'Audit > Create > Publish > Report' },
]
