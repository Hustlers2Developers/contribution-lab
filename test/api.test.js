import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { startServer } from '../src/server.js';
import { MemberStore } from '../src/store.js';

let server;
let base;

before(async () => {
  server = await startServer({ port: 0, store: new MemberStore() });
  base = `http://localhost:${server.address().port}`;
});

after(() => server.close());

const signup = (body) =>
  fetch(`${base}/api/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

describe('API', () => {
  it('GET /api/health answers ok', async () => {
    const response = await fetch(`${base}/api/health`);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).status, 'ok');
  });

  it('POST /api/signup creates a member without leaking secrets', async () => {
    const response = await signup({ name: 'Grace Hopper', email: 'grace@example.com', username: 'grace', password: 'cobol', skills: ['COBOL'] });
    assert.equal(response.status, 201);
    const { member } = await response.json();
    assert.equal(member.username, 'grace');
    assert.equal(member.passwordHash, undefined);
    assert.equal(member.email, undefined);
  });

  it('POST /api/signup rejects invalid input with field errors', async () => {
    const response = await signup({ name: '', email: 'x', username: 'X', password: '' });
    assert.equal(response.status, 422);
    const body = await response.json();
    assert.ok(body.errors.email);
    assert.ok(body.errors.username);
  });

  it('POST /api/signup rejects a taken username', async () => {
    const response = await signup({ name: 'Another Grace', email: 'other@example.com', username: 'grace', password: 'x' });
    assert.equal(response.status, 409);
  });

  it('GET /api/members lists members', async () => {
    const response = await fetch(`${base}/api/members`);
    const { members } = await response.json();
    assert.ok(members.some((member) => member.username === 'grace'));
  });

  it('serves the frontend', async () => {
    const response = await fetch(`${base}/`);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /DevCircle/);
  });

  it('does not serve files outside public/', async () => {
    const response = await fetch(`${base}/..%2Fpackage.json`);
    assert.equal(response.status, 404);
  });

  it('answers 404 for unknown API routes', async () => {
    assert.equal((await fetch(`${base}/api/nope`)).status, 404);
  });
});
