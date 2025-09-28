import type { Settings } from './background.ts'

type Side = 'top' | 'right' | 'bottom' | 'left'

/**
 * Yields the grid position of elements in a snail-shaped layout that goes
 * from top, to right, to bottom, to left. `elemSize` is the number of cells
 * to use for one element. Elements are one cell tall or wide, depending on
 * the side.
 */
export function* snailGrid(cols: number, rows: number, elemSize: number) {
  let top = 0
  let bottom = rows - 1
  let left = 0
  let right = cols - 1

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c += elemSize) {
      yield {
        gridArea: `
          ${top + 1} / ${c + 1} / ${top + 2} / ${Math.min(c + elemSize - 1, right) + 2}
        `,
        side: 'top' as Side,
      }
    }
    top++

    for (let r = top; r <= bottom; r += elemSize) {
      yield {
        gridArea: `
          ${r + 1} / ${right + 1} / ${Math.min(r + elemSize - 1, bottom) + 2} / ${right + 2}
        `,
        side: 'right' as Side,
      }
    }
    right--

    if (top <= bottom) {
      for (let c = right; c >= left; c -= elemSize) {
        yield {
          gridArea: `
            ${bottom + 1} / ${Math.max(c - elemSize + 1, left) + 1} / ${bottom + 2} / ${c + 2}
          `,
          side: 'bottom' as Side,
        }
      }
      bottom--
    }

    if (left <= right) {
      for (let r = bottom; r >= top; r -= elemSize) {
        yield {
          gridArea: `
            ${Math.max(r - elemSize + 1, top) + 1} / ${left + 1} / ${r + 2} / ${left + 2}
          `,
          side: 'left' as Side,
        }
      }
      left++
    }
  }
}

export function snailGridSize() {
  const cellSize = 32
  const cols = Math.round(document.documentElement.clientWidth / cellSize)
  const rows = Math.round(document.documentElement.clientHeight / cellSize)

  return { cols, rows }
}

export function loadTheme(theme: Settings['theme']) {
  document.getElementById('tabsnail-theme')?.remove()

  const stylesheet = document.createElement('link')
  stylesheet.id = 'tabsnail-theme'
  stylesheet.rel = 'stylesheet'
  stylesheet.href = chrome.runtime.getURL(`themes/${theme}.css`)

  document.head.appendChild(stylesheet)
}

export function className(name: string) {
  return `tabsnail-${name}`
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

export function debounce(callback: (...args: unknown[]) => unknown, wait: number) {
  let timeoutId: number | undefined
  return (...args: unknown[]) => {
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args)
    }, wait)
  }
}
