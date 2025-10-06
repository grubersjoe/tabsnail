import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'build',
    emptyOutDir: false,
    rollupOptions: {
      input: 'src/background.ts',
      output: {
        entryFileNames: () => '[name].js',
      },
    },
  },
})
