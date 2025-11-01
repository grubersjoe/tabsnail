import { snailBounds, snailGrid, snailGridSize } from '../lib/layout'
import './content.css'
import {
  type ActivateTabMessage,
  type CloseTabMessage,
  isUpdateTabsMessage,
  type Message,
  type UpdateTabsMessage,
} from '../lib/messages'
import { className, debounce, isDarkColor, loadTheme } from '../lib'
import type { Settings } from '../settings/settings.ts'
import { defaultSettings } from '../settings/default'

let settings = defaultSettings

function main() {
  let tabsnail = document.getElementById('tabsnail')

  if (!tabsnail) {
    tabsnail = document.createElement('div')
    tabsnail.id = 'tabsnail'
    document.documentElement.appendChild(tabsnail)
  }

  chrome.storage.sync.get<Settings>(null, syncSettings => {
    settings = syncSettings
    tabsnail.style.setProperty('--color', settings.color)
    tabsnail.classList.toggle(className('dark'), isDarkColor(settings.color))
    loadTheme(settings.theme)
  })

  loadTheme('default')

  chrome.runtime.onMessage.addListener((message: Message, _sender, response) => {
    if (isUpdateTabsMessage(message)) {
      updateTabs(tabsnail, message)
      response()
    }
  })

  chrome.storage.onChanged.addListener(syncSettings => {
    if (syncSettings.color) {
      settings.color = syncSettings.color.newValue as Settings['color']
      tabsnail.style.setProperty('--color', settings.color)
      tabsnail.classList.toggle(className('dark'), isDarkColor(settings.color))
    }

    if (syncSettings.shrinkPage) {
      settings.shrinkPage = syncSettings.shrinkPage.newValue as Settings['shrinkPage']

      if (settings.shrinkPage) {
        const gridSize = snailGridSize()
        shrinkPage(gridSize, snailGrid(gridSize, tabsnail.children.length, settings.tabSize))
      } else {
        resetPage()
      }
    }

    if (syncSettings.tabSize) {
      settings.tabSize = syncSettings.tabSize.newValue as Settings['tabSize']
      updateLayout(tabsnail, settings.tabSize)
    }

    if (syncSettings.theme) {
      settings.theme = syncSettings.theme.newValue as Settings['theme']
      loadTheme(settings.theme)
    }
  })

  window.addEventListener(
    'resize',
    debounce(() => {
      updateLayout(tabsnail, settings.tabSize)
    }, 150),
  )

  return tabsnail
}

function updateTabs(tabsnail: HTMLElement, message: UpdateTabsMessage) {
  const gridSize = snailGridSize()
  const gridPositions = snailGrid(gridSize, message.tabs.length, settings.tabSize)

  if (settings.shrinkPage) {
    shrinkPage(gridSize, gridPositions)
  } else {
    resetPage()
  }

  tabsnail.style.setProperty('--grid-columns', String(gridSize.cols))
  tabsnail.style.setProperty('--grid-rows', String(gridSize.rows))

  const fragment = new DocumentFragment()

  message.tabs.forEach((tab, i) => {
    const tabId = tab.id

    if (!tabId) {
      console.warn(`Unexpected: Tab ${i} has no ID.`)
      return
    }

    if (!gridPositions[i]) {
      console.warn(`Tab ${i} (${tabId}) has no grid position.`)
      return
    }

    const { gridRowStart, gridRowEnd, gridColumnStart, gridColumnEnd, side } = gridPositions[i]

    const container = document.createElement('div')
    container.style.gridArea = `${gridRowStart} / ${gridColumnStart} / ${gridRowEnd} / ${gridColumnEnd}`
    container.classList.add(className(side))
    container.classList.toggle(className('active'), tab.active)

    const activateButton = document.createElement('button')
    activateButton.type = 'button'
    activateButton.textContent = tab.title ?? ''
    activateButton.classList.add(className('btn-activate'))

    activateButton.addEventListener('click', () => {
      void chrome.runtime.sendMessage<ActivateTabMessage>({
        type: 'activate-tab',
        tabId,
      })
    })

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
      void chrome.runtime.sendMessage<CloseTabMessage>({
        type: 'close-tab',
        tabId,
      })
    })

    container.appendChild(activateButton)
    container.appendChild(closeButton)
    fragment.appendChild(container)
  })

  tabsnail.replaceChildren(fragment)
}

function updateLayout(tabsnail: HTMLElement, tabSize: number) {
  const gridSize = snailGridSize()
  const gridPositions = snailGrid(gridSize, tabsnail.children.length, tabSize)

  shrinkPage(gridSize, gridPositions)

  tabsnail.style.setProperty('--grid-columns', String(gridSize.cols))
  tabsnail.style.setProperty('--grid-rows', String(gridSize.rows))

  Array.from(tabsnail.children).forEach((elem, i) => {
    const container = elem as HTMLElement

    if (!gridPositions[i]) {
      console.warn(`Tab ${i} has no grid position.`)
      return
    }

    const { gridRowStart, gridRowEnd, gridColumnStart, gridColumnEnd, side } = gridPositions[i]

    container.style.gridArea = `${gridRowStart} / ${gridColumnStart} / ${gridRowEnd} / ${gridColumnEnd}`
    container.classList.toggle(className('top'), side === 'top')
    container.classList.toggle(className('right'), side === 'right')
    container.classList.toggle(className('bottom'), side === 'bottom')
    container.classList.toggle(className('left'), side === 'left')
  })
}

function shrinkPage(
  gridSize: ReturnType<typeof snailGridSize>,
  gridPositions: ReturnType<typeof snailGrid>,
) {
  const bounds = snailBounds(gridSize, gridPositions)

  document.body.style.boxSizing = 'border-box'
  document.body.style.translate = `${bounds.left}px ${bounds.top}px`

  if (bounds.left + bounds.right > 0) {
    document.body.style.width = `calc(100vw - ${bounds.left + bounds.right}px)`
  }

  if (bounds.bottom > 0) {
    document.body.style.paddingBottom = `${bounds.bottom}px`
  }
}

function resetPage() {
  document.body.style.boxSizing = 'revert'
  document.body.style.translate = '0' // overwrite default from content.css
  document.body.style.width = 'revert'
  document.body.style.paddingBottom = 'revert'
}

main()
