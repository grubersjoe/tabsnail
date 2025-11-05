import './content.css'
import closeIcon from '@/assets/close.svg?raw'
import { className, debounce, isDarkColor } from '@/lib'
import { snailBounds, snailGrid, snailGridSize } from '@/lib/layout'
import {
  type ActivateTabMessage,
  type CloseTabMessage,
  isUpdateTabsMessage,
  type Message,
  type UpdateTabsMessage,
} from '@/lib/messages'
import { defaultState, getStateSnapshot, type State, stateStorage } from '@/lib/state'
import { loadTheme, themes } from '@/lib/themes'

const tabsnail = document.createElement('div')
tabsnail.id = 'tabsnail'

let state: State = defaultState

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'manifest',
  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'html',
      onMount(container) {
        container.append(tabsnail)

        // Load state from storage and initialize
        getStateSnapshot()
          .then(snapshot => {
            state = snapshot
            onColorChange()
            onShrinkViewportChange()
            onThemeChange()
            onTabSizeChange()
          })
          .catch(console.error)
      },
      onRemove() {
        resetViewport()
        tabsnail.remove()
      },
    })

    ui.mount()

    browser.runtime.onMessage.addListener((message: Message, _sender, response) => {
      if (isUpdateTabsMessage(message)) {
        updateTabs(tabsnail, message)
        response()
      }
    })

    stateStorage.color.watch(color => {
      state.color = color
      onColorChange()
    })

    stateStorage.shrinkViewport.watch(shrinkViewport => {
      state.shrinkViewport = shrinkViewport
      onShrinkViewportChange()
    })

    stateStorage.tabSize.watch(tabSize => {
      state.tabSize = tabSize
      onTabSizeChange()
    })

    stateStorage.theme.watch(theme => {
      state.theme = theme
      onThemeChange()
    })

    window.addEventListener('resize', () => {
      onResize()
    })

    document.addEventListener('fullscreenchange', () => {
      onFullscreenChange()
    })
  },
})

function updateTabs(tabsnail: HTMLElement, message: UpdateTabsMessage) {
  const gridSize = snailGridSize(themes[state.theme].cellSizePixel)
  const gridPositions = snailGrid(gridSize, message.tabs.length, state.tabSize)

  if (state.shrinkViewport) {
    shrinkViewport(gridSize, gridPositions)
  } else {
    resetViewport()
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
      void browser.runtime.sendMessage<ActivateTabMessage>({
        type: 'activate-tab',
        tabId,
      })
    })

    const closeButton = document.createElement('button')
    closeButton.type = 'button'
    closeButton.classList.add(className('btn-close'))
    closeButton.innerHTML = closeIcon

    closeButton.addEventListener('click', () => {
      void browser.runtime.sendMessage<CloseTabMessage>({
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

function updateSnailLayout(tabsnail: HTMLElement) {
  const gridSize = snailGridSize(themes[state.theme].cellSizePixel)
  const gridPositions = snailGrid(gridSize, tabsnail.children.length, state.tabSize)

  shrinkViewport(gridSize, gridPositions)

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

function shrinkViewport(
  gridSize: ReturnType<typeof snailGridSize>,
  gridPositions: ReturnType<typeof snailGrid>,
) {
  const bounds = snailBounds(gridSize, gridPositions)

  document.body.style.boxSizing = 'border-box'
  document.body.style.maxHeight = `calc(100vh - ${bounds.top}px)`
  document.body.style.translate = `${bounds.left}px ${bounds.top}px`

  if (bounds.left + bounds.right > 0) {
    document.body.style.width = `calc(100vw - ${bounds.left + bounds.right}px)`
  } else {
    document.body.style.width = 'revert'
  }

  if (bounds.bottom > 0) {
    document.body.style.paddingBottom = `${bounds.bottom}px`
  } else {
    document.body.style.paddingBottom = 'revert'
  }
}

function resetViewport() {
  document.body.style.boxSizing = 'revert'
  document.body.style.maxHeight = 'revert'
  document.body.style.translate = '0' // overwrite default from content.css
  document.body.style.width = 'revert'
  document.body.style.paddingBottom = 'revert'
}

function onThemeChange() {
  loadTheme(state.theme, tabsnail)
  updateSnailLayout(tabsnail)
  onShrinkViewportChange()
}

function onColorChange() {
  tabsnail.style.setProperty('--color', state.color)
  tabsnail.classList.toggle(className('dark'), isDarkColor(state.color))
}

function onShrinkViewportChange() {
  if (state.shrinkViewport) {
    const gridSize = snailGridSize(themes[state.theme].cellSizePixel)
    shrinkViewport(gridSize, snailGrid(gridSize, tabsnail.children.length, state.tabSize))
  } else {
    resetViewport()
  }
}

function onTabSizeChange() {
  updateSnailLayout(tabsnail)
  onShrinkViewportChange()
}

function onResize() {
  if (document.fullscreenElement) {
    return
  }

  debounce(() => {
    updateSnailLayout(tabsnail)
  }, 150)()
}

function onFullscreenChange() {
  tabsnail.hidden = Boolean(document.fullscreenElement)

  if (tabsnail.hidden) {
    resetViewport()
  } else if (state.shrinkViewport) {
    const gridSize = snailGridSize(themes[state.theme].cellSizePixel)
    shrinkViewport(gridSize, snailGrid(gridSize, tabsnail.children.length, state.tabSize))
  }
}
