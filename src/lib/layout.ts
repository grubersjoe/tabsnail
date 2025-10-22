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
    for (let col = left; col <= right; col += elemSize) {
      yield {
        gridRowStart: top + 1,
        gridColumnStart: col + 1,
        gridRowEnd: top + 2,
        gridColumnEnd: Math.min(col + elemSize - 1, right) + 2,
        side: 'top' as Side,
      }
    }
    top++

    for (let row = top; row <= bottom; row += elemSize) {
      yield {
        gridRowStart: row + 1,
        gridColumnStart: right + 1,
        gridRowEnd: Math.min(row + elemSize - 1, bottom) + 2,
        gridColumnEnd: right + 2,
        side: 'right' as Side,
      }
    }
    right--

    if (top <= bottom) {
      for (let col = right; col >= left; col -= elemSize) {
        yield {
          gridRowStart: bottom + 1,
          gridColumnStart: Math.max(col - elemSize + 1, left) + 1,
          gridRowEnd: bottom + 2,
          gridColumnEnd: col + 2,
          side: 'bottom' as Side,
        }
      }
      bottom--
    }

    if (left <= right) {
      for (let row = bottom; row >= top; row -= elemSize) {
        yield {
          gridRowStart: Math.max(row - elemSize + 1, top) + 1,
          gridColumnStart: left + 1,
          gridRowEnd: row + 2,
          gridColumnEnd: left + 2,
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
