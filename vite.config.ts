import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        background: 'src/background.ts',
        content: 'src/content.ts',
        settings: 'src/settings.ts',
      },
      output: {
        entryFileNames: () => {
          return '[name].js'
        },
      },
    },
  },
})
