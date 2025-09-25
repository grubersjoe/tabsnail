import { isDarkColor, snailLayout } from './snail.ts'
import type { TabListMessage, TabSetActiveMessage } from './types.ts'

const tabsnail = init()

function init() {
  let tabsnail = document.getElementById('tabsnail')

  if (!tabsnail) {
    tabsnail = document.createElement('div')
    tabsnail.id = 'tabsnail'
    document.documentElement.appendChild(tabsnail)
  }

  return tabsnail
}

function isListTabsMessage(msg: { type: string }): msg is TabListMessage {
  return msg.type === 'list-tabs'
}

function handleListTabsMessage(message: TabListMessage) {
  tabsnail.innerHTML = ''

  const gridCols = 48
  const gridRows = 30
  const layout = snailLayout(gridCols, gridRows, 6)

  tabsnail.style.setProperty('--grid-columns', String(gridCols))
  tabsnail.style.setProperty('--grid-rows', String(gridRows))

  message.tabs.forEach((tab, i) => {
    const { row, column, edge } = layout[i]

    const segment = document.createElement('div')
    segment.style.gridRow = row
    segment.style.gridColumn = column
    segment.className = edge

    const button = document.createElement('button')
    button.type = 'button'
    button.title = tab.title
    button.textContent = tab.title
    button.addEventListener('click', () =>
      chrome.runtime.sendMessage<TabSetActiveMessage>({
        type: 'activate-tab',
        tabId: tab.id,
      }),
    )

    segment.appendChild(button)
    tabsnail.appendChild(segment)
  })
}

chrome.runtime.onMessage.addListener((message, _sender, response) => {
  if (isListTabsMessage(message)) {
    handleListTabsMessage(message)
  }

  response()
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
