import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'build',
    emptyOutDir: false,
    rollupOptions: {
      input: 'src/content/content.ts',
      output: {
        inlineDynamicImports: true,
        assetFileNames: () => '[name].[ext]',
        entryFileNames: () => '[name].js',
      },
    },
  },
})
