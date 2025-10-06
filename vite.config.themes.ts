import { defineConfig } from 'vite'
import path, { basename } from 'node:path'
import { existsSync, globSync } from 'node:fs'

const themes = globSync(path.join(__dirname, './src/content/themes/**/*.css'))
  .filter(existsSync)
  .reduce<Record<string, string>>((input, file) => {
    input[basename(file, '.css')] = file
    return input
  }, {})

if (Object.keys(themes).length === 0) {
  throw new Error('No themes found.')
}

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
