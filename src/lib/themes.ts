export type Theme = keyof typeof themes

type ThemeDefinition = {
  name: string
  url: string
  cellSizePx: number
}

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
    cellSizePx: 36,
  },
} as const satisfies Record<string, ThemeDefinition>

export function loadTheme(theme: Theme) {
  let stylesheet = document.getElementById('tabsnail-theme') as HTMLLinkElement | null

  if (!stylesheet) {
    stylesheet = document.createElement('link')
    stylesheet.id = 'tabsnail-theme'
    stylesheet.rel = 'stylesheet'
    document.head.appendChild(stylesheet)
  }

  if (stylesheet.href !== themes[theme].url) {
    stylesheet.href = themes[theme].url
  }

  return theme
}
