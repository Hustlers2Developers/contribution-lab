import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson, sendJson } from './http.js';
import { hashPassword } from './password.js';
import { MemberStore } from './store.js';
import { validateSignup } from './validation.js';

const PUBLIC_DIR = fileURLToPath(new URL('../public/', import.meta.url));
const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
};

/** Builds the request handler. A fresh store per app keeps tests isolated. */
export function createApp({ store = new MemberStore() } = {}) {
  const routes = {
    'GET /api/health': () => ({ status: 200, body: { status: 'ok', members: store.size } }),

    'GET /api/members': () => ({ status: 200, body: { members: store.list() } }),

    'POST /api/signup': async (req) => {
      const input = await readJson(req);
      const errors = validateSignup(input);
      if (Object.keys(errors).length) return { status: 422, body: { error: 'Validation failed', errors } };

      if (store.emailTaken(input.email.trim())) {
        return { status: 409, body: { error: 'Email already registered', errors: { email: 'This email is already registered.' } } };
      }
      if (store.usernameTaken(input.username)) {
        return { status: 409, body: { error: 'Username taken', errors: { username: 'This username is taken.' } } };
      }

      const member = store.add({ ...input, passwordHash: await hashPassword(input.password) });
      return { status: 201, body: { member } };
    },
  };

  return async function handle(req, res) {
    const url = new URL(req.url, 'http://localhost');
    const route = routes[`${req.method} ${url.pathname}`];

    try {
      if (route) {
        const { status, body } = await route(req, url);
        return sendJson(res, status, body);
      }
      if (req.method === 'GET' && !url.pathname.startsWith('/api/')) return serveStatic(url.pathname, res);
      return sendJson(res, 404, { error: 'Not found' });
    } catch (error) {
      console.error(error);
      return sendJson(res, 500, { error: 'Internal server error' });
    }
  };
}

async function serveStatic(pathname, res) {
  const relative = normalize(pathname === '/' ? '/index.html' : pathname).replace(/^([/\\])+/, '');
  const file = join(PUBLIC_DIR, relative);
  if (!file.startsWith(PUBLIC_DIR)) return sendJson(res, 404, { error: 'Not found' });
  try {
    const content = await readFile(file);
    res.writeHead(200, { 'Content-Type': CONTENT_TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(content);
  } catch {
    sendJson(res, 404, { error: 'Not found' });
  }
}
