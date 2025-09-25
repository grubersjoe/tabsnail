import type { Tab, ListTabsMessage } from './content.ts'

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

type Settings = {
  color: string
}

const defaultSettings: Settings = {
  color: '#6495ED',
}

// Initialize settings
chrome.storage.sync.get('color', async ({ color }) => {
  if (!color) {
    await chrome.storage.sync.set({ color: defaultSettings.color })
  }
})

async function sendTabs() {
  const tabs = await chrome.tabs.query({})

  const sanitizedTabs: Tab[] = tabs
    .filter((tab): tab is chrome.tabs.Tab & Tab => tab.id != null && tab.title != null)
    .map(t => ({
      id: t.id,
      title: t.title,
      active: t.active,
    }))

  const promises = []
  for (const tab of tabs) {
    if (tab.id) {
      promises.push(
        chrome.tabs.sendMessage<ListTabsMessage>(tab.id, {
          type: 'list-tabs',
          tabs: sanitizedTabs,
        }),
      )
    }
  }

  return Promise.allSettled(promises)
}

chrome.tabs.onUpdated.addListener(sendTabs)
chrome.tabs.onRemoved.addListener(sendTabs)

chrome.runtime.onMessage.addListener(async (message, _sender, response) => {
  if (isActivateTabMessage(message)) {
    chrome.tabs.update(message.tabId, { active: true }).then(response)
  }
  if (isCloseTabMessage(message)) {
    chrome.tabs.remove(message.tabId).then(response)
  }
})
