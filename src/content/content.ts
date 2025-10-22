import { snailGrid, snailGridSize } from '../lib/layout.ts'
import './content.css'
import {
  type ActivateTabMessage,
  type CloseTabMessage,
  isUpdateTabsMessage,
  type Message,
  type UpdateTabsMessage,
} from '../lib/messages.ts'
import { className, debounce, isDarkColor, loadTheme } from '../lib'
import type { Settings } from '../settings/settings.ts'

const tabsnail = init()

let settingsReadyResolve!: (s: Settings) => void
const settingsReady = new Promise<Settings>(res => (settingsReadyResolve = res))

function init() {
  let tabsnail = document.getElementById('tabsnail')

  if (!tabsnail) {
    tabsnail = document.createElement('div')
    tabsnail.id = 'tabsnail'
    document.documentElement.appendChild(tabsnail)
  }

  chrome.storage.sync.get<Settings>(null, settings => {
    tabsnail.style.setProperty('--color', settings.color)
    tabsnail.classList.toggle(className('dark'), isDarkColor(settings.color))

    loadTheme(settings.theme)
    settingsReadyResolve(settings)
  })

  loadTheme('default')

  return tabsnail
}

chrome.runtime.onMessage.addListener((message: Message, _sender, response) => {
  void settingsReady.then(({ tabSize }) => {
    if (isUpdateTabsMessage(message)) {
      updateTabs(message, tabSize)
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
      tabsnail.classList.toggle(className('dark'), isDarkColor(color.newValue as Settings['color']))
    }

    if (tabSize?.newValue) {
      updateLayout(tabSize.newValue as Settings['tabSize'])
    }
  },
)

window.addEventListener(
  'resize',
  debounce(() => {
    void settingsReady.then(({ tabSize }) => {
      updateLayout(tabSize)
    })
  }, 150),
)

function updateTabs(message: UpdateTabsMessage, tabSize: number) {
  const { cols, rows } = snailGridSize()
  const grid = snailGrid(cols, rows, tabSize)

  tabsnail.style.setProperty('--grid-columns', String(cols))
  tabsnail.style.setProperty('--grid-rows', String(rows))

  const fragment = new DocumentFragment()

  message.tabs.forEach((tab, i) => {
    const tabId = tab.id

    if (!tabId) {
      console.warn(`Unexpected: Tab ${i} has no ID.`)
      return
    }

    const { value, done } = grid.next()

    if (done) {
      console.error(`No grid cell for tab ${tab.title ?? tabId}`)
      return
    }

    const { gridRowStart, gridRowEnd, gridColumnStart, gridColumnEnd, side } = value

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

function updateLayout(tabSize: number) {
  const { cols, rows } = snailGridSize()
  const grid = snailGrid(cols, rows, tabSize)

  tabsnail.style.setProperty('--grid-columns', String(cols))
  tabsnail.style.setProperty('--grid-rows', String(rows))

  Array.from(tabsnail.children).forEach(elem => {
    const container = elem as HTMLElement

    const { value, done } = grid.next()

    if (done) {
      console.error(`No grid cell for tab`)
      return
    }

    const { gridRowStart, gridRowEnd, gridColumnStart, gridColumnEnd, side } = value

    container.style.gridArea = `${gridRowStart} / ${gridColumnStart} / ${gridRowEnd} / ${gridColumnEnd}`
    container.classList.toggle(className('top'), side === 'top')
    container.classList.toggle(className('right'), side === 'right')
    container.classList.toggle(className('bottom'), side === 'bottom')
    container.classList.toggle(className('left'), side === 'left')
  })
}
