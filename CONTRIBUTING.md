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

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org): `feat:`, `fix:`, `test:`, `docs:`, `refactor:` —
and add the issue number, e.g. `fix: return 400 for malformed JSON (#45)`.

## Community tasks (no claim needed)

Small, guided tasks from [contribute.godevelopers.space/community/tasks](https://contribute.godevelopers.space/community/tasks)
work differently from `contribute-task` issues:

1. Fork this repository (no collaborator access needed) and branch: `git checkout -b task/<slug>`.
2. Follow the task's guide. Run `npm test` before you push.
3. Open a PR whose **title** contains the task tag, e.g. `Add a footer link [task:footer-link]`.
4. When a maintainer merges it, the XP lands on your Contributor Card automatically (once per task).

Your profile file goes in [`contributors/`](contributors/README.md); never put email, phone or address there.

