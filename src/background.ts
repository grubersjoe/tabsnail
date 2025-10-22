import {
  isActivateTabMessage,
  isCloseTabMessage,
  type Message,
  type UpdateTabsMessage,
} from './lib/messages.ts'
import type { Settings } from './settings/settings.ts'

const defaultSettings: Settings = {
  color: '#edffb8',
  theme: 'default',
  tabSize: 8,
}

// Initialize settings
chrome.storage.sync.get<Partial<Settings>>(null, settings => {
  const initialSettings = Object.fromEntries(
    Object.entries(defaultSettings).filter(([key]) => settings[key as keyof Settings] == null),
  )
  void chrome.storage.sync.set(initialSettings)
})

chrome.runtime.onMessage.addListener((message: Message, _sender, response) => {
  if (isActivateTabMessage(message)) {
    void chrome.tabs.update(message.tabId, { active: true }).then(response)
  }
  if (isCloseTabMessage(message)) {
    void chrome.tabs.remove(message.tabId).then(response)
  }
})

chrome.tabs.onActivated.addListener(() => {
  void sendTabs()
})

chrome.tabs.onUpdated.addListener(() => {
  void sendTabs()
})

chrome.tabs.onRemoved.addListener(() => {
  void sendTabs()
})

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
