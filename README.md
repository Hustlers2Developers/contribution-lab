# DevCircle — the Hustlers2Developers contribution lab

A small, real web app — sign up, browse members — that you improve one pull request at a time.
Ship one reviewed, merged, verified pull request here and you earn **Member** access on GoDevelopers.

> Start at **[contribute.godevelopers.space](https://contribute.godevelopers.space)** — apply with GitHub,
> get approved, then claim a task. Read [CONTRIBUTING.md](CONTRIBUTING.md) before your first PR.

## Run it

Needs **Node.js 20+**. There are no dependencies to install.

```bash
git clone https://github.com/Hustlers2Developers/contribution-lab.git
cd contribution-lab
npm start          # http://localhost:3000
npm test           # runs every test once
npm run dev        # restarts on file changes
```

## What's inside

```
src/
  server.js       starts the HTTP server (npm start)
  app.js          routes: /api/health, /api/members, /api/signup + static files
  validation.js   input validation, one function per field
  password.js     scrypt password hashing
  store.js        in-memory member store (resets on restart)
  http.js         JSON request/response helpers
public/           the frontend: index.html, app.js, styles.css (no framework)
test/             node:test suites — run with npm test
```

## API

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | `{ status: "ok", members }` |
| `GET` | `/api/members` | `{ members: [...] }`, newest first. Never includes emails or password hashes. |
| `POST` | `/api/signup` | Body `{ name, email, username, password, skills? }` → `201 { member }`, `422 { errors }`, `409` if email/username taken |

## Ground rules

- One task at a time, claimed through the Contribute workspace.
- Branch name `task-<issue-number>-short-description`, PR description says `Closes #<issue-number>`.
- Every change comes with tests, and `npm test` must pass.
- A maintainer from `@Hustlers2Developers/hustlers` reviews and merges.
