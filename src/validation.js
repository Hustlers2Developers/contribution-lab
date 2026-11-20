// Input validation for the signup form and API.
// Every validator returns an object of { field: message } — empty means valid.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME = /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])$/;

export const MAX_SKILLS = 8;

export function validateName(name) {
  if (typeof name !== 'string' || name.trim().length < 2) return 'Name must be at least 2 characters.';
  if (name.trim().length > 60) return 'Name must be at most 60 characters.';
  return null;
}

export function validateEmail(email) {
  if (typeof email !== 'string' || !EMAIL.test(email.trim())) return 'Enter a valid email address.';
  return null;
}

/** Lowercase letters, numbers and dashes; 3–30 characters; no leading/trailing dash. */
export function validateUsername(username) {
  if (typeof username !== 'string' || !USERNAME.test(username)) {
    return 'Username must be 3–30 characters: lowercase letters, numbers and dashes.';
  }
  return null;
}

export function validatePassword(password) {
  if (typeof password !== 'string' || password.length === 0) return 'Password is required.';
  return null;
}

export function validateSkills(skills) {
  if (skills === undefined) return null;
  if (!Array.isArray(skills) || skills.some((skill) => typeof skill !== 'string'))
    return 'Skills must be a list of strings.';
  if (skills.length > MAX_SKILLS) return `Add at most ${MAX_SKILLS} skills.`;
  return null;
}

export function validateSignup(input) {
  const errors = {};
  const checks = {
    name: validateName(input?.name),
    email: validateEmail(input?.email),
    username: validateUsername(input?.username),
    password: validatePassword(input?.password),
    skills: validateSkills(input?.skills),
  };
  for (const [field, message] of Object.entries(checks)) {
    if (message) errors[field] = message;
  }
  return errors;
}
