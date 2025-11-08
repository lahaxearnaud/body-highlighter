import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      entryRoot: resolve(__dirname, 'src'),
      include: ['src'],
      outDir: 'dist',
      rollupTypes: true,
    }),
  ],
  build: {
    target: 'es2019',
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'BodyHighlighter',
      formats: ['es', 'cjs'],
      fileName: format => (format === 'es' ? 'body-highlighter.esm.js' : 'body-highlighter.cjs.js'),
    },
    rollupOptions: {
      output: {
        exports: 'named',
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['test/**/*.test.ts'],
    pool: 'forks',
    threads: false,
  },
});
