type Side = 'top' | 'right' | 'bottom' | 'left'

/**
 * Returns the grid position of elements in a snail-shaped layout that goes
 * from top, to right, to bottom, to left. `elemSize` is the number of cells
 * to use for one element. Elements are one cell tall or wide, depending on
 * the side.
 */
export function snailGrid(gridSize: ReturnType<typeof snailGridSize>, n: number, elemSize: number) {
  n = Math.max(1, n)

  const minElemSize = 4

  if (elemSize < minElemSize) {
    throw new RangeError(`Element size must be at least ${minElemSize}.`)
  }

  let top = 0
  let bottom = gridSize.rows - 1
  let left = 0
  let right = gridSize.cols - 1

  const result = []
  while (top <= bottom && left <= right) {
    // Top side
    for (let col = left; col <= right; col += elemSize) {
      const remaining = right - col + 1
      const desiredSize = Math.min(elemSize, remaining)
      const nextRemaining = remaining - desiredSize
      const actualSize = nextRemaining > 0 && nextRemaining < minElemSize ? remaining : desiredSize

      result.push({
        gridRowStart: top + 1,
        gridColumnStart: col + 1,
        gridRowEnd: top + 2,
        gridColumnEnd: col + actualSize + 1,
        side: 'top' as Side,
      })

      if (col + actualSize > right) break
    }
    top++

    // Right side
    for (let row = top; row <= bottom; row += elemSize) {
      const remaining = bottom - row + 1
      const desiredSize = Math.min(elemSize, remaining)
      const nextRemaining = remaining - desiredSize
      const actualSize = nextRemaining > 0 && nextRemaining < minElemSize ? remaining : desiredSize

      result.push({
        gridRowStart: row + 1,
        gridColumnStart: right + 1,
        gridRowEnd: row + actualSize + 1,
        gridColumnEnd: right + 2,
        side: 'right' as Side,
      })

      if (row + actualSize > bottom) break
    }
    right--

    // Bottom side
    if (top <= bottom) {
      for (let col = right; col >= left; col -= elemSize) {
        const remaining = col - left + 1
        const desiredSize = Math.min(elemSize, remaining)
        const nextRemaining = remaining - desiredSize
        const actualSize =
          nextRemaining > 0 && nextRemaining < minElemSize ? remaining : desiredSize

        result.push({
          gridRowStart: bottom + 1,
          gridColumnStart: col - actualSize + 2,
          gridRowEnd: bottom + 2,
          gridColumnEnd: col + 2,
          side: 'bottom' as Side,
        })

        if (col - actualSize < left) break
      }
      bottom--
    }

    // Left side
    if (left <= right) {
      for (let row = bottom; row >= top; row -= elemSize) {
        const remaining = row - top + 1
        const desiredSize = Math.min(elemSize, remaining)
        const nextRemaining = remaining - desiredSize
        const actualSize =
          nextRemaining > 0 && nextRemaining < minElemSize ? remaining : desiredSize

        result.push({
          gridRowStart: row - actualSize + 2,
          gridColumnStart: left + 1,
          gridRowEnd: row + 2,
          gridColumnEnd: left + 2,
          side: 'left' as Side,
        })

        if (row - actualSize < top) break
      }
      left++
    }
  }

  return result.slice(0, n)
}

export function snailGridSize(gridCellSizePixel: number) {
  return {
    cols: Math.round(document.documentElement.clientWidth / gridCellSizePixel),
    rows: Math.round(document.documentElement.clientHeight / gridCellSizePixel),
  }
}

/**
 * Returns the number of pixels occupied by the Tabsnail on each side.
 */
export function snailBounds(
  gridSize: ReturnType<typeof snailGridSize>,
  elems: ReturnType<typeof snailGrid>,
) {
  const bounds = { top: 0, right: 0, bottom: 0, left: 0 }
  const cellWidth = document.documentElement.clientWidth / gridSize.cols
  const cellHeight = document.documentElement.clientHeight / gridSize.rows

  return elems.reduce((bounds, { gridRowStart, gridColumnStart, side }) => {
    switch (side) {
      case 'top':
        bounds.top = Math.max(bounds.top, gridRowStart * cellHeight)
        return bounds
      case 'right':
        bounds.right = Math.max(bounds.right, (gridSize.cols - gridColumnStart + 1) * cellWidth)
        return bounds
      case 'bottom':
        bounds.bottom = Math.max(bounds.bottom, (gridSize.rows - gridRowStart + 1) * cellHeight)
        return bounds
      case 'left':
        bounds.left = Math.max(bounds.left, gridColumnStart * cellWidth)
        return bounds
    }
  }, bounds)
}
