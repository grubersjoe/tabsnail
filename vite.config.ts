import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        background: 'src/background.ts',
        content: 'src/content.ts',
      },
      output: {
        entryFileNames: () => {
          return '[name].js'
        },
      },
    },
  },
})
