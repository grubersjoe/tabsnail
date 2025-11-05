export type Theme = keyof typeof themes

type ThemeDefinition = {
  name: string
  url: string
  cellSizePixel: number
}

export const themes = {
  default: {
    name: 'Stripes',
    url: browser.runtime.getURL(`/themes/stripes.css`),
    cellSizePixel: 32,
  },
  pride: {
    name: 'Pride',
    url: browser.runtime.getURL(`/themes/pride.css`),
    cellSizePixel: 32,
  },
  win95: {
    name: 'Windows 95',
    url: browser.runtime.getURL(`/themes/win95.css`),
    cellSizePixel: 36,
  },
} as const satisfies Record<string, ThemeDefinition>

export function loadTheme(theme: Theme, tabsnail: HTMLElement) {
  document.getElementById('tabsnail-theme')?.remove()

  const stylesheet = document.createElement('link')
  stylesheet.id = 'tabsnail-theme'
  stylesheet.rel = 'stylesheet'
  stylesheet.href = themes[theme].url

  document.head.appendChild(stylesheet)

  tabsnail.style.setProperty('--cell-size', `${themes[theme].cellSizePixel}px`)
}
