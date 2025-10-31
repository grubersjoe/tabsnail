type Side = 'top' | 'right' | 'bottom' | 'left'

/**
 * Yields the grid position of elements in a snail-shaped layout that goes
 * from top, to right, to bottom, to left. `elemSize` is the number of cells
 * to use for one element. Elements are one cell tall or wide, depending on
 * the side.
 */
export function* snailGrid(cols: number, rows: number, elemSize: number) {
  const minElemSize = 4

  if (elemSize < minElemSize) {
    throw new RangeError(`Element size must be at least ${minElemSize}.`)
  }

  let top = 0
  let bottom = rows - 1
  let left = 0
  let right = cols - 1

  while (top <= bottom && left <= right) {
    // Top side
    for (let col = left; col <= right; col += elemSize) {
      const remaining = right - col + 1
      const desiredSize = Math.min(elemSize, remaining)
      const nextRemaining = remaining - desiredSize
      const size = nextRemaining > 0 && nextRemaining < minElemSize ? remaining : desiredSize

      yield {
        gridRowStart: top + 1,
        gridColumnStart: col + 1,
        gridRowEnd: top + 2,
        gridColumnEnd: col + size + 1,
        side: 'top' as Side,
      }

      if (col + size > right) break
    }
    top++

    // Right side
    for (let row = top; row <= bottom; row += elemSize) {
      const remaining = bottom - row + 1
      const desiredSize = Math.min(elemSize, remaining)
      const nextRemaining = remaining - desiredSize
      const size = nextRemaining > 0 && nextRemaining < minElemSize ? remaining : desiredSize

      yield {
        gridRowStart: row + 1,
        gridColumnStart: right + 1,
        gridRowEnd: row + size + 1,
        gridColumnEnd: right + 2,
        side: 'right' as Side,
      }

      if (row + size > bottom) break
    }
    right--

    // Bottom side
    if (top <= bottom) {
      for (let col = right; col >= left; col -= elemSize) {
        const remaining = col - left + 1
        const desiredSize = Math.min(elemSize, remaining)
        const nextRemaining = remaining - desiredSize
        const size = nextRemaining > 0 && nextRemaining < minElemSize ? remaining : desiredSize

        yield {
          gridRowStart: bottom + 1,
          gridColumnStart: col - size + 2,
          gridRowEnd: bottom + 2,
          gridColumnEnd: col + 2,
          side: 'bottom' as Side,
        }

        if (col - size < left) break
      }
      bottom--
    }

    // Left side
    if (left <= right) {
      for (let row = bottom; row >= top; row -= elemSize) {
        const remaining = row - top + 1
        const desiredSize = Math.min(elemSize, remaining)
        const nextRemaining = remaining - desiredSize
        const size = nextRemaining > 0 && nextRemaining < minElemSize ? remaining : desiredSize

        yield {
          gridRowStart: row - size + 2,
          gridColumnStart: left + 1,
          gridRowEnd: row + 2,
          gridColumnEnd: left + 2,
          side: 'left' as Side,
        }

        if (row - size < top) break
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
