import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src/settings',
  build: {
    outDir: '../../build',
    emptyOutDir: false,
    rollupOptions: {
      input: 'src/settings/settings.html',
      output: {
        inlineDynamicImports: true,
        assetFileNames: () => '[name].[ext]',
        entryFileNames: () => '[name].js',
      },
    },
  },
})
