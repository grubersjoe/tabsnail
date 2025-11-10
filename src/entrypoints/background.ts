import {
  type Message,
  type TabsMessage,
  isActivateTabMessage,
  isCloseTabMessage,
  isRequestTabsMessage,
} from '@/lib/messages'

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message: Message, _, sendResponse) => {
    if (isRequestTabsMessage(message)) {
      void getTabs().then(tabs => {
        sendResponse({ type: 'tabs', tabs } satisfies TabsMessage)
      })
      return true // required for asynchronous responses
    }

    if (isActivateTabMessage(message)) {
      void browser.tabs.update(message.tabId, { active: true })
    }

    if (isCloseTabMessage(message)) {
      void browser.tabs.remove(message.tabId)
    }
  })

  browser.tabs.onActivated.addListener(() => {
    void sendTabs()
  })

  browser.tabs.onUpdated.addListener(() => {
    void sendTabs()
  })

  browser.tabs.onRemoved.addListener(() => {
    void sendTabs()
  })

  browser.tabs.onMoved.addListener(() => {
    void sendTabs() // (reordering tabs)
  })

  browser.tabs.onAttached.addListener(() => {
    void sendTabs()
  })

  browser.tabs.onDetached.addListener((_, detachInfo) => {
    void sendTabs(detachInfo.oldWindowId)
  })

  async function sendTabs(windowId?: number) {
    const tabs = await getTabs(windowId)
    const promises = []

    for (const tab of tabs) {
      if (!tab.id) {
        continue // unexpected
      }

      promises.push(
        browser.tabs.sendMessage<TabsMessage>(tab.id, {
          type: 'tabs',
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
})

async function getTabs(windowId?: number) {
  const query: Browser.tabs.QueryInfo = windowId
    ? { windowType: 'normal', windowId }
    : { windowType: 'normal', currentWindow: true }

  return browser.tabs.query(query)
}
