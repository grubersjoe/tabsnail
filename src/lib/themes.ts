import { themes } from '@@/public/themes'

export type Theme = {
  name: string
  url: string
  font?: FontFace
  cellSizePx: number
}

export type ThemeKey = keyof typeof themes

export async function loadTheme(shadowRoot: ShadowRoot, theme: ThemeKey) {
  const { url, font } = themes[theme] as Theme

  const stylesheet = new CSSStyleSheet()
  const cssFile = await fetch(url)
  await stylesheet.replace(await cssFile.text())
  shadowRoot.adoptedStyleSheets = [stylesheet]

  if (font) {
    document.fonts.add(font)
  }
}
