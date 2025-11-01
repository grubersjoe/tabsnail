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

function main() {
  let tabsnail = document.getElementById('tabsnail')

  if (!tabsnail) {
    tabsnail = document.createElement('div')
    tabsnail.id = 'tabsnail'
    document.documentElement.appendChild(tabsnail)
  }

  let settingsReadyResolve!: (s: Settings) => void
  const settingsReady = new Promise<Settings>(res => (settingsReadyResolve = res))

  chrome.storage.sync.get<Settings>(null, settings => {
    tabsnail.style.setProperty('--color', settings.color)
    tabsnail.classList.toggle(className('dark'), isDarkColor(settings.color))

    loadTheme(settings.theme)
    settingsReadyResolve(settings)
  })

  loadTheme('default')

  chrome.runtime.onMessage.addListener((message: Message, _sender, response) => {
    void settingsReady.then(({ tabSize }) => {
      if (isUpdateTabsMessage(message)) {
        updateTabs(tabsnail, message, tabSize)
        response()
      }
    })
  })

  chrome.storage.onChanged.addListener(
    ({ theme, color, tabSize }: Partial<Record<string, chrome.storage.StorageChange>>) => {
      if (theme?.newValue) {
        loadTheme(theme.newValue as Settings['theme'])
      }

      if (color?.newValue) {
        tabsnail.style.setProperty('--color', color.newValue as Settings['color'])
        tabsnail.classList.toggle(
          className('dark'),
          isDarkColor(color.newValue as Settings['color']),
        )
      }

      if (tabSize?.newValue) {
        updateLayout(tabsnail, tabSize.newValue as Settings['tabSize'])
      }
    },
  )

  window.addEventListener(
    'resize',
    debounce(() => {
      void settingsReady.then(({ tabSize }) => {
        updateLayout(tabsnail, tabSize)
      })
    }, 150),
  )

  return tabsnail
}

function updateTabs(tabsnail: HTMLElement, message: UpdateTabsMessage, tabSize: number) {
  const { gridCols, gridRows } = snailGridSize()
  const gridPositions = snailGrid(gridCols, gridRows, message.tabs.length, tabSize)

  updateViewportBounds(gridRows, gridCols, gridPositions)

  tabsnail.style.setProperty('--grid-columns', String(gridCols))
  tabsnail.style.setProperty('--grid-rows', String(gridRows))

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
  const { gridCols, gridRows } = snailGridSize()
  const gridPositions = snailGrid(gridCols, gridRows, tabsnail.children.length, tabSize)

  updateViewportBounds(gridRows, gridCols, gridPositions)

  tabsnail.style.setProperty('--grid-columns', String(gridCols))
  tabsnail.style.setProperty('--grid-rows', String(gridRows))

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

function updateViewportBounds(
  gridRows: number,
  gridCols: number,
  gridPositions: ReturnType<typeof snailGrid>,
) {
  const bounds = snailBounds(gridRows, gridCols, gridPositions)

  document.body.style.boxSizing = 'border-box'
  document.body.style.translate = `${bounds.left}px ${bounds.top}px`

  if (bounds.left + bounds.right > 0) {
    document.body.style.width = `calc(100vw - ${bounds.left + bounds.right}px)`
  }

  if (bounds.bottom > 0) {
    document.body.style.paddingBottom = `${bounds.bottom}px`
  }
}

main()
