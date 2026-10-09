import { randomUUID } from 'node:crypto';

/**
 * In-memory member store. Data resets when the server restarts — good enough
 * for the lab; the interface is what matters.
 */
export class MemberStore {
  #members = [];

  /** Members, newest first. Never includes password hashes. */
  list() {
    return [...this.#members].reverse().map(toPublic);
  }

  findByUsername(username) {
    const member = this.#members.find((item) => item.username === username);
    return member ? toPublic(member) : null;
  }

  emailTaken(email) {
    return this.#members.some((item) => item.email === email);
  }

  usernameTaken(username) {
    return this.#members.some((item) => item.username === username);
  }

  add({ name, email, username, passwordHash, skills = [] }) {
    const member = {
      id: randomUUID(),
      name: name.trim(),
      email: email.trim(),
      username,
      passwordHash,
      skills: skills.map((skill) => skill.trim()).filter(Boolean),
      joinedAt: new Date().toISOString(),
    };
    this.#members.push(member);
    return toPublic(member);
  }

  get size() {
    return this.#members.length;
  }
}

function toPublic({ passwordHash, email, ...member }) {
  return member;
}
