import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals:     true,
    environment: 'node',
    include:     ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include:  ['src/**/*.ts'],
      exclude:  ['src/__tests__/**', 'src/index.ts'],
    },
  },
  resolve: {
    alias: {
      '@arabic/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
    },
  },
});
