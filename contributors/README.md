# Contributors

Every file here is one developer's public profile on **GoDevelopers Community**
([contribute.godevelopers.space/community](https://contribute.godevelopers.space/community)).
Adding yours is the open-source way to join, and it earns **+75 XP** and the 🌱 **Git Native** badge.

## Add yourself

1. Fork this repository and clone your fork.
2. Copy [`_template.json`](./_template.json) to `contributors/<your-github-username>.json`.
3. Fill in what you like. Only `github` and `name` are required. Your editor autocompletes fields through [`schema.json`](./schema.json).
4. Check it: `node scripts/validate-contributors.js contributors/<your-github-username>.json`
5. Open a pull request titled `Add my profile [task:dev-card-file]`.
6. The **validate-contributors** check runs. A maintainer merges, and your profile goes live within a minute.

Prefer a form? Use [/community/join](https://contribute.godevelopers.space/community/join). Both give you the same Contributor Card.

## Rules (enforced by CI)

| Rule | Why |
|---|---|
| File name = your GitHub username, and `"github"` matches it | One profile per person |
| You can only add or edit **your own** file | The PR author must match the file name |
| **No `email`, `phone` or `address`** | This repo is public and git history is forever |
| Required: only `github` and `name` | Join fast, fill the rest later |
| Links must be `https://`; LinkedIn, Instagram and X links on their own domains | Safe, clickable links |
| `coding.*`: your username or your profile link | We read the username out of the link |

Removing your file removes your profile from the directory (unless you also joined through the form).
