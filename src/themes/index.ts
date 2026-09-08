import pride from './pride.css?raw'
import spiral from './spiral.css?raw'
import stripes from './stripes.css?raw'
import win95 from './win95.css?raw'
import type { Theme } from '@/lib/themes.ts'

export const themes = {
  default: {
    name: 'Stripes',
    css: stripes,
  },
  pride: {
    name: 'Pride',
    css: pride,
  },
  spiral: {
    name: 'Spiral',
    css: spiral,
  },
  win95: {
    name: 'Windows 95',
    css: win95,
    font: new FontFace('Win95', `url(${browser.runtime.getURL(`/fonts/win95.woff2`)})`),
  },
} as const satisfies Record<string, Theme>
