// Router / Concierge: the chat runs the skill-0 flow and never publishes, schedules or spends.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { markFromText, parseRequest, routerReply, skillsFor, type RouterMsg } from './router.ts'

const CTX = { files: ['Ariya Interiors - Brand Profile.pdf', 'Ariya Interiors - Campaign Report.pdf'] }
const turn = (role: string, text: string, mark?: RouterMsg['mark']): RouterMsg => ({ role, text, mark })

test('router: parses tasks, offer and language from a voice-style request', () => {
  const p = parseRequest('Make a LinkedIn post for our Winter Home Makeover offer using the brand profile I uploaded')
  assert.deepEqual(p.tasks, ['1 LinkedIn post'])
  assert.equal(p.offer, 'Winter Home Makeover')
  assert.equal(p.language, 'English')
  assert.deepEqual(parseRequest('Plan three posts for the Winter Home Makeover offer').tasks, ['3 posts'])
  assert.deepEqual(parseRequest('Create two Instagram reels and a blog').tasks, ['2 Instagram reels', '1 blog'])
})

test('router: intake reply is the structured request, linked brand context and the clarifying gaps', () => {
  const r = routerReply([], 'Make a LinkedIn post for our Winter Home Makeover offer', CTX)!
  assert.equal(r.mark, 'intake')
  assert.match(r.text, /Task\(s\): create 1 LinkedIn post/)
  assert.match(r.text, /Ariya Interiors - Brand Profile\.pdf/)
  assert.match(r.text, /gaps to close before I plan \(0\.1\.3\)/)
  assert.match(routerReply([], 'Make a post', { files: [] })!.text, /no brand profile or previous-cycle report uploaded yet/)
})

test('router: answers produce the plan read-back awaiting the decision', () => {
  const h: RouterMsg[] = [turn('user', 'Make a LinkedIn post for our Winter Home Makeover offer'), turn('assistant', '...', 'intake')]
  const r = routerReply(h, 'Local buyers, organic only, first post on 1 December', CTX)!
  assert.equal(r.mark, 'plan')
  assert.match(r.text, /Noted: "Local buyers, organic only, first post on 1 December"/)
  assert.match(r.text, /Content & Creatives \(skill 4\)/)
  assert.match(r.text, /Social Media \(skill 6\)/)
  assert.match(r.text, /Reply approve, edit or cancel/)
})

test('router: approve records the decision and hands the brief to the selected skills', () => {
  const h: RouterMsg[] = [
    turn('user', 'Make a LinkedIn post for our Winter Home Makeover offer'), turn('assistant', '...', 'intake'),
    turn('user', 'you decide'), turn('assistant', '...', 'plan')]
  const r = routerReply(h, 'approve', CTX)!
  assert.equal(r.mark, 'approved')
  assert.match(r.text, /decision recorded against the plan \(0\.2\.3\)/)
  assert.match(r.text, /Content & Creatives \(skill 4\)/)
  const s = routerReply([...h, turn('user', 'approve'), turn('assistant', '...', 'approved')], 'status?', CTX)!
  assert.equal(s.mark, 'status')
  assert.match(s.text, /Current status \(0\.3\.2\)/)
})

test('router: cancel and edit are recorded, nothing is handed off', () => {
  const h: RouterMsg[] = [turn('user', 'Plan three posts for the Winter Home Makeover offer'), turn('assistant', '...', 'intake'), turn('user', 'you decide'), turn('assistant', '...', 'plan')]
  assert.match(routerReply(h, 'cancel', CTX)!.text, /Cancelled and recorded \(0\.2\.3\)/)
  assert.equal(routerReply(h, 'edit', CTX)!.mark, 'edit')
})

test('router: restored threads recover the phase from reply text; workflow questions pass through', () => {
  assert.equal(markFromText('... Reply approve, edit or cancel.'), 'plan')
  assert.equal(markFromText('... gaps to close before I plan (0.1.3): ...'), 'intake')
  assert.equal(routerReply([], 'What is next?', CTX), undefined)
})

test('router: audits route to skill 1, ads to skill 5', () => {
  assert.deepEqual(skillsFor(parseRequest('Audit my marketing'), 'Audit my marketing').map(s => s.id), ['1'])
  assert.ok(skillsFor(parseRequest('Run two LinkedIn ads for the Winter Home Makeover offer'), 'Run two LinkedIn ads for the Winter Home Makeover offer').some(s => s.id === '5'))
})
