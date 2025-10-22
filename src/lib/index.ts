import type { Settings } from '../settings/settings.ts'

export function debounce(callback: (...args: unknown[]) => unknown, wait: number) {
  let timeoutId: number | undefined
  return (...args: unknown[]) => {
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args)
    }, wait)
  }
}

export function className(name: string) {
  return `tabsnail-${name}`
}

export function loadTheme(theme: Settings['theme']) {
  document.getElementById('tabsnail-theme')?.remove()

  const stylesheet = document.createElement('link')
  stylesheet.id = 'tabsnail-theme'
  stylesheet.rel = 'stylesheet'
  stylesheet.href = chrome.runtime.getURL(`themes/${theme}.css`)

  document.head.appendChild(stylesheet)
}

export function isDarkColor(hex: string) {
  hex = hex.slice(1)
  const int = parseInt(
    hex.length === 3
      ? hex
          .split('')
          .map(c => c + c)
          .join('')
      : hex,
    16,
  )
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255

  // Relative luminance (sRGB)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

  return luminance < 128
}
