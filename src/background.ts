import type { TabListMessage, TabSetActiveMessage } from './types.ts'

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

  const promises = []
  for (const tab of tabs) {
    if (!tab.id) {
      continue
    }
    promises.push(
      chrome.tabs.sendMessage<TabListMessage>(tab.id, {
        type: 'list-tabs',
        tabs: tabs.map(tab => {
          if (!tab.id || !tab.title) {
            throw new Error(`Invalid tab: ${tab}`)
          }

          return {
            id: tab.id,
            title: tab.title,
          }
        }),
      }),
    )
  }

  return Promise.allSettled(promises)
}

chrome.tabs.onUpdated.addListener(async () => {
  await sendTabs()
})

chrome.tabs.onRemoved.addListener(async () => {
  await sendTabs()
})

function isActivateTabMessage(msg: { type: string }): msg is TabSetActiveMessage {
  return msg.type === 'activate-tab'
}

chrome.runtime.onMessage.addListener(async (message, _sender, response) => {
  if (isActivateTabMessage(message)) {
    await chrome.tabs.update(message.tabId, { active: true })
  }
  response()
})
