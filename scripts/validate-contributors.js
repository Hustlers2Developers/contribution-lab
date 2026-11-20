// Checks contributors/<github-username>.json files (GoDevelopers Community profiles).
//
//   npm run validate:contributors                          # every file
//   node scripts/validate-contributors.js contributors/you.json
//   node scripts/validate-contributors.js --author you contributors/you.json   (what CI runs)
import { readdirSync, readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { isProfilePath, validateContributor } from './contributor-rules.js';

const args = process.argv.slice(2);
const at = args.indexOf('--author');
const author = at >= 0 ? args.splice(at, 2)[1] : undefined;
const files = (args.length ? args : readdirSync('contributors').map((f) => `contributors/${f}`)).filter(isProfilePath);

let failed = 0;
for (const file of files) {
  let problems;
  try {
    problems = validateContributor(JSON.parse(readFileSync(file, 'utf8')), basename(file, '.json'), author);
  } catch (error) {
    problems = [`Not valid JSON: ${error.message}`];
  }
  if (problems.length) {
    failed++;
    console.log(`✗ ${file}`);
    // ::error lines become annotations on the pull request.
    for (const problem of problems) console.log(`::error file=${file}::${problem}`);
  } else {
    console.log(`✓ ${file}`);
  }
}
console.log(files.length ? `\n${files.length - failed}/${files.length} valid` : 'No contributor files to check.');
process.exit(failed ? 1 : 0);
