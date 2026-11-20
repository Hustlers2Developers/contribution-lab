// Rules for contributors/<github-username>.json — the "join with a pull request" gate of
// GoDevelopers Community. They mirror the platform's own check (Contribute service,
// lib/community/profile.ts); the platform validates again when it imports a merged file,
// so a file that passes here is accepted there.
//
// Plain JavaScript, no dependencies: runs on Node 20+ like the rest of this repo.

const LOGIN = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
const HANDLE = /^[A-Za-z0-9_.-]{1,40}$/;

const ALLOWED_KEYS = new Set(['$schema', 'github', 'name', 'designation', 'bio', 'avatarUrl', 'location', 'education', 'goal', 'interests', 'techStack', 'projects', 'links', 'coding']);
const PRIVATE_KEYS = ['email', 'phone', 'address', 'mobile', 'contact'];
const YEARS = new Set(['1', '2', '3', '4', '5', 'GRADUATED', 'WORKING']);
const LINK_HOSTS = { portfolio: null, linkedin: ['linkedin.com'], instagram: ['instagram.com'], twitter: ['x.com', 'twitter.com'] };
const CODING_HOSTS = { leetcode: 'leetcode.com', codeforces: 'codeforces.com', codechef: 'codechef.com', gfg: 'geeksforgeeks.org', hackerrank: 'hackerrank.com' };
const PATH_PREFIXES = new Set(['u', 'user', 'users', 'profile', 'profiles', 'contests']);

const isObject = (v) => Boolean(v) && typeof v === 'object' && !Array.isArray(v);
const str = (v) => (typeof v === 'string' ? v.trim() : '');

export function isHttpsUrl(value, hosts) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return false;
    if (!hosts) return true;
    const host = url.hostname.replace(/^www\./, '');
    return hosts.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

/** Username from "name", "@name" or a full profile link; null when none is found. */
export function codingHandle(platform, raw) {
  let value = str(raw).replace(/^@/, '');
  if (/^(https?:\/\/)?([a-z0-9-]+\.)*[a-z0-9-]+\.[a-z]{2,}\//i.test(value)) {
    try {
      const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
      const host = url.hostname.replace(/^www\./, '');
      if (host !== CODING_HOSTS[platform] && !host.endsWith(`.${CODING_HOSTS[platform]}`)) return null;
      const parts = url.pathname.split('/').filter(Boolean);
      while (parts.length > 1 && PATH_PREFIXES.has(parts[0].toLowerCase())) parts.shift();
      value = decodeURIComponent(parts[0] ?? '');
    } catch {
      return null;
    }
  }
  return HANDLE.test(value) ? value : null;
}

/**
 * Problems with one contributor file (empty list = valid).
 * @param {unknown} json parsed file
 * @param {string} fileLogin file name without .json
 * @param {string} [prAuthor] GitHub login of the pull request author (CI)
 */
export function validateContributor(json, fileLogin, prAuthor) {
  const problems = [];
  if (!isObject(json)) return ['The file must be a JSON object.'];

  for (const key of Object.keys(json)) {
    if (PRIVATE_KEYS.includes(key.toLowerCase())) problems.push(`"${key}" is private: remove it. Public files must never contain email, phone or address.`);
    else if (!ALLOWED_KEYS.has(key)) problems.push(`Unknown field "${key}".`);
  }

  // Identity: one file per person, edited only by that person.
  if (!LOGIN.test(fileLogin)) problems.push(`File name "${fileLogin}.json" must be your GitHub username.`);
  if (str(json.github).toLowerCase() !== fileLogin.toLowerCase()) problems.push(`"github" must be "${fileLogin}" (same as the file name).`);
  if (prAuthor && prAuthor.toLowerCase() !== fileLogin.toLowerCase()) problems.push(`@${prAuthor} can only add or edit contributors/${prAuthor}.json.`);

  // Only a name is required; everything else is optional but must be well-formed.
  if (str(json.name).length < 2) problems.push('name: Add your name.');
  if (json.avatarUrl !== undefined && !isHttpsUrl(str(json.avatarUrl))) problems.push('avatarUrl: Use an https:// image link.');

  if (json.education !== undefined) {
    if (!isObject(json.education)) problems.push('education must be an object.');
    else if (json.education.year !== undefined && !YEARS.has(String(json.education.year))) problems.push('education.year: Use 1–5, GRADUATED or WORKING.');
  }
  if (json.location !== undefined && !isObject(json.location)) problems.push('location must be an object.');

  for (const key of ['interests', 'techStack']) {
    if (json[key] !== undefined && (!Array.isArray(json[key]) || json[key].some((x) => typeof x !== 'string'))) problems.push(`${key} must be a list of strings.`);
  }

  if (json.links !== undefined) {
    if (!isObject(json.links)) problems.push('links must be an object.');
    else
      for (const [key, value] of Object.entries(json.links)) {
        if (!(key in LINK_HOSTS)) problems.push(`links.${key}: unknown link.`);
        else if (value && !isHttpsUrl(str(value), LINK_HOSTS[key] ?? undefined)) {
          problems.push(LINK_HOSTS[key] ? `links.${key}: Paste your full https://${LINK_HOSTS[key][0]}/… link.` : `links.${key}: Use a full https:// link.`);
        }
      }
  }

  if (json.coding !== undefined) {
    if (!isObject(json.coding)) problems.push('coding must be an object.');
    else
      for (const [key, value] of Object.entries(json.coding)) {
        if (!(key in CODING_HOSTS)) problems.push(`coding.${key}: unknown platform.`);
        else if (value && !codingHandle(key, value)) problems.push(`coding.${key}: Use your username or your profile link.`);
      }
  }

  if (json.projects !== undefined) {
    if (!Array.isArray(json.projects)) problems.push('projects must be a list.');
    else {
      if (json.projects.length > 6) problems.push('projects: at most 6.');
      json.projects.forEach((p, i) => {
        if (!isObject(p)) return problems.push(`projects.${i}: must be an object.`);
        if (!str(p.name)) problems.push(`projects.${i}.name: Project name.`);
        if (!isHttpsUrl(str(p.url))) problems.push(`projects.${i}.url: Full https:// link (repo or live demo).`);
      });
    }
  }
  return problems;
}

/** contributors/<login>.json paths that are profiles (not the template or schema). */
export const isProfilePath = (path) => /^contributors\/[^/_][^/]*\.json$/.test(path.replace(/\\/g, '/')) && !path.endsWith('/schema.json');
