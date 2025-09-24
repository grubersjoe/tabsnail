export function snailOrder(cols: number, rows: number): [number, number][] {
  let top = 0
  let bottom = rows - 1
  let left = 0
  let right = cols - 1

  let result: [number, number][] = []
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) result.push([top, c])
    top++

    for (let r = top; r <= bottom; r++) result.push([r, right])
    right--

    if (top <= bottom) {
      for (let c = right; c >= left; c--) result.push([bottom, c])
      bottom--
    }

    if (left <= right) {
      for (let r = bottom; r >= top; r--) result.push([r, left])
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
