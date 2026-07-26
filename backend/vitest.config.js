import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // mongodb-memory-server may download a binary on first run.
    hookTimeout: 120000,
    testTimeout: 30000,
    // Integration tests share a single in-memory Mongo; run serially.
    fileParallelism: false,
  },
});
