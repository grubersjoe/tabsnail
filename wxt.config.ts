import { resolve } from 'path'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-svelte'],
  outDir: 'build',
  srcDir: 'src',
  hooks: {
    'build:manifestGenerated': (wxt, manifest) => {
      manifest.content_scripts ??= []
      manifest.content_scripts.push({
        css: ['content-scripts/global.css'],
        matches: ['<all_urls>'],
      })
    },
  },
  manifest: {
    name: 'Tabsnail',
    description: 'Display the tab bar in a snail-like layout around the page.',
    permissions: ['tabs', 'storage'],
    web_accessible_resources: [
      {
        resources: ['content-scripts/global.css'],
        matches: ['<all_urls>'],
      },
      {
        resources: ['themes/*'],
        matches: ['<all_urls>'],
      },
    ],
    browser_specific_settings: {
      gecko: {
        id: 'tabsnail@jogruber.de',
      },
    },
  },
  vite: () => ({
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
  }),
})
