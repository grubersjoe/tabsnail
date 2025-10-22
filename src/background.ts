import { isActivateTabMessage, isCloseTabMessage, type UpdateTabsMessage } from './lib/messages.ts'
import type { Settings } from './settings/settings.ts'

const defaultSettings: Settings = {
  color: '#edffb8',
  theme: 'default',
  tabSize: 8,
}

// Initialize settings
chrome.storage.sync.get<Settings>(null, async settings => {
  const uninitializedSettings = Object.fromEntries(
    Object.entries(defaultSettings).filter(([key]) => settings[key as keyof Settings] == null),
  )

  return chrome.storage.sync.set(uninitializedSettings)
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

  return Promise.allSettled(promises)
}
