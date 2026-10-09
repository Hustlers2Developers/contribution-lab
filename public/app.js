const form = document.querySelector('#signup-form');
const list = document.querySelector('#members');
const count = document.querySelector('#member-count');

function memberItem(member) {
  const item = document.createElement('li');
  item.className = 'member';

  const name = document.createElement('strong');
  name.textContent = member.name;
  const handle = document.createElement('span');
  handle.className = 'muted';
  handle.textContent = `@${member.username}`;

  const skills = document.createElement('div');
  skills.className = 'skills';
  for (const skill of member.skills) {
    const tag = document.createElement('span');
    tag.className = 'skill';
    tag.textContent = skill;
    skills.append(tag);
  }

  item.append(name, handle, skills);
  return item;
}

async function loadMembers() {
  const response = await fetch('/api/members');
  const { members } = await response.json();
  list.replaceChildren(...members.map(memberItem));
  count.textContent = `${members.length} ${members.length === 1 ? 'member' : 'members'}`;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const payload = {
    name: data.get('name'),
    email: data.get('email'),
    username: data.get('username'),
    password: data.get('password'),
    skills: String(data.get('skills') ?? '')
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean),
  };

  const response = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await response.json();

  if (!response.ok) {
    const messages = Object.values(body.errors ?? {}).join('\n');
    alert(messages || body.error);
    return;
  }

  form.reset();
  await loadMembers();
});

loadMembers();
