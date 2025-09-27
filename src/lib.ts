type Side = 'top' | 'right' | 'bottom' | 'left'

/**
 * Calculates the grid position of each element in a snail-shaped layout that
 * goes from top, to right, to bottom, to left. `elemSize` is the number of
 * cells to use per element.
 */
export function snailLayout(cols: number, rows: number, elemSize: number = 8) {
  let top = 0
  let bottom = rows - 1
  let left = 0
  let right = cols - 1

  let layout: {
    gridArea: string
    side: Side
  }[] = []

  while (top <= bottom && left <= right) {
    // top: left -> right
    for (let col = left; col <= right; col += elemSize) {
      let endCol = Math.min(col + elemSize - 1, right)
      layout.push({
        gridArea: `${top + 1} / ${col + 1} / ${top + 2} / ${endCol + 2}`,
        side: 'top',
      })
    }
    top++

    // right: top -> bottom
    for (let row = top; row <= bottom; row += elemSize) {
      let endRow = Math.min(row + elemSize - 1, bottom)
      layout.push({
        gridArea: `${row + 1} / ${right + 1} / ${endRow + 2} / ${right + 2}`,
        side: 'right',
      })
    }
    right--

    // bottom: right -> left
    if (top <= bottom) {
      for (let col = right; col >= left; col -= elemSize) {
        let endCol = Math.max(col - elemSize + 1, left)
        layout.push({
          gridArea: `${bottom + 1} / ${endCol + 1} / ${bottom + 2} / ${col + 2}`,
          side: 'bottom',
        })
      }
      bottom--
    }

    // left: bottom -> top
    if (left <= right) {
      for (let row = bottom; row >= top; row -= elemSize) {
        let endRow = Math.max(row - elemSize + 1, top)
        layout.push({
          gridArea: `${endRow + 1} / ${left + 1} / ${row + 2} / ${left + 2}`,
          side: 'left',
        })
      }
      left++
    }
  }

  return layout
}

/**
 * Calculates the number of grid cells and their dimension based on the
 * current viewport. Each cell is roughly 32x32 pixels (rounding).
 */
export function gridDimensionsForViewport() {
  const cellSize = 32
  const cellWidth = document.documentElement.clientWidth / cellSize
  const cellHeight = document.documentElement.clientHeight / cellSize

  return {
    cols: Math.round(cellWidth),
    rows: Math.round(cellHeight),
    cellWidth,
    cellHeight,
  }
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
