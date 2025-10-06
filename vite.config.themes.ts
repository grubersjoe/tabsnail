import { defineConfig } from 'vite'
import { basename } from 'node:path'
import { globSync } from 'node:fs'

const themes = globSync('./src/content/themes/**/*.css').reduce<Record<string, string>>(
  (input, file) => {
    input[basename(file, '.css')] = file
    return input
  },
  {},
)

export default defineConfig({
  build: {
    outDir: 'build',
    emptyOutDir: false,
    rollupOptions: {
      input: themes,
      output: {
        assetFileNames: () => 'themes/[name].[ext]',
      },
    },
  },
})
