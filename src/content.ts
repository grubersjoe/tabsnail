import { isDarkColor, snailLayout } from './snail.ts'
import type { ActivateTabMessage, CloseTabMessage } from './background.ts'
import { loadFonts } from './fonts.ts'

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

export type Tab = {
  id?: number
  title?: string
  active: boolean
}

export type ListTabsMessage = {
  type: 'list-tabs'
  tabs: Tab[]
}

function isListTabsMessage(msg: { type: string }): msg is ListTabsMessage {
  return msg.type === 'list-tabs'
}

chrome.runtime.onMessage.addListener((message, _sender, response) => {
  if (isListTabsMessage(message)) {
    handleListTabsMessage(message)
    response()
  }
})

chrome.storage.sync.get('color', ({ color }) => {
  if (color) {
    const isDark = isDarkColor(color)
    tabsnail.style.setProperty('--dark-color', isDark ? '#fff' : '#111')
    tabsnail.style.setProperty('--dark-bg', color)
  }
})

chrome.storage.onChanged.addListener(changes => {
  if (changes.color) {
    const isDark = isDarkColor(changes.color.newValue)
    tabsnail.style.setProperty('--dark-color', isDark ? '#fff' : '#000')
    tabsnail.style.setProperty('--dark-bg', changes.color.newValue)
  }
})

function handleListTabsMessage(message: ListTabsMessage) {
  tabsnail.innerHTML = ''

  const gridCols = 48
  const gridRows = 30
  const layout = snailLayout(gridCols, gridRows, 6)

  tabsnail.style.setProperty('--grid-columns', String(gridCols))
  tabsnail.style.setProperty('--grid-rows', String(gridRows))

  message.tabs.forEach((tab, i) => {
    const tabId = tab.id

    if (!tabId) {
      console.error(`Unexpected: Tab ${i} has no ID.`)
      return
    }

    const { gridArea, side } = layout[i]

    const tabContainer = document.createElement('div')
    tabContainer.style.gridArea = gridArea
    tabContainer.classList.add(className(side))

    if (tab.active) {
      tabContainer.classList.add(className('active'))
    }

    const activateButton = document.createElement('button')
    activateButton.type = 'button'
    activateButton.classList.add(className('btn-activate'))

    activateButton.addEventListener('click', () => {
      return chrome.runtime.sendMessage<ActivateTabMessage>({
        type: 'activate-tab',
        tabId,
      })
    })

    // Required for text overflow with ellipsis.
    const span = document.createElement('span')
    span.textContent = tab.title ?? ''
    activateButton.appendChild(span)

    const closeButton = document.createElement('button')
    closeButton.type = 'button'
    closeButton.classList.add(className('btn-close'))
    closeButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="m10.94 12-3.97 3.97 1.06 1.06L12 13.06l3.97 3.97 1.06-1.06L13.06 12l3.97-3.97-1.06-1.06L12 10.94 8.03 6.97 6.97 8.03 10.94 12Z" />
        </svg>    
    `

    closeButton.addEventListener('click', () => {
      return chrome.runtime.sendMessage<CloseTabMessage>({
        type: 'close-tab',
        tabId,
      })
    })

    tabContainer.appendChild(activateButton)
    tabContainer.appendChild(closeButton)
    tabsnail.appendChild(tabContainer)
  })
}

function className(name: string) {
  return `tabsnail-${name}`
}

loadFonts()
