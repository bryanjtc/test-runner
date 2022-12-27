import { defineConfig } from 'tsup';

export default defineConfig([
  {
    clean: true,
    entry: ['./src/**/!(*.{d,test}).{js,jsx,ts,tsx}'],
    format: ['cjs', 'esm'],
    dts: true,
    esbuildOptions(options, context) {
      options.platform = 'node';
    },
  },
]);