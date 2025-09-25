import { isDarkColor, snailLayout } from './snail.ts'
import type { TabSetActiveMessage } from './background.ts'

export type Tab = Pick<chrome.tabs.Tab, 'id' | 'title'>

export type TabListMessage = {
  type: 'list-tabs'
  tabs: Tab[]
}

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
    const { gridArea, side } = layout[i]

    const segment = document.createElement('div')
    segment.style.gridArea = gridArea
    segment.className = side

    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = tab.title ?? '???'
    button.addEventListener('click', () => {
      if (tab.id) {
        return chrome.runtime.sendMessage<TabSetActiveMessage>({
          type: 'activate-tab',
          tabId: tab.id,
        })
      }
    })

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

const fonts = [
  new FontFace('Victor Mono', `url('${chrome.runtime.getURL('fonts/VictorMono-Regular.woff2')}'`, {
    weight: '400',
    style: 'normal',
  }),
  new FontFace('Victor Mono', `url('${chrome.runtime.getURL('fonts/VictorMono-Medium.woff2')}'`, {
    weight: '500',
    style: 'normal',
  }),
  new FontFace(
    'Victor Mono',
    `url('${chrome.runtime.getURL('fonts/VictorMono-MediumItalic.woff2')}'`,
    {
      weight: '500',
      style: 'italic',
    },
  ),
  new FontFace('Victor Mono', `url('${chrome.runtime.getURL('fonts/VictorMono-SemiBold.woff2')}'`, {
    weight: '600',
    style: 'normal',
  }),
  new FontFace(
    'Viktor Mono',
    `url('${chrome.runtime.getURL('fonts/VictorMono-SemiBoldItalic.woff2')}'`,
    {
      weight: '600',
      style: 'italic',
    },
  ),
]

fonts.forEach(f =>
  f
    .load()
    .then(f => document.fonts.add(f))
    .catch(console.error),
)
