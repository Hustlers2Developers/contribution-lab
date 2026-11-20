import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { validateEmail, validateSignup, validateUsername } from '../src/validation.js';

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  username: 'ada-lovelace',
  password: 'secret',
  skills: ['JavaScript'],
};

describe('validateSignup', () => {
  it('accepts a complete signup', () => {
    assert.deepEqual(validateSignup(valid), {});
  });

  it('reports every invalid field at once', () => {
    const errors = validateSignup({ name: 'A', email: 'nope', username: '-x', password: '' });
    assert.deepEqual(Object.keys(errors).sort(), ['email', 'name', 'password', 'username']);
  });

  it('allows skills to be omitted', () => {
    const { skills, ...withoutSkills } = valid;
    assert.deepEqual(validateSignup(withoutSkills), {});
  });

  it('rejects skills that are not a list of strings', () => {
    assert.ok(validateSignup({ ...valid, skills: 'js' }).skills);
    assert.ok(validateSignup({ ...valid, skills: [1, 2] }).skills);
  });
});

describe('validateUsername', () => {
  for (const name of ['ada', 'ada-lovelace', 'dev2026']) {
    it(`accepts "${name}"`, () => assert.equal(validateUsername(name), null));
  }
  for (const name of ['ab', 'Ada', '-ada', 'ada-', 'ada lovelace', 'a'.repeat(31)]) {
    it(`rejects "${name}"`, () => assert.ok(validateUsername(name)));
  }
});

describe('validateEmail', () => {
  it('accepts a normal address', () => assert.equal(validateEmail('dev@godevelopers.space'), null));
  it('rejects a missing domain', () => assert.ok(validateEmail('dev@')));
});
