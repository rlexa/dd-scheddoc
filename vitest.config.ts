/// <reference types='vitest' />
import angular from '@analogjs/vite-plugin-angular';
import {resolve} from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => ({
  resolve: {
    alias: {
      src: resolve('./src'),
    },
  },
  cacheDir: './node_modules/.vite/apps/dd-scheddoc',
  plugins: [angular()],
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './coverage/apps/dd-scheddoc',
      provider: 'v8' as const,
    },
  },
}));
