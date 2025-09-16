import type { TabListMessage } from './background.ts'

function isTabListMessage(msg: { type: string }): msg is TabListMessage {
  return msg.type === 'tabList'
}

let tabsnail = document.getElementById('tabsnail')

if (!tabsnail) {
  tabsnail = document.createElement('div')
  tabsnail.id = 'tabsnail'
  document.documentElement.appendChild(tabsnail)
}

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (isTabListMessage(msg)) {
    const gridCols = 10
    const gridRows = 20
    const gridPositions = snailOrder(gridCols, gridRows)

    tabsnail.style.setProperty('--grid-columns', String(gridCols))
    tabsnail.style.setProperty('--grid-rows', String(gridRows))

    tabsnail.innerHTML = msg.tabs
      .map((tab, idx) => {
        const [row, col] = gridPositions[idx]
        return `
            <div style="grid-row: ${row + 1}; grid-column: ${col + 1};">
              <span>${tab.title}</span>
            </div>
          `
      })
      .join('')
  }

  sendResponse()
})

chrome.storage.sync.get('color', ({ color }) => {
  if (color) {
    const contrastColor = isDarkColor(color) ? '#fff' : '#000'
    tabsnail.style.setProperty('--contrast-color', contrastColor)
    tabsnail.style.setProperty('--bg-color', color)
  }
})

chrome.storage.onChanged.addListener(changes => {
  if (changes.color) {
    const contrastColor = isDarkColor(changes.color.newValue) ? '#fff' : '#000'
    tabsnail.style.setProperty('--contrast-color', contrastColor)
    tabsnail.style.setProperty('--bg-color', changes.color.newValue)
  }
})

function snailOrder(cols: number, rows: number): [number, number][] {
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

function isDarkColor(hex: string) {
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
