import { themes } from '@@/public/themes'

export type Theme = {
  name: string
  url: string
  font?: FontFace
  cellSizePx: number
}

export type ThemeKey = keyof typeof themes

export function loadTheme(shadowRoot: ShadowRoot, theme: ThemeKey) {
  const { url, font } = themes[theme] as Theme

  // Using the shadow roots adoptedStyleSheets field would be cool,
  // but Firefox has a bug:
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1928865
  let link = shadowRoot.querySelector<HTMLLinkElement>('#theme')

  if (!link) {
    link = document.createElement('link')
    link.id = 'theme'
    link.rel = 'stylesheet'
    shadowRoot.querySelector('head')?.appendChild(link)
  }

  link.href = url

  if (font) {
    document.fonts.add(font)
  }
}
