# Contributing to DevCircle

This repository is where Hustlers2Developers contributors prove they can work like a real team member:
pick an issue, branch, write code with tests, open a pull request, handle review, get merged.

## 1. Get access and claim a task

1. Apply with GitHub at **contribute.godevelopers.space**.
2. Once approved, accept the collaborator invitation for this repository (check your GitHub notifications).
3. In your Contribute workspace, **claim exactly one task**. Claimed tasks are assigned to you on GitHub.
   If there's no pull request within 7 days, the claim expires and the task returns to the board.

Only issues labelled `contribute-task` count. Don't start work on an issue you haven't claimed.

## 2. Do the work

```bash
git checkout main
git pull
git checkout -b task-42-password-strength     # task-<issue-number>-<short-description>
# make your change + add tests
npm test
git add -A
git commit -m "feat: require stronger passwords on signup (#42)"
git push -u origin task-42-password-strength
```

- Keep the change focused on the issue. No drive-by refactors.
- Add or update tests in `test/` for every behaviour you change.
- Match the existing style: ES modules, small functions, no new dependencies unless the issue asks for one.

## 3. Open the pull request

- Base branch: `main`.
- The description **must** contain `Closes #<issue-number>` (the template has it ready).
- Explain what you changed and how you tested it.
- Request a review from `@Hustlers2Developers/hustlers` if it isn't requested automatically.

## 4. Review

- Reply to every comment. Push fixes as new commits on the same branch; don't open a new PR.
- Approvals from other contributors don't count: a maintainer must approve.
- New commits after an approval need a fresh approval.

## 5. Merge and verification

A maintainer merges your PR. GoDevelopers Contribute then verifies it automatically: the PR author is the
GitHub account you applied with, it targets this repository, references your claimed issue, was approved by a
maintainer, merged into `main`, and changes real code. When every check passes you get a recorded proof and your
Member invitation.

## Code style and project layout

Everyone writes the same style, so reviews are about behaviour, not whitespace.

- **Formatting is automatic:** `npm run format` (Prettier, pinned, nothing to install). CI fails on unformatted code.
- **Before every push:** `npm run check` runs formatting, tests and contributor-profile checks, exactly like CI.
- ES modules, small named functions, no new dependencies unless the issue asks for one.
- One responsibility per file:

```
src/
  server.js       starts the HTTP server
  app.js          routes (one entry per "METHOD /path") + static files
  validation.js   one validator per field; returns a message or null
  store.js        in-memory data; the only place that touches members
  password.js     hashing
  http.js         JSON request/response helpers
public/           the browser app (HTML, CSS, vanilla JS)
test/             node:test files, one per src/ module
scripts/          repo tooling (contributor-profile checks)
contributors/     one public profile per GitHub user
```

**Adding an endpoint:** add the route in `src/app.js`, keep data access in `src/store.js` and input rules in
`src/validation.js`, then test it in `test/api.test.js` against a fresh `MemberStore`. Never return `email` or
`passwordHash`: `store.js` already strips them, so return what it gives you.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org): `feat:`, `fix:`, `test:`, `docs:`, `refactor:` —
and add the issue number, e.g. `fix: return 400 for malformed JSON (#45)`.

## Community tasks (no claim needed)

Small, guided tasks work differently from `contribute-task` issues. Every one has a full guide on
[contribute.godevelopers.space/community/tasks](https://contribute.godevelopers.space/community/tasks). There are two kinds:

| | **`community-task` issues** | **Repeatable tasks** |
|---|---|---|
| Example | "Add a dark theme" | "Add your profile as a file", "Fix a typo" |
| Who | The first merged PR completes it | Everyone can do it (XP once per person) |
| PR | Description says `Closes #<issue>` | Title contains `[task:<slug>]` |

1. Fork this repository (no collaborator access needed) and branch: `git checkout -b task/<short-name>`.
2. Follow the task's guide. Run `npm run check` before you push.
3. Open the PR as shown above.
4. When a maintainer merges it, the XP lands on your Contributor Card automatically.

Maintainers: open new ones with the **Community task** issue template. The board picks them up by itself,
and an issue never carries both `community-task` and `contribute-task`.

Your profile file goes in [`contributors/`](contributors/README.md); never put email, phone or address there.

