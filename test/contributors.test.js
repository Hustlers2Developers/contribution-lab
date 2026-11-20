import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { describe, it } from 'node:test';
import { codingHandle, isProfilePath, validateContributor } from '../scripts/contributor-rules.js';

const template = JSON.parse(readFileSync('contributors/_template.json', 'utf8'));
const minimal = (login) => ({ github: login, name: 'Ada Lovelace' });

describe('contributor files', () => {
  it('accepts the template once renamed to your username', () => {
    assert.deepEqual(validateContributor({ ...template, github: 'ada-lovelace' }, 'ada-lovelace'), []);
  });

  it('needs only github and name', () => {
    assert.deepEqual(validateContributor(minimal('ada'), 'ada'), []);
    assert.ok(validateContributor({ github: 'ada' }, 'ada').some((p) => p.startsWith('name')));
  });

  it('refuses private fields', () => {
    const problems = validateContributor({ ...minimal('ada'), email: 'ada@example.com', phone: '9999999999' }, 'ada');
    assert.equal(problems.filter((p) => p.includes('is private')).length, 2);
  });

  it('only lets you edit your own file', () => {
    assert.ok(
      validateContributor(minimal('ada'), 'ada', 'someone-else').some((p) => p.includes('@someone-else can only')),
    );
    assert.ok(validateContributor(minimal('ada'), 'grace').some((p) => p.includes('same as the file name')));
  });

  it('checks links and coding usernames', () => {
    const problems = validateContributor(
      { ...minimal('ada'), links: { linkedin: 'https://evil.com/in/ada' }, coding: { gfg: 'has spaces' } },
      'ada',
    );
    assert.equal(problems.length, 2);
  });

  it('reads a username out of a pasted profile link', () => {
    assert.equal(codingHandle('gfg', 'https://www.geeksforgeeks.org/user/ada_99/'), 'ada_99');
    assert.equal(codingHandle('leetcode', 'https://leetcode.com/u/ada/'), 'ada');
    assert.equal(codingHandle('leetcode', 'https://evil.com/u/ada'), null);
  });

  it('every committed profile is valid', () => {
    const files = readdirSync('contributors')
      .map((f) => `contributors/${f}`)
      .filter(isProfilePath);
    for (const file of files) {
      assert.deepEqual(validateContributor(JSON.parse(readFileSync(file, 'utf8')), basename(file, '.json')), [], file);
    }
  });
});
