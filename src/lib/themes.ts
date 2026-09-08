import { themes } from '@/themes'

export type Theme = {
  name: string
  css: string
  font?: FontFace
}

export type ThemeKey = keyof typeof themes

export function getTheme(key: ThemeKey): Theme {
  return themes[key]
}

export function isThemeKey(key: string): key is ThemeKey {
  return key in themes
}

let style: HTMLStyleElement | undefined

export function loadTheme(shadowRoot: ShadowRoot, theme: ThemeKey) {
  // Using shadowRoot.adoptedStyleSheets would be cool,
  // but unfortunately, Firefox does not support this.
  if (!style) {
    style = document.createElement('style')
    shadowRoot.append(style)
  }

  const { css, font } = getTheme(theme)
  style.textContent = css

  if (font) {
    document.fonts.add(font)
  }
}
