// LazyBooks | tools/dev.mjs
// `npm run dev`: start the mock Tally server, then the Electron dev app with LB_MOCK_TALLY=true.
import { spawn } from 'node:child_process';
import { startMockTally } from './mock-tally/server.mjs';
import { MOCK_ANON_KEY, startMockRegistry } from './mock-registry/server.mjs';

const port = Number(process.env.LB_TALLY_PORT) || 9000;
const mock = startMockTally(port);
const regPort = Number(process.env.LB_MOCK_REGISTRY_PORT) || 54321;
const registry = startMockRegistry(regPort);

const bin = process.platform === 'win32' ? 'electron-vite.cmd' : 'electron-vite';
const child = spawn(`node_modules/.bin/${bin}`, ['dev'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: {
    ...process.env,
    LB_MOCK_TALLY: 'true',
    LB_TALLY_PORT: String(port),
    LB_MOCK_REGISTRY: 'true',
    LB_MASTER_URL: process.env.LB_MASTER_URL || `http://127.0.0.1:${regPort}`,
    LB_MASTER_ANON_KEY: process.env.LB_MASTER_ANON_KEY || MOCK_ANON_KEY,
  },
});

const stop = (code) => {
  mock.close();
  registry.close();
  process.exit(code ?? 0);
};
child.on('exit', stop);
process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
