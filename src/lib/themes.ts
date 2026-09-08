import { themes } from '@/themes'

export type Theme = {
  name: string
  css: string
  font?: FontFace
  cellSizePx: number
}

export type ThemeKey = keyof typeof themes

let style: HTMLStyleElement | undefined

export function loadTheme(shadowRoot: ShadowRoot, theme: ThemeKey) {
  // Using shadowRoot.adoptedStyleSheets would be cool,
  // but unfortunately, Firefox does not support this.
  if (!style) {
    style = document.createElement('style')
    shadowRoot.append(style)
  }

  const { css, font } = themes[theme]
  style.textContent = css

  if (font) {
    document.fonts.add(font)
  }
}
