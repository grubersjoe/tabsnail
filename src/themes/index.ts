import pride from './pride.css?raw'
import stripes from './stripes.css?raw'
import win95 from './win95.css?raw'
import type { Theme } from '@/lib/themes.ts'

export const themes = {
  default: {
    name: 'Stripes',
    css: stripes,
    font: undefined,
    cellSizePx: 32,
  },
  pride: {
    name: 'Pride',
    css: pride,
    font: undefined,
    cellSizePx: 32,
  },
  win95: {
    name: 'Windows 95',
    css: win95,
    font: new FontFace('Win95', `url(${browser.runtime.getURL(`/fonts/win95.woff2`)})`),
    cellSizePx: 36,
  },
} as const satisfies Record<string, Theme>
