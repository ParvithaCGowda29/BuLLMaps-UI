import { test } from 'node:test'
import assert from 'node:assert/strict'
import { SKILLS } from './skills.config.ts'
import { APPROVED, CANCELLED, NO_MATCH, UNROUTED, intake, route } from './router.ts'

test('ten skills, four subskills each, every subskill has steps', () => {
  assert.equal(SKILLS.length, 10)
  for (const s of SKILLS) { assert.equal(s.subskills.length, 4, s.name); for (const sub of s.subskills) assert.ok(sub.steps.length > 0, sub.name) }
})

test('the starter chips route to the right skill', () => {
  const skill = (t: string) => SKILLS[route(t)!.skill].id
  assert.equal(skill('Make a reel for my offer'), 'content')
  assert.equal(skill('How did I do this week?'), 'reports')
  assert.equal(skill("Plan this month's posts"), 'social')
  assert.equal(skill('Audit my website'), 'audit')
  assert.equal(route('hello there'), undefined)
})

test('short request: one clarifying question, then the plan, then a hard stop for approval', () => {
  const a = intake('Make a reel for my offer', null, 1)
  assert.equal(a.task?.phase, 'clarify')
  const b = intake('Diwali whitening offer, book on WhatsApp', a.task, 1)
  assert.equal(b.task?.phase, 'approval')
  assert.match(b.reply, /Reels/)
  assert.match(b.reply, /until you approve/)
  // Changing the plan reads it back again and still waits.
  assert.equal(intake('make it 15 seconds', b.task).task?.phase, 'approval')
  assert.deepEqual(intake('yes', b.task), { task: { ...b.task!, phase: 'approved' }, reply: APPROVED })
  assert.deepEqual(intake('cancel', b.task), { task: null, reply: CANCELLED })
})

test('detailed request goes straight to approval; unknown asks once, then gives up honestly', () => {
  assert.equal(intake('Run a Google Ads campaign for teeth whitening in Pune with a 2000 daily budget', null).task?.phase, 'approval')
  const u = intake('hello', null, 2)
  assert.deepEqual([u.task?.phase, u.reply], ['clarify', UNROUTED])
  assert.equal(intake('not sure', u.task).reply, NO_MATCH)
})
