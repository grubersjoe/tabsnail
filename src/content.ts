import type { TabListMessage } from './background.ts'
import { isDarkColor, snailOrder } from './lib.ts'

function isTabListMessage(msg: { type: string }): msg is TabListMessage {
  return msg.type === 'tab-list'
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
