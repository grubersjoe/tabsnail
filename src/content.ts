import { debounce, gridDimensionsForViewport, isDarkColor, snailLayout } from './lib.ts'
import type { ActivateTabMessage, CloseTabMessage, Settings } from './background.ts'
import { loadFonts } from './fonts.ts'

const settings: Partial<Settings> = {}
const tabsnail = init()

function init() {
  let tabsnail = document.getElementById('tabsnail')

  if (!tabsnail) {
    tabsnail = document.createElement('div')
    tabsnail.id = 'tabsnail'
    document.documentElement.appendChild(tabsnail)
  }

  chrome.storage.sync.get<Settings>(['color', 'tabSize'], ({ color, tabSize }) => {
    if (color) {
      settings.color = color
      tabsnail.style.setProperty('--color', color)
      tabsnail.classList.toggle(className('dark'), isDarkColor(color))
    }

    if (tabSize) {
      settings.tabSize = tabSize
    }
  })

  return tabsnail
}

export type Tab = {
  id?: number
  title?: string
  active: boolean
}

export type UpdateTabsMessage = {
  type: 'update-tabs'
  tabs: Tab[]
}

function isUpdateTabsMessage(msg: { type: string }): msg is UpdateTabsMessage {
  return msg.type === 'update-tabs'
}

chrome.runtime.onMessage.addListener((message, _sender, response) => {
  if (isUpdateTabsMessage(message)) {
    updateTabs(message)
    response()
  }
})

chrome.storage.onChanged.addListener(({ color, tabSize }) => {
  if (color) {
    settings.color = color.newValue
    tabsnail.style.setProperty('--color', color.newValue)
    tabsnail.classList.toggle(className('dark'), isDarkColor(color.newValue))
  }

  if (tabSize) {
    settings.tabSize = tabSize.newValue
    updateLayout()
  }
})

window.addEventListener(
  'resize',
  debounce(() => {
    updateLayout()
  }, 150),
)

function updateTabs(message: UpdateTabsMessage) {
  tabsnail.innerHTML = ''

  const { cols, rows } = gridDimensionsForViewport()
  const layout = snailLayout(cols, rows, settings.tabSize)

  tabsnail.style.setProperty('--grid-columns', String(cols))
  tabsnail.style.setProperty('--grid-rows', String(rows))

  message.tabs.forEach((tab, i) => {
    const tabId = tab.id

    if (!tabId) {
      console.error(`Unexpected: Tab ${i} has no ID.`)
      return
    }

    const { gridArea, side } = layout[i]
    const container = document.createElement('div')
    container.style.gridArea = gridArea
    container.classList.add(className(side))

    if (tab.active) {
      container.classList.add(className('active'))
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
        <path 
          fill="currentColor" 
          d="m10.94 12-3.97 3.97 1.06 1.06L12 13.06l3.97 3.97 1.06-1.06L13.06 12l3.97-3.97-1.06-1.06L12 10.94 8.03 6.97 6.97 8.03 10.94 12Z" 
        />
      </svg>    
    `

    closeButton.addEventListener('click', () => {
      return chrome.runtime.sendMessage<CloseTabMessage>({
        type: 'close-tab',
        tabId,
      })
    })

    container.appendChild(activateButton)
    container.appendChild(closeButton)
    tabsnail.appendChild(container)
  })
}

function updateLayout() {
  const { cols, rows } = gridDimensionsForViewport()
  const layout = snailLayout(cols, rows, settings.tabSize)

  tabsnail.style.setProperty('--grid-columns', String(cols))
  tabsnail.style.setProperty('--grid-rows', String(rows))

  Array.from(tabsnail.children).forEach((elem, i) => {
    const container = elem as HTMLElement
    const { gridArea, side } = layout[i]
    container.style.gridArea = gridArea
    container.classList.toggle(className('top'), side === 'top')
    container.classList.toggle(className('right'), side === 'right')
    container.classList.toggle(className('bottom'), side === 'bottom')
    container.classList.toggle(className('left'), side === 'left')
  })
}

function className(name: string) {
  return `tabsnail-${name}`
}

loadFonts()
