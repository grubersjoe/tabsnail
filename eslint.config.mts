import autoImports from './.wxt/eslint-auto-imports.mjs'
import eslint from '@eslint/js'
import svelte from 'eslint-plugin-svelte'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import typescript from 'typescript-eslint'

export default defineConfig(
  autoImports,
  eslint.configs.recommended,
  typescript.configs.strictTypeChecked,
  typescript.configs.stylisticTypeChecked,
  svelte.configs.recommended,
  {
    rules: {
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNullish: true }],
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: ['.svelte'],
        parser: typescript.parser,
      },
    },
    rules: {
      'svelte/no-at-html-tags': 'off',
    },
  },
  {
    // Note: there must be no other properties in this object
    ignores: ['build', '.wxt'],
  },
)
