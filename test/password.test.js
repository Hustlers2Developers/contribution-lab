import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { hashPassword, verifyPassword } from '../src/password.js';

describe('password hashing', () => {
  it('never stores the plain password', async () => {
    const hash = await hashPassword('hunter2');
    assert.ok(!hash.includes('hunter2'));
    assert.match(hash, /^scrypt\$[0-9a-f]{32}\$[0-9a-f]{128}$/);
  });

  it('verifies the right password and rejects a wrong one', async () => {
    const hash = await hashPassword('hunter2');
    assert.equal(await verifyPassword('hunter2', hash), true);
    assert.equal(await verifyPassword('hunter3', hash), false);
  });

  it('salts every hash', async () => {
    assert.notEqual(await hashPassword('same'), await hashPassword('same'));
  });
});
