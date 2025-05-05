import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    testTimeout: 10000,
    environmentOptions: {
      teardown: 'process',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'tests/setup/**',
        '**/*.config.js',
      ],
    },
    mockReset: true,
    deps: {
      inline: ['vitest'],
    },
    isolate: false,
  },
}); 