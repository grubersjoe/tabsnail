import { defineConfig } from 'vite'
import { resolve } from 'path'

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
  resolve: {
    alias: {
      '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // https://github.com/twbs/bootstrap/issues/40962
        silenceDeprecations: ['color-functions', 'global-builtin', 'import'],
      },
    },
  },
})
