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
