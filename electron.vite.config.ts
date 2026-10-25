import { defineConfig } from 'electron-vite';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import { resolve } from 'node:path';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  main: {
    // Phase 42: the registry URL and anon key are public values supplied by the release workflow (repository variables), not secrets.
    define: {
      __LB_MASTER_URL__: JSON.stringify(process.env['LB_MASTER_URL'] ?? ''),
      __LB_MASTER_ANON_KEY__: JSON.stringify(process.env['LB_MASTER_ANON_KEY'] ?? ''),
    },
  },
  preload: {
    build: {
      // Two sandboxed preload bundles: the status window (index) and the embedded PWA window (host, Phase 40).
      rollupOptions: { input: { index: resolve(process.cwd(), 'src/preload/index.ts'), host: resolve(process.cwd(), 'src/preload/host.ts') } },
    },
  },
  renderer: {
    plugins: [react()],
    css: {
      postcss: {
        plugins: [tailwindcss({ config: resolve(process.cwd(), 'tailwind.config.cjs') }), autoprefixer()],
      },
    },
  },
});
