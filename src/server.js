import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';

export function startServer({ port = Number(process.env.PORT) || 3000, store } = {}) {
  const server = createServer(createApp({ store }));
  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

// `npm start` runs this file directly; tests import startServer instead.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = await startServer();
  const { port } = server.address();
  console.log(`DevCircle running at http://localhost:${port}`);
}
