import type { UpdateTabsMessage } from './content.ts'

export type ActivateTabMessage = {
  type: 'activate-tab'
  tabId: number
}

function isActivateTabMessage(msg: { type: string }): msg is ActivateTabMessage {
  return msg.type === 'activate-tab'
}

export type CloseTabMessage = {
  type: 'close-tab'
  tabId: number
}

function isCloseTabMessage(msg: { type: string }): msg is CloseTabMessage {
  return msg.type === 'close-tab'
}

export type Settings = {
  color: string
  tabSize: number
}

const defaultSettings: Settings = {
  color: '#edffb8',
  tabSize: 8,
}

// Initialize settings
chrome.storage.sync.get<Settings>(['color', 'tabSize'], async ({ color, tabSize }) => {
  const promises: Promise<void>[] = []

  if (!color) {
    promises.push(
      chrome.storage.sync.set({
        color: defaultSettings.color,
      }),
    )
  }

  if (!tabSize) {
    promises.push(
      chrome.storage.sync.set({
        tabSize: defaultSettings.tabSize,
      }),
    )
  }

  return Promise.all(promises)
})

chrome.runtime.onMessage.addListener(async (message, _sender, response) => {
  if (isActivateTabMessage(message)) {
    chrome.tabs.update(message.tabId, { active: true }).then(response)
  }
  if (isCloseTabMessage(message)) {
    chrome.tabs.remove(message.tabId).then(response)
  }
})

chrome.tabs.onActivated.addListener(sendTabs)
chrome.tabs.onUpdated.addListener(sendTabs)
chrome.tabs.onRemoved.addListener(sendTabs)

export async function sendTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true })
  const promises = []

  for (const tab of tabs) {
    if (!tab.id) {
      console.warn(`Tab #${tab.index} has no ID.`)
      continue
    }
    promises.push(
      chrome.tabs.sendMessage<UpdateTabsMessage>(tab.id, {
        type: 'update-tabs',
        tabs: tabs.map(t => ({
          id: t.id,
          title: t.title,
          active: t.active,
        })),
      }),
    )
  }

  return Promise.all(promises)
}
