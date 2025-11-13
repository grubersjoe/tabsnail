type Side = 'top' | 'right' | 'bottom' | 'left'

/**
 * Returns the grid position of elements in a snail-shaped layout that goes
 * from top, to right, to bottom, to left. `elemSize` is the number of cells
 * to use for one element. Elements are one cell tall or wide, depending on
 * the side.
 */
export function snailGrid(gridColumns: number, gridRows: number, elemSize: number) {
  const minElemSize = 4

  if (elemSize < minElemSize) {
    throw new RangeError(`Element size must be at least ${minElemSize}.`)
  }

  let top = 0
  let bottom = gridRows - 1
  let left = 0
  let right = gridColumns - 1

  const result = []
  while (top <= bottom && left <= right) {
    // Top side
    for (let col = left; col <= right; col += elemSize) {
      const remaining = right - col + 1
      const desiredSize = Math.min(elemSize, remaining)
      const nextRemaining = remaining - desiredSize
      const actualSize = nextRemaining > 0 && nextRemaining < minElemSize ? remaining : desiredSize

      result.push({
        rowStart: top + 1,
        columnStart: col + 1,
        rowEnd: top + 2,
        columnEnd: col + actualSize + 1,
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
        rowStart: row + 1,
        columnStart: right + 1,
        rowEnd: row + actualSize + 1,
        columnEnd: right + 2,
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
          rowStart: bottom + 1,
          columnStart: col - actualSize + 2,
          rowEnd: bottom + 2,
          columnEnd: col + 2,
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
          rowStart: row - actualSize + 2,
          columnStart: left + 1,
          rowEnd: row + 2,
          columnEnd: left + 2,
          side: 'left' as Side,
        })

        if (row - actualSize < top) break
      }
      left++
    }
  }

  return result
}

/**
 * Returns the number of pixels occupied by the Tabsnail on each side.
 */
export function snailBounds(
  clientWidth: number,
  clientHeight: number,
  gridColumns: number,
  gridRows: number,
  grid: ReturnType<typeof snailGrid>,
) {
  const bounds = { top: 0, right: 0, bottom: 0, left: 0 }
  const cellWidth = clientWidth / gridColumns
  const cellHeight = clientHeight / gridRows

  return grid.reduce((bounds, { rowStart, columnStart, side }) => {
    switch (side) {
      case 'top':
        bounds.top = Math.max(bounds.top, rowStart * cellHeight)
        return bounds
      case 'right':
        bounds.right = Math.max(bounds.right, (gridColumns - columnStart + 1) * cellWidth)
        return bounds
      case 'bottom':
        bounds.bottom = Math.max(bounds.bottom, (gridRows - rowStart + 1) * cellHeight)
        return bounds
      case 'left':
        bounds.left = Math.max(bounds.left, columnStart * cellWidth)
        return bounds
    }
  }, bounds)
}

export function setViewportBounds(condition: boolean, bounds: ReturnType<typeof snailBounds>) {
  if (condition) {
    document.body.style.translate = `${bounds.left}px ${bounds.top}px`

    if (bounds.left + bounds.right > 0) {
      document.body.style.width = `calc(100% - ${bounds.left + bounds.right}px)`
    } else {
      document.body.style.removeProperty('width')
    }

    if (bounds.bottom > 0) {
      document.body.style.boxSizing = 'border-box'
      document.body.style.paddingBottom = `${bounds.bottom}px`
    } else {
      document.body.style.removeProperty('box-sizing')
      document.body.style.removeProperty('padding-bottom')
    }
  } else {
    document.body.style.translate = 'initial' // must not be removed because a default is set in tabsnail.css
    document.body.style.removeProperty('width')
    document.body.style.removeProperty('box-sizing')
    document.body.style.removeProperty('padding-bottom')
  }
}
