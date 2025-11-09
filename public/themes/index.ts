import type { Theme } from '@/lib/themes'

export const themes = {
  default: {
    name: 'Stripes',
    url: browser.runtime.getURL(`/themes/stripes.css`),
    cellSizePx: 32,
  },
  pride: {
    name: 'Pride',
    url: browser.runtime.getURL(`/themes/pride.css`),
    cellSizePx: 32,
  },
  win95: {
    name: 'Windows 95',
    url: browser.runtime.getURL(`/themes/win95.css`),
    font: new FontFace('Win95', `url(${browser.runtime.getURL(`/themes/fonts/win95.woff2`)})`),
    cellSizePx: 36,
  },
} as const satisfies Record<string, Theme>
