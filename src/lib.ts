type Edge = 'top' | 'right' | 'bottom' | 'left'

export function snailLayout(cols: number, rows: number, blockSize: number) {
  let top = 0
  let bottom = rows - 1
  let left = 0
  let right = cols - 1

  let result: { row: string; column: string; edge: Edge }[] = []

  while (top <= bottom && left <= right) {
    // top: left -> right
    for (let c = left; c <= right; c += blockSize) {
      let endC = Math.min(c + blockSize - 1, right)
      result.push({
        row: `${top + 1} / ${top + 2}`,
        column: `${c + 1} / ${endC + 2}`,
        edge: 'top',
      })
    }
    top++

    // right: top -> bottom
    for (let r = top; r <= bottom; r += blockSize) {
      let endR = Math.min(r + blockSize - 1, bottom)
      result.push({
        row: `${r + 1} / ${endR + 2}`,
        column: `${right + 1} / ${right + 2}`,
        edge: 'right',
      })
    }
    right--

    // bottom: right -> left
    if (top <= bottom) {
      for (let c = right; c >= left; c -= blockSize) {
        let endC = Math.max(c - blockSize + 1, left)
        result.push({
          row: `${bottom + 1} / ${bottom + 2}`,
          column: `${endC + 1} / ${c + 2}`,
          edge: 'bottom',
        })
      }
      bottom--
    }

    // left: bottom -> top
    if (left <= right) {
      for (let r = bottom; r >= top; r -= blockSize) {
        let endR = Math.max(r - blockSize + 1, top)
        result.push({
          row: `${endR + 1} / ${r + 2}`,
          column: `${left + 1} / ${left + 2}`,
          edge: 'left',
        })
      }
      left++
    }
  }

  return result
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
